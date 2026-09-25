import { useEffect, useState } from "react";
import { wishListApi } from "../../services/wishListApi.js";
import { cartApi } from "../../services/cartApi.js";
import { LoadingScreen } from "../../components/ui/LoadingScreen.jsx";
import { Alert } from "../../components/ui/Alert.jsx";

const FALLBACK_IMAGE =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKE5daVJDAxBZONI4RfP1pM3LxWfx5qtIIg3WLv_7ISw&s=10";


function getDiscountPercent(price, discountPrice) {
    if (!price || !discountPrice || discountPrice >= price) {
        return 0;
    }

    return Math.round(
        ((price - discountPrice) / price) * 100
    );
}


export function WishlistPage() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [added, setAdded] = useState(null);


    async function loadWishlist() {

        try {

            setLoading(true);
            setError("");

            const response = await wishListApi.get();

            console.log("Wishlist:", response);

            const wishlist =
                response?.data ||
                response;

            const wishlistProducts =
                wishlist?.products || [];

            setProducts(wishlistProducts);

        } catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Failed to load wishlist."
            );

        } finally {

            setLoading(false);

        }
    }


    useEffect(() => {
        loadWishlist();
    }, []);


    async function removeProduct(productId) {

        try {

            await wishListApi.remove(productId);

            setProducts((previous) =>
                previous.filter(
                    (product) =>
                        product._id !== productId
                )
            );

        } catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Failed to remove product."
            );

        }
    }


    async function addToCart(productId) {

        try {

            await cartApi.add(productId);

            window.dispatchEvent(
                new Event("cart-updated")
            );

            setAdded(productId);

            setTimeout(() => {
                setAdded(null);
            }, 1500);

        } catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Failed to add product to cart."
            );

        }
    }


    if (loading) {
        return <LoadingScreen />;
    }


    return (
        <main className="page wishlist-page">

            {/* HEADER */}

            <div className="page-header">

                <div>
                    <h1>My Wishlist ❤️</h1>

                    <p className="muted">
                        Products you've saved for later.
                    </p>
                </div>

                <span className="wishlist-count">
                    {products.length}{" "}
                    {products.length === 1
                        ? "item"
                        : "items"}
                </span>

            </div>


            {/* ERROR */}

            {error && (
                <Alert>
                    {error}
                </Alert>
            )}


            {/* EMPTY */}

            {!error && products.length === 0 && (

                <div className="wishlist-empty">

                    <div className="wishlist-empty-heart">
                        ♡
                    </div>

                    <h2>
                        Your wishlist is empty
                    </h2>

                    <p className="muted">
                        Save products you love and
                        come back to them later.
                    </p>

                </div>

            )}


            {/* PRODUCTS */}

            {products.length > 0 && (

                <div className="wishlist-grid">

                    {products.map((product) => {

                        const discount =
                            getDiscountPercent(
                                product.price,
                                product.discountPrice
                            );

                        const outOfStock =
                            product.stock <= 0;

                        const isAdded =
                            added === product._id;


                        return (

                            <article
                                className="wishlist-card"
                                key={product._id}
                            >

                                {/* IMAGE */}

                                <div className="wishlist-image-wrap">

                                    {discount > 0 && (
                                        <span className="product-badge">
                                            {discount}% OFF
                                        </span>
                                    )}

                                    <button
                                        type="button"
                                        className="wishlist-remove"
                                        onClick={() =>
                                            removeProduct(
                                                product._id
                                            )
                                        }
                                        aria-label="Remove from wishlist"
                                    >
                                        ♥
                                    </button>

                                    <img
                                        src={
                                            product.images?.[0] ||
                                            FALLBACK_IMAGE
                                        }
                                        alt={product.name}
                                    />

                                </div>


                                {/* DETAILS */}

                                <div className="wishlist-product-info">

                                    <p className="product-brand">
                                        {product.brand}
                                    </p>

                                    <h2>
                                        {product.name}
                                    </h2>


                                    {product.rating > 0 && (
                                        <p className="product-rating">
                                            {product.rating} ★
                                        </p>
                                    )}


                                    {/* PRICE */}

                                    <div className="product-price-row">

                                        <p className="product-price">
                                            ₹
                                            {Number(
                                                product.discountPrice ??
                                                product.price
                                            ).toLocaleString("en-IN")}
                                        </p>

                                        {discount > 0 && (
                                            <>
                                                <p className="product-original-price">
                                                    ₹
                                                    {Number(
                                                        product.price
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </p>

                                                <p className="product-discount">
                                                    {discount}% off
                                                </p>
                                            </>
                                        )}

                                    </div>


                                    {/* STOCK */}

                                    {outOfStock ? (

                                        <p className="product-stock product-stock--out">
                                            Out of stock
                                        </p>

                                    ) : product.stock <= 5 ? (

                                        <p className="product-stock product-stock--low">
                                            Only {product.stock} left
                                        </p>

                                    ) : (

                                        <p className="product-stock">
                                            In stock
                                        </p>

                                    )}


                                    {/* BUTTON */}

                                    <button
                                        className={`button button--primary ${
                                            isAdded
                                                ? "is-added"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            addToCart(
                                                product._id
                                            )
                                        }
                                        disabled={
                                            outOfStock
                                        }
                                    >

                                        {outOfStock
                                            ? "Out of stock"
                                            : isAdded
                                                ? "Added ✓"
                                                : "Add to cart"}

                                    </button>

                                </div>

                            </article>

                        );

                    })}

                </div>

            )}

        </main>
    );
}