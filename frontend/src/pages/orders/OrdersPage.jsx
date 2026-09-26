import { Link } from "react-router";
import { orderApi } from "../../services/orderApi";
import { useAsyncData } from "../../hooks/useAsyncData";

const FALLBACK_IMAGE =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKE5daVJDAxBZONI4RfP1pM3LxWfx5qtIIg3WLv_7ISw&s=10";

const money = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

function formatDate(value) {
    if (!value) return null;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function formatTime(value) {
    if (!value) return null;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
    });
}

function CheckIcon() {
    return (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M20 6L9 17l-5-5" />
        </svg>
    );
}

function LockIcon() {
    return (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <rect x="4" y="11" width="16" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
    );
}

function PackageIcon() {
    return (
        <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="m16.5 9.4-9-5.19" />
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22V12" />
        </svg>
    );
}

function OrdersSkeleton() {
    return (
        <div className="orders-page">
            <div className="orders-header">
                <div>
                    <div className="orders-skeleton orders-skeleton-title" />
                    <div className="orders-skeleton orders-skeleton-subtitle" />
                </div>
            </div>

            {[1, 2].map((item) => (
                <div
                    className="order-card order-card--skeleton"
                    key={item}
                >
                    <div className="orders-skeleton orders-skeleton-header" />

                    <div className="orders-skeleton-product">
                        <div className="orders-skeleton orders-skeleton-image" />

                        <div className="orders-skeleton-product-lines">
                            <div className="orders-skeleton orders-skeleton-line" />
                            <div className="orders-skeleton orders-skeleton-line orders-skeleton-line--short" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function OrdersPage() {
    const {
        data,
        loading,
        error,
    } = useAsyncData(orderApi.get);

    if (loading && !data) {
        return <OrdersSkeleton />;
    }

    if (error && !data) {
        return (
            <div className="orders-page">
                <div className="orders-message">
                    <div className="orders-message-icon">
                        <PackageIcon />
                    </div>

                    <h2>We couldn't load your orders</h2>

                    <p>{error}</p>

                    <button
                        className="button button--primary"
                        onClick={() => window.location.reload()}
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="orders-page">
                <div className="orders-empty">
                    <div className="orders-empty-icon">
                        <PackageIcon />
                    </div>

                    <h2>No orders yet</h2>

                    <p>
                        Once you place an order, your order
                        details and delivery information will
                        appear here.
                    </p>

                    <Link
                        to="/products"
                        className="button button--primary"
                    >
                        Start shopping
                    </Link>
                </div>
            </div>
        );
    }

    const totalOrders = data.length;

    return (
        <div className="orders-page">

            {/* HEADER */}

            <div className="orders-header">

                <div>
                    <h1>My Orders</h1>

                    <p>
                        Track and manage your recent orders.
                    </p>
                </div>

                <div className="orders-header-count">
                    <PackageIcon />

                    <div>
                        <strong>{totalOrders}</strong>
                        <span>
                            {totalOrders === 1
                                ? "Order"
                                : "Orders"}
                        </span>
                    </div>
                </div>

            </div>

            {/* ORDERS */}

            <div className="orders-list">

                {data.map((order) => {

                    const status =
                        (order.status || "PLACED")
                            .toLowerCase();

                    const placedOn =
                        formatDate(order.createdAt);

                    const placedTime =
                        formatTime(order.createdAt);

                    const itemCount =
                        order.items?.reduce(
                            (total, item) =>
                                total + item.quantity,
                            0
                        ) || 0;

                    return (
                        <article
                            className="order-card"
                            key={order._id}
                        >

                            {/* ORDER HEADER */}

                            <div className="order-card-header">

                                <div className="order-information">

                                    <div className="order-id">
                                        <span>
                                            Order ID
                                        </span>

                                        <strong>
                                            #
                                            {order._id.slice(
                                                -8
                                            ).toUpperCase()}
                                        </strong>
                                    </div>

                                    {placedOn && (
                                        <div className="order-date">
                                            <span>
                                                Ordered on
                                            </span>

                                            <strong>
                                                {placedOn}
                                                {placedTime &&
                                                    ` · ${placedTime}`}
                                            </strong>
                                        </div>
                                    )}

                                    <div className="order-date">
                                        <span>
                                            Items
                                        </span>

                                        <strong>
                                            {itemCount}{" "}
                                            {itemCount === 1
                                                ? "item"
                                                : "items"}
                                        </strong>
                                    </div>

                                </div>

                                <div
                                    className={`order-status order-status--${status}`}
                                >
                                    <CheckIcon />
                                    {order.status ||
                                        "PLACED"}
                                </div>

                            </div>

                            {/* PRODUCTS */}

                            <div className="order-products">

                                {order.items?.map(
                                    (item) => {

                                        const product =
                                            item.product;

                                        if (!product) {
                                            return null;
                                        }

                                        const image =
                                            product.images?.[0] ||
                                            FALLBACK_IMAGE;

                                        return (
                                            <div
                                                className="order-product"
                                                key={item._id}
                                            >

                                                <div className="order-product-image-wrap">

                                                    <img
                                                        className="order-product-image"
                                                        src={image}
                                                        alt={
                                                            product.name
                                                        }
                                                    />

                                                    <span className="order-product-quantity">
                                                        {item.quantity}
                                                    </span>

                                                </div>

                                                <div className="order-product-info">

                                                    <p className="order-product-brand">
                                                        {product.brand}
                                                    </p>

                                                    <h3>
                                                        {
                                                            product.name
                                                        }
                                                    </h3>

                                                    <p className="order-product-price">
                                                        {money(
                                                            item.price
                                                        )}{" "}
                                                        ×{" "}
                                                        {
                                                            item.quantity
                                                        }
                                                    </p>

                                                </div>

                                                <strong className="order-product-total">
                                                    {money(
                                                        item.price *
                                                        item.quantity
                                                    )}
                                                </strong>

                                            </div>
                                        );
                                    }
                                )}

                            </div>

                            {/* FOOTER */}

                            <div className="order-card-footer">

                                <div className="order-address">

                                    <div className="order-footer-title">
                                        <span className="order-footer-icon">
                                            📍
                                        </span>

                                        <strong>
                                            Delivery address
                                        </strong>
                                    </div>

                                    <p>
                                        {
                                            order.shippingAddress
                                        }
                                    </p>

                                </div>

                                <div className="order-total">
                                    <span className="order-total-label">
                                        Order total
                                    </span>

                                    <strong className="order-total-value">
                                        ₹33,998
                                    </strong>

                                    <span className="payment-completed">
                                        Payment completed
                                    </span>
                                </div>

                            </div>

                            {/* SECURE FOOTER */}

                            <div className="order-secure">

                                <LockIcon />

                                <span>
                                    Payment processed securely
                                    through Razorpay
                                </span>

                            </div>

                        </article>
                    );
                })}

            </div>

            {/* CONTINUE SHOPPING */}

            <div className="orders-bottom">

                <p>
                    Looking for something else?
                </p>

                <Link
                    to="/products"
                    className="orders-shop-link"
                >
                    Continue shopping →
                </Link>

            </div>

        </div>
    );
}