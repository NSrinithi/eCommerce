import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { adminApi } from "../../services/adminApi";

const AdminProducts = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalProduct: 0,
    totalPages: 1,
  });

  // ----------------------------------------
  // FETCH PRODUCTS
  // ----------------------------------------

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const response = await adminApi.getProducts(page, 10);

      if (response?.success) {
        setProducts(response.data || []);

        setPagination({
          page: response.pagination?.page || page,
          limit: response.pagination?.limit || 10,
          totalProduct: response.pagination?.totalProduct || 0,
          totalPages: response.pagination?.totalPages || 1,
        });
      } else {
        setProducts([]);
        setError("Unable to load products.");
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProducts([]);
      setError(
        err?.message || "Something went wrong while loading products."
      );
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------
  // INITIAL LOAD
  // ----------------------------------------

  useEffect(() => {
    fetchProducts(1);
  }, []);

  // ----------------------------------------
  // PAGINATION
  // ----------------------------------------

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;

    fetchProducts(page);

    // Scroll to top of product table
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ----------------------------------------
  // DELETE PRODUCT
  // ----------------------------------------

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );

    if (!confirmed) return;

    try {
      setDeleting(id);

      await adminApi.deleteProduct(id);

      // If deleting the last item on a page,
      // go back one page.
      if (products.length === 1 && pagination.page > 1) {
        await fetchProducts(pagination.page - 1);
      } else {
        await fetchProducts(pagination.page);
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err?.message || "Failed to delete product.");
    } finally {
      setDeleting(null);
    }
  };

  // ----------------------------------------
  // DISCOUNT
  // ----------------------------------------

  const getDiscountPercentage = (price, discountPrice) => {
    if (!price || !discountPrice || discountPrice >= price) {
      return 0;
    }

    return Math.round(((price - discountPrice) / price) * 100);
  };

  // ----------------------------------------
  // STOCK STATUS
  // ----------------------------------------

  const getStockStatus = (stock) => {
    if (stock === 0) {
      return {
        text: "Out of stock",
        className: "stock-out",
      };
    }

    if (stock <= 10) {
      return {
        text: "Low stock",
        className: "stock-low",
      };
    }

    return {
      text: "In stock",
      className: "stock-good",
    };
  };

  // ----------------------------------------
  // FORMAT PRICE
  // ----------------------------------------

  const formatPrice = (price) => {
    return `₹${Number(price || 0).toLocaleString("en-IN")}`;
  };

  // ----------------------------------------
  // LOADING
  // ----------------------------------------

  if (loading && products.length === 0) {
    return (
      <div className="admin-products-page">
        <div className="products-card">
          <div className="products-loading">
            <div className="loading-spinner"></div>
            <p>Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------
  // PAGE
  // ----------------------------------------

  return (
    <div className="admin-products-page">

      {/* ======================================
          PAGE HEADER
      ====================================== */}

      <div className="products-page-header">
        <div>
          <h1>Products</h1>
          <p>
            Manage your products, inventory and pricing.
          </p>
        </div>

        <button
          className="add-product-button"
          onClick={() => navigate("/admin/products/add")}
        >
          <span>＋</span>
          Add Product
        </button>
      </div>

      {/* ======================================
          ERROR
      ====================================== */}

      {error && (
        <div className="products-error">
          <span>⚠</span>
          <span>{error}</span>

          <button onClick={() => fetchProducts(pagination.page)}>
            Try again
          </button>
        </div>
      )}

      {/* ======================================
          PRODUCT CARD
      ====================================== */}

      <div className="products-card">

        {/* --------------------------------------
            CARD HEADER
        -------------------------------------- */}

        <div className="products-card-header">

          <div>
            <h2>Product Catalog</h2>
            <p>
              View and manage all products in your store.
            </p>
          </div>

          <div className="catalog-summary">
            <span>
              {pagination.totalProduct}{" "}
              {pagination.totalProduct === 1
                ? "product"
                : "products"}
            </span>
          </div>

        </div>

        {/* --------------------------------------
            TABLE
        -------------------------------------- */}

        {products.length > 0 ? (
          <div className="product-table-container">

            <table className="product-table">

              <thead>
                <tr>
                  <th className="product-header">
                    PRODUCT
                  </th>

                  <th>
                    CATEGORY
                  </th>

                  <th>
                    PRICE
                  </th>

                  <th>
                    STOCK
                  </th>

                  <th>
                    RATING
                  </th>

                  <th className="actions-header">
                    ACTIONS
                  </th>
                </tr>
              </thead>

              <tbody>

                {products.map((product) => {

                  const discount =
                    getDiscountPercentage(
                      product.price,
                      product.discountPrice
                    );

                  const stockStatus =
                    getStockStatus(product.stock);

                  return (
                    <tr key={product._id}>

                      {/* ==============================
                          PRODUCT
                      ============================== */}

                      <td>

                        <div className="product-cell">

                          <div className="product-image-container">

                            {product.images?.[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="product-image"
                              />
                            ) : (
                              <div className="no-product-image">
                                🛍️
                              </div>
                            )}

                          </div>

                          <div className="product-information">

                            <div
                              className="product-name"
                              title={product.name}
                            >
                              {product.name}
                            </div>

                            <div className="product-brand">
                              {product.brand}
                            </div>

                            <div className="product-sku">
                              SKU #
                              {product._id
                                ?.slice(-6)
                                .toUpperCase()}
                            </div>

                          </div>

                        </div>

                      </td>

                      {/* ==============================
                          CATEGORY
                      ============================== */}

                      <td>

                        <span className="category-badge">
                          {product.category}
                        </span>

                      </td>

                      {/* ==============================
                          PRICE
                      ============================== */}

                      <td>

                        <div className="price-cell">

                          <div className="discount-price">
                            {formatPrice(
                              product.discountPrice
                            )}
                          </div>

                          {product.price !==
                            product.discountPrice && (
                            <div className="original-price">
                              {formatPrice(
                                product.price
                              )}
                            </div>
                          )}

                          {discount > 0 && (
                            <span className="discount-badge">
                              {discount}% OFF
                            </span>
                          )}

                        </div>

                      </td>

                      {/* ==============================
                          STOCK
                      ============================== */}

                      <td>

                        <div className="stock-cell">

                          <div className="stock-number">
                            {product.stock}{" "}
                            <span>units</span>
                          </div>

                          <span
                            className={`stock-badge ${stockStatus.className}`}
                          >
                            <span className="stock-dot"></span>
                            {stockStatus.text}
                          </span>

                        </div>

                      </td>

                      {/* ==============================
                          RATING
                      ============================== */}

                      <td>

                        <div className="rating-cell">

                          <div className="rating-value">
                            <span className="star">
                              ★
                            </span>

                            <span>
                              {Number(
                                product.rating || 0
                              ).toFixed(1)}
                            </span>
                          </div>

                          <div className="review-count">
                            (
                            {Number(
                              product.numReviews || 0
                            ).toLocaleString("en-IN")}
                            )
                          </div>

                        </div>

                      </td>

                      {/* ==============================
                          ACTIONS
                      ============================== */}

                      <td>

                        <div className="product-actions">

                          <button
                            className="action-button edit-button"
                            title="Edit product"
                            onClick={() =>
                              navigate(
                                `/admin/edit/${product._id}`
                              )
                            }
                          >
                            ✎
                          </button>

                          <button
                            className="action-button delete-button"
                            title="Delete product"
                            disabled={
                              deleting === product._id
                            }
                            onClick={() =>
                              handleDelete(
                                product._id,
                                product.name
                              )
                            }
                          >
                            {deleting === product._id
                              ? "..."
                              : "🗑"}
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        ) : (

          /* ======================================
             EMPTY STATE
          ====================================== */

          <div className="empty-products">

            <div className="empty-icon">
              🛍️
            </div>

            <h3>No products found</h3>

            <p>
              Add your first product to get started.
            </p>

            <button
              className="empty-add-button"
              onClick={() =>
                navigate("/admin/products/add")
              }
            >
              + Add Product
            </button>

          </div>
        )}

        {/* ======================================
            PAGINATION
        ====================================== */}

        {pagination.totalPages > 1 && (
          <div className="pagination-container">

            <div className="pagination-info">
              Showing{" "}
              <strong>
                {(pagination.page - 1) *
                  pagination.limit +
                  1}
              </strong>{" "}
              -
              <strong>
                {" "}
                {Math.min(
                  pagination.page *
                    pagination.limit,
                  pagination.totalProduct
                )}
              </strong>{" "}
              of{" "}
              <strong>
                {pagination.totalProduct}
              </strong>{" "}
              products
            </div>

            <div className="pagination-controls">

              {/* PREVIOUS */}

              <button
                className="pagination-button previous"
                disabled={pagination.page === 1}
                onClick={() =>
                  handlePageChange(
                    pagination.page - 1
                  )
                }
              >
                ←
                <span>Previous</span>
              </button>

              {/* PAGE NUMBERS */}

              <div className="page-numbers">

                {Array.from(
                  {
                    length:
                      pagination.totalPages,
                  },
                  (_, index) => index + 1
                ).map((pageNumber) => (

                  <button
                    key={pageNumber}
                    className={`page-number ${
                      pagination.page ===
                      pageNumber
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handlePageChange(
                        pageNumber
                      )
                    }
                  >
                    {pageNumber}
                  </button>

                ))}

              </div>

              {/* NEXT */}

              <button
                className="pagination-button next"
                disabled={
                  pagination.page ===
                  pagination.totalPages
                }
                onClick={() =>
                  handlePageChange(
                    pagination.page + 1
                  )
                }
              >
                <span>Next</span>
                →
              </button>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};

export default AdminProducts;