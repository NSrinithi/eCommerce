import { useEffect, useMemo, useState } from "react";
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

const LOW_STOCK_LIMIT = 10;

const EMPTY_FORM = {
    name: "",
    description: "",
    brand: "",
    category: "",
    price: "",
    discountPrice: "",
    stock: "",
    rating: "",
    numReviews: "",
};

function productToForm(product) {
    return {
        name: product.name || "",
        description: product.description || "",
        brand: product.brand || "",
        category: product.category || "",
        price: product.price ?? "",
        discountPrice: product.discountPrice ?? "",
        stock: product.stock ?? "",
        rating: product.rating ?? "",
        numReviews: product.numReviews ?? "",
    };
}

function formatMoney(value) {
    if (value === "" || Number.isNaN(Number(value))) return "—";
    return `₹${Number(value).toLocaleString("en-IN")}`;
}

function getStockState(stock) {
    if (stock === "" || Number.isNaN(Number(stock))) {
        return { label: "Not set", tone: "muted" };
    }
    const qty = Number(stock);
    if (qty <= 0) return { label: "Out of stock", tone: "danger" };
    if (qty <= LOW_STOCK_LIMIT) return { label: "Low stock", tone: "warning" };
    return { label: "In stock", tone: "success" };
}

function validate(form) {
    const errors = {};

    if (!form.name.trim()) errors.name = "Product name is required.";
    if (!form.description.trim()) errors.description = "Description is required.";
    if (!form.category) errors.category = "Select a category.";

    if (!form.price || Number(form.price) <= 0) {
        errors.price = "Enter a price greater than 0.";
    }

    if (
        form.discountPrice !== "" &&
        Number(form.discountPrice) > Number(form.price)
    ) {
        errors.discountPrice = "Selling price can't be higher than the original price.";
    }

    if (form.stock === "" || Number(form.stock) < 0) {
        errors.stock = "Enter a stock quantity of 0 or more.";
    }

    if (
        form.rating !== "" &&
        (Number(form.rating) < 0 || Number(form.rating) > 5)
    ) {
        errors.rating = "Rating must be between 0 and 5.";
    }

    return errors;
}

export function EditProductPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [form, setForm] = useState(EMPTY_FORM);
    const [initialForm, setInitialForm] = useState(EMPTY_FORM);

    const [image, setImage] = useState(null);
    const [originalImage, setOriginalImage] = useState("");
    const [preview, setPreview] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [loadError, setLoadError] = useState("");
    const [error, setError] = useState("");
    const [showErrors, setShowErrors] = useState(false);

    // -----------------------------
    // Load product
    // -----------------------------
    useEffect(() => {
        let cancelled = false;

        async function loadProduct() {
            try {
                setLoading(true);
                setLoadError("");

                const response = await adminApi.getProductById(id);

                const product =
                    response?.data?.product ||
                    response?.product ||
                    response?.data ||
                    response;

                if (!product) throw new Error("Product not found.");
                if (cancelled) return;

                const loaded = productToForm(product);
                setForm(loaded);
                setInitialForm(loaded);

                const firstImage = product.images?.[0] || "";
                setOriginalImage(firstImage);
                setPreview(firstImage);
            } catch (err) {
                if (!cancelled) {
                    setLoadError(err.message || "Failed to load product.");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        if (id) loadProduct();

        return () => {
            cancelled = true;
        };
    }, [id]);

    // Free the temporary blob URL when the preview changes / page closes
    useEffect(() => {
        return () => {
            if (preview && preview.startsWith("blob:")) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    // -----------------------------
    // Derived, live values
    // -----------------------------
    const errors = useMemo(() => validate(form), [form]);

    const isDirty = useMemo(
        () => image !== null || JSON.stringify(form) !== JSON.stringify(initialForm),
        [form, initialForm, image]
    );

    // Warn before closing the tab with unsaved edits
    useEffect(() => {
        if (!isDirty) return;

        function warn(e) {
            e.preventDefault();
            e.returnValue = "";
        }

        window.addEventListener("beforeunload", warn);
        return () => window.removeEventListener("beforeunload", warn);
    }, [isDirty]);

    const price = Number(form.price) || 0;
    const sellingPrice =
        form.discountPrice !== "" ? Number(form.discountPrice) : price;
    const discountPercent =
        price > 0 && sellingPrice < price
            ? Math.round((1 - sellingPrice / price) * 100)
            : 0;
    const stockState = getStockState(form.stock);

    const categoryOptions =
        form.category && !CATEGORIES.includes(form.category)
            ? [form.category, ...CATEGORIES]
            : CATEGORIES;

    // -----------------------------
    // Handlers
    // -----------------------------
    function handleChange(e) {
        const { name, value } = e.target;
        setForm((current) => ({ ...current, [name]: value }));
    }

    function handleImageChange(e) {
        const file = e.target.files?.[0];
        e.target.value = "";

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please select an image file (JPG, PNG or WEBP).");
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

    function handleRevertImage() {
        setImage(null);
        setPreview(originalImage);
    }

    function handleDiscard() {
        setForm(initialForm);
        setImage(null);
        setPreview(originalImage);
        setShowErrors(false);
        setError("");
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setShowErrors(true);

        if (Object.keys(errors).length > 0) {
            setError("Please fix the highlighted fields.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        try {
            setSaving(true);
            setError("");

            const formData = new FormData();

            formData.append("name", form.name.trim());
            formData.append("description", form.description.trim());
            formData.append("brand", form.brand.trim());
            formData.append("category", form.category);
            formData.append("price", form.price);
            formData.append("discountPrice", form.discountPrice || form.price);
            formData.append("stock", form.stock);
            formData.append("rating", form.rating || "0");
            formData.append("numReviews", form.numReviews || "0");

            // Only send an image if the admin picked a new one
            if (image) {
                formData.append("images", image);
            }

            await adminApi.updateProduct(id, formData);

            navigate("/admin/products");
        } catch (err) {
            console.error("Update product error:", err);
            setError(err.message || "Failed to update product.");
            window.scrollTo({ top: 0, behavior: "smooth" });
        } finally {
            setSaving(false);
        }
    }

    const fieldError = (name) => (showErrors ? errors[name] : "");

    // -----------------------------
    // Loading skeleton
    // -----------------------------
    if (loading) {
        return (
            <div className="admin-add-product">
                <div className="ep-skeleton ep-skeleton-title" />
                <div className="add-product-layout">
                    <div className="add-product-main">
                        <div className="ep-skeleton ep-skeleton-card" />
                        <div className="ep-skeleton ep-skeleton-card" />
                    </div>
                    <div className="add-product-sidebar">
                        <div className="ep-skeleton ep-skeleton-card tall" />
                    </div>
                </div>
            </div>
        );
    }

    // -----------------------------
    // Load error
    // -----------------------------
    if (loadError) {
        return (
            <div className="admin-add-product">
                <div className="ep-state-card">
                    <div className="ep-state-icon">!</div>
                    <h2>Couldn't load this product</h2>
                    <p>{loadError}</p>
                    <div className="ep-state-actions">
                        <button
                            type="button"
                            className="primary-btn"
                            onClick={() => window.location.reload()}
                        >
                            Try again
                        </button>
                        <Link to="/admin/products" className="secondary-btn ep-link-btn">
                            Back to products
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-add-product">
            {/* ---------- Header ---------- */}
            <div className="add-product-header">
                <div>
                    <div className="admin-breadcrumb">
                        Admin / Products / Edit
                    </div>

                    <div className="ep-title-row">
                        <h1>Edit product</h1>
                        <span className={`ep-badge ep-badge--${stockState.tone}`}>
                            <i /> {stockState.label}
                        </span>
                    </div>

                    <p>
                        Product ID <code className="ep-code">{id}</code>
                    </p>
                </div>

                <div className="product-actions ep-header-actions">
                    <Link to="/admin/products" className="secondary-btn ep-link-btn">
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        form="edit-product-form"
                        className="primary-btn"
                        disabled={saving || !isDirty}
                    >
                        {saving ? "Saving…" : "Save changes"}
                    </button>
                </div>
            </div>

            {error && (
                <div className="form-error" role="alert">
                    {error}
                </div>
            )}

            <form
                id="edit-product-form"
                className="add-product-layout"
                onSubmit={handleSubmit}
                noValidate
            >
                {/* ================= MAIN ================= */}
                <div className="add-product-main">
                    {/* Basic info */}
                    <section className="product-form-card">
                        <div className="card-heading">
                            <h2>Basic information</h2>
                            <p>The name, brand and description customers see.</p>
                        </div>

                        <div className="form-grid">
                            <div className={`form-field full ${fieldError("name") ? "has-error" : ""}`}>
                                <label htmlFor="name">
                                    Product name <span>*</span>
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Apple AirPods 4"
                                />
                                {fieldError("name") && (
                                    <small className="ep-field-error">{fieldError("name")}</small>
                                )}
                            </div>

                            <div className="form-field">
                                <label htmlFor="brand">Brand</label>
                                <input
                                    id="brand"
                                    name="brand"
                                    value={form.brand}
                                    onChange={handleChange}
                                    placeholder="e.g. Apple"
                                />
                            </div>

                            <div className={`form-field ${fieldError("category") ? "has-error" : ""}`}>
                                <label htmlFor="category">
                                    Category <span>*</span>
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                >
                                    <option value="">Select category</option>
                                    {categoryOptions.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                                {fieldError("category") && (
                                    <small className="ep-field-error">{fieldError("category")}</small>
                                )}
                            </div>

                            <div className={`form-field full ${fieldError("description") ? "has-error" : ""}`}>
                                <label htmlFor="description">
                                    Description <span>*</span>
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows="6"
                                    placeholder="Describe the product…"
                                />
                                <div className="ep-field-footer">
                                    {fieldError("description") ? (
                                        <small className="ep-field-error">{fieldError("description")}</small>
                                    ) : (
                                        <span />
                                    )}
                                    <small className="ep-counter">
                                        {form.description.length} characters
                                    </small>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Pricing */}
                    <section className="product-form-card">
                        <div className="card-heading">
                            <h2>Pricing</h2>
                            <p>Set the original price and the price customers pay.</p>
                        </div>

                        <div className="form-grid">
                            <div className={`form-field ${fieldError("price") ? "has-error" : ""}`}>
                                <label htmlFor="price">
                                    Original price <span>*</span>
                                </label>
                                <div className="input-with-symbol">
                                    <span>₹</span>
                                    <input
                                        id="price"
                                        name="price"
                                        type="number"
                                        min="0"
                                        value={form.price}
                                        onChange={handleChange}
                                        placeholder="0"
                                    />
                                </div>
                                {fieldError("price") && (
                                    <small className="ep-field-error">{fieldError("price")}</small>
                                )}
                            </div>

                            <div className={`form-field ${fieldError("discountPrice") ? "has-error" : ""}`}>
                                <label htmlFor="discountPrice">Selling price</label>
                                <div className="input-with-symbol">
                                    <span>₹</span>
                                    <input
                                        id="discountPrice"
                                        name="discountPrice"
                                        type="number"
                                        min="0"
                                        value={form.discountPrice}
                                        onChange={handleChange}
                                        placeholder="Same as original"
                                    />
                                </div>
                                {fieldError("discountPrice") ? (
                                    <small className="ep-field-error">{fieldError("discountPrice")}</small>
                                ) : discountPercent > 0 ? (
                                    <small className="ep-hint ep-hint--success">
                                        Customers save {discountPercent}% ({formatMoney(price - sellingPrice)})
                                    </small>
                                ) : (
                                    <small className="ep-hint">Leave empty to sell at the original price.</small>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Inventory */}
                    <section className="product-form-card">
                        <div className="card-heading">
                            <h2>Inventory &amp; ratings</h2>
                            <p>Stock levels update the badge at the top of this page.</p>
                        </div>

                        <div className="form-grid three">
                            <div className={`form-field ${fieldError("stock") ? "has-error" : ""}`}>
                                <label htmlFor="stock">
                                    Stock <span>*</span>
                                </label>
                                <input
                                    id="stock"
                                    name="stock"
                                    type="number"
                                    min="0"
                                    value={form.stock}
                                    onChange={handleChange}
                                    placeholder="0"
                                />
                                {fieldError("stock") && (
                                    <small className="ep-field-error">{fieldError("stock")}</small>
                                )}
                            </div>

                            <div className={`form-field ${fieldError("rating") ? "has-error" : ""}`}>
                                <label htmlFor="rating">Rating (0–5)</label>
                                <input
                                    id="rating"
                                    name="rating"
                                    type="number"
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    value={form.rating}
                                    onChange={handleChange}
                                    placeholder="0.0"
                                />
                                {fieldError("rating") && (
                                    <small className="ep-field-error">{fieldError("rating")}</small>
                                )}
                            </div>

                            <div className="form-field">
                                <label htmlFor="numReviews">Number of reviews</label>
                                <input
                                    id="numReviews"
                                    name="numReviews"
                                    type="number"
                                    min="0"
                                    value={form.numReviews}
                                    onChange={handleChange}
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </section>
                </div>

                {/* ================= SIDEBAR ================= */}
                <aside className="add-product-sidebar">
                    {/* Image */}
                    <section className="product-form-card image-card">
                        <div className="card-heading">
                            <h2>Product image</h2>
                            <p>JPG, PNG or WEBP · max 5 MB</p>
                        </div>

                        <label htmlFor="product-image" className="image-upload">
                            {preview ? (
                                <div className="image-preview">
                                    <img src={preview} alt="Product preview" />
                                    <div className="change-image">Click to replace image</div>
                                </div>
                            ) : (
                                <div className="upload-placeholder">
                                    <div className="upload-icon">+</div>
                                    <strong>Upload an image</strong>
                                    <span>Click to browse your files</span>
                                    <small>JPG, PNG or WEBP</small>
                                </div>
                            )}

                            <input
                                id="product-image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                hidden
                            />
                        </label>

                        {image && (
                            <div className="ep-image-note">
                                <span title={image.name}>New: {image.name}</span>
                                <button type="button" onClick={handleRevertImage}>
                                    Undo
                                </button>
                            </div>
                        )}
                    </section>

                    {/* Live summary */}
                    <section className="product-form-card">
                        <div className="card-heading">
                            <h2>Live summary</h2>
                            <p>How this product will look in the store.</p>
                        </div>

                        <div className="product-summary">
                            <div>
                                <span>Name</span>
                                <strong title={form.name}>{form.name || "—"}</strong>
                            </div>
                            <div>
                                <span>Category</span>
                                <strong>{form.category || "—"}</strong>
                            </div>
                            <div>
                                <span>Price</span>
                                <strong className="ep-price">
                                    {formatMoney(sellingPrice || "")}
                                    {discountPercent > 0 && (
                                        <s>{formatMoney(price)}</s>
                                    )}
                                </strong>
                            </div>
                            {discountPercent > 0 && (
                                <div>
                                    <span>Discount</span>
                                    <strong className="ep-green">{discountPercent}% off</strong>
                                </div>
                            )}
                            <div>
                                <span>Stock</span>
                                <strong>
                                    {form.stock === "" ? "—" : form.stock} · {stockState.label}
                                </strong>
                            </div>
                            <div>
                                <span>Rating</span>
                                <strong>
                                    {form.rating === "" ? "—" : `★ ${Number(form.rating).toFixed(1)}`}
                                    {form.numReviews !== "" && ` (${form.numReviews})`}
                                </strong>
                            </div>
                        </div>
                    </section>
                </aside>
            </form>

            {/* ---------- Unsaved changes bar ---------- */}
            {isDirty && (
                <div className="ep-savebar" role="status">
                    <div className="ep-savebar-inner">
                        <span className="ep-savebar-text">
                            <i /> You have unsaved changes
                        </span>

                        <div className="ep-savebar-actions">
                            <button
                                type="button"
                                className="secondary-btn"
                                onClick={handleDiscard}
                                disabled={saving}
                            >
                                Discard
                            </button>

                            <button
                                type="submit"
                                form="edit-product-form"
                                className="primary-btn"
                                disabled={saving}
                            >
                                {saving ? "Saving…" : "Save changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}