import { useAsyncData } from "../../hooks/useAsyncData";
import { adminApi } from "../../services/adminApi";

function formatCurrency(value) {
    return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatDate(value) {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

function getStockClass(stock) {
    if (stock <= 0) return "admin-stock-badge admin-stock-badge--out";
    if (stock <= 5) return "admin-stock-badge admin-stock-badge--low";

    return "admin-stock-badge admin-stock-badge--good";
}

export function AdminDashboardPage() {
    const { data, loading, error } = useAsyncData(adminApi.getDashboard);

    if (loading) {
        return (
            <div className="admin-dashboard">
                <div className="admin-dashboard-loading">
                    <div className="admin-loading-line admin-loading-line--large" />
                    <div className="admin-loading-grid">
                        <div className="admin-loading-card" />
                        <div className="admin-loading-card" />
                        <div className="admin-loading-card" />
                        <div className="admin-loading-card" />
                    </div>
                    <div className="admin-loading-content" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-dashboard">
                <div className="admin-error">
                    <strong>Unable to load dashboard</strong>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    const dashboard = data ?? {};

    const recentOrders = dashboard.recentOrders ?? [];
    const lowStockProducts = dashboard.lowStockProducts ?? [];

    return (
        <div className="admin-dashboard">

            {/* HEADER */}

            <div className="admin-dashboard-header">
                <div>
                    <p className="admin-eyebrow">
                        STORE OVERVIEW
                    </p>

                    <h1>
                        Dashboard
                    </h1>

                    <p className="admin-dashboard-subtitle">
                        Monitor your store performance, orders and inventory.
                    </p>
                </div>

                <div className="admin-dashboard-date">
                    <span>Today</span>
                    <strong>
                        {new Date().toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                        })}
                    </strong>
                </div>
            </div>


            {/* STAT CARDS */}

            <div className="admin-stats">

                <div className="admin-stat-card">

                    <div className="admin-stat-top">
                        <div className="admin-stat-icon admin-stat-icon--blue">
                            📦
                        </div>

                        <span className="admin-stat-label">
                            PRODUCTS
                        </span>
                    </div>

                    <strong className="admin-stat-value">
                        {dashboard.totalProducts ?? 0}
                    </strong>

                    <span className="admin-stat-description">
                        Products in your catalogue
                    </span>

                </div>


                <div className="admin-stat-card">

                    <div className="admin-stat-top">
                        <div className="admin-stat-icon admin-stat-icon--purple">
                            🛍️
                        </div>

                        <span className="admin-stat-label">
                            ORDERS
                        </span>
                    </div>

                    <strong className="admin-stat-value">
                        {dashboard.totalOrders ?? 0}
                    </strong>

                    <span className="admin-stat-description">
                        Orders placed by customers
                    </span>

                </div>


                <div className="admin-stat-card">

                    <div className="admin-stat-top">
                        <div className="admin-stat-icon admin-stat-icon--green">
                            👥
                        </div>

                        <span className="admin-stat-label">
                            CUSTOMERS
                        </span>
                    </div>

                    <strong className="admin-stat-value">
                        {dashboard.totalUsers ?? 0}
                    </strong>

                    <span className="admin-stat-description">
                        Registered customers
                    </span>

                </div>


                <div className="admin-stat-card admin-stat-card--revenue">

                    <div className="admin-stat-top">
                        <div className="admin-stat-icon admin-stat-icon--orange">
                            ₹
                        </div>

                        <span className="admin-stat-label">
                            REVENUE
                        </span>
                    </div>

                    <strong className="admin-stat-value">
                        {formatCurrency(dashboard.totalRevenue)}
                    </strong>

                    <span className="admin-stat-description">
                        Total revenue generated
                    </span>

                </div>

            </div>


            {/* MAIN GRID */}

            <div className="admin-dashboard-grid">

                {/* RECENT ORDERS */}

                <section className="admin-panel admin-panel--orders">

                    <div className="admin-panel-header">

                        <div>
                            <p className="admin-panel-eyebrow">
                                SALES
                            </p>

                            <h2>
                                Recent Orders
                            </h2>

                            <p>
                                Latest customer purchases
                            </p>
                        </div>

                        <span className="admin-panel-count">
                            {recentOrders.length} recent
                        </span>

                    </div>


                    {recentOrders.length > 0 ? (

                        <div className="admin-orders-table">

                            <div className="admin-orders-table-head">
                                <span>ORDER</span>
                                <span>CUSTOMER</span>
                                <span>ITEMS</span>
                                <span>AMOUNT</span>
                                <span>STATUS</span>
                            </div>


                            {recentOrders.map((order) => {

                                const paymentStatus =
                                    order.payment?.status || "PENDING";

                                const statusClass =
                                    paymentStatus.toLowerCase();

                                return (
                                    <div
                                        className="admin-order-row"
                                        key={order._id}
                                    >

                                        <div className="admin-order-id">
                                            <strong>
                                                #{order._id.slice(-6).toUpperCase()}
                                            </strong>

                                            <span>
                                                {formatDate(order.createdAt)}
                                            </span>
                                        </div>


                                        <div className="admin-customer">

                                            <div className="admin-customer-avatar">
                                                {(order.user?.name || "C")
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <div>
                                                <strong>
                                                    {order.user?.name || "Customer"}
                                                </strong>

                                                <span>
                                                    {order.user?.email || ""}
                                                </span>
                                            </div>

                                        </div>


                                        <span className="admin-items-count">
                                            {order.items?.length || 0}{" "}
                                            {order.items?.length === 1
                                                ? "item"
                                                : "items"}
                                        </span>


                                        <strong className="admin-order-amount">
                                            {formatCurrency(order.totalAmount)}
                                        </strong>


                                        <span
                                            className={`admin-status admin-status--${statusClass}`}
                                        >
                                            <span className="admin-status-dot" />
                                            {paymentStatus}
                                        </span>

                                    </div>
                                );
                            })}

                        </div>

                    ) : (

                        <div className="admin-empty">
                            <div className="admin-empty-icon">
                                🛍️
                            </div>

                            <strong>
                                No orders yet
                            </strong>

                            <p>
                                Customer orders will appear here.
                            </p>
                        </div>

                    )}

                </section>


                {/* LOW STOCK */}

                <section className="admin-panel admin-panel--stock">

                    <div className="admin-panel-header">

                        <div>
                            <p className="admin-panel-eyebrow">
                                INVENTORY
                            </p>

                            <h2>
                                Stock Overview
                            </h2>

                            <p>
                                Products that need attention
                            </p>
                        </div>

                    </div>


                    {lowStockProducts.length > 0 ? (

                        <div className="admin-stock-list">

                            {lowStockProducts.map((product) => (

                                <div
                                    className="admin-stock-row"
                                    key={product._id}
                                >

                                    <div className="admin-stock-product">

                                        <div className="admin-stock-image">
                                            {product.images?.[0] ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                />
                                            ) : (
                                                "📦"
                                            )}
                                        </div>

                                        <div>
                                            <strong>
                                                {product.name}
                                            </strong>

                                            <span>
                                                {product.brand || "No brand"}
                                            </span>
                                        </div>

                                    </div>


                                    <span className={getStockClass(product.stock)}>
                                        {product.stock <= 0
                                            ? "Out of stock"
                                            : `${product.stock} left`}
                                    </span>

                                </div>

                            ))}

                        </div>

                    ) : (

                        <div className="admin-no-stock">

                            <div className="admin-success-icon">
                                ✓
                            </div>

                            <strong>
                                Inventory looks good
                            </strong>

                            <span>
                                No products are currently low on stock.
                            </span>

                        </div>

                    )}

                </section>

            </div>

        </div>
    );
}