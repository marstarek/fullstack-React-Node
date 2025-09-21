import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Search,
  Users,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  User,
  Mail,
  Shield,
  Pencil,
  Trash2,
} from "lucide-react";
import api from "../../api/axios"; // ✅ your axios instance
import toast from "react-hot-toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useGlobalDialog } from "@/components/GlobalDialog/GlobalDialog";
import EditUserForm from "@/components/EditUser/EditUserForm";

interface User {
  id: number;
  name: string;
  email: string;
  role: "USER" | "RESTAURANT_ADMIN" | "SUPERADMIN";
}

interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

// ✅ fetch users from backend API
async function fetchUsers(
  page: number,
  limit: number,
  search: string
): Promise<UsersResponse> {
  const res = await api.get(
    `/admin/users?page=${page}&limit=${limit}&search=${encodeURIComponent(
      search
    )}`
  );
  return res.data;
}

// Custom hook for debounced search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "SUPERADMIN":
      return "bg-red-100 text-red-800 border-red-200";
    case "RESTAURANT_ADMIN":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "USER":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getRoleIcon = (role: string) => {
  switch (role) {
    case "SUPERADMIN":
      return <Shield className="w-3 h-3" />;
    case "RESTAURANT_ADMIN":
      return <Users className="w-3 h-3" />;
    case "USER":
      return <User className="w-3 h-3" />;
    default:
      return <User className="w-3 h-3" />;
  }
};

export default function UsersTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { openDialog } = useGlobalDialog(); // ✅ now works

  // ✅ Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/users/${id}`),
    onSuccess: () => {
      toast.success("User deleted successfully");
      setConfirmOpen(false);
      refetch();
    },
  });

  const handleDelete = (id: number) => {
    openDialog({
      title: "Delete User",
      message: "Are you sure you want to delete this user?",
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: async () => {
        console.log("Deleting user:", id);
        await deleteMutation.mutateAsync(id);
      },
    });
  };
 const handleEdit = (user: User) => {
  openDialog({
    title: "Edit User",
    content: <EditUserForm user={user} refetch={refetch} />, // 👈 custom component inside dialog
  });
};
const handleAddUser = () => {
    openDialog({
      title: "Add User",
      content: <EditUserForm refetch={refetch} />, // no user → add mode
    });
  };
  const debouncedSearch = useDebounce(searchInput, 300);

  const { data, isLoading, isError ,refetch } = useQuery<UsersResponse, Error>({
    queryKey: ["users", page, limit, debouncedSearch],
    queryFn: () => fetchUsers(page, limit, debouncedSearch),
  });

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setPage(1);
  };

  const totalPages = Math.ceil((data?.total || 0) / limit);
  const startRecord = (page - 1) * limit + 1;
  const endRecord = Math.min(page * limit, data?.total || 0);

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-8">
            <div className="flex items-center justify-center text-red-600">
              <AlertCircle className="w-12 h-12 mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Error Loading Users</h3>
                <p className="text-red-500 mt-1">Please try again later</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex  mb-2 flex-col items-start sm:gap-3">
            <div className="flex items-center">

            <Users className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              User Management
            </h1>
            </div>
          <p className="text-gray-600">
            Manage and monitor user accounts across the platform
          </p>
          </div>
        <button
        type="button"
        onClick={handleAddUser}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        Add User
      </button>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Search and Filters */}
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search users by name or email..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Show:</span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span>entries</span>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mr-3" />
              <span className="text-gray-600 font-medium">
                Loading users...
              </span>
            </div>
          )}

          {/* Table */}
          {!isLoading && data && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Role
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data?.users?.map((user: User) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                            #{user.id}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                              <span className="text-white font-semibold text-sm">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                {user.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="w-4 h-4 mr-2" />
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                              user.role
                            )}`}
                          >
                            {getRoleIcon(user.role)}
                            <span className="ml-1">
                              {user.role.replace("_", " ")}
                            </span>
                          </span>
                        </td>
                        {/* Actions Column */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center gap-3">
                            {/* Edit Button */}
                            <button
                              onClick={() => handleEdit(user)}
                              className="p-2 rounded-lg border border-gray-200 text-blue-600 hover:bg-blue-50 transition"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="p-2 rounded-lg border border-gray-200 text-red-600 hover:bg-red-50 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Empty State */}
              {data && data?.users?.length === 0 && (
                <div className="text-center py-16">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No users found
                  </h3>
                  <p className="text-gray-600">
                    {debouncedSearch
                      ? "Try adjusting your search terms"
                      : "No users available at the moment"}
                  </p>
                </div>
              )}

              {/* Pagination */}
              {data.users.length > 0 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Showing {startRecord} to {endRecord} of {data.total}{" "}
                      results
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-white hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      <div className="flex items-center space-x-1">
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else {
                              if (page <= 3) {
                                pageNum = i + 1;
                              } else if (page >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                              } else {
                                pageNum = page - 2 + i;
                              }
                            }

                            return (
                              <button
                                key={pageNum}
                                onClick={() => setPage(pageNum)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  page === pageNum
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "text-gray-600 hover:bg-white hover:text-gray-900"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          }
                        )}
                      </div>

                      <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-white hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
