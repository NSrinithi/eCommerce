import { useEffect, useState } from "react";
import { Link } from "react-router";
import { adminApi } from "../../services/adminApi.js";
import { LoadingScreen } from "../../components/ui/LoadingScreen.jsx";
import { Alert } from "../../components/ui/Alert.jsx";

const PAGE_SIZE = 10;

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

    // =========================================================
    // LOAD PRODUCTS
    // =========================================================

    async function loadProducts(currentPage = 1) {
        try {
            setLoading(true);
            setError("");

            console.log(
                "REQUESTING PRODUCTS:",
                `page=${currentPage}&limit=${PAGE_SIZE}`
            );

            const response = await adminApi.getProducts(
                currentPage,
                PAGE_SIZE
            );

            console.log("RAW PRODUCT RESPONSE:", response);

            // -------------------------------------------------
            // Handle possible API wrapper structures
            // -------------------------------------------------

            const payload =
                response?.data?.success !== undefined
                    ? response.data
                    : response;

            console.log("NORMALIZED PAYLOAD:", payload);

            // -------------------------------------------------
            // Products
            // -------------------------------------------------

            const productList = Array.isArray(payload?.data)
                ? payload.data
                : Array.isArray(payload)
                    ? payload
                    : [];

            // -------------------------------------------------
            // Pagination
            // -------------------------------------------------

            const paginationData =
                payload?.pagination ||
                response?.pagination ||
                response?.data?.pagination ||
                {
                    page: currentPage,
                    limit: PAGE_SIZE,
                    totalProduct: productList.length,
                    totalPages: Math.max(
                        1,
                        Math.ceil(productList.length / PAGE_SIZE)
                    ),
                };

            console.log("PRODUCT LIST:", productList);
            console.log("PAGINATION:", paginationData);

            setProducts(productList);

            setPagination({
                page: Number(paginationData.page) || currentPage,
                limit: Number(paginationData.limit) || PAGE_SIZE,
                totalProduct:
                    Number(paginationData.totalProduct) ||
                    Number(paginationData.total) ||
                    productList.length,
                totalPages:
                    Number(paginationData.totalPages) || 1,
            });

        } catch (err) {
            console.error("FAILED TO LOAD PRODUCTS:", err);

            setError(
                err?.message ||
                "Failed to load products."
            );

            setProducts([]);
        } finally {
            setLoading(false);
        }
    }

    // =========================================================
    // INITIAL LOAD + PAGE CHANGE
    // =========================================================

    useEffect(() => {
        loadProducts(page);
    }, [page]);

    // =========================================================
    // DELETE PRODUCT
    // =========================================================

    async function handleDelete(productId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await adminApi.deleteProduct(productId);

            // If this was the last product on the page
            // and we're not on page 1, move backwards.
            if (products.length === 1 && page > 1) {
                setPage((currentPage) => currentPage - 1);
                return;
            }

            // Otherwise reload current page
            await loadProducts(page);

        } catch (err) {
            console.error("DELETE PRODUCT ERROR:", err);

            setError(
                err?.message ||
                "Failed to delete product."
            );
        }
    }

    // =========================================================
    // PAGE CHANGE
    // =========================================================

    function changePage(newPage) {
        if (newPage < 1) {
            return;
        }

        if (newPage > pagination.totalPages) {
            return;
        }

        if (newPage === page) {
            return;
        }

        console.log("CHANGING PAGE:", newPage);

        setPage(newPage);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    // =========================================================
    // REFRESH
    // =========================================================

    async function refreshProducts() {
        await loadProducts(page);
    }

    // =========================================================
    // LOADING
    // =========================================================

    if (loading && products.length === 0) {
        return <LoadingScreen />;
    }

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <main className="page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="page-header">

                <div>
                    <h1>Products</h1>

                    <p className="muted">
                        Manage your products and inventory.
                    </p>
                </div>

                <div className="page-header-actions">

                    <button
                        type="button"
                        className="button secondary"
                        onClick={refreshProducts}
                        disabled={loading}
                    >
                        {loading
                            ? "Refreshing..."
                            : "Refresh"}
                    </button>

                    <Link
                        to="/admin/products/new"
                        className="button"
                    >
                        + Add Product
                    </Link>

                </div>

            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
                <Alert>
                    {error}
                </Alert>
            )}

            {/* =================================================
                SUMMARY
            ================================================= */}

            <div className="admin-products-summary">

                <div className="admin-products-summary-card">
                    <strong>
                        {pagination.totalProduct}
                    </strong>

                    <span className="muted">
                        Total Products
                    </span>
                </div>

                <div className="admin-products-summary-card">
                    <strong>
                        {page}
                    </strong>

                    <span className="muted">
                        Current Page
                    </span>
                </div>

                <div className="admin-products-summary-card">
                    <strong>
                        {pagination.totalPages}
                    </strong>

                    <span className="muted">
                        Total Pages
                    </span>
                </div>

            </div>

            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {!loading && products.length === 0 ? (

                <div className="empty-state">

                    <h2>
                        No products found
                    </h2>

                    <p className="muted">
                        Add your first product to get started.
                    </p>

                    <Link
                        to="/admin/products/new"
                        className="button"
                    >
                        Add Product
                    </Link>

                </div>

            ) : (

                <>

                    {/* =================================================
                        PRODUCTS TABLE
                    ================================================= */}

                    <div className="admin-products-table-wrap">

                        <table className="admin-products-table">

                            <thead>

                                <tr>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Rating</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>

                            </thead>

                            <tbody>

                                {products.map((product) => {

                                    const price =
                                        Number(product.price || 0);

                                    const discountPrice =
                                        Number(
                                            product.discountPrice ??
                                            product.price ??
                                            0
                                        );

                                    const stock =
                                        Number(product.stock || 0);

                                    const rating =
                                        Number(product.rating || 0);

                                    // ---------------------------------
                                    // Stock status
                                    // ---------------------------------

                                    let stockStatus = "In stock";
                                    let stockClass = "in-stock";

                                    if (stock === 0) {

                                        stockStatus =
                                            "Out of stock";

                                        stockClass =
                                            "out-of-stock";

                                    } else if (stock <= 5) {

                                        stockStatus =
                                            "Critical";

                                        stockClass =
                                            "critical";

                                    } else if (stock <= 10) {

                                        stockStatus =
                                            "Low stock";

                                        stockClass =
                                            "low-stock";
                                    }

                                    // ---------------------------------
                                    // Discount
                                    // ---------------------------------

                                    const discount =
                                        price > discountPrice
                                            ? Math.round(
                                                ((price - discountPrice) /
                                                    price) *
                                                100
                                            )
                                            : 0;

                                    return (

                                        <tr
                                            key={product._id}
                                        >

                                            {/* PRODUCT */}

                                            <td>

                                                <div className="admin-product-cell">

                                                    <div className="admin-product-image">

                                                        {product.images?.[0] ? (

                                                            <img
                                                                src={
                                                                    product.images[0]
                                                                }
                                                                alt={
                                                                    product.name
                                                                }
                                                            />

                                                        ) : (

                                                            <div className="no-image">
                                                                No image
                                                            </div>

                                                        )}

                                                    </div>

                                                    <div className="admin-product-info">

                                                        <strong>
                                                            {product.name}
                                                        </strong>

                                                        {product.brand && (
                                                            <span className="muted">
                                                                {product.brand}
                                                            </span>
                                                        )}

                                                        <span className="muted">
                                                            SKU #
                                                            {product._id
                                                                ?.slice(-6)
                                                                .toUpperCase()}
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>

                                            {/* CATEGORY */}

                                            <td>
                                                {product.category ||
                                                    "Uncategorized"}
                                            </td>

                                            {/* PRICE */}

                                            <td>

                                                <div className="price-cell">

                                                    <strong>
                                                        ₹
                                                        {discountPrice.toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </strong>

                                                    {price >
                                                        discountPrice && (

                                                        <span className="old-price">
                                                            ₹
                                                            {price.toLocaleString(
                                                                "en-IN"
                                                            )}
                                                        </span>

                                                    )}

                                                    {discount > 0 && (

                                                        <span className="discount-text">
                                                            {discount}% OFF
                                                        </span>

                                                    )}

                                                </div>

                                            </td>

                                            {/* STOCK */}

                                            <td>

                                                <strong>
                                                    {stock}
                                                </strong>

                                                <span className="muted">
                                                    {" "}units
                                                </span>

                                            </td>

                                            {/* RATING */}

                                            <td>

                                                <span className="rating">
                                                    ★
                                                    {rating.toFixed(1)}
                                                </span>

                                                <span className="muted">
                                                    {" "}
                                                    ({product.numReviews || 0})
                                                </span>

                                            </td>

                                            {/* STATUS */}

                                            <td>

                                                <span
                                                    className={`stock-status stock-status--${stockClass}`}
                                                >
                                                    {stockStatus}
                                                </span>

                                            </td>

                                            {/* ACTIONS */}

                                            <td>

                                                <div className="admin-product-actions">

                                                    <Link
                                                        to={`/admin/edit/${product._id}`}
                                                        className="icon-button"
                                                        title="Edit product"
                                                    >
                                                        ✎
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        className="icon-button delete-button"
                                                        title="Delete product"
                                                        onClick={() =>
                                                            handleDelete(
                                                                product._id
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

                    {/* =================================================
                        PAGINATION
                    ================================================= */}

                    {pagination.totalPages > 1 && (

                        <div className="pagination">

                            {/* PREVIOUS */}

                            <button
                                type="button"
                                className="pagination-button"
                                disabled={page === 1 || loading}
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
                                (_, index) => index + 1
                            ).map((pageNumber) => (

                                <button
                                    key={pageNumber}
                                    type="button"
                                    disabled={loading}
                                    className={`pagination-button ${
                                        pageNumber === page
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        changePage(pageNumber)
                                    }
                                >
                                    {pageNumber}
                                </button>

                            ))}

                            {/* NEXT */}

                            <button
                                type="button"
                                className="pagination-button"
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

                    )}

                    {/* =================================================
                        PAGINATION INFO
                    ================================================= */}

                    <div className="pagination-info">

                        Showing{" "}

                        <strong>
                            {products.length}
                        </strong>

                        {" "}of{" "}

                        <strong>
                            {pagination.totalProduct}
                        </strong>

                        {" "}products

                        {" • "}

                        Page{" "}

                        <strong>
                            {page}
                        </strong>

                        {" "}of{" "}

                        <strong>
                            {pagination.totalPages}
                        </strong>

                    </div>

                </>

            )}

        </main>
    );
}