import { useAsyncData } from "../../hooks/useAsyncData.js";
import { orderApi } from "../../services/orderApi.js";
import { LoadingScreen } from "../../components/ui/LoadingScreen.jsx";
import { Alert } from "../../components/ui/Alert.jsx";

export function AdminOrderPage() {
  const {
    data,
    loading,
    error,
    reload,
  } = useAsyncData(orderApi.getAll);

  if (loading) {
    return <LoadingScreen />;
  }

  const orders = Array.isArray(data)
    ? data
    : data?.data || [];

  // =============================
  // STATS
  // =============================

  const totalOrders = orders.length;

  const paidOrders = orders.filter(
    (order) => order.payment?.status === "PAID"
  ).length;

  const pendingOrders = orders.filter(
    (order) => order.payment?.status !== "PAID"
  ).length;

  const totalRevenue = orders.reduce(
    (total, order) =>
      total + Number(order.totalAmount || 0),
    0
  );

  return (
    <main className="page admin-orders-page">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="page-header admin-orders-title">

        <div>
          <p className="muted admin-breadcrumb">
            Admin / Orders
          </p>

          <h1>Orders</h1>

          <p className="muted">
            Manage and view all customer orders.
          </p>
        </div>

        <button
          type="button"
          className="button"
          onClick={reload}
        >
          ↻ Refresh
        </button>

      </div>

      {/* =========================================
          STATS
      ========================================= */}

      <div className="order-stats">

        <div className="order-stat-card">
          <div className="order-stat-icon">
            📦
          </div>

          <div>
            <span className="muted">
              Total orders
            </span>

            <strong>
              {totalOrders}
            </strong>
          </div>
        </div>

        <div className="order-stat-card">
          <div className="order-stat-icon">
            ✓
          </div>

          <div>
            <span className="muted">
              Paid orders
            </span>

            <strong>
              {paidOrders}
            </strong>
          </div>
        </div>

        <div className="order-stat-card">
          <div className="order-stat-icon">
            ◷
          </div>

          <div>
            <span className="muted">
              Pending payment
            </span>

            <strong>
              {pendingOrders}
            </strong>
          </div>
        </div>

        <div className="order-stat-card">
          <div className="order-stat-icon">
            ₹
          </div>

          <div>
            <span className="muted">
              Total revenue
            </span>

            <strong>
              ₹{totalRevenue.toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

      </div>

      {/* =========================================
          ERROR
      ========================================= */}

      {error && (
        <Alert>
          {error.message || "Failed to load orders."}
        </Alert>
      )}

      {/* =========================================
          EMPTY
      ========================================= */}

      {!error && orders.length === 0 && (
        <div className="empty-state admin-empty-orders">

          <div className="empty-order-icon">
            📦
          </div>

          <h2>No orders yet</h2>

          <p className="muted">
            Customer orders will appear here once
            customers place an order.
          </p>

        </div>
      )}

      {/* =========================================
          ORDERS
      ========================================= */}

      {orders.length > 0 && (
        <div className="admin-orders-list">

          {orders.map((order) => {

            const status =
              order.status || "PLACED";

            const paymentStatus =
              order.payment?.status || "UNKNOWN";

            return (
              <article
                key={order._id}
                className="admin-order-card"
              >

                {/* =================================
                    ORDER TOP
                ================================= */}

                <div className="admin-order-top">

                  <div className="order-id-block">

                    <span className="muted">
                      ORDER
                    </span>

                    <h2>
                      #{order._id
                        .slice(-8)
                        .toUpperCase()}
                    </h2>

                    <p className="muted">
                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleString(
                            "en-IN",
                            {
                              dateStyle: "medium",
                              timeStyle: "short",
                            }
                          )
                        : "Date unavailable"}
                    </p>

                  </div>

                  <div className="order-badges">

                    <span
                      className={`order-status-badge status-${status.toLowerCase()}`}
                    >
                      {status}
                    </span>

                    <span
                      className={`payment-badge ${
                        paymentStatus === "PAID"
                          ? "payment-paid"
                          : "payment-pending"
                      }`}
                    >
                      {paymentStatus}
                    </span>

                  </div>

                </div>

                {/* =================================
                    ORDER CONTENT
                ================================= */}

                <div className="admin-order-body">

                  {/* CUSTOMER */}

                  <section className="order-info-box">

                    <div className="order-section-title">
                      <span>👤</span>
                      Customer
                    </div>

                    <strong>
                      {order.user?.name ||
                        "Customer"}
                    </strong>

                    {order.user?.email && (
                      <p className="muted">
                        {order.user.email}
                      </p>
                    )}

                  </section>

                  {/* SHIPPING */}

                  <section className="order-info-box">

                    <div className="order-section-title">
                      <span>📍</span>
                      Shipping address
                    </div>

                    <p>
                      {order.shippingAddress ||
                        "Not provided"}
                    </p>

                  </section>

                  {/* PAYMENT */}

                  <section className="order-info-box">

                    <div className="order-section-title">
                      <span>💳</span>
                      Payment
                    </div>

                    <strong>
                      {paymentStatus}
                    </strong>

                    <p className="muted payment-id">
                      {order.payment?.paymentId ||
                        "No payment ID"}
                    </p>

                  </section>

                </div>

                {/* =================================
                    PRODUCTS
                ================================= */}

                <div className="admin-order-products-section">

                  <div className="order-section-heading">
                    <h3>Products</h3>

                    <span className="muted">
                      {order.items?.length || 0} item
                      {order.items?.length === 1
                        ? ""
                        : "s"}
                    </span>
                  </div>

                  <div className="admin-order-products">

                    {order.items?.map(
                      (item, index) => {

                        const product =
                          item.product;

                        return (
                          <div
                            className="admin-order-product"
                            key={
                              item._id ||
                              `${order._id}-${index}`
                            }
                          >

                            {/* IMAGE */}

                            <div className="admin-order-product-image">

                              {product?.images?.[0] ? (
                                <img
                                  src={
                                    product.images[0]
                                  }
                                  alt={
                                    product.name ||
                                    "Product"
                                  }
                                />
                              ) : (
                                <div className="no-image">
                                  📦
                                </div>
                              )}

                            </div>

                            {/* DETAILS */}

                            <div className="admin-order-product-info">

                              <strong>
                                {product?.name ||
                                  "Product unavailable"}
                              </strong>

                              {product?.brand && (
                                <span className="muted">
                                  {product.brand}
                                </span>
                              )}

                              <div className="product-meta">

                                <span>
                                  Qty:{" "}
                                  <strong>
                                    {item.quantity}
                                  </strong>
                                </span>

                                <span>
                                  ₹
                                  {Number(
                                    item.price || 0
                                  ).toLocaleString(
                                    "en-IN"
                                  )}{" "}
                                  each
                                </span>

                              </div>

                            </div>

                            {/* TOTAL */}

                            <div className="admin-order-product-total">

                              <span className="muted">
                                Item total
                              </span>

                              <strong>
                                ₹
                                {(
                                  Number(
                                    item.price || 0
                                  ) *
                                  Number(
                                    item.quantity || 0
                                  )
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </strong>

                            </div>

                          </div>
                        );
                      }
                    )}

                  </div>

                </div>

                {/* =================================
                    FOOTER
                ================================= */}

                <div className="admin-order-footer">

                  <div className="order-payment-method">

                    <span className="muted">
                      Payment
                    </span>

                    <strong>
                      Razorpay
                    </strong>

                  </div>

                  <div className="admin-order-total">

                    <span className="muted">
                      Order total
                    </span>

                    <strong>
                      ₹
                      {Number(
                        order.totalAmount || 0
                      ).toLocaleString("en-IN")}
                    </strong>

                  </div>

                </div>

              </article>
            );
          })}

        </div>
      )}

    </main>
  );
}