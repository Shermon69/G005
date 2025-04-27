import React, { useState, useEffect } from "react";
import {
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
} from "../../api/restaurantItemApi";
import { uploadFile } from "../../services/uploadFileService";
import Modal from "react-modal";
import "./RestaurantItems.css";

Modal.setAppElement("#root");

const RestaurantItems = () => {
  const token = localStorage.getItem("token");
  const restaurantId = localStorage.getItem("id");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    inStock: true,
    imageUrl: "",
    restaurant: localStorage.getItem("id"),
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  // Form validation
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    price: "",
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await getAllItems(token);
      setItems(response.data.filter((item) => !item.deleteStatus));
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      showAlert("Failed to fetch items", "error");
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    } else {
      newErrors.name = "";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      valid = false;
    } else {
      newErrors.description = "";
    }

    if (!formData.price || isNaN(formData.price) || formData.price <= 0) {
      newErrors.price = "Valid price is required";
      valid = false;
    } else {
      newErrors.price = "";
    }

    setErrors(newErrors);
    return valid;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    try {
      setIsUploading(true);
      setUploadProgress(0);
      const url = await uploadFile(imageFile, (progress) => {
        setUploadProgress(progress);
      });
      setIsUploading(false);
      return url;
    } catch (err) {
      setIsUploading(false);
      showAlert("Image upload failed", "error");
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      let imageUrl = formData.imageUrl;

      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const itemData = {
        ...formData,
        price: parseFloat(formData.price),
        imageUrl,
        restaurant: restaurantId,
      };

      if (currentItem) {
        // Update existing item
        await updateItem(currentItem._id, itemData, token);
        showAlert("Item updated successfully", "success");
      } else {
        // Create new item
        await createItem(itemData, token);
        showAlert("Item created successfully", "success");
      }

      closeModal();
      fetchItems();
    } catch (err) {
      showAlert(err.message || "Operation failed", "error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteItem(id, token);
        showAlert("Item deleted successfully", "success");
        fetchItems();
      } catch (err) {
        console.error(err);
        showAlert("Failed to delete item", "error");
      }
    }
  };

  const openModal = (item = null) => {
    setCurrentItem(item);
    setFormData(
      item
        ? {
            ...item,
            price: item.price.toString(),
          }
        : {
            name: "",
            description: "",
            price: "",
            inStock: true,
            imageUrl: "",
          }
    );
    setImageFile(null);
    setUploadProgress(0);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      inStock: true,
      imageUrl: "",
    });
    setImageFile(null);
    setErrors({
      name: "",
      description: "",
      price: "",
    });
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
    }, 3000);
  };

  if (loading && items.length === 0) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="restaurant-items-container">
      {alert.show && (
        <div className={`alert alert-${alert.type}`}>{alert.message}</div>
      )}

      <div className="header">
        <h2>Menu Items</h2>
        <button onClick={() => openModal()} className="add-button">
          Add New Item
        </button>
      </div>

      <div className="items-table-container">
        <table className="items-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item._id}>
                  <td>
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="item-image"
                      />
                    )}
                  </td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    <span
                      className={`status ${
                        item.inStock ? "in-stock" : "out-of-stock"
                      }`}
                    >
                      {item.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => openModal(item)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-items">
                  No items found. Add your first menu item!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>{currentItem ? "Edit Item" : "Add New Item"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name*</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? "error-input" : ""}
            />
            {errors.name && (
              <span className="error-message">{errors.name}</span>
            )}
          </div>

          <div className="form-group">
            <label>Description*</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={errors.description ? "error-input" : ""}
            />
            {errors.description && (
              <span className="error-message">{errors.description}</span>
            )}
          </div>

          <div className="form-group">
            <label>Price*</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              className={errors.price ? "error-input" : ""}
            />
            {errors.price && (
              <span className="error-message">{errors.price}</span>
            )}
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleInputChange}
              />
              In Stock
            </label>
          </div>

          <div className="form-group">
            <label>Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {isUploading && (
              <div className="upload-progress">
                <progress value={uploadProgress} max="100" />
                <span>{uploadProgress}%</span>
              </div>
            )}
            {formData.imageUrl && !imageFile && (
              <div className="current-image">
                <img
                  src={formData.imageUrl}
                  alt="Current"
                  className="preview-image"
                />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={closeModal}
              className="cancel-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isUploading}
            >
              {currentItem ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RestaurantItems;
