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
  console.log("data:"+data);

  if (loading) {
    return <LoadingScreen />;
  }

  const orders = Array.isArray(data)
    ? data
    : data?.data || [];

  return (
    <main className="page">

      {/* ================= HEADER ================= */}
      <div className="page-header">
        <div>
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
          Refresh
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
        <div className="empty-state">
          <h2>No orders yet</h2>
          <p className="muted">
            Customer orders will appear here.
          </p>
        </div>
      )}

      {/* ================= ORDERS ================= */}
      {orders.length > 0 && (
        <div className="admin-orders">

          {orders.map((order) => (
            <article
              key={order._id}
              className="admin-order-card"
            >

              {/* ================= ORDER HEADER ================= */}
              <div className="admin-order-header">

                <div>
                  <h2>
                    Order #{order._id.slice(-8).toUpperCase()}
                  </h2>

                  <p className="muted">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString(
                          "en-IN",
                          {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }
                        )
                      : "Date unavailable"}
                  </p>
                </div>

                <div className="order-status-wrap">

                  <span
                    className={`order-status order-status--${(
                      order.status || "PLACED"
                    ).toLowerCase()}`}
                  >
                    {order.status || "PLACED"}
                  </span>

                  <span
                    className={`payment-status ${
                      order.payment?.status === "PAID"
                        ? "payment-paid"
                        : "payment-pending"
                    }`}
                  >
                    {order.payment?.status || "UNKNOWN"}
                  </span>

                </div>

              </div>

              {/* ================= CUSTOMER ================= */}
              <div className="admin-order-section">

                <h3>Customer</h3>

                <p>
                  <strong>
                    {order.user?.name || "Customer"}
                  </strong>
                </p>

                {order.user?.email && (
                  <p className="muted">
                    {order.user.email}
                  </p>
                )}

              </div>

              {/* ================= PRODUCTS ================= */}
              <div className="admin-order-section">

                <h3>Products</h3>

                <div className="admin-order-products">

                  {order.items?.map((item, index) => {

                    const product = item.product;

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
                              src={product.images[0]}
                              alt={product.name}
                            />
                          ) : (
                            <div className="no-image">
                              No image
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

                          <span>
                            Quantity: {item.quantity}
                          </span>

                          <span>
                            Price: ₹
                            {Number(
                              item.price || 0
                            ).toLocaleString("en-IN")}
                          </span>

                        </div>

                        {/* ITEM TOTAL */}
                        <div className="admin-order-product-total">

                          ₹
                          {(
                            Number(item.price || 0) *
                            Number(item.quantity || 0)
                          ).toLocaleString("en-IN")}

                        </div>

                      </div>
                    );
                  })}

                </div>

              </div>

              {/* ================= SHIPPING ================= */}
              <div className="admin-order-section">

                <h3>Shipping Address</h3>

                <p>
                  {order.shippingAddress || "Not provided"}
                </p>

              </div>

              {/* ================= FOOTER ================= */}
              <div className="admin-order-footer">

                <div>
                  <span className="muted">
                    Payment ID
                  </span>

                  <strong>
                    {order.payment?.paymentId ||
                      "Not available"}
                  </strong>
                </div>

                <div className="admin-order-total">

                  <span>
                    Total
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
          ))}

        </div>
      )}

    </main>
  );
}