import { useEffect, useMemo, useState } from "react";
import {
  FaSearch,
  FaTrashAlt,
  FaUserCheck,
  FaUserGraduate,
} from "react-icons/fa";
import "../admin/ManageUsers.css";

import API_BASE_URL from "../config";

const API_URL = `${API_BASE_URL}/api/admin/users`;
function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const [error, setError] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Unable to load users.");

      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const removeUser = async (userId) => {
    if (!window.confirm("Delete this user account?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${userId}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Unable to delete user.");

      setUsers((previous) =>
        previous.filter((user) => String(user._id || user.id) !== String(userId))
      );
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const filteredUsers = useMemo(() => {
    const text = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !text ||
        `${user.name || ""} ${user.email || ""} ${user.phone || ""}`
          .toLowerCase()
          .includes(text);

      const userRole = user.role || "student";
      const matchesRole = role === "All" || userRole === role;

      return matchesSearch && matchesRole;
    });
  }, [users, search, role]);

  return (
    <div>
      <div className="admin-page-heading">
        <div>
          <span>User Accounts</span>
          <h2>Manage Users</h2>
          <p>Review registered students and platform administrators.</p>
        </div>
      </div>

      {error && <div className="admin-error-message">{error}</div>}

      <div className="user-summary-grid">
        <article>
          <FaUserGraduate />
          <div>
            <strong>{users.length}</strong>
            <span>Total Users</span>
          </div>
        </article>

        <article>
          <FaUserCheck />
          <div>
            <strong>
              {users.filter((user) => (user.role || "student") === "student").length}
            </strong>
            <span>Students</span>
          </div>
        </article>
      </div>

      <div className="users-toolbar">
        <div>
          <FaSearch />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select value={role} onChange={(event) => setRole(event.target.value)}>
          <option value="All">All Roles</option>
          <option value="student">Students</option>
          <option value="admin">Administrators</option>
        </select>
      </div>

      <div className="users-table-card">
        <div className="manage-table-wrap">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => {
                const userId = user._id || user.id;

                return (
                  <tr key={userId}>
                    <td>
                      <div className="user-cell">
                        <div>{(user.name || "U").charAt(0).toUpperCase()}</div>
                        <span>
                          <strong>{user.name || "Unnamed User"}</strong>
                          <small>{user.email || "No email"}</small>
                        </span>
                      </div>
                    </td>

                    <td>{user.phone || "Not provided"}</td>
                    <td>
                      <span className="user-role">{user.role || "student"}</span>
                    </td>
                    <td>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-IN")
                        : "N/A"}
                    </td>
                    <td>
                      <span className="user-status">
                        {user.isActive === false ? "Inactive" : "Active"}
                      </span>
                    </td>
                    <td>
                      <button type="button" onClick={() => removeUser(userId)}>
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="manage-state">No users found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;
