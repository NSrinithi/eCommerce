import { useEffect, useState } from "react";
import { Link } from "react-router";
import { adminApi } from "../../services/adminApi.js";
import { LoadingScreen } from "../../components/ui/LoadingScreen.jsx";
import { Alert } from "../../components/ui/Alert.jsx";

export function AdminProductsPage() {
  const [products, setProducts] = useState([]);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    page: 1,
    limit: 10,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================================
  // LOAD PRODUCTS
  // ================================
  async function loadProducts(currentPage = page) {
    try {
      setLoading(true);
      setError("");

      const data = await adminApi.getProducts(currentPage, limit);

      console.log("PRODUCT API RESPONSE:", data);

      /*
        Expected response:

        {
          products: [],
          pagination: {
            page: 1,
            limit: 10,
            total: 25,
            totalPages: 3
          }
        }
      */

      setProducts(
        data?.products ||
        data?.data ||
        []
      );

      if (data?.pagination) {
        setPagination(data.pagination);
      }

      /*
        If your backend returns:
        {
          data: {
            products: [],
            pagination: {}
          }
        }

        use this instead:

        setProducts(data?.data?.products || []);

        setPagination(data?.data?.pagination || {});
      */

    } catch (err) {
      console.error(err);
      setError(
        err?.message ||
        "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  }

  // ================================
  // LOAD WHEN PAGE CHANGES
  // ================================
  useEffect(() => {
    loadProducts(page);
  }, [page]);

  // ================================
  // DELETE PRODUCT
  // ================================
  async function handleDelete(productId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await adminApi.deleteProduct(productId);

      /*
        Reload current page after delete.
      */

      await loadProducts(page);

      /*
        If the last item of a page was deleted,
        move to previous page.
      */

      if (
        products.length === 1 &&
        page > 1
      ) {
        setPage(page - 1);
      }

    } catch (err) {
      console.error(err);

      setError(
        err?.message ||
        "Failed to delete product."
      );
    }
  }

  // ================================
  // PAGE CHANGE
  // ================================
  function changePage(newPage) {
    if (newPage < 1) return;

    if (
      pagination.totalPages &&
      newPage > pagination.totalPages
    ) {
      return;
    }

    setPage(newPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ================================
  // LOADING
  // ================================
  if (loading && products.length === 0) {
    return <LoadingScreen />;
  }

  // ================================
  // RENDER
  // ================================
  return (
    <main className="page">

      {/* ================= HEADER ================= */}

      <div className="page-header">

        <div>
          <h1>Products</h1>

          <p className="muted">
            Manage your products and inventory.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="button"
        >
          + Add Product
        </Link>

      </div>


      {/* ================= ERROR ================= */}

      {error && (
        <Alert>
          {error}
        </Alert>
      )}


      {/* ================= SUMMARY ================= */}

      <div className="admin-products-summary">

        <div>
          <strong>
            {pagination.total || 0}
          </strong>

          <span className="muted">
            Total Products
          </span>
        </div>

        <div>
          <strong>
            {page}
          </strong>

          <span className="muted">
            Current Page
          </span>
        </div>

        <div>
          <strong>
            {pagination.totalPages || 1}
          </strong>

          <span className="muted">
            Total Pages
          </span>
        </div>

      </div>


      {/* ================= PRODUCTS ================= */}

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
                      product.discountPrice ||
                      product.price ||
                      0
                    );

                  const stock =
                    Number(product.stock || 0);

                  const rating =
                    Number(product.rating || 0);

                  let stockStatus =
                    "In stock";

                  if (stock === 0) {
                    stockStatus = "Out of stock";
                  } else if (stock <= 5) {
                    stockStatus = "Critical";
                  } else if (stock <= 10) {
                    stockStatus = "Low stock";
                  }

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
                                src={product.images[0]}
                                alt={product.name}
                              />

                            ) : (

                              <div className="no-image">
                                No image
                              </div>

                            )}

                          </div>


                          <div>

                            <strong>
                              {product.name}
                            </strong>

                            {product.brand && (
                              <span className="muted">
                                {product.brand}
                              </span>
                            )}

                            {product.sku && (
                              <span className="muted">
                                SKU #{product.sku}
                              </span>
                            )}

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

                        </div>

                      </td>


                      {/* STOCK */}

                      <td>

                        {stock}

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

                        {product.numReviews !==
                          undefined && (

                          <span className="muted">
                            {" "}
                            ({product.numReviews})
                          </span>

                        )}

                      </td>


                      {/* STATUS */}

                      <td>

                        <span
                          className={`stock-status stock-status--${stockStatus
                            .toLowerCase()
                            .replace(" ", "-")}`}
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


          {/* ================= PAGINATION ================= */}

          {pagination.totalPages > 1 && (

            <div className="pagination">

              {/* PREVIOUS */}

              <button
                type="button"
                className="pagination-button"
                disabled={page === 1}
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
                  pagination.totalPages
                }
                onClick={() =>
                  changePage(page + 1)
                }
              >
                →
              </button>

            </div>

          )}


          {/* ================= PAGE INFO ================= */}

          <div className="pagination-info">

            Showing{" "}

            <strong>
              {products.length}
            </strong>{" "}

            products on page{" "}

            <strong>
              {page}
            </strong>{" "}

            of{" "}

            <strong>
              {pagination.totalPages || 1}
            </strong>

          </div>

        </>

      )}

    </main>
  );
}