import { useEffect, useMemo, useState } from "react";

import {
  FaEdit,
  FaEye,
  FaFolderOpen,
  FaPlus,
  FaSearch,
  FaTimes,
  FaTrash,
} from "react-icons/fa";

import "./ManageCategories.css";
import API_BASE_URL from "../config";

const API_URL = `${API_BASE_URL}/api/admin/categories`;
const emptyForm = {
  name: "",
  description: "",
  image: "",
  active: true,
};

function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [selectedCategory, setSelectedCategory] =
    useState(null);

  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_BASE_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load categories."
        );
      }

      setCategories(
        Array.isArray(data)
          ? data
          : data.categories || []
      );
    } catch (requestError) {
      console.error(requestError);
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return categories;
    }

    return categories.filter((category) => {
      const searchableText = `
        ${category.name || ""}
        ${category.description || ""}
      `.toLowerCase();

      return searchableText.includes(value);
    });
  }, [categories, search]);

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((previousForm) => ({
      ...previousForm,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const openAddModal = () => {
    setForm(emptyForm);
    setSelectedCategory(null);
    setModal("add");
    setError("");
    setMessage("");
  };

  const openViewModal = (category) => {
    setSelectedCategory(category);
    setModal("view");
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);

    setForm({
      name: category.name || "",
      description:
        category.description || "",
      image: category.image || "",
      active:
        category.active !== false,
    });

    setModal("edit");
    setError("");
    setMessage("");
  };

  const closeModal = () => {
    setModal(null);
    setSelectedCategory(null);
    setForm(emptyForm);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError(
        "Please enter a category name."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const isEditing =
        modal === "edit";

      const categoryId =
        selectedCategory?._id ||
        selectedCategory?.id;

      const requestUrl = isEditing
        ? `${API_BASE_URL}/${categoryId}`
        : API_BASE_URL;

      const response = await fetch(
        requestUrl,
        {
          method: isEditing
            ? "PUT"
            : "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: form.name.trim(),
            description:
              form.description.trim(),
            image: form.image.trim(),
            active: form.active,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Unable to save category."
        );
      }

      setMessage(
        isEditing
          ? "Category updated successfully."
          : "Category added successfully."
      );

      await fetchCategories();

      setTimeout(() => {
        closeModal();
        setMessage("");
      }, 700);
    } catch (requestError) {
      console.error(requestError);
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (
    category
  ) => {
    const categoryId =
      category._id || category.id;

    const confirmed = window.confirm(
      `Delete the "${category.name}" category?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_BASE_URL}/${categoryId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete category."
        );
      }

      setMessage(
        "Category deleted successfully."
      );

      setCategories(
        (previousCategories) =>
          previousCategories.filter(
            (item) =>
              String(
                item._id || item.id
              ) !==
              String(categoryId)
          )
      );
    } catch (requestError) {
      console.error(requestError);
      setError(requestError.message);
    }
  };

  return (
    <section className="manage-categories-page">
      <div className="category-page-header">
        <div>
          <span className="category-eyebrow">
            COURSE ORGANISATION
          </span>

          <h1>Manage Categories</h1>

          <p>
            Add, view, edit and remove
            DVOC course categories.
          </p>
        </div>

        <button
          type="button"
          className="category-add-button"
          onClick={openAddModal}
        >
          <FaPlus />
          Add Category
        </button>
      </div>

      {message && (
        <div className="category-success-message">
          {message}
        </div>
      )}

      {error && !modal && (
        <div className="category-error-message">
          {error}
        </div>
      )}

      <div className="category-toolbar">
        <div className="category-search-box">
          <FaSearch />

          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <span>
          {filteredCategories.length}{" "}
          categor
          {filteredCategories.length === 1
            ? "y"
            : "ies"}
        </span>
      </div>

      {loading ? (
        <div className="category-loading">
          Loading categories...
        </div>
      ) : (
        <div className="category-grid">
          {filteredCategories.map(
            (category) => (
              <article
                className="category-card"
                key={
                  category._id ||
                  category.id
                }
              >
                <div className="category-card-image">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                    />
                  ) : (
                    <FaFolderOpen />
                  )}
                </div>

                <div className="category-card-content">
                  <div className="category-card-top">
                    <span
                      className={
                        category.active !==
                        false
                          ? "category-status active"
                          : "category-status inactive"
                      }
                    >
                      {category.active !==
                      false
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>

                  <h3>{category.name}</h3>

                  <p>
                    {category.description ||
                      "No description has been added."}
                  </p>

                  <div className="category-card-actions">
                    <button
                      type="button"
                      className="category-view-action"
                      onClick={() =>
                        openViewModal(
                          category
                        )
                      }
                    >
                      <FaEye />
                      View
                    </button>

                    <button
                      type="button"
                      className="category-edit-action"
                      onClick={() =>
                        openEditModal(
                          category
                        )
                      }
                    >
                      <FaEdit />
                      Edit
                    </button>

                    <button
                      type="button"
                      className="category-delete-action"
                      onClick={() =>
                        handleDelete(
                          category
                        )
                      }
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </article>
            )
          )}

          {filteredCategories.length ===
            0 && (
            <div className="category-empty-state">
              <FaFolderOpen />

              <h3>No categories found</h3>

              <p>
                Add a category for your
                DVOC courses.
              </p>
            </div>
          )}
        </div>
      )}

      {(modal === "add" ||
        modal === "edit") && (
        <div className="category-modal-overlay">
          <div className="category-modal">
            <div className="category-modal-header">
              <div>
                <span>
                  DVOC COURSE CATEGORY
                </span>

                <h2>
                  {modal === "edit"
                    ? "Update Category"
                    : "Add Category"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
              >
                <FaTimes />
              </button>
            </div>

            <form
              className="category-form"
              onSubmit={handleSubmit}
            >
              <div className="category-form-group">
                <label>
                  Category Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Stack Development"
                  required
                />
              </div>

              <div className="category-form-group">
                <label>
                  Category Image
                </label>

                <input
                  type="text"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="/course-fullstack.jpg"
                />
              </div>

              <div className="category-form-group">
                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    form.description
                  }
                  onChange={handleChange}
                  placeholder="Enter category description..."
                />
              </div>

              <label className="category-checkbox">
                <input
                  type="checkbox"
                  name="active"
                  checked={form.active}
                  onChange={handleChange}
                />

                Active category
              </label>

              {error && (
                <div className="category-error-message">
                  {error}
                </div>
              )}

              {message && (
                <div className="category-success-message">
                  {message}
                </div>
              )}

              <div className="category-modal-actions">
                <button
                  type="button"
                  className="category-cancel-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="category-save-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : modal === "edit"
                    ? "Update Category"
                    : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modal === "view" &&
        selectedCategory && (
          <div className="category-modal-overlay">
            <div className="category-view-modal">
              <button
                type="button"
                className="category-view-close"
                onClick={closeModal}
              >
                <FaTimes />
              </button>

              <div className="category-view-image">
                {selectedCategory.image ? (
                  <img
                    src={
                      selectedCategory.image
                    }
                    alt={
                      selectedCategory.name
                    }
                  />
                ) : (
                  <FaFolderOpen />
                )}
              </div>

              <span className="category-view-label">
                Course Category
              </span>

              <h2>
                {selectedCategory.name}
              </h2>

              <p>
                {selectedCategory.description ||
                  "No description has been added."}
              </p>

              <div className="category-view-status">
                Status:{" "}
                <strong>
                  {selectedCategory.active !==
                  false
                    ? "Active"
                    : "Inactive"}
                </strong>
              </div>

              <button
                type="button"
                className="category-save-button"
                onClick={() =>
                  openEditModal(
                    selectedCategory
                  )
                }
              >
                <FaEdit />
                Edit Category
              </button>
            </div>
          </div>
        )}
    </section>
  );
}

export default ManageCategories;