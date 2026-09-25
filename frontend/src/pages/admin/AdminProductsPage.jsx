import { useEffect, useState } from "react";
import { Link } from "react-router";
import { adminApi } from "../../services/adminApi.js";
import { LoadingScreen } from "../../components/ui/LoadingScreen.jsx";
import { Alert } from "../../components/ui/Alert.jsx";

const PAGE_SIZE = 10;

function formatCurrency(value) {
    return `₹${Number(value ?? 0).toLocaleString("en-IN")}`;
}

function getStockStatus(stock) {
    const value = Number(stock ?? 0);

    if (value === 0) {
        return {
            label: "Out of stock",
            className: "out",
        };
    }

    if (value <= 5) {
        return {
            label: "Critical",
            className: "critical",
        };
    }

    if (value <= 10) {
        return {
            label: "Low stock",
            className: "low",
        };
    }

    return {
        label: "In stock",
        className: "good",
    };
}

export function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);

    const [pagination, setPagination] = useState({
        page: 1,
        limit: PAGE_SIZE,
        totalProduct: 0,
        totalPages: 1,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ============================================================
    // LOAD PRODUCTS
    // ============================================================

    async function loadProducts(currentPage = 1) {
    try {
        setLoading(true);
        setError("");

        const response = await adminApi.getProducts(
            currentPage,
            PAGE_SIZE
        );

        console.log("=================================");
        console.log("PRODUCT API RESPONSE:", response);
        console.log("PRODUCTS:", response?.data);
        console.log("PAGINATION:", response?.pagination);
        console.log(
            "TOTAL PRODUCTS:",
            response?.pagination?.totalProduct
        );
        console.log(
            "TOTAL PAGES:",
            response?.pagination?.totalPages
        );
        console.log("=================================");

        if (!response?.success) {
            throw new Error(
                response?.message ||
                "Failed to load products."
            );
        }

        const productList = Array.isArray(response.data)
            ? response.data
            : [];

        const paginationData = response.pagination || {};

        setProducts(productList);

        setPagination({
            page:
                Number(paginationData.page) ||
                currentPage,

            limit:
                Number(paginationData.limit) ||
                PAGE_SIZE,

            totalProduct:
                Number(paginationData.totalProduct) || 0,

            totalPages:
                Number(paginationData.totalPages) || 1,
        });

    } catch (err) {
        console.error("PRODUCT LOAD ERROR:", err);

        setError(
            err?.message ||
            "Failed to load products."
        );

        setProducts([]);

        setPagination({
            page: currentPage,
            limit: PAGE_SIZE,
            totalProduct: 0,
            totalPages: 1,
        });

    } finally {
        setLoading(false);
    }
}

    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {
        loadProducts(page);
    }, [page]);

    // ============================================================
    // DELETE PRODUCT
    // ============================================================

    async function handleDelete(productId, productName) {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${productName}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await adminApi.deleteProduct(productId);

            if (products.length === 1 && page > 1) {
                setPage((currentPage) => currentPage - 1);
                return;
            }

            await loadProducts(page);

        } catch (err) {
            console.error("DELETE ERROR:", err);

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to delete product."
            );
        }
    }

    // ============================================================
    // REFRESH
    // ============================================================

    async function refreshProducts() {
        await loadProducts(page);
    }

    // ============================================================
    // PAGE CHANGE
    // ============================================================

    function changePage(newPage) {
        if (loading) return;

        if (newPage < 1) return;

        if (newPage > pagination.totalPages) return;

        if (newPage === page) return;

        setPage(newPage);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    // ============================================================
    // LOADING
    // ============================================================

    if (loading && products.length === 0) {
        return <LoadingScreen />;
    }

    // ============================================================
    // CALCULATIONS
    // ============================================================

    const showingStart =
        pagination.totalProduct === 0
            ? 0
            : (page - 1) * PAGE_SIZE + 1;

    const showingEnd =
        Math.min(
            page * PAGE_SIZE,
            pagination.totalProduct
        );

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <main className="products-page">

            {/* =====================================================
                HEADER
            ====================================================== */}

            <section className="products-header">

                <div>
                    <div className="products-eyebrow">
                        CATALOG MANAGEMENT
                    </div>

                    <h1>Products</h1>

                    <p>
                        Manage your products, inventory and pricing
                        from one place.
                    </p>
                </div>

                <div className="products-header-actions">

                    <button
                        type="button"
                        className="products-refresh-btn"
                        onClick={refreshProducts}
                        disabled={loading}
                    >
                        <span className="refresh-icon">
                            ↻
                        </span>

                        {loading
                            ? "Refreshing..."
                            : "Refresh"}
                    </button>

                    <Link
                        to="/admin/products/new"
                        className="products-add-btn"
                    >
                        <span>+</span>
                        Add Product
                    </Link>

                </div>

            </section>

            {/* =====================================================
                ERROR
            ====================================================== */}

            {error && (
                <div className="products-error">
                    <Alert>{error}</Alert>
                </div>
            )}

            {/* =====================================================
                STAT CARDS
            ====================================================== */}

            <section className="products-stats">

                {/* TOTAL PRODUCTS */}

                <div className="products-stat-card">

                    <div className="stat-icon stat-icon-products">
                        📦
                    </div>

                    <div>
                        <span>Total Products</span>

                        <strong>
                            {pagination.totalProduct}
                        </strong>
                    </div>

                </div>

                {/* CURRENT PAGE */}

                <div className="products-stat-card">

                    <div className="stat-icon stat-icon-page">
                        ◫
                    </div>

                    <div>
                        <span>Current Page</span>

                        <strong>
                            {page}

                            <small>
                                {" "}
                                / {pagination.totalPages}
                            </small>
                        </strong>
                    </div>

                </div>

                {/* SHOWING */}

                <div className="products-stat-card">

                    <div className="stat-icon stat-icon-showing">
                        👁
                    </div>

                    <div>
                        <span>Showing</span>

                        <strong>
                            {products.length}
                        </strong>
                    </div>

                </div>

            </section>

            {/* =====================================================
                PRODUCT CATALOG
            ====================================================== */}

            <section className="products-panel">

                {/* PANEL HEADER */}

                <div className="products-panel-header">

                    <div>
                        <h2>
                            Product Catalog
                        </h2>

                        <p>
                            View and manage all products in your
                            store.
                        </p>
                    </div>

                    <div className="catalog-count">
                        {pagination.totalProduct} products
                    </div>

                </div>

                {/* =================================================
                    EMPTY
                ================================================== */}

                {!loading && products.length === 0 ? (

                    <div className="products-empty">

                        <div className="empty-icon">
                            📦
                        </div>

                        <h3>
                            No products found
                        </h3>

                        <p>
                            Add your first product to start
                            building your catalog.
                        </p>

                        <Link
                            to="/admin/products/new"
                            className="products-add-btn"
                        >
                            + Add Product
                        </Link>

                    </div>

                ) : (

                    /* =================================================
                       TABLE
                    ================================================== */

                    <div className="products-table-container">

                        <table className="products-table">

                            <thead>

                                <tr>
                                    <th>PRODUCT</th>
                                    <th>CATEGORY</th>
                                    <th>PRICE</th>
                                    <th>STOCK</th>
                                    <th>RATING</th>
                                    <th>STATUS</th>
                                    <th className="actions-heading">
                                        ACTIONS
                                    </th>
                                </tr>

                            </thead>

                            <tbody>

                                {products.map((product) => {

                                    const price =
                                        Number(
                                            product.price ?? 0
                                        );

                                    const discountPrice =
                                        Number(
                                            product.discountPrice ??
                                            product.price ??
                                            0
                                        );

                                    const stock =
                                        Number(
                                            product.stock ?? 0
                                        );

                                    const rating =
                                        Number(
                                            product.rating ?? 0
                                        );

                                    const reviewCount =
                                        Number(
                                            product.numReviews ?? 0
                                        );

                                    const discount =
                                        price > 0 &&
                                        discountPrice < price
                                            ? Math.round(
                                                ((price -
                                                    discountPrice) /
                                                    price) *
                                                100
                                            )
                                            : 0;

                                    const stockStatus =
                                        getStockStatus(stock);

                                    return (

                                        <tr
                                            key={product._id}
                                            className="product-row"
                                        >

                                            {/* =====================
                                                PRODUCT
                                            ====================== */}

                                            <td>

                                                <div className="product-info">

                                                    <div className="product-image-wrapper">

                                                        {product.images?.[0] ? (

                                                            <img
                                                                src={
                                                                    product.images[0]
                                                                }
                                                                alt={
                                                                    product.name
                                                                }
                                                                className="product-image"
                                                                loading="lazy"
                                                            />

                                                        ) : (

                                                            <div className="product-no-image">
                                                                📦
                                                            </div>

                                                        )}

                                                    </div>

                                                    <div className="product-details">

                                                        <strong>
                                                            {product.name}
                                                        </strong>

                                                        <span className="product-brand">
                                                            {product.brand ||
                                                                "No brand"}
                                                        </span>

                                                        <span className="product-sku">
                                                            SKU #
                                                            {product._id
                                                                ?.slice(-6)
                                                                .toUpperCase()}
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>

                                            {/* =====================
                                                CATEGORY
                                            ====================== */}

                                            <td>

                                                <span className="category-badge">
                                                    {product.category ||
                                                        "Uncategorized"}
                                                </span>

                                            </td>

                                            {/* =====================
                                                PRICE
                                            ====================== */}

                                            <td>

                                                <div className="price-info">

                                                    <strong>
                                                        {formatCurrency(
                                                            discountPrice
                                                        )}
                                                    </strong>

                                                    {discount > 0 && (

                                                        <div className="price-extra">

                                                            <span className="old-price">
                                                                {formatCurrency(
                                                                    price
                                                                )}
                                                            </span>

                                                            <span className="discount-badge">
                                                                {discount}% OFF
                                                            </span>

                                                        </div>

                                                    )}

                                                </div>

                                            </td>

                                            {/* =====================
                                                STOCK
                                            ====================== */}

                                            <td>

                                                <div className="stock-info">

                                                    <strong>
                                                        {stock}
                                                    </strong>

                                                    <span>
                                                        units
                                                    </span>

                                                </div>

                                            </td>

                                            {/* =====================
                                                RATING
                                            ====================== */}

                                            <td>

                                                <div className="rating-info">

                                                    <span className="rating-star">
                                                        ★
                                                    </span>

                                                    <strong>
                                                        {rating.toFixed(1)}
                                                    </strong>

                                                    <span className="review-count">
                                                        (
                                                        {reviewCount.toLocaleString(
                                                            "en-IN"
                                                        )}
                                                        )
                                                    </span>

                                                </div>

                                            </td>

                                            {/* =====================
                                                STATUS
                                            ====================== */}

                                            <td>

                                                <span
                                                    className={`status-badge status-${stockStatus.className}`}
                                                >

                                                    <span className="status-dot">
                                                        ●
                                                    </span>

                                                    {stockStatus.label}

                                                </span>

                                            </td>

                                            {/* =====================
                                                ACTIONS
                                            ====================== */}

                                            <td>

                                                <div className="product-actions">

                                                    <Link
                                                        to={`/admin/edit/${product._id}`}
                                                        className="action-btn edit-action"
                                                        title="Edit product"
                                                    >
                                                        ✎
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        className="action-btn delete-action"
                                                        title="Delete product"
                                                        onClick={() =>
                                                            handleDelete(
                                                                product._id,
                                                                product.name
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

                    </div>

                )}

                {/* =================================================
                    PAGINATION
                ================================================== */}

                {pagination.totalPages > 1 && (

                    <div className="products-pagination">

                        <div className="pagination-summary">

                            Showing{" "}

                            <strong>
                                {showingStart}
                            </strong>

                            {" - "}

                            <strong>
                                {showingEnd}
                            </strong>

                            {" of "}

                            <strong>
                                {pagination.totalProduct}
                            </strong>

                        </div>

                        <div className="pagination-controls">

                            {/* PREVIOUS */}

                            <button
                                type="button"
                                className="pagination-arrow"
                                disabled={
                                    page === 1 ||
                                    loading
                                }
                                onClick={() =>
                                    changePage(page - 1)
                                }
                            >
                                ←
                            </button>

                            {/* PAGE NUMBERS */}

                            {Array.from(
                                {
                                    length:
                                        pagination.totalPages,
                                },
                                (_, index) =>
                                    index + 1
                            ).map((pageNumber) => (

                                <button
                                    key={pageNumber}
                                    type="button"
                                    disabled={loading}
                                    className={`pagination-number ${
                                        pageNumber === page
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        changePage(
                                            pageNumber
                                        )
                                    }
                                >
                                    {pageNumber}
                                </button>

                            ))}

                            {/* NEXT */}

                            <button
                                type="button"
                                className="pagination-arrow"
                                disabled={
                                    page ===
                                        pagination.totalPages ||
                                    loading
                                }
                                onClick={() =>
                                    changePage(page + 1)
                                }
                            >
                                →
                            </button>

                        </div>

                    </div>

                )}

            </section>

        </main>
    );
}