-- FastCat Ferry Parts Inventory System - Complete Database Schema
-- Initial Schema Migration

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SHIPS TABLE - Vessel management
CREATE TABLE ships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL, -- e.g., "M1", "M2"
    type VARCHAR(50), -- e.g., "Fast Ferry", "Express"
    capacity INTEGER,
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Maintenance', 'Decommissioned')),
    captain_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. USERS TABLE - User management with Supabase Auth integration
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL CHECK (role IN ('Admin', 'Manager', 'Staff')),
    department VARCHAR(50) NOT NULL,
    assigned_ship UUID REFERENCES ships(id),
    status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Suspended')),
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CATEGORIES TABLE - Hierarchical part categorization
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    parent_category_id UUID REFERENCES categories(id),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. SUPPLIERS TABLE - Supplier management
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    payment_terms VARCHAR(100),
    lead_time_days INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. STOCK LOCATIONS TABLE - Inventory location management
CREATE TABLE stock_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('Warehouse', 'Vessel', 'Workshop')),
    ship_id UUID REFERENCES ships(id),
    parent_location_id UUID REFERENCES stock_locations(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. PARTS TABLE - Core inventory management
CREATE TABLE parts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    part_number VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(id),
    subcategory VARCHAR(50),
    current_stock INTEGER NOT NULL DEFAULT 0,
    minimum_stock INTEGER NOT NULL DEFAULT 0,
    maximum_stock INTEGER,
    unit_of_measure VARCHAR(20) DEFAULT 'units',
    location_id UUID REFERENCES stock_locations(id),
    supplier_id UUID REFERENCES suppliers(id),
    unit_price DECIMAL(10,2),
    reorder_point INTEGER,
    lead_time_days INTEGER,
    barcode_data VARCHAR(255),
    qr_code_data VARCHAR(255),
    specifications JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. INVENTORY TRANSACTIONS TABLE - Stock movement tracking
CREATE TABLE inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('Stock In', 'Stock Out', 'Transfer', 'Adjustment', 'Return')),
    part_id UUID NOT NULL REFERENCES parts(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    source_location_id UUID REFERENCES stock_locations(id),
    destination_id UUID REFERENCES stock_locations(id),
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    performed_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reference_number VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'Completed' CHECK (status IN ('Completed', 'Pending', 'Failed', 'Cancelled')),
    notes TEXT,
    cost DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. STAFF REQUESTS TABLE - Part requisition system
CREATE TABLE staff_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_number VARCHAR(20) UNIQUE NOT NULL,
    staff_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    part_id UUID NOT NULL REFERENCES parts(id) ON DELETE CASCADE,
    quantity_requested INTEGER NOT NULL,
    quantity_approved INTEGER,
    ship_id UUID NOT NULL REFERENCES ships(id) ON DELETE CASCADE,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('Low', 'Medium', 'High', 'Critical', 'Urgent')),
    reason TEXT NOT NULL,
    additional_notes TEXT,
    request_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Delivered', 'Cancelled')),
    reviewed_by UUID REFERENCES users(id),
    review_date TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    estimated_delivery_date DATE,
    actual_delivery_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. REQUEST APPROVALS TABLE - Multi-level approval workflow
CREATE TABLE request_approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES staff_requests(id) ON DELETE CASCADE,
    approver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    approval_level INTEGER NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('Approved', 'Rejected', 'Forwarded')),
    comments TEXT,
    approval_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. AUDIT LOGS TABLE - Comprehensive audit trail
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Create request_number sequence
CREATE SEQUENCE request_number_seq;

-- 12. Performance Indexes
-- User indexes
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_department ON users(department);
CREATE INDEX idx_users_ship ON users(assigned_ship);
CREATE INDEX idx_users_status ON users(status);

-- Parts indexes
CREATE INDEX idx_parts_category ON parts(category_id);
CREATE INDEX idx_parts_stock ON parts(current_stock);
CREATE INDEX idx_parts_supplier ON parts(supplier_id);
CREATE INDEX idx_parts_number ON parts(part_number);
CREATE INDEX idx_parts_location ON parts(location_id);
CREATE INDEX idx_parts_active ON parts(is_active);

-- Transaction indexes
CREATE INDEX idx_transactions_date ON inventory_transactions(transaction_date);
CREATE INDEX idx_transactions_type ON inventory_transactions(transaction_type);
CREATE INDEX idx_transactions_part ON inventory_transactions(part_id);
CREATE INDEX idx_transactions_user ON inventory_transactions(performed_by);
CREATE INDEX idx_transactions_status ON inventory_transactions(status);

-- Request indexes
CREATE INDEX idx_requests_status ON staff_requests(status);
CREATE INDEX idx_requests_priority ON staff_requests(priority);
CREATE INDEX idx_requests_staff ON staff_requests(staff_id);
CREATE INDEX idx_requests_date ON staff_requests(request_date);
CREATE INDEX idx_requests_ship ON staff_requests(ship_id);

-- Ship indexes
CREATE INDEX idx_ships_status ON ships(status);
CREATE INDEX idx_ships_code ON ships(code);

-- Location indexes
CREATE INDEX idx_locations_type ON stock_locations(type);
CREATE INDEX idx_locations_ship ON stock_locations(ship_id);
CREATE INDEX idx_locations_parent ON stock_locations(parent_location_id);

-- Category indexes
CREATE INDEX idx_categories_parent ON categories(parent_category_id);
CREATE INDEX idx_categories_active ON categories(is_active);

-- Supplier indexes
CREATE INDEX idx_suppliers_active ON suppliers(is_active);

-- Audit log indexes
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_table ON audit_logs(table_name);
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp);

-- 13. Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ships ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 14. Row Level Security Policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Admins can manage all users
CREATE POLICY "Admins can manage users" ON users
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM users WHERE role = 'Admin'
        )
    );

-- Anyone can view active ships
CREATE POLICY "Anyone can view ships" ON ships
    FOR SELECT USING (is_active = true);

-- Anyone can view active categories
CREATE POLICY "Anyone can view categories" ON categories
    FOR SELECT USING (is_active = true);

-- Anyone can view active suppliers
CREATE POLICY "Anyone can view suppliers" ON suppliers
    FOR SELECT USING (is_active = true);

-- Anyone can view active stock locations
CREATE POLICY "Anyone can view stock locations" ON stock_locations
    FOR SELECT USING (is_active = true);

-- Anyone can view active parts
CREATE POLICY "Anyone can view parts" ON parts
    FOR SELECT USING (is_active = true);

-- Authenticated users can view transactions
CREATE POLICY "Authenticated users can view transactions" ON inventory_transactions
    FOR SELECT USING (auth.role() = 'authenticated');

-- Authenticated users can view requests
CREATE POLICY "Authenticated users can view requests" ON staff_requests
    FOR SELECT USING (auth.role() = 'authenticated');

-- Users can view their own requests
CREATE POLICY "Users can view own requests" ON staff_requests
    FOR SELECT USING (staff_id = auth.uid());

-- Users can create requests
CREATE POLICY "Users can create requests" ON staff_requests
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Managers can approve requests
CREATE POLICY "Managers can approve requests" ON staff_requests
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT id FROM users WHERE role IN ('Manager', 'Admin')
        )
    );

-- Users can view approvals
CREATE POLICY "Users can view approvals" ON request_approvals
    FOR SELECT USING (auth.role() = 'authenticated');

-- 15. Triggers and Functions
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ships_updated_at BEFORE UPDATE ON ships
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parts_updated_at BEFORE UPDATE ON parts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate request number
CREATE OR REPLACE FUNCTION generate_request_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.request_number := 'REQ-' || to_char(NOW(), 'YYYY') || '-' || ltrim(nextval('request_number_seq')::text, '0');
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-generate request numbers
CREATE TRIGGER generate_staff_request_number
    BEFORE INSERT ON staff_requests
    FOR EACH ROW EXECUTE FUNCTION generate_request_number();

-- Function to audit data changes
CREATE OR REPLACE FUNCTION audit_data_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (user_id, action, table_name, record_id, old_data, new_data, timestamp)
        VALUES (
            auth.uid(),
            'UPDATE',
            TG_TABLE_NAME,
            NEW.id,
            jsonb_strip_nulls(to_jsonb(OLD)),
            jsonb_strip_nulls(to_jsonb(NEW)),
            NOW()
        );
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (user_id, action, table_name, record_id, old_data, timestamp)
        VALUES (
            auth.uid(),
            'DELETE',
            TG_TABLE_NAME,
            OLD.id,
            jsonb_strip_nulls(to_jsonb(OLD)),
            NULL,
            NOW()
        );
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (user_id, action, table_name, record_id, new_data, timestamp)
        VALUES (
            auth.uid(),
            'INSERT',
            TG_TABLE_NAME,
            NEW.id,
            jsonb_strip_nulls(to_jsonb(NEW)),
            NOW()
        );
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Add audit triggers (selective to avoid circular references)
CREATE TRIGGER audit_users_changes
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION audit_data_changes();

CREATE TRIGGER audit_parts_changes
    AFTER INSERT OR UPDATE OR DELETE ON parts
    FOR EACH ROW EXECUTE FUNCTION audit_data_changes();

CREATE TRIGGER audit_transactions_changes
    AFTER INSERT OR UPDATE OR DELETE ON inventory_transactions
    FOR EACH ROW EXECUTE FUNCTION audit_data_changes();

CREATE TRIGGER audit_requests_changes
    AFTER INSERT OR UPDATE OR DELETE ON staff_requests
    FOR EACH ROW EXECUTE FUNCTION audit_data_changes();

-- 16. Check Constraints
-- Ensure stock doesn't go negative
ALTER TABLE parts ADD CONSTRAINT check_non_negative_stock CHECK (current_stock >= 0);
ALTER TABLE parts ADD CONSTRAINT check_minimum_stock CHECK (minimum_stock >= 0);

-- Ensure transaction quantities are valid
ALTER TABLE inventory_transactions ADD CONSTRAINT check_transaction_quantity CHECK (quantity != 0);

-- Ensure requested quantities are positive
ALTER TABLE staff_requests ADD CONSTRAINT check_positive_quantity CHECK (quantity_requested > 0);
ALTER TABLE staff_requests ADD CONSTRAINT check_approved_quantity CHECK (quantity_approved IS NULL OR quantity_approved >= 0);

-- 17. Default Data - Insert basic categories
INSERT INTO categories (name, code, description) VALUES
('Engine', 'ENG', 'Engine parts and components'),
('Electrical', 'ELEC', 'Electrical systems and components'),
('Hydraulic', 'HYD', 'Hydraulic systems and components'),
('Safety', 'SAFE', 'Safety equipment and supplies'),
('Maintenance', 'MAINT', 'General maintenance supplies'),
('Navigation', 'NAV', 'Navigation equipment and supplies'),
('Communication', 'COMM', 'Communication equipment'),
('Hull & Deck', 'HULL', 'Hull and deck maintenance items');

-- 18. Default Ships (FastCat fleet)
INSERT INTO ships (name, code, type, capacity) VALUES
('FastCat M1', 'M1', 'Fast Ferry', 300),
('FastCat M2', 'M2', 'Fast Ferry', 300),
('FastCat M3', 'M3', 'Fast Ferry', 300),
('FastCat M4', 'M4', 'Express', 200),
('FastCat M5', 'M5', 'Express', 200);

-- 19. Default Stock Locations
INSERT INTO stock_locations (name, code, type) VALUES
('Main Warehouse', 'WH-MAIN', 'Warehouse'),
('Warehouse Section A', 'WH-A', 'Warehouse'),
('Warehouse Section B', 'WH-B', 'Warehouse'),
('FastCat M1 Engine Room', 'M1-ER', 'Vessel'),
('FastCat M1 Deck', 'M1-DECK', 'Vessel'),
('FastCat M2 Engine Room', 'M2-ER', 'Vessel'),
('FastCat M2 Deck', 'M2-DECK', 'Vessel'),
('FastCat M3 Engine Room', 'M3-ER', 'Vessel'),
('FastCat M3 Deck', 'M3-DECK', 'Vessel');

-- 20. Create function to update stock levels based on transactions
CREATE OR REPLACE FUNCTION update_stock_level()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'Completed' THEN
        IF NEW.transaction_type IN ('Stock In', 'Return') THEN
            UPDATE parts SET current_stock = current_stock + NEW.quantity WHERE id = NEW.part_id;
        ELSIF NEW.transaction_type IN ('Stock Out', 'Transfer') THEN
            UPDATE parts SET current_stock = current_stock - NEW.quantity WHERE id = NEW.part_id;
        END IF;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Handle status changes or quantity updates
        IF OLD.status != NEW.status THEN
            IF NEW.status = 'Completed' AND OLD.status != 'Completed' THEN
                IF NEW.transaction_type IN ('Stock In', 'Return') THEN
                    UPDATE parts SET current_stock = current_stock + NEW.quantity WHERE id = NEW.part_id;
                ELSIF NEW.transaction_type IN ('Stock Out', 'Transfer') THEN
                    UPDATE parts SET current_stock = current_stock - NEW.quantity WHERE id = NEW.part_id;
                END IF;
            ELSIF OLD.status = 'Completed' AND NEW.status != 'Completed' THEN
                -- Reverse the stock change
                IF OLD.transaction_type IN ('Stock In', 'Return') THEN
                    UPDATE parts SET current_stock = current_stock - OLD.quantity WHERE id = OLD.part_id;
                ELSIF OLD.transaction_type IN ('Stock Out', 'Transfer') THEN
                    UPDATE parts SET current_stock = current_stock + OLD.quantity WHERE id = OLD.part_id;
                END IF;
            END IF;
        END IF;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Add stock update trigger
CREATE TRIGGER update_stock_on_transaction
    AFTER INSERT OR UPDATE ON inventory_transactions
    FOR EACH ROW EXECUTE FUNCTION update_stock_level();

-- 21. Function to check for low stock
CREATE OR REPLACE FUNCTION check_low_stock()
RETURNS TABLE(part_id UUID, part_name VARCHAR, current_stock INTEGER, minimum_stock INTEGER, stock_level VARCHAR) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.name,
        p.current_stock,
        p.minimum_stock,
        CASE
            WHEN p.current_stock = 0 THEN 'Out of Stock'
            WHEN p.current_stock <= p.minimum_stock * 0.5 THEN 'Critical'
            WHEN p.current_stock <= p.minimum_stock THEN 'Low'
            ELSE 'Normal'
        END as stock_level
    FROM parts p
    WHERE p.is_active = true
    AND p.current_stock <= p.minimum_stock
    ORDER BY p.current_stock ASC;
END;
$$ language 'plpgsql';