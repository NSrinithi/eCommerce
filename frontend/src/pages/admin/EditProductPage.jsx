import { useEffect, useState } from "react";
import { adminApi } from "../../services/adminApi";
import { useNavigate, useParams, Link } from "react-router";

const CATEGORIES = [
    "Electronics",
    "Audio",
    "Computer Accessories",
    "Books & Reading",
    "Kitchen",
    "Kitchen Appliances",
    "Toys",
    "Watches",
    "Fashion",
    "Clothing",
    "Bags",
    "Travel",
    "Beauty & Personal Care",
    "Home Appliances",
];

export function EditProductPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [form, setForm] = useState({
        name: "",
        description: "",
        brand: "",
        category: "",
        price: "",
        discountPrice: "",
        stock: "",
        rating: "",
        numReviews: "",
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // -----------------------------
    // Load product
    // -----------------------------
    useEffect(() => {
        async function loadProduct() {
            try {
                setLoading(true);
                setError("");

                const response = await adminApi.getProductById(id);

                console.log("Product response:", response);

                // Handles common response structures
                const product =
                    response?.data?.product ||
                    response?.product ||
                    response?.data ||
                    response;

                if (!product) {
                    throw new Error("Product not found.");
                }

                setForm({
                    name: product.name || "",
                    description: product.description || "",
                    brand: product.brand || "",
                    category: product.category || "",
                    price: product.price ?? "",
                    discountPrice: product.discountPrice ?? "",
                    stock: product.stock ?? "",
                    rating: product.rating ?? "",
                    numReviews: product.numReviews ?? "",
                });

                // Existing product image
                if (product.images?.length > 0) {
                    setPreview(product.images[0]);
                }
            } catch (err) {
                console.error("Failed to load product:", err);

                setError(
                    err.message || "Failed to load product."
                );
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            loadProduct();
        }
    }, [id]);

    // -----------------------------
    // Input change
    // -----------------------------
    function handleChange(e) {
        const { name, value } = e.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    }

    // -----------------------------
    // Image change
    // -----------------------------
    function handleImageChange(e) {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please select an image file.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Image must be smaller than 5 MB.");
            return;
        }

        setError("");
        setImage(file);
        setPreview(URL.createObjectURL(file));
    }

    // -----------------------------
    // Validation
    // -----------------------------
    function validateForm() {
        if (!form.name.trim()) {
            return "Product name is required.";
        }

        if (!form.description.trim()) {
            return "Product description is required.";
        }

        if (!form.category) {
            return "Please select a category.";
        }

        if (!form.price || Number(form.price) <= 0) {
            return "Please enter a valid price.";
        }

        if (
            form.discountPrice !== "" &&
            Number(form.discountPrice) > Number(form.price)
        ) {
            return "Discount price cannot be greater than the original price.";
        }

        if (
            form.stock === "" ||
            Number(form.stock) < 0
        ) {
            return "Please enter a valid stock quantity.";
        }

        if (
            form.rating !== "" &&
            (Number(form.rating) < 0 ||
                Number(form.rating) > 5)
        ) {
            return "Rating must be between 0 and 5.";
        }

        return "";
    }

    // -----------------------------
    // Submit
    // -----------------------------
    async function handleSubmit(e) {
        e.preventDefault();

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setSaving(true);
            setError("");

            const formData = new FormData();

            formData.append(
                "name",
                form.name.trim()
            );

            formData.append(
                "description",
                form.description.trim()
            );

            formData.append(
                "brand",
                form.brand.trim()
            );

            formData.append(
                "category",
                form.category
            );

            formData.append(
                "price",
                form.price
            );

            formData.append(
                "discountPrice",
                form.discountPrice || form.price
            );

            formData.append(
                "stock",
                form.stock
            );

            formData.append(
                "rating",
                form.rating || "0"
            );

            formData.append(
                "numReviews",
                form.numReviews || "0"
            );

            // Only send image if admin selected a new one
            if (image) {
                formData.append("images", image);
            }

            console.log("Updating product:", id);

            for (const [key, value] of formData.entries()) {
                console.log(key, value);
            }

            await adminApi.updateProduct(id, formData);

            navigate("/admin/products");
        } catch (err) {
            console.error("Update product error:", err);

            setError(
                err.message ||
                "Failed to update product."
            );
        } finally {
            setSaving(false);
        }
    }

    // -----------------------------
    // Loading
    // -----------------------------
    if (loading) {
        return (
            <div className="admin-page">
                <p>Loading product...</p>
            </div>
        );
    }

    // -----------------------------
    // Error
    // -----------------------------
    if (error && !form.name) {
        return (
            <div className="admin-page">
                <div className="admin-form-error">
                    {error}
                </div>

                <Link
                    to="/admin/products"
                    className="admin-secondary-button"
                >
                    ← Back to Products
                </Link>
            </div>
        );
    }

    return (
        <div className="admin-page">

            {/* Header */}
            <div className="admin-page-header">

                <div>
                    <p className="admin-eyebrow">
                        CATALOG
                    </p>

                    <h1>Edit Product</h1>

                    <p>
                        Update the details of your product.
                    </p>
                </div>

                <Link
                    to="/admin/products"
                    className="admin-secondary-button"
                >
                    ← Back to Products
                </Link>

            </div>

            {/* Error */}
            {error && (
                <div className="admin-form-error">
                    {error}
                </div>
            )}

            <form
                className="admin-product-form"
                onSubmit={handleSubmit}
            >

                {/* IMAGE */}
                <section className="admin-form-card">

                    <div className="admin-form-card-header">
                        <div>
                            <h2>Product Image</h2>

                            <p>
                                Change the product image if needed.
                            </p>
                        </div>
                    </div>

                    <div className="admin-image-upload">

                        <div className="admin-image-preview">

                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Product preview"
                                />
                            ) : (
                                <div className="admin-image-placeholder">
                                    <span>＋</span>
                                    <p>
                                        No image selected
                                    </p>
                                </div>
                            )}

                        </div>

                        <div className="admin-image-upload-info">

                            <label
                                htmlFor="product-image"
                                className="admin-upload-button"
                            >
                                Choose New Image
                            </label>

                            <input
                                id="product-image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                hidden
                            />

                            <p>
                                JPG, PNG or WEBP
                            </p>

                            <p>
                                Maximum size: 5 MB
                            </p>

                            {image && (
                                <strong>
                                    {image.name}
                                </strong>
                            )}

                        </div>

                    </div>

                </section>

                {/* BASIC INFORMATION */}
                <section className="admin-form-card">

                    <div className="admin-form-card-header">
                        <div>
                            <h2>
                                Basic Information
                            </h2>

                            <p>
                                Update the main details of your product.
                            </p>
                        </div>
                    </div>

                    <div className="admin-form-grid">

                        {/* Name */}
                        <div className="admin-form-field full">

                            <label htmlFor="name">
                                Product Name *
                            </label>

                            <input
                                id="name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="e.g. Apple AirPods 4"
                            />

                        </div>

                        {/* Brand */}
                        <div className="admin-form-field">

                            <label htmlFor="brand">
                                Brand
                            </label>

                            <input
                                id="brand"
                                name="brand"
                                value={form.brand}
                                onChange={handleChange}
                                placeholder="e.g. Apple"
                            />

                        </div>

                        {/* Category */}
                        <div className="admin-form-field">

                            <label htmlFor="category">
                                Category *
                            </label>

                            <select
                                id="category"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                            >

                                <option value="">
                                    Select category
                                </option>

                                {CATEGORIES.map((category) => (
                                    <option
                                        key={category}
                                        value={category}
                                    >
                                        {category}
                                    </option>
                                ))}

                            </select>

                        </div>

                        {/* Description */}
                        <div className="admin-form-field full">

                            <label htmlFor="description">
                                Description *
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows="5"
                                placeholder="Describe the product..."
                            />

                        </div>

                    </div>

                </section>

                {/* PRICING & INVENTORY */}
                <section className="admin-form-card">

                    <div className="admin-form-card-header">

                        <div>
                            <h2>
                                Pricing & Inventory
                            </h2>

                            <p>
                                Update pricing and available stock.
                            </p>
                        </div>

                    </div>

                    <div className="admin-form-grid">

                        {/* Original price */}
                        <div className="admin-form-field">

                            <label htmlFor="price">
                                Original Price *
                            </label>

                            <div className="admin-input-prefix">

                                <span>₹</span>

                                <input
                                    id="price"
                                    name="price"
                                    type="number"
                                    min="0"
                                    value={form.price}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>

                        {/* Selling price */}
                        <div className="admin-form-field">

                            <label htmlFor="discountPrice">
                                Selling Price
                            </label>

                            <div className="admin-input-prefix">

                                <span>₹</span>

                                <input
                                    id="discountPrice"
                                    name="discountPrice"
                                    type="number"
                                    min="0"
                                    value={form.discountPrice}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>

                        {/* Stock */}
                        <div className="admin-form-field">

                            <label htmlFor="stock">
                                Stock *
                            </label>

                            <input
                                id="stock"
                                name="stock"
                                type="number"
                                min="0"
                                value={form.stock}
                                onChange={handleChange}
                            />

                        </div>

                        {/* Rating */}
                        <div className="admin-form-field">

                            <label htmlFor="rating">
                                Rating
                            </label>

                            <input
                                id="rating"
                                name="rating"
                                type="number"
                                min="0"
                                max="5"
                                step="0.1"
                                value={form.rating}
                                onChange={handleChange}
                            />

                        </div>

                        {/* Reviews */}
                        <div className="admin-form-field">

                            <label htmlFor="numReviews">
                                Number of Reviews
                            </label>

                            <input
                                id="numReviews"
                                name="numReviews"
                                type="number"
                                min="0"
                                value={form.numReviews}
                                onChange={handleChange}
                            />

                        </div>

                    </div>

                </section>

                {/* ACTIONS */}
                <div className="admin-form-actions">

                    <Link
                        to="/admin/products"
                        className="admin-secondary-button"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        className="admin-primary-button"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving Changes..."
                            : "Save Changes"}
                    </button>

                </div>

            </form>

        </div>
    );
}