import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { adminApi } from "../../services/adminApi.js";
import { Field } from "../../components/ui/Field.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Alert } from "../../components/ui/Alert.jsx";

export function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "",
    category: "",
    brand: "",
    rating: "",
    numReviews: "",
  });

  const [currentImage, setCurrentImage] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // LOAD PRODUCT
  // ==========================================

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const product = await adminApi.getProductById(id);

        console.log("EDIT PRODUCT:", product);

        setForm({
          name: product.name || "",
          description: product.description || "",
          price: product.price ?? "",
          discountPrice: product.discountPrice ?? "",
          stock: product.stock ?? "",
          category: product.category || "",
          brand: product.brand || "",
          rating: product.rating ?? "",
          numReviews: product.numReviews ?? "",
        });

        if (product.images && product.images.length > 0) {
          setCurrentImage(product.images[0]);
        }
      } catch (err) {
        console.error("LOAD PRODUCT ERROR:", err);
        setError(err.message || "Failed to load product.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadProduct();
    }
  }, [id]);

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  // ==========================================
  // IMAGE CHANGE
  // ==========================================

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setNewImage(file);

    // Preview new image
    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);

    setError("");
    setSuccess("");
  }

  // ==========================================
  // SUBMIT
  // ==========================================

  async function handleSubmit(event) {
    event.preventDefault();

    setBusy(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("discountPrice", form.discountPrice);
      formData.append("stock", form.stock);
      formData.append("category", form.category);
      formData.append("brand", form.brand);
      formData.append("rating", form.rating);
      formData.append("numReviews", form.numReviews);

      // Backend currently requires image
      if (newImage) {
        formData.append("image", newImage);
      }

      console.log("UPDATING ID:", id);

      const result = await adminApi.updateProduct(id, formData);

      console.log("UPDATE RESULT:", result);

      setSuccess("Product updated successfully!");

      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);
    } catch (err) {
      console.error("UPDATE ERROR:", err);
      setError(err.message || "Failed to update product.");
    } finally {
      setBusy(false);
    }
  }

  // ==========================================
  // LOADING UI
  // ==========================================

  if (loading) {
    return (
      <main className="page">
        <section className="auth-card">
          <h1>Edit Product</h1>
          <p className="muted">Loading product...</p>
        </section>
      </main>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="page">

      {/* ================= HEADER ================= */}

      <div className="page-header">
        <div>
          <h1>Edit Product</h1>
          <p className="muted">
            Update your product information.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => navigate("/admin/products")}
        >
          Back to Products
        </Button>
      </div>

      {/* ================= ALERTS ================= */}

      {error && (
        <Alert>
          {error}
        </Alert>
      )}

      {success && (
        <Alert tone="success">
          {success}
        </Alert>
      )}

      {/* ================= FORM ================= */}

      <form
        className="form-stack"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >

        {/* ========================================
            IMAGE SECTION
        ======================================== */}

        <section className="auth-card">

          <h2>Product Image</h2>

          <p className="muted">
            Update the main image of your product.
          </p>

          {/* Current / Preview Image */}

          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {(previewImage || currentImage) && (
              <img
                src={previewImage || currentImage}
                alt={form.name}
                style={{
                  width: "260px",
                  height: "260px",
                  objectFit: "contain",
                  borderRadius: "12px",
                  border: "1px solid #ddd",
                  background: "#fff",
                  padding: "10px",
                }}
              />
            )}
          </div>

          {/* File input */}

          <div
            className="field"
            style={{ marginTop: "20px" }}
          >
            <label htmlFor="image">
              Product image
            </label>

            <input
              id="image"
              type="file"
              name="image"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              disabled={busy}
            />

            <p className="muted">
              {newImage
                ? `Selected: ${newImage.name}`
                : "Choose a new image to replace the current image."}
            </p>

            <p className="muted">
              JPG, PNG or WEBP
            </p>

            <p className="muted">
              Maximum size: 5 MB
            </p>
          </div>

        </section>

        {/* ========================================
            BASIC INFORMATION
        ======================================== */}

        <section className="auth-card">

          <h2>Basic Information</h2>

          <p className="muted">
            Update the main details of your product.
          </p>

          <div className="form-stack">

            <Field
              label="Product Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              disabled={busy}
              placeholder="Enter product name"
            />

            <div className="field">

              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                disabled={busy}
                rows={5}
                placeholder="Enter product description"
              />

            </div>

            <Field
              label="Brand"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              required
              disabled={busy}
              placeholder="Example: Philips"
            />

            <Field
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              disabled={busy}
              placeholder="Example: Electronics"
            />

          </div>

        </section>

        {/* ========================================
            PRICING
        ======================================== */}

        <section className="auth-card">

          <h2>Pricing</h2>

          <p className="muted">
            Update the product pricing.
          </p>

          <div className="form-stack">

            <Field
              label="Price"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              required
              disabled={busy}
              min="0"
              step="0.01"
              placeholder="2999"
            />

            <Field
              label="Discount Price"
              name="discountPrice"
              type="number"
              value={form.discountPrice}
              onChange={handleChange}
              disabled={busy}
              min="0"
              step="0.01"
              placeholder="1499"
            />

          </div>

        </section>

        {/* ========================================
            INVENTORY
        ======================================== */}

        <section className="auth-card">

          <h2>Inventory</h2>

          <p className="muted">
            Update stock and product review information.
          </p>

          <div className="form-stack">

            <Field
              label="Stock"
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              required
              disabled={busy}
              min="0"
              placeholder="25"
            />

            <Field
              label="Rating"
              name="rating"
              type="number"
              value={form.rating}
              onChange={handleChange}
              disabled={busy}
              min="0"
              max="5"
              step="0.1"
              placeholder="4.3"
            />

            <Field
              label="Number of Reviews"
              name="numReviews"
              type="number"
              value={form.numReviews}
              onChange={handleChange}
              disabled={busy}
              min="0"
              placeholder="120"
            />

          </div>

        </section>

        {/* ========================================
            BUTTONS
        ======================================== */}

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "10px",
            marginBottom: "30px",
          }}
        >

          <Button
            type="submit"
            busy={busy}
          >
            Update Product
          </Button>

          <Button
            type="button"
            disabled={busy}
            onClick={() => navigate("/admin/products")}
          >
            Cancel
          </Button>

        </div>

      </form>

    </main>
  );
}