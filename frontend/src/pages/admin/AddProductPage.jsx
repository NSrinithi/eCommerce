import { useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../../lib/api";

export function AddProductPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        description: "",
        brand: "",
        category: "",
        price: "",
        discountPrice: "",
        stock: "",
        rating: "0",
        numReviews: "0",
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!image) {
            setError("Please upload a product image.");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append("name", form.name);
            formData.append("description", form.description);
            formData.append("brand", form.brand);
            formData.append("category", form.category);
            formData.append("price", form.price);
            formData.append("discountPrice", form.discountPrice);
            formData.append("stock", form.stock);
            formData.append("rating", form.rating);
            formData.append("numReviews", form.numReviews);

            // IMPORTANT:
            // Backend uses upload.single("images")
            formData.append("images", image);

            await api("/products", {
                method: "POST",
                data: formData,
            });

            navigate("/admin/products");
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to add product.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-add-product">

            {/* HEADER */}

            <div className="add-product-header">

                <div>
                    <h1>Add Product</h1>

                    <p>
                        Create a new product and add it to your store catalog.
                    </p>
                </div>

                <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => navigate("/admin/products")}
                >
                    ← Back to Products
                </button>

            </div>


            {/* ERROR */}

            {error && (
                <div className="form-error">
                    ⚠ {error}
                </div>
            )}


            <form
                className="add-product-layout"
                onSubmit={handleSubmit}
            >

                {/* LEFT SIDE */}

                <div className="add-product-main">

                    {/* BASIC INFORMATION */}

                    <section className="product-form-card">

                        <div className="card-heading">
                            <div>
                                <h2>Basic Information</h2>
                                <p>
                                    Add the basic details of your product.
                                </p>
                            </div>
                        </div>


                        <div className="form-grid">

                            <div className="form-field full">
                                <label>
                                    Product Name <span>*</span>
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Nike Air Max 270"
                                    required
                                />
                            </div>


                            <div className="form-field">
                                <label>
                                    Brand
                                </label>

                                <input
                                    type="text"
                                    name="brand"
                                    value={form.brand}
                                    onChange={handleChange}
                                    placeholder="e.g. Nike"
                                />
                            </div>


                            <div className="form-field">
                                <label>
                                    Category <span>*</span>
                                </label>

                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">
                                        Select category
                                    </option>

                                    <option value="Electronics">
                                        Electronics
                                    </option>

                                    <option value="Audio">
                                        Audio
                                    </option>

                                    <option value="Computer Accessories">
                                        Computer Accessories
                                    </option>

                                    <option value="Books & Reading">
                                        Books & Reading
                                    </option>

                                    <option value="Kitchen Appliances">
                                        Kitchen Appliances
                                    </option>

                                    <option value="Toys">
                                        Toys
                                    </option>

                                    <option value="Watches">
                                        Watches
                                    </option>

                                    <option value="Fashion">
                                        Fashion
                                    </option>

                                    <option value="Beauty & Personal Care">
                                        Beauty & Personal Care
                                    </option>

                                    <option value="Travel">
                                        Travel
                                    </option>
                                </select>
                            </div>


                            <div className="form-field full">
                                <label>
                                    Description <span>*</span>
                                </label>

                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Describe the product, features, materials, specifications..."
                                    rows="6"
                                    required
                                />
                            </div>

                        </div>

                    </section>


                    {/* PRICING */}

                    <section className="product-form-card">

                        <div className="card-heading">
                            <div>
                                <h2>Pricing</h2>
                                <p>
                                    Set the product price and discount.
                                </p>
                            </div>
                        </div>


                        <div className="form-grid three">

                            <div className="form-field">
                                <label>
                                    Original Price <span>*</span>
                                </label>

                                <div className="input-with-symbol">
                                    <span>₹</span>

                                    <input
                                        type="number"
                                        name="price"
                                        value={form.price}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>


                            <div className="form-field">
                                <label>
                                    Selling Price
                                </label>

                                <div className="input-with-symbol">
                                    <span>₹</span>

                                    <input
                                        type="number"
                                        name="discountPrice"
                                        value={form.discountPrice}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        min="0"
                                    />
                                </div>
                            </div>


                            <div className="form-field">
                                <label>
                                    Stock <span>*</span>
                                </label>

                                <input
                                    type="number"
                                    name="stock"
                                    value={form.stock}
                                    onChange={handleChange}
                                    placeholder="0"
                                    min="0"
                                    required
                                />
                            </div>

                        </div>

                    </section>


                    {/* PRODUCT METADATA */}

                    <section className="product-form-card">

                        <div className="card-heading">
                            <div>
                                <h2>Product Details</h2>
                                <p>
                                    Additional product information.
                                </p>
                            </div>
                        </div>


                        <div className="form-grid three">

                            <div className="form-field">
                                <label>Rating</label>

                                <input
                                    type="number"
                                    name="rating"
                                    value={form.rating}
                                    onChange={handleChange}
                                    min="0"
                                    max="5"
                                    step="0.1"
                                />
                            </div>


                            <div className="form-field">
                                <label>Number of Reviews</label>

                                <input
                                    type="number"
                                    name="numReviews"
                                    value={form.numReviews}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </div>

                        </div>

                    </section>

                </div>


                {/* RIGHT SIDE */}

                <aside className="add-product-sidebar">

                    {/* IMAGE */}

                    <section className="product-form-card image-card">

                        <div className="card-heading">
                            <div>
                                <h2>Product Image</h2>

                                <p>
                                    Upload the main product image.
                                </p>
                            </div>
                        </div>


                        <label className="image-upload">

                            {preview ? (

                                <div className="image-preview">

                                    <img
                                        src={preview}
                                        alt="Product preview"
                                    />

                                    <div className="change-image">
                                        Change image
                                    </div>

                                </div>

                            ) : (

                                <div className="upload-placeholder">

                                    <div className="upload-icon">
                                        ↑
                                    </div>

                                    <strong>
                                        Upload product image
                                    </strong>

                                    <span>
                                        PNG, JPG or JPEG
                                    </span>

                                    <small>
                                        Maximum recommended size 5MB
                                    </small>

                                </div>

                            )}

                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/jpg"
                                onChange={handleImageChange}
                                hidden
                            />

                        </label>

                    </section>


                    {/* SUMMARY */}

                    <section className="product-form-card">

                        <div className="card-heading">
                            <div>
                                <h2>Product Summary</h2>
                                <p>
                                    Review before publishing.
                                </p>
                            </div>
                        </div>


                        <div className="product-summary">

                            <div>
                                <span>Product</span>
                                <strong>
                                    {form.name || "Not added"}
                                </strong>
                            </div>

                            <div>
                                <span>Category</span>
                                <strong>
                                    {form.category || "Not selected"}
                                </strong>
                            </div>

                            <div>
                                <span>Price</span>
                                <strong>
                                    {form.discountPrice
                                        ? `₹${form.discountPrice}`
                                        : form.price
                                            ? `₹${form.price}`
                                            : "₹0"}
                                </strong>
                            </div>

                            <div>
                                <span>Stock</span>
                                <strong>
                                    {form.stock || "0"} units
                                </strong>
                            </div>

                        </div>

                    </section>


                    {/* ACTIONS */}

                    <div className="product-actions">

                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={() => navigate("/admin/products")}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Adding Product..."
                                : "Add Product"}
                        </button>

                    </div>

                </aside>

            </form>

        </div>
    );
}