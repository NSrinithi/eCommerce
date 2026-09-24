import { useEffect, useMemo, useState } from "react";
import { adminApi } from "../../services/adminApi";
import { Link } from "react-router";

function formatCurrency(value) {
    return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

export function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [stockFilter, setStockFilter] = useState("All");
    const [sort, setSort] = useState("newest");

    const [selectedProducts, setSelectedProducts] = useState([]);

    async function loadProducts() {
        try {
            setLoading(true);
            setError("");

            const response = await adminApi.getProducts(1, 50);

            setProducts(
                Array.isArray(response)
                    ? response
                    : []
            );
        } catch (err) {
            setError(err.message || "Failed to load products.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadProducts();
    }, []);

    async function handleDelete(product) {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${product.name}"?`
        );

        if (!confirmed) return;

        try {
            await adminApi.deleteProduct(product._id);

            setProducts((currentProducts) =>
                currentProducts.filter(
                    (item) => item._id !== product._id
                )
            );

            setSelectedProducts((current) =>
                current.filter((id) => id !== product._id)
            );
        } catch (err) {
            alert(err.message || "Failed to delete product.");
        }
    }

    function toggleProduct(id) {
        setSelectedProducts((current) =>
            current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id]
        );
    }

    function toggleAll() {
        if (selectedProducts.length === filteredProducts.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(
                filteredProducts.map((product) => product._id)
            );
        }
    }

    const categories = useMemo(() => {
        return [
            "All",
            ...new Set(
                products
                    .map((product) => product.category)
                    .filter(Boolean)
            ),
        ];
    }, [products]);

    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (search.trim()) {
            const query = search.toLowerCase();

            result = result.filter((product) =>
                [
                    product.name,
                    product.brand,
                    product.category,
                ]
                    .filter(Boolean)
                    .some((value) =>
                        value.toLowerCase().includes(query)
                    )
            );
        }

        if (category !== "All") {
            result = result.filter(
                (product) => product.category === category
            );
        }

        if (stockFilter === "In stock") {
            result = result.filter(
                (product) => product.stock > 15
            );
        }

        if (stockFilter === "Low stock") {
            result = result.filter(
                (product) =>
                    product.stock > 0 &&
                    product.stock <= 15
            );
        }

        if (stockFilter === "Out of stock") {
            result = result.filter(
                (product) => product.stock <= 0
            );
        }

        if (sort === "price-low") {
            result.sort(
                (a, b) =>
                    (a.discountPrice ?? a.price) -
                    (b.discountPrice ?? b.price)
            );
        }

        if (sort === "price-high") {
            result.sort(
                (a, b) =>
                    (b.discountPrice ?? b.price) -
                    (a.discountPrice ?? a.price)
            );
        }

        if (sort === "rating") {
            result.sort(
                (a, b) =>
                    (b.rating || 0) -
                    (a.rating || 0)
            );
        }

        if (sort === "stock") {
            result.sort(
                (a, b) =>
                    (a.stock || 0) -
                    (b.stock || 0)
            );
        }

        if (sort === "newest") {
            result.sort(
                (a, b) =>
                    new Date(b.createdAt || 0) -
                    new Date(a.createdAt || 0)
            );
        }

        return result;
    }, [
        products,
        search,
        category,
        stockFilter,
        sort,
    ]);

    const totalProducts = products.length;

    const lowStockCount = products.filter(
        (product) =>
            product.stock > 0 &&
            product.stock <= 15
    ).length;

    const outOfStockCount = products.filter(
        (product) => product.stock <= 0
    ).length;

    if (loading) {
        return (
            <div className="admin-products-page">
                <div className="admin-loading-card">
                    <div className="admin-spinner"></div>
                    <span>Loading products...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-products-page">
                <div className="admin-error-card">
                    <strong>Something went wrong</strong>
                    <span>{error}</span>

                    <button
                        onClick={loadProducts}
                        className="admin-retry-button"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-products-page">

            {/* ================= HEADER ================= */}

            <div className="products-topbar">

                <div>
                    <div className="admin-breadcrumb">
                        Admin
                        <span>/</span>
                        Products
                    </div>

                    <h1>Products</h1>

                    <p>
                        Manage your product catalog, inventory and pricing.
                    </p>
                </div>

                <Link
                    to="/admin/add"
                    className="add-product-button"
                >
                    <span>＋</span>
                    Add product
                </Link>

            </div>


            {/* ================= OVERVIEW CARDS ================= */}

            <div className="product-overview">

                <div className="overview-card">
                    <div className="overview-icon">📦</div>

                    <div>
                        <span>Total products</span>
                        <strong>{totalProducts}</strong>
                    </div>
                </div>

                <div className="overview-card">
                    <div className="overview-icon">🟢</div>

                    <div>
                        <span>In catalog</span>
                        <strong>
                            {totalProducts - lowStockCount - outOfStockCount}
                        </strong>
                    </div>
                </div>

                <div className="overview-card warning-card">
                    <div className="overview-icon">⚠️</div>

                    <div>
                        <span>Low stock</span>
                        <strong>{lowStockCount}</strong>
                    </div>
                </div>

                <div className="overview-card danger-card">
                    <div className="overview-icon">○</div>

                    <div>
                        <span>Out of stock</span>
                        <strong>{outOfStockCount}</strong>
                    </div>
                </div>

            </div>


            {/* ================= TOOLBAR ================= */}

            <div className="products-toolbar">

                <div className="product-search">

                    <span>⌕</span>

                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="clear-search"
                        >
                            ×
                        </button>
                    )}

                </div>


                <div className="toolbar-filters">

                    <select
                        value={category}
                        onChange={(e) =>
                            setCategory(e.target.value)
                        }
                    >
                        {categories.map((item) => (
                            <option
                                key={item}
                                value={item}
                            >
                                {item === "All"
                                    ? "All categories"
                                    : item}
                            </option>
                        ))}
                    </select>


                    <select
                        value={stockFilter}
                        onChange={(e) =>
                            setStockFilter(e.target.value)
                        }
                    >
                        <option value="All">
                            All stock
                        </option>

                        <option value="In stock">
                            In stock
                        </option>

                        <option value="Low stock">
                            Low stock
                        </option>

                        <option value="Out of stock">
                            Out of stock
                        </option>
                    </select>


                    <select
                        value={sort}
                        onChange={(e) =>
                            setSort(e.target.value)
                        }
                    >
                        <option value="newest">
                            Newest
                        </option>

                        <option value="price-low">
                            Price: Low to high
                        </option>

                        <option value="price-high">
                            Price: High to low
                        </option>

                        <option value="rating">
                            Highest rated
                        </option>

                        <option value="stock">
                            Lowest stock
                        </option>
                    </select>

                </div>

            </div>


            {/* ================= BULK BAR ================= */}

            {selectedProducts.length > 0 && (
                <div className="bulk-action-bar">

                    <div>
                        <strong>
                            {selectedProducts.length}
                        </strong>

                        <span>
                            products selected
                        </span>
                    </div>

                    <div>
                        <button>
                            Edit
                        </button>

                        <button className="bulk-danger">
                            Delete
                        </button>
                    </div>

                </div>
            )}


            {/* ================= PRODUCT TABLE ================= */}

            <div className="products-table-card">

                <div className="products-table-header">

                    <div>
                        <h2>Product catalog</h2>

                        <p>
                            {filteredProducts.length} products
                            {search && ` matching "${search}"`}
                        </p>
                    </div>

                    <button
                        className="refresh-button"
                        onClick={loadProducts}
                    >
                        ↻ Refresh
                    </button>

                </div>


                <div className="products-table-scroll">

                    <table className="modern-products-table">

                        <thead>

                            <tr>

                                <th className="checkbox-column">
                                    <input
                                        type="checkbox"
                                        checked={
                                            filteredProducts.length > 0 &&
                                            selectedProducts.length ===
                                            filteredProducts.length
                                        }
                                        onChange={toggleAll}
                                    />
                                </th>

                                <th>Product</th>

                                <th>Category</th>

                                <th>Price</th>

                                <th>Inventory</th>

                                <th>Rating</th>

                                <th>Status</th>

                                <th className="actions-column">
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredProducts.map((product) => {

                                const image =
                                    product.images?.[0] ||
                                    "https://via.placeholder.com/80";

                                const sellingPrice =
                                    product.discountPrice ??
                                    product.price;

                                const hasDiscount =
                                    product.discountPrice &&
                                    product.discountPrice <
                                    product.price;

                                const stockStatus =
                                    product.stock <= 0
                                        ? "out"
                                        : product.stock <= 5
                                            ? "critical"
                                            : product.stock <= 15
                                                ? "low"
                                                : "good";

                                return (

                                    <tr key={product._id}>

                                        {/* CHECKBOX */}

                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedProducts.includes(
                                                    product._id
                                                )}
                                                onChange={() =>
                                                    toggleProduct(
                                                        product._id
                                                    )
                                                }
                                            />
                                        </td>


                                        {/* PRODUCT */}

                                        <td>

                                            <div className="modern-product-info">

                                                <div className="product-image-wrapper">

                                                    <img
                                                        src={image}
                                                        alt={product.name}
                                                    />

                                                </div>

                                                <div className="product-name-wrapper">

                                                    <strong>
                                                        {product.name}
                                                    </strong>

                                                    <span>
                                                        {product.brand ||
                                                            "No brand"}
                                                    </span>

                                                    <small>
                                                        SKU #
                                                        {product._id
                                                            ?.slice(-6)
                                                            .toUpperCase()}
                                                    </small>

                                                </div>

                                            </div>

                                        </td>


                                        {/* CATEGORY */}

                                        <td>

                                            <span className="category-pill">
                                                {product.category ||
                                                    "Uncategorized"}
                                            </span>

                                        </td>


                                        {/* PRICE */}

                                        <td>

                                            <div className="modern-price">

                                                <strong>
                                                    {formatCurrency(
                                                        sellingPrice
                                                    )}
                                                </strong>

                                                {hasDiscount && (
                                                    <span>
                                                        {formatCurrency(
                                                            product.price
                                                        )}
                                                    </span>
                                                )}

                                            </div>

                                        </td>


                                        {/* INVENTORY */}

                                        <td>

                                            <div className="inventory-cell">

                                                <strong>
                                                    {product.stock}
                                                </strong>

                                                <span>
                                                    units
                                                </span>

                                            </div>

                                        </td>


                                        {/* RATING */}

                                        <td>

                                            <div className="rating-cell">

                                                <span>
                                                    ★
                                                </span>

                                                <strong>
                                                    {product.rating ||
                                                        "0.0"}
                                                </strong>

                                                <small>
                                                    ({product.numReviews ||
                                                        0})
                                                </small>

                                            </div>

                                        </td>


                                        {/* STATUS */}

                                        <td>

                                            {stockStatus === "good" && (
                                                <span className="status-pill success">
                                                    <i></i>
                                                    In stock
                                                </span>
                                            )}

                                            {stockStatus === "low" && (
                                                <span className="status-pill warning">
                                                    <i></i>
                                                    Low stock
                                                </span>
                                            )}

                                            {stockStatus === "critical" && (
                                                <span className="status-pill danger">
                                                    <i></i>
                                                    Critical
                                                </span>
                                            )}

                                            {stockStatus === "out" && (
                                                <span className="status-pill danger">
                                                    <i></i>
                                                    Out of stock
                                                </span>
                                            )}

                                        </td>


                                        {/* ACTIONS */}

                                        <td>

                                            <div className="modern-actions">

                                                <Link
                                                    to={`/admin/edit/${product._id}`}
                                                    className="icon-action edit"
                                                    title="Edit product"
                                                >
                                                    ✎
                                                </Link>

                                                <button
                                                    className="icon-action delete"
                                                    title="Delete product"
                                                    onClick={() =>
                                                        handleDelete(
                                                            product
                                                        )
                                                    }
                                                >
                                                    🗑
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                );
                            })}

                        </tbody>

                    </table>


                    {/* EMPTY */}

                    {filteredProducts.length === 0 && (

                        <div className="products-empty">

                            <div>
                                🛍️
                            </div>

                            <h3>
                                No products found
                            </h3>

                            <p>
                                Try changing your search or filters.
                            </p>

                            <button
                                onClick={() => {
                                    setSearch("");
                                    setCategory("All");
                                    setStockFilter("All");
                                }}
                            >
                                Clear filters
                            </button>

                        </div>

                    )}

                </div>


                {/* ================= FOOTER ================= */}

                <div className="products-table-footer">

                    <span>
                        Showing{" "}
                        <strong>
                            {filteredProducts.length}
                        </strong>{" "}
                        of{" "}
                        <strong>
                            {products.length}
                        </strong>{" "}
                        products
                    </span>

                    <div className="table-page-buttons">

                        <button disabled>
                            ←
                        </button>

                        <button className="active">
                            1
                        </button>

                        <button disabled>
                            →
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}