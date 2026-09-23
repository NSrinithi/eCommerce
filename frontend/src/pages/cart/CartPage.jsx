import { useState } from "react";
import { Link } from "react-router";
import { useAsyncData } from "../../hooks/useAsyncData";
import { cartApi } from "../../services/cartApi";



const money = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

function TrashIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" />
        </svg>
    );
}

function LockIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="4" y="11" width="16" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
    );
}

function CartIcon() {
    return (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="9" cy="20" r="1.4" />
            <circle cx="18" cy="20" r="1.4" />
            <path d="M2 3h3l2.7 12.4a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.1L21 8H6" />
        </svg>
    );
}

function CartSteps() {
    return (
        <ol className="cart-steps" aria-label="Checkout progress">
            <li className="is-active" aria-current="step">
                <span>1</span>
                <b className="cart-step-label">Cart</b>
            </li>
            <li>
                <span>2</span>
                <b className="cart-step-label">Address &amp; payment</b>
            </li>
            <li>
                <span>3</span>
                <b className="cart-step-label">Order placed</b>
            </li>
        </ol>
    );
}

function CartSkeleton() {
    return (
        <div className="cart-page" aria-hidden="true">
            <div className="cart-layout">
                <div className="cart-items">
                    {[1, 2].map((n) => (
                        <div className="cart-item" key={n}>
                            <div className="cart-sk cart-sk-image" />
                            <div>
                                <div className="cart-sk cart-sk-line" style={{ width: "60%" }} />
                                <div className="cart-sk cart-sk-line" style={{ width: "30%" }} />
                                <div className="cart-sk cart-sk-line" style={{ width: "45%" }} />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="cart-summary">
                    <div className="cart-sk cart-sk-summary" />
                </div>
            </div>
        </div>
    );
}

export function CartPage() {
    const { data, loading, error, reload } = useAsyncData(cartApi.get);
    const [busyId, setBusyId] = useState(null);

    // Runs a cart update, locks that item while it is in flight, then reloads.
    async function updateItem(productId, action) {
        setBusyId(productId);
        try {
            await action();
            reload();
        } catch (err) {
            alert(err.message || "Could not update your cart.");
        } finally {
            setBusyId(null);
        }
    }

    function handleDecrease(productId, quantity) {
        if (quantity <= 1) return;
        updateItem(productId, () => cartApi.update(productId, quantity - 1));
    }

    function handleIncrease(productId, quantity) {
        updateItem(productId, () => cartApi.update(productId, quantity + 1));
    }

    function handleRemove(productId) {
        updateItem(productId, () => cartApi.remove(productId));
    }

    // Only show the full-page states on the very first load, so the page
    // doesn't blink every time a quantity changes.
    if (loading && !data) {
        return <CartSkeleton />;
    }

    if (error && !data) {
        return (
            <div className="cart-empty">
                <h2>We couldn’t load your cart</h2>
                <p>{error}</p>
                <button className="button button--primary" onClick={reload}>
                    Try again
                </button>
            </div>
        );
    }

    const items = (data?.items ?? []).filter((item) => item.product);

    if (items.length === 0) {
        return (
            <div className="cart-empty">
                <div className="cart-empty-icon">
                    <CartIcon />
                </div>
                <h2>Your cart is empty</h2>
                <p>Looks like you haven’t added anything yet. Explore the store and find something you like.</p>
                <Link to="/products" className="button button--primary">
                    Browse products
                </Link>
            </div>
        );
    }

    const itemCount = items.reduce((n, item) => n + item.quantity, 0);
    const cartTotal = items.reduce(
        (sum, item) => sum + item.product.discountPrice * item.quantity,
        0
    );
    const mrpTotal = items.reduce(
        (sum, item) => sum + (item.product.price ?? item.product.discountPrice) * item.quantity,
        0
    );
    const savings = mrpTotal - cartTotal;

    return (
        <div className="cart-page">
            <CartSteps />

            <div className="cart-header">
                <h1>
                    Shopping Cart <span className="cart-count">{itemCount} {itemCount === 1 ? "item" : "items"}</span>
                </h1>
                <Link to="/products" className="cart-continue">
                    ← Continue shopping
                </Link>
            </div>

            <div className="cart-layout">
                <div className="cart-items">
                    {items.map(({ product, quantity }) => {
                        const hasDiscount = product.price && product.price > product.discountPrice;
                        const off = hasDiscount
                            ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
                            : 0;
                        const busy = busyId === product._id;
                        const hasStock = typeof product.stock === "number";
                        const maxReached = hasStock && quantity >= product.stock;

                        return (
                            <div className={`cart-item ${busy ? "is-busy" : ""}`} key={product._id}>
                                <img
                                    className="cart-item-image"
                                    src={product.images?.[0]}
                                    alt={product.name}
                                />

                                <div className="cart-item-info">
                                    <p className="cart-item-brand">{product.brand}</p>
                                    <h2>{product.name}</h2>

                                    <div className="cart-item-price">
                                        <strong>{money(product.discountPrice)}</strong>
                                        {hasDiscount && (
                                            <>
                                                <span className="cart-item-mrp">{money(product.price)}</span>
                                                <span className="cart-item-off">{off}% off</span>
                                            </>
                                        )}
                                    </div>

                                    {hasStock && product.stock > 0 && product.stock <= 5 && (
                                        <p className="cart-item-stock">Only {product.stock} left in stock</p>
                                    )}

                                    <div className="cart-item-actions">
                                        <div className="cart-quantity">
                                            <button
                                                aria-label="Decrease quantity"
                                                onClick={() => handleDecrease(product._id, quantity)}
                                                disabled={quantity <= 1 || busy}
                                            >
                                                −
                                            </button>
                                            <span>{quantity}</span>
                                            <button
                                                aria-label="Increase quantity"
                                                onClick={() => handleIncrease(product._id, quantity)}
                                                disabled={maxReached || busy}
                                                title={maxReached ? "Maximum available quantity" : undefined}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            className="cart-remove"
                                            onClick={() => handleRemove(product._id)}
                                            disabled={busy}
                                        >
                                            <TrashIcon /> Remove
                                        </button>
                                    </div>
                                </div>

                                <div className="cart-item-total">
                                    <span>Item total</span>
                                    <strong>{money(product.discountPrice * quantity)}</strong>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <aside className="cart-summary">
                    <h3>Price details</h3>

                    <div className="cart-summary-rows">
                        <div className="cart-summary-row">
                            <span>Price ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
                            <span>{money(mrpTotal)}</span>
                        </div>
                        {savings > 0 && (
                            <div className="cart-summary-row cart-summary-row--saving">
                                <span>Discount</span>
                                <span>− {money(savings)}</span>
                            </div>
                        )}
                        <div className="cart-summary-row cart-summary-row--total">
                            <span>Total amount</span>
                            <span>{money(cartTotal)}</span>
                        </div>
                    </div>

                    {savings > 0 && (
                        <p className="cart-savings-note">
                            You will save {money(savings)} on this order
                        </p>
                    )}

                    <div className="cart-summary-cta">
                        <Link to="/checkOut" className="button button--primary cart-checkout-btn">
                            Proceed to checkout
                        </Link>
                        <p className="cart-secure">
                            <LockIcon /> Safe and secure payments
                        </p>
                    </div>
                </aside>
            </div>

            {/* Mobile checkout bar */}
            <div className="cart-mobile-bar">
                <div>
                    <span>Total</span>
                    <strong>{money(cartTotal)}</strong>
                </div>
                <Link to="/checkOut" className="button button--primary">
                    Checkout
                </Link>
            </div>
        </div>
    );
}