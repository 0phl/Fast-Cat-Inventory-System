import { useState, useMemo, useEffect } from 'react';
import { getRequests } from '@/services/api';
import type { StaffRequest } from '@/types';

export function useManagerRequests() {
    const [requests, setRequests] = useState<StaffRequest[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterPriority, setFilterPriority] = useState("all");
    const [selectedRequest, setSelectedRequest] = useState<StaffRequest | null>(null);
    const [actionDialog, setActionDialog] = useState<{ type: "approve" | "reject"; request: StaffRequest } | null>(null);
    const [actionNotes, setActionNotes] = useState("");

    useEffect(() => {
        const fetchRequests = async () => {
            const fetchedRequests = await getRequests();
            setRequests(fetchedRequests);
        };
        fetchRequests();
    }, []);

    const filteredRequests = useMemo(() => {
        return requests.filter((request) => {
            const matchesSearch =
                request.staffName!.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.ship.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.id.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = filterStatus === "all" || request.status === filterStatus;
            const matchesPriority = filterPriority === "all" || request.priority === filterPriority;

            return matchesSearch && matchesStatus && matchesPriority;
        });
    }, [requests, searchTerm, filterStatus, filterPriority]);

    const handleApproveReject = (action: "approve" | "reject", request: StaffRequest) => {
        setActionDialog({ type: action, request });
        setActionNotes("");
    };

    const confirmAction = () => {
        if (actionDialog) {
            // Here you would typically make an API call to update the request status
            console.log(`${actionDialog.type} request ${actionDialog.request.id} with notes: ${actionNotes}`);
            // You would then refetch or update the state
            setActionDialog(null);
            setActionNotes("");
        }
    };

    return {
        searchTerm, setSearchTerm,
        filterStatus, setFilterStatus,
        filterPriority, setFilterPriority,
        selectedRequest, setSelectedRequest,
        actionDialog, setActionDialog,
        actionNotes, setActionNotes,
        requests,
        filteredRequests,
        handleApproveReject,
        confirmAction
    };
}
