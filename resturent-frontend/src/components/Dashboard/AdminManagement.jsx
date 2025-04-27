import React, { useState, useEffect } from "react";
import {
  registerAdmin,
  updateAdminProfile,
  deleteAdminProfile,
  getAllAdmins,
  changeAdminPassword,
} from "../../api/adminApi";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import "./AdminManagement.css";

const AdminDashboard = () => {
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    employeeNumber: "",
    password: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  // Fetch all admins on component mount
  useEffect(() => {
    fetchAdmins();
  }, []);

  // Filter admins whenever search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredAdmins(admins);
    } else {
      const filtered = admins.filter(
        (admin) =>
          admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          admin.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAdmins(filtered);
    }
  }, [searchTerm, admins]);

  // Fetch all admins
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await getAllAdmins(token);
      setAdmins(response.data);
      setFilteredAdmins(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch admins");
      setLoading(false);
      console.error("Error fetching admins:", err);
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle password form input change
  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Open create admin modal
  const openCreateModal = () => {
    setFormData({
      name: "",
      employeeNumber: "",
      password: "",
    });
    setShowCreateModal(true);
  };

  // Open update admin modal
  const openUpdateModal = (admin) => {
    setSelectedAdmin(admin);
    setFormData({
      name: admin.name,
      employeeNumber: admin.employeeNumber,
    });
    setShowUpdateModal(true);
  };

  // Open change password modal
  const openPasswordModal = (admin) => {
    setSelectedAdmin(admin);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
    });
    setShowPasswordModal(true);
  };

  // Close all modals
  const closeModals = () => {
    setShowCreateModal(false);
    setShowUpdateModal(false);
    setShowPasswordModal(false);
    setSelectedAdmin(null);
  };

  // Create new admin
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      await registerAdmin(formData, token);
      closeModals();
      fetchAdmins();
      alert("Admin created successfully!");
    } catch (err) {
      alert("Failed to create admin");
      console.error("Error creating admin:", err);
    }
  };

  // Update admin
  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        name: formData.name,
        employeeNumber: formData.employeeNumber,
      };

      await updateAdminProfile({ ...updateData, id: selectedAdmin._id }, token);
      closeModals();
      fetchAdmins();
      alert("Admin updated successfully!");
    } catch (err) {
      alert("Failed to update admin");
      console.error("Error updating admin:", err);
    }
  };

  // Change admin password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await changeAdminPassword(passwordData, token);
      closeModals();
      alert("Password changed successfully!");
    } catch (err) {
      alert("Failed to change password");
      console.error("Error changing password:", err);
    }
  };

  // Delete admin
  const handleDeleteAdmin = async (adminId) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        await deleteAdminProfile(token, adminId);
        fetchAdmins();
        alert("Admin deleted successfully!");
      } catch (err) {
        alert("Failed to delete admin");
        console.error("Error deleting admin:", err);
      }
    }
  };

  // Generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Admins Report", 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Define the table columns
    const tableColumn = ["Name", "Employee Number", "Created At", "Updated At"];

    // Define the rows data
    const tableRows = [];

    filteredAdmins.forEach((admin) => {
      const adminData = [
        admin.name,
        admin.employeeNumber,
        new Date(admin.createdAt).toLocaleDateString(),
        new Date(admin.updatedAt).toLocaleDateString(),
      ];
      tableRows.push(adminData);
    });

    // Generate the table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: {
        fontSize: 10,
        cellPadding: 3,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [66, 135, 245],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
    });

    // Save the PDF
    doc.save("admins-report.pdf");
  };

  // If loading
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // If error
  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Management Dashboard</h1>

      <div className="dashboard-actions">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name or employee number..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        <div className="action-buttons">
          <button className="btn btn-primary" onClick={openCreateModal}>
            Add New Admin
          </button>
          <button className="btn btn-secondary" onClick={generatePDF}>
            Generate PDF Report
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Employee Number</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">
                  No admins found
                </td>
              </tr>
            ) : (
              filteredAdmins.map((admin) => (
                <tr key={admin._id}>
                  <td>{admin.name}</td>
                  <td>{admin.employeeNumber}</td>
                  <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
                  <td>{new Date(admin.updatedAt).toLocaleDateString()}</td>
                  <td className="action-cell">
                    <button
                      className="btn-action btn-edit"
                      onClick={() => openUpdateModal(admin)}
                    >
                      Edit
                    </button>
                    {/* <button
                      className="btn-action btn-password"
                      onClick={() => openPasswordModal(admin)}
                    >
                      Password
                    </button> */}
                    <button
                      className="btn-action btn-delete"
                      onClick={() => handleDeleteAdmin(admin._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Create New Admin</h2>
              <button className="btn-close" onClick={closeModals}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreateAdmin}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="employeeNumber">Employee Number</label>
                  <input
                    type="text"
                    id="employeeNumber"
                    name="employeeNumber"
                    value={formData.employeeNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength="8"
                  />
                  <small>Password must be at least 8 characters long</small>
                </div>
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModals}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Admin
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Update Admin Modal */}
      {showUpdateModal && selectedAdmin && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Update Admin</h2>
              <button className="btn-close" onClick={closeModals}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleUpdateAdmin}>
                <div className="form-group">
                  <label htmlFor="update-name">Name</label>
                  <input
                    type="text"
                    id="update-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="update-employeeNumber">Employee Number</label>
                  <input
                    type="text"
                    id="update-employeeNumber"
                    name="employeeNumber"
                    value={formData.employeeNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModals}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Update Admin
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && selectedAdmin && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Change Password</h2>
              <button className="btn-close" onClick={closeModals}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleChangePassword}>
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordInputChange}
                    required
                    minLength="8"
                  />
                  <small>Password must be at least 8 characters long</small>
                </div>
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModals}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
