import { useState } from "react";
import { useNavigate } from "react-router";
import { useAsyncData } from "../../hooks/useAsyncData";
import { cartApi } from "../../services/cartApi";
import { paymentApi } from "../../services/payment.Api";

const money = (value) =>
    `₹${Number(value).toLocaleString("en-IN")}`;

function LockIcon() {
    return (
        <svg
            width="16"
            height="16"
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

function CheckIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M20 6L9 17l-5-5" />
        </svg>
    );
}

function ArrowIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
        </svg>
    );
}

function CheckoutSteps() {
    return (
        <ol className="checkout-steps" aria-label="Checkout progress">
            <li className="is-complete">
                <span>
                    <CheckIcon />
                </span>
                <b>Cart</b>
            </li>

            <li className="is-active" aria-current="step">
                <span>2</span>
                <b>Address &amp; payment</b>
            </li>

            <li>
                <span>3</span>
                <b>Order placed</b>
            </li>
        </ol>
    );
}

function CheckoutSkeleton() {
    return (
        <div className="checkout-page">
            <div className="checkout-skeleton-layout">
                <div className="checkout-skeleton-card" />
                <div className="checkout-skeleton-card checkout-skeleton-summary" />
            </div>
        </div>
    );
}

export function CheckOutPage() {
    const [address, setAddress] = useState("");
    const [paying, setPaying] = useState(false);

    const navigate = useNavigate();

    const {
        data: cart,
        loading,
        error,
    } = useAsyncData(cartApi.get);

    const items = (cart?.items ?? []).filter(
        (item) => item.product
    );

    const cartTotal = items.reduce(
        (sum, item) =>
            sum +
            item.product.discountPrice * item.quantity,
        0
    );

    const mrpTotal = items.reduce(
        (sum, item) =>
            sum +
            (item.product.price ??
                item.product.discountPrice) *
                item.quantity,
        0
    );

    const savings = mrpTotal - cartTotal;

    async function handleCheckOut() {
        if (!address.trim()) {
            alert("Please enter your shipping address.");
            return;
        }

        if (items.length === 0) {
            alert("Your cart is empty.");
            navigate("/products");
            return;
        }

        setPaying(true);

        try {
            const result =
                await paymentApi.createPayment();

            const options = {
                key: import.meta.env
                    .VITE_RAZORPAY_KEY_ID,

                amount: result.amount,
                currency: result.currency,

                name: "My-Ecommerce Store",
                description: "Order Payment",

                order_id: result.id,

                handler: async function (response) {
                    try {
                        await paymentApi.verifyPayment({
                            razorpay_order_id:
                                response.razorpay_order_id,

                            razorpay_payment_id:
                                response.razorpay_payment_id,

                            razorpay_signature:
                                response.razorpay_signature,

                            address: address,
                        });

                        alert(
                            "Payment successful! Order placed."
                        );

                        setAddress("");
                        navigate("/orders");
                    } catch (error) {
                        setPaying(false);
                        alert(
                            error.message ||
                                "Payment verification failed."
                        );
                    }
                },

                modal: {
                    ondismiss: () => {
                        setPaying(false);
                    },
                },

                prefill: {
                    name: "",
                    email: "",
                },

                theme: {
                    color: "#3399cc",
                },
            };

            const razorpay =
                new window.Razorpay(options);

            razorpay.open();
        } catch (error) {
            setPaying(false);

            alert(
                error.message ||
                    "Unable to start payment."
            );
        }
    }

    if (loading && !cart) {
        return <CheckoutSkeleton />;
    }

    if (error && !cart) {
        return (
            <div className="checkout-page">
                <div className="checkout-message">
                    <h2>We couldn't load your checkout</h2>

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

    if (items.length === 0) {
        return (
            <div className="checkout-page">
                <CheckoutSteps />

                <div className="checkout-message">
                    <div className="checkout-message-icon">
                        🛒
                    </div>

                    <h2>Your cart is empty</h2>

                    <p>
                        Add some products to your cart
                        before proceeding to checkout.
                    </p>

                    <button
                        className="button button--primary"
                        onClick={() =>
                            navigate("/products")
                        }
                    >
                        Browse products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">

            <CheckoutSteps />

            <div className="checkout-header">
                <div>
                    <h1>Checkout</h1>

                    <p>
                        Complete your delivery details
                        and securely place your order.
                    </p>
                </div>

                <div className="checkout-secure-badge">
                    <LockIcon />
                    Secure checkout
                </div>
            </div>

            <div className="checkout-layout">

                {/* LEFT SIDE */}
                <main className="checkout-main">

                    <section className="checkout-card">

                        <div className="checkout-card-head">
                            <div className="checkout-section-number">
                                1
                            </div>

                            <div>
                                <h2>
                                    Delivery address
                                </h2>

                                <p>
                                    Where should we deliver
                                    your order?
                                </p>
                            </div>
                        </div>

                        <div className="checkout-card-body">

                            <label
                                htmlFor="address"
                                className="checkout-label"
                            >
                                Shipping address
                            </label>

                            <textarea
                                id="address"
                                value={address}
                                onChange={(e) =>
                                    setAddress(
                                        e.target.value
                                    )
                                }
                                placeholder={
                                    "House no., street, area,\ncity, state, PIN code"
                                }
                                rows="6"
                                disabled={paying}
                            />

                            <div className="checkout-address-hint">
                                <CheckIcon />

                                <span>
                                    Please include your PIN
                                    code for accurate
                                    delivery.
                                </span>
                            </div>

                        </div>
                    </section>

                    {/* PAYMENT CARD */}
                    <section className="checkout-card">

                        <div className="checkout-card-head">

                            <div className="checkout-section-number">
                                2
                            </div>

                            <div>
                                <h2>
                                    Payment method
                                </h2>

                                <p>
                                    Complete your payment
                                    securely with Razorpay.
                                </p>
                            </div>

                        </div>

                        <div className="checkout-payment-method">

                            <div className="payment-method-icon">
                                ₹
                            </div>

                            <div className="payment-method-info">
                                <strong>
                                    Razorpay
                                </strong>

                                <span>
                                    UPI, cards, net banking
                                    &amp; more
                                </span>
                            </div>

                            <div className="payment-method-check">
                                <CheckIcon />
                            </div>

                        </div>

                        <div className="checkout-secure-note">
                            <LockIcon />

                            <span>
                                Your payment is processed
                                securely through Razorpay.
                                We never store your card
                                details.
                            </span>
                        </div>

                    </section>

                    {/* PLACE ORDER */}
                    <button
                        className="checkout-place-order"
                        onClick={handleCheckOut}
                        disabled={paying}
                    >
                        {paying ? (
                            <>
                                <span className="checkout-spinner" />
                                Processing payment...
                            </>
                        ) : (
                            <>
                                <LockIcon />
                                Pay {money(cartTotal)}
                                &amp; place order
                                <ArrowIcon />
                            </>
                        )}
                    </button>

                    <p className="checkout-terms">
                        By placing your order, you agree
                        to our terms and conditions.
                    </p>

                    <a
                        href="/cart"
                        className="checkout-back"
                    >
                        ← Return to cart
                    </a>

                </main>

                {/* RIGHT SIDE */}
                <aside className="checkout-summary">

                    <div className="checkout-summary-head">
                        <h2>Order summary</h2>

                        <span>
                            {items.reduce(
                                (total, item) =>
                                    total +
                                    item.quantity,
                                0
                            )}{" "}
                            items
                        </span>
                    </div>

                    <div className="checkout-summary-items">

                        {items.map(
                            ({ product, quantity }) => (
                                <div
                                    className="checkout-summary-item"
                                    key={product._id}
                                >
                                    <div className="checkout-product-image-wrap">

                                        <img
                                            src={
                                                product.images?.[0]
                                            }
                                            alt={
                                                product.name
                                            }
                                        />

                                        <span>
                                            {quantity}
                                        </span>

                                    </div>

                                    <div className="checkout-summary-product">

                                        <p>
                                            {product.name}
                                        </p>

                                        <span>
                                            {product.brand}
                                        </span>

                                    </div>

                                    <strong>
                                        {money(
                                            product.discountPrice *
                                                quantity
                                        )}
                                    </strong>

                                </div>
                            )
                        )}

                    </div>

                    <div className="checkout-price-details">

                        <div>
                            <span>
                                MRP (
                                {items.reduce(
                                    (total, item) =>
                                        total +
                                        item.quantity,
                                    0
                                )}{" "}
                                items)
                            </span>

                            <span>
                                {money(mrpTotal)}
                            </span>
                        </div>

                        {savings > 0 && (
                            <div className="checkout-discount">
                                <span>
                                    Discount
                                </span>

                                <span>
                                    − {money(savings)}
                                </span>
                            </div>
                        )}

                        <div className="checkout-delivery">
                            <span>
                                Delivery
                            </span>

                            <span>FREE</span>
                        </div>

                        <div className="checkout-total">
                            <span>Total amount</span>

                            <strong>
                                {money(cartTotal)}
                            </strong>
                        </div>

                    </div>

                    {savings > 0 && (
                        <div className="checkout-savings">
                            🎉 You save{" "}
                            <strong>
                                {money(savings)}
                            </strong>{" "}
                            on this order
                        </div>
                    )}

                    <div className="checkout-summary-secure">
                        <LockIcon />

                        <div>
                            <strong>
                                Safe &amp; secure payment
                            </strong>

                            <span>
                                Your payment information
                                is protected.
                            </span>
                        </div>
                    </div>

                </aside>

            </div>

        </div>
    );
}