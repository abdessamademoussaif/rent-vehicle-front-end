import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import axios, { formToJSON } from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

import Card, { CardHeader, CardContent } from "./ui/Card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import ActionButton from "./ActionButton";
import ConfirmModal from "./ConfirmModal";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api/v1`,
});

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, user: null, action: null });

  const authHeaders = {
    Authorization: `Bearer ${Cookies.get("authToken")}`,
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/users", { headers: authHeaders });
      const formatted = data.data.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "User",
        image: user.profileImg,
        isActive: user.active,
      }));
      setUsers(formatted);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    [user.name, user.email, user.role].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleAction = async () => {
    const { user, action } = modal;
    if (!user || !action) return;

    const urlMap = {
      delete: `/users/${user.id}`,
      activate: `/users/activate/${user.id}`,
      deactivate: `/users/deactivate/${user.id}`,
    };

    const method = action === "delete" ? "delete" : "put";
    const url = urlMap[action];

    try {
      if (method === "delete") {
        await api.delete(url, { headers: authHeaders });
      } else {
        await api.put(url, {}, { headers: authHeaders }); // empty data object for PUT
      }

      setUsers((prev) =>
        action === "delete"
          ? prev.filter((u) => u.id !== user.id)
          : prev.map((u) =>
              u.id === user.id ? { ...u, isActive: action === "activate" } : u
            )
      );

      toast.success(`User ${action}d`);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${action} user`);
    } finally {
      setModal({ open: false, user: null, action: null });
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(
        `/users/${userId}`,
        { role: newRole },
        { headers: authHeaders }
      );

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );

      toast.success("Role updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update role");
    }
  };

  return (
    <>
      <Card>
        <CardHeader
          title="Users"
          description="View and manage user accounts"
          action={
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700"
              size="sm"
            >
              + Add User
            </Button>
          }
        />

        <div className="px-6 pt-4 flex flex-wrap gap-4 items-center justify-between border-b pb-4">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            className="bg-gray-200 text-gray-700 hover:bg-gray-300"
            size="sm"
            onClick={fetchUsers}
          >
            {isLoading ? (
              <RefreshCw size={16} className="ml-1 animate-spin" />
            ) : (
              <>
                <RefreshCw size={16} className="mr-1" />
                Refresh
              </>
            )}
          </Button>
        </div>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["User", "Role", "Status", "Actions"].map((title) => (
                    <th
                      key={title}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap flex items-center">
                        <img
                          src={user.image}
                          alt=""
                          className="h-10 w-10 bg-blue-100 rounded-full"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value)
                          }
                          className="text-xs bg-blue-100 text-blue-800 font-semibold rounded-full px-2 py-1"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                          <option value="manager">Manager</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                            user.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <ActionButton
                            type={user.isActive ? "deactivate" : "activate"}
                            onClick={() =>
                              setModal({
                                open: true,
                                user,
                                action: user.isActive
                                  ? "deactivate"
                                  : "activate",
                              })
                            }
                          />
                          <ActionButton
                            type="edit"
                            onClick={() => console.log("Edit user", user.id)}
                          />
                          <ActionButton
                            type="delete"
                            onClick={() =>
                              setModal({ open: true, user, action: "delete" })
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ConfirmModal
        open={modal.open}
        onCancel={() => setModal({ open: false, user: null, action: null })}
        onConfirm={handleAction}
        title={
          modal.user && modal.action
            ? `Are you sure you want to ${modal.action} ${modal.user.name}?`
            : ""
        }
      />
    </>
  );
};

export default UserList;
