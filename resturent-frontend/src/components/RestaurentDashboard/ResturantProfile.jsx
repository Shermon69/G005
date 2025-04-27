import React, { useState, useEffect } from "react";
import {
  getRestaurantProfile,
  updateRestaurantProfile,
  deleteRestaurantProfile,
} from "../../api/restaurantApi";
import "./RestaurantProfile.css"; // Import the CSS file

const RestaurantProfile = () => {
  const [token] = useState(localStorage.getItem("token"));
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    businessRegistrationNumber: "",
  });
  const [errors, setErrors] = useState({});

  // Fetch restaurant profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getRestaurantProfile(token);
        const fetchedRestaurant = response.data;
        setRestaurant(fetchedRestaurant);

        // Populate form data with current profile values
        setFormData({
          name: fetchedRestaurant.name || "",
          address: fetchedRestaurant.address || "",
          businessRegistrationNumber:
            fetchedRestaurant.businessRegistrationNumber || "",
        });
      } catch (err) {
        alert("Failed to load restaurant profile. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
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
        } else if (value.length < 10) {
          newErrors[fieldName] = "Address must be at least 10 characters.";
        } else {
          delete newErrors[fieldName];
        }
        break;

      case "businessRegistrationNumber":
        if (!value.trim()) {
          newErrors[fieldName] = "Business Registration Number is required.";
        } else if (!/^[A-Za-z]{3}\d{5,6}$/.test(value)) {
          newErrors[fieldName] =
            "Business Registration Number must be 3 letters followed by 5-6 digits (e.g., BIN10101).";
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
      await updateRestaurantProfile(formData, token);
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
        await deleteRestaurantProfile(token);
        alert("Profile deleted successfully.");
        localStorage.removeItem("token");
        window.location.href = "/"; // Redirect to home page
      } catch (err) {
        alert("Failed to delete profile. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!restaurant) {
    return <div>Failed to load restaurant profile.</div>;
  }

  return (
    <div className="restaurant-profile">
      <h1>Restaurant Profile</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter restaurant name"
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        <div>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter restaurant address"
          />
          {errors.address && <p className="error">{errors.address}</p>}
        </div>

        <div>
          <label>Business Registration Number:</label>
          <input
            type="text"
            name="businessRegistrationNumber"
            value={formData.businessRegistrationNumber}
            onChange={handleChange}
            placeholder="Enter business registration number (e.g., BIN10101)"
          />
          {errors.businessRegistrationNumber && (
            <p className="error">{errors.businessRegistrationNumber}</p>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>

      <button className="delete-btn" onClick={handleDelete} disabled={loading}>
        {loading ? "Deleting..." : "Delete Profile"}
      </button>
    </div>
  );
};

export default RestaurantProfile;
