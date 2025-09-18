import { useState, useMemo, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { getUsers } from '@/services/api';
import type { User } from '@/types';

export function useUserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [isEditUserOpen, setIsEditUserOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const fetchUsers = async () => {
            const fetchedUsers = await getUsers();
            setUsers(fetchedUsers);
        };
        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesSearch = 
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.ship.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.id.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesRole = filterRole === "all" || user.role === filterRole;
            const matchesStatus = filterStatus === "all" || user.status === filterStatus;

            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, searchTerm, filterRole, filterStatus]);

    const handleEditUser = (user: User) => {
        setEditingUser({ ...user });
        setIsEditUserOpen(true);
    };

    const handleSaveEditUser = () => {
        if (editingUser) {
            setUsers(users.map((user) => (user.id === editingUser.id ? editingUser : user)));
            setIsEditUserOpen(false);
            setEditingUser(null);
            toast({
                title: "User Updated",
                description: "User information has been successfully updated.",
            });
        }
    };

    const handleToggleUserStatus = (userId: string) => {
        setUsers(
            users.map((user) => {
                if (user.id === userId) {
                    const newStatus = user.status === "Active" ? "Inactive" : "Active";
                    toast({
                        title: `User ${newStatus}`,
                        description: `${user.name} has been ${newStatus.toLowerCase()}.`,
                    });
                    return { ...user, status: newStatus };
                }
                return user;
            }),
        );
    };

    const handleDeleteUser = (userId: string) => {
        setUserToDelete(userId);
        setIsDeleteDialogOpen(true);
    };

    const confirmDeleteUser = () => {
        if (userToDelete) {
            const userToDeleteObj = users.find((u) => u.id === userToDelete);
            setUsers(users.filter((user) => user.id !== userToDelete));
            setIsDeleteDialogOpen(false);
            setUserToDelete(null);
            toast({
                title: "User Deleted",
                description: `${userToDeleteObj?.name} has been removed from the system.`,
                variant: "destructive",
            });
        }
    };

    return {
        users,
        searchTerm, 
        setSearchTerm,
        filterRole, 
        setFilterRole,
        filterStatus, 
        setFilterStatus,
        isAddUserOpen, 
        setIsAddUserOpen,
        isEditUserOpen, 
        setIsEditUserOpen,
        editingUser, 
        setEditingUser,
        isDeleteDialogOpen, 
        setIsDeleteDialogOpen,
        userToDelete, 
        setUserToDelete,
        filteredUsers,
        handleEditUser,
        handleSaveEditUser,
        handleToggleUserStatus,
        handleDeleteUser,
        confirmDeleteUser
    };
}
