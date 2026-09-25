import { useState } from "react";
import { useAsyncData } from "../../hooks/useAsyncData.js";
import { orderApi } from "../../services/orderApi.js";
import { LoadingScreen } from "../../components/ui/LoadingScreen.jsx";
import { Alert } from "../../components/ui/Alert.jsx";

const STATUS_OPTIONS = [
  "PLACED",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export function AdminOrderPage() {
  const {
    data,
    loading,
    error,
    reload,
  } = useAsyncData(orderApi.getAll);

  const [updatingOrder, setUpdatingOrder] = useState(null);

  if (loading) {
    return <LoadingScreen />;
  }

  const orders = Array.isArray(data)
    ? data
    : data?.data || [];

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingOrder(orderId);

      await orderApi.updateStatus(orderId, newStatus);

      await reload();
    } catch (err) {
      console.error("Failed to update order status:", err);

      alert(
        err?.message ||
          "Failed to update order status."
      );
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PLACED":
        return "status-placed";

      case "CONFIRMED":
        return "status-confirmed";

      case "SHIPPED":
        return "status-shipped";

      case "DELIVERED":
        return "status-delivered";

      case "CANCELLED":
        return "status-cancelled";

      default:
        return "status-default";
    }
  };

  const formatStatus = (status) => {
    if (!status) return "PLACED";

    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  return (
    <main className="admin-orders-page">

      {/* ================= PAGE HEADER ================= */}

      <div className="orders-page-header">

        <div>

          <h1>Orders</h1>

          <p>
            Manage customer orders and update delivery status.
          </p>
        </div>

        <button
          className="refresh-orders-btn"
          onClick={reload}
          type="button"
        >
          ↻ Refresh
        </button>

      </div>


      {/* ================= ERROR ================= */}

      {error && (
        <Alert>
          {error.message || "Failed to load orders."}
        </Alert>
      )}


      {/* ================= EMPTY ================= */}

      {!error && orders.length === 0 && (
        <div className="orders-empty">

          <div className="empty-icon">
            🛍️
          </div>

          <h2>No orders yet</h2>

          <p>
            Customer orders will appear here once someone places an order.
          </p>

        </div>
      )}


      {/* ================= ORDER COUNT ================= */}

      {orders.length > 0 && (
        <div className="orders-summary">

          <div>
            <span className="summary-label">
              Total Orders
            </span>

            <strong>
              {orders.length}
            </strong>
          </div>

          <div>
            <span className="summary-label">
              Paid Orders
            </span>

            <strong>
              {
                orders.filter(
                  (order) =>
                    order.payment?.status === "PAID"
                ).length
              }
            </strong>
          </div>

          <div>
            <span className="summary-label">
              Delivered
            </span>

            <strong>
              {
                orders.filter(
                  (order) =>
                    order.status === "DELIVERED"
                ).length
              }
            </strong>
          </div>

          <div>
            <span className="summary-label">
              Pending
            </span>

            <strong>
              {
                orders.filter(
                  (order) =>
                    !["DELIVERED", "CANCELLED"].includes(
                      order.status
                    )
                ).length
              }
            </strong>
          </div>

        </div>
      )}


      {/* ================= ORDERS ================= */}

      <div className="admin-orders-list">

        {orders.map((order) => {

          const currentStatus =
            order.status || "PLACED";

          return (
            <article
              key={order._id}
              className="order-card"
            >

              {/* ================= ORDER TOP ================= */}

              <div className="order-card-top">

                <div className="order-main-info">

                  <div className="order-icon">
                    📦
                  </div>

                  <div>

                    <h2>
                      Order #
                      {order._id
                        .slice(-8)
                        .toUpperCase()}
                    </h2>

                    <p>
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

                </div>


                {/* STATUS */}

                <div className="order-actions">

                  <span
                    className={`status-badge ${getStatusClass(
                      currentStatus
                    )}`}
                  >
                    <span className="status-dot"></span>

                    {formatStatus(
                      currentStatus
                    )}
                  </span>

                  <span
                    className={`payment-badge ${
                      order.payment?.status === "PAID"
                        ? "payment-paid"
                        : "payment-pending"
                    }`}
                  >
                    {order.payment?.status === "PAID"
                      ? "✓ Paid"
                      : "Payment Pending"}
                  </span>

                </div>

              </div>


              {/* ================= STATUS CONTROL ================= */}

              <div className="status-control">

                <div>

                  <span className="status-control-label">
                    Update order status
                  </span>

                  <small>
                    Change the current delivery status
                  </small>

                </div>

                <div className="status-select-wrapper">

                  <select
                    value={currentStatus}
                    disabled={
                      updatingOrder === order._id
                    }
                    onChange={(e) =>
                      handleStatusChange(
                        order._id,
                        e.target.value
                      )
                    }
                    className={`status-select ${getStatusClass(
                      currentStatus
                    )}`}
                  >

                    {STATUS_OPTIONS.map(
                      (status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {formatStatus(status)}
                        </option>
                      )
                    )}

                  </select>

                  {updatingOrder ===
                    order._id && (
                    <span className="updating-text">
                      Saving...
                    </span>
                  )}

                </div>

              </div>


              {/* ================= CONTENT GRID ================= */}

              <div className="order-content-grid">


                {/* ================= CUSTOMER ================= */}

                <section className="order-info-box">

                  <div className="section-title">
                    <span>👤</span>
                    Customer
                  </div>

                  <div className="customer-name">
                    {order.user?.name ||
                      "Customer"}
                  </div>

                  {order.user?.email && (
                    <div className="customer-email">
                      {order.user.email}
                    </div>
                  )}

                </section>


                {/* ================= SHIPPING ================= */}

                <section className="order-info-box">

                  <div className="section-title">
                    <span>📍</span>
                    Shipping Address
                  </div>

                  <p className="shipping-address">
                    {order.shippingAddress ||
                      "Not provided"}
                  </p>

                </section>


                {/* ================= PAYMENT ================= */}

                <section className="order-info-box">

                  <div className="section-title">
                    <span>💳</span>
                    Payment
                  </div>

                  <div className="payment-method">
                    Razorpay
                  </div>

                  <div className="payment-id">
                    {order.payment?.paymentId ||
                      "Not available"}
                  </div>

                </section>

              </div>


              {/* ================= PRODUCTS ================= */}

              <div className="products-section">

                <div className="products-section-header">

                  <div>
                    <h3>Products</h3>

                    <span>
                      {order.items?.length || 0} item
                      {order.items?.length === 1
                        ? ""
                        : "s"}
                    </span>
                  </div>

                </div>


                <div className="products-list">

                  {order.items?.map(
                    (item, index) => {

                      const product =
                        item.product;

                      return (
                        <div
                          key={
                            item._id ||
                            `${order._id}-${index}`
                          }
                          className="product-row"
                        >

                          {/* IMAGE */}

                          <div className="product-image">

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
                              <div className="product-no-image">
                                📦
                              </div>
                            )}

                          </div>


                          {/* DETAILS */}

                          <div className="product-details">

                            <strong>
                              {product?.name ||
                                "Product unavailable"}
                            </strong>

                            {product?.brand && (
                              <span className="product-brand">
                                {product.brand}
                              </span>
                            )}

                            <span className="product-quantity">
                              Qty:{" "}
                              {item.quantity}
                            </span>

                          </div>


                          {/* PRICE */}

                          <div className="product-price">

                            <span>
                              ₹
                              {Number(
                                item.price || 0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </span>

                            <small>
                              ×{" "}
                              {item.quantity}
                            </small>

                          </div>


                          {/* TOTAL */}

                          <div className="product-total">

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

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

              </div>


              {/* ================= ORDER FOOTER ================= */}

              <div className="order-card-footer">

                <div className="footer-payment">

                  <span>
                    Payment ID
                  </span>

                  <strong>
                    {order.payment?.paymentId ||
                      "Not available"}
                  </strong>

                </div>


                <div className="order-total">

                  <span>
                    Order Total
                  </span>

                  <strong>
                    ₹
                    {Number(
                      order.totalAmount || 0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

              </div>

            </article>
          );
        })}

      </div>

    </main>
  );
}