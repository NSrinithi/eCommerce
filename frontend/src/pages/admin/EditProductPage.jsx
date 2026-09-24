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

  const [image, setImage] = useState(null);
  const [oldImage, setOldImage] = useState("");

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // -----------------------------
  // LOAD PRODUCT
  // -----------------------------
  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const product = await adminApi.getProductById(id);

        console.log("Product loaded:", product);

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

        if (product.images?.length > 0) {
          setOldImage(product.images[0]);
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load product.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadProduct();
    }
  }, [id]);

  // -----------------------------
  // INPUT CHANGE
  // -----------------------------
  function change(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  // -----------------------------
  // IMAGE CHANGE
  // -----------------------------
  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setImage(file);
    setError("");
    setSuccess("");
  }

  // -----------------------------
  // SUBMIT
  // -----------------------------
  async function submit(event) {
  event.preventDefault();

  setBusy(true);
  setError("");
  setSuccess("");

  try {
    if (!image) {
      setError("Please select a new product image.");
      setBusy(false);
      return;
    }

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

    // IMPORTANT
    formData.append("image", image);

    console.log("========== EDIT PRODUCT ==========");
    console.log("ID:", id);
    console.log("Image:", image);

    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const response = await adminApi.updateProduct(id, formData);

    console.log("Update response:", response);

    setSuccess("Product updated successfully.");

    setTimeout(() => {
      navigate("/admin/products");
    }, 800);

  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    setError(err.message || "Failed to update product.");
  } finally {
    setBusy(false);
  }
}

  // -----------------------------
  // LOADING
  // -----------------------------
  if (loading) {
    return (
      <main className="page">
        <div className="page-header">
          <h1>Edit Product</h1>
        </div>

        <p>Loading product...</p>
      </main>
    );
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <main className="page">
      <div className="page-header">
        <div>
          <h1>Edit Product</h1>
          <p className="muted">
            Update the product details below.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => navigate("/admin/products")}
        >
          Back
        </Button>
      </div>

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

      <form
        className="form-stack"
        onSubmit={submit}
        encType="multipart/form-data"
      >
        {/* NAME */}
        <Field
          label="Product name"
          name="name"
          value={form.name}
          onChange={change}
          required
          disabled={busy}
          placeholder="Enter product name"
        />

        {/* DESCRIPTION */}
        <div className="field">
          <label htmlFor="description">
            Description
          </label>

          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={change}
            disabled={busy}
            required
            rows={5}
            placeholder="Enter product description"
          />
        </div>

        {/* PRICE */}
        <Field
          label="Price"
          name="price"
          type="number"
          value={form.price}
          onChange={change}
          required
          disabled={busy}
          min="0"
          step="0.01"
          placeholder="2999"
        />

        {/* DISCOUNT PRICE */}
        <Field
          label="Discount price"
          name="discountPrice"
          type="number"
          value={form.discountPrice}
          onChange={change}
          disabled={busy}
          min="0"
          step="0.01"
          placeholder="1499"
        />

        {/* STOCK */}
        <Field
          label="Stock"
          name="stock"
          type="number"
          value={form.stock}
          onChange={change}
          required
          disabled={busy}
          min="0"
          placeholder="25"
        />

        {/* CATEGORY */}
        <Field
          label="Category"
          name="category"
          value={form.category}
          onChange={change}
          required
          disabled={busy}
          placeholder="Electronics"
        />

        {/* BRAND */}
        <Field
          label="Brand"
          name="brand"
          value={form.brand}
          onChange={change}
          required
          disabled={busy}
          placeholder="boAt"
        />

        {/* RATING */}
        <Field
          label="Rating"
          name="rating"
          type="number"
          value={form.rating}
          onChange={change}
          disabled={busy}
          min="0"
          max="5"
          step="0.1"
          placeholder="4.3"
        />

        {/* NUMBER OF REVIEWS */}
        <Field
          label="Number of reviews"
          name="numReviews"
          type="number"
          value={form.numReviews}
          onChange={change}
          disabled={busy}
          min="0"
          placeholder="120"
        />

        {/* EXISTING IMAGE */}
        {oldImage && (
          <div>
            <label>Current image</label>

            <div style={{ marginTop: "8px" }}>
              <img
                src={oldImage}
                alt={form.name}
                style={{
                  width: "180px",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            </div>
          </div>
        )}

        {/* NEW IMAGE */}
        <div className="field">
          <label htmlFor="image">
            Product image
          </label>

          <input
            id="image"
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            disabled={busy}
          />

          <p className="muted">
            {image
              ? `Selected: ${image.name}`
              : "Select a new image if you want to replace the current image."}
          </p>
        </div>

        {/* BUTTONS */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "10px",
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
            onClick={() => navigate("/admin/products")}
            disabled={busy}
          >
            Cancel
          </Button>
        </div>
      </form>
    </main>
  );
}