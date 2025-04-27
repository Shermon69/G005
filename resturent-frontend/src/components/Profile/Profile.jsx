import React, { useEffect, useState } from "react";
import {
  getCustomerProfile,
  updateCustomerProfile,
  deleteCustomerProfile,
} from "../../api/customerApi";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
  });
  const [errors, setErrors] = useState({});

  // Fetch customer profile on mount
  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      const fetchProfile = async () => {
        try {
          setLoading(true);
          const response = await getCustomerProfile(token);
          const fetchedUser = response.data;
          setUser(fetchedUser);

          // Populate form data with current profile values
          setFormData({
            name: fetchedUser.name || "",
            address: fetchedUser.address || "",
            email: fetchedUser.email || "",
          });
        } catch (err) {
          alert("Failed to load profile. Please try again.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    }
  }, [token]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate field on change
    validateField(name, value);

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Validate individual fields
  const validateField = (fieldName, value) => {
    const newErrors = { ...errors };

    switch (fieldName) {
      case "name":
        if (!value.trim()) {
          newErrors[fieldName] = "Name is required.";
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          newErrors[fieldName] = "Name should only contain letters and spaces.";
        } else {
          delete newErrors[fieldName];
        }
        break;

      case "address":
        if (!value.trim()) {
          newErrors[fieldName] = "Address is required.";
        } else if (value.length < 5) {
          newErrors[fieldName] = "Address must be at least 5 characters.";
        } else {
          delete newErrors[fieldName];
        }
        break;

      case "email":
        if (!value.trim()) {
          newErrors[fieldName] = "Email is required.";
        } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
          newErrors[fieldName] = "Please enter a valid email address.";
        } else {
          delete newErrors[fieldName];
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    let isValid = true;
    const newErrors = {};

    Object.keys(formData).forEach((field) => {
      validateField(field, formData[field]);
      if (errors[field]) {
        isValid = false;
        newErrors[field] = errors[field];
      }
    });

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await updateCustomerProfile(formData, token);
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle profile deletion
  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete your profile? This action cannot be undone."
    );

    if (isConfirmed) {
      try {
        setLoading(true);
        await deleteCustomerProfile(token);
        alert("Profile deleted successfully.");
        localStorage.removeItem("token");
        window.location.href = "/login"; // Redirect to login page
      } catch (err) {
        alert("Failed to delete profile. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    const isConfirmed = window.confirm("Are you sure you want to log out?");

    if (isConfirmed) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirect to login page
    }
  };

  if (loading) {
    return <div className="profile-loading">Loading...</div>;
  }

  if (!user) {
    return <div className="profile-error">Failed to load profile.</div>;
  }

  return (
    <div className="profile-container">
      <h1>My Profile</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        <div>
          <label>Address:</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
          />
          {errors.address && <p className="error">{errors.address}</p>}
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>

      <button className="delete-btn" onClick={handleDelete} disabled={loading}>
        {loading ? "Deleting..." : "Delete Profile"}
      </button>

      <button className="logout-btn" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
};

export default Profile;
