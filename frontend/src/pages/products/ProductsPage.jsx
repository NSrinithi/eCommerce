import { useEffect, useState } from "react";
import { productApi } from "../../services/productApi";
import { cartApi } from "../../services/cartApi";
import { wishListApi } from "../../services/wishListApi";

const PAGE_SIZE = 9;

const CATEGORIES = [
    "Electronics",
    "Audio",
    "Computer Accessories",
    "Books & Reading",
    "Kitchen",
    "Kitchen Appliances",
    "Toys",
    "Watches",
    "Fashion",
    "Beauty & Personal Care",
    "Travel",
];

const SORT_OPTIONS = [
    { value: "", label: "Relevance" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "rating", label: "Rating" },
    { value: "newest", label: "Newest" },
];

const FALLBACK_IMAGE =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKE5daVJDAxBZONI4RfP1pM3LxWfx5qtIIg3WLv_7ISw&s=10";

function getDiscountPercent(price, discountPrice) {
    if (!price || !discountPrice || discountPrice >= price) {
        return 0;
    }
    return Math.round(((price - discountPrice) / price) * 100);
}

function StockLabel({ stock }) {
    if (stock <= 0) {
        return <p className="product-stock product-stock--out">Out of stock</p>;
    }
    if (stock <= 5) {
        return <p className="product-stock product-stock--low">Only {stock} left</p>;
    }
    return <p className="product-stock">In stock</p>;
}

function ProductSkeleton() {
    return (
        <div className="product-card product-card--skeleton" aria-hidden="true">
            <div className="skeleton skeleton-image" />
            <div className="skeleton skeleton-line skeleton-line--short" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line skeleton-line--short" />
            <div className="skeleton skeleton-button" />
        </div>
    );
}

// 1 … 4 5 [6] 7 8 … 20
function getPageItems(current, total) {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }
    const pages = new Set([1, total, current - 1, current, current + 1]);
    const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

    const items = [];
    sorted.forEach((p, i) => {
        if (i > 0 && p - sorted[i - 1] > 1) {
            items.push(`gap-${p}`);
        }
        items.push(p);
    });
    return items;
}

function normalizeResponse(res) {
    if (Array.isArray(res)) {
        return { products: res, totalPages: null, total: null };
    }

    const products =
        res?.product ??
        res?.data?.product ??
        res?.products ??
        res?.data?.products ??
        res?.data?.data ??
        res?.data ??
        res?.items ??
        [];

    const total =
        res?.totalProducts ??
        res?.data?.totalProducts ??
        res?.total ??
        res?.data?.total ??
        null;

    const totalPages =
        res?.pagination?.totalPages ??
        res?.data?.pagination?.totalPages ??
        res?.totalPages ??
        res?.data?.totalPages ??
        (total ? Math.ceil(total / PAGE_SIZE) : null);

    return {
        products: Array.isArray(products) ? products : [],
        totalPages,
        total,
    };
}

export function ProductsPage() {
    const [page, setPage] = useState(1);
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(null);
    const [total, setTotal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);
    const [added, setAdded] = useState(null);
    const [wishlist, setWishlist] = useState([]);

    // filter inputs (what the user is typing/choosing)
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sort, setSort] = useState("");

    // filters actually sent to the API
    const [appliedFilters, setAppliedFilters] = useState(null);

    async function toggleWishlist(productId) {
        const isAlreadyWishlisted = wishlist.includes(productId);

        try {
            if (isAlreadyWishlisted) {
                await wishListApi.remove(productId);

                setWishlist((prev) =>
                    prev.filter((id) => id !== productId)
                );
            } else {
                await wishListApi.add(productId);

                setWishlist((prev) => [
                    ...prev,
                    productId
                ]);
            }
        } catch (error) {
            console.error(
                "Wishlist update failed:",
                error
            );
        }
    }

    function applyFilters(overrides = {}) {
        setPage(1);
        setAppliedFilters({
            search: search.trim(),
            category,
            minPrice,
            maxPrice,
            sort,
            ...overrides,
        });
    }

    function handleSearchSubmit(e) {
        e.preventDefault();
        applyFilters();
    }

    function handleCategory(value) {
        setCategory(value);
        applyFilters({ category: value });
    }

    function handleSort(value) {
        setSort(value);
        applyFilters({ sort: value });
    }

    function clearAll() {
        setSearch("");
        setCategory("");
        setMinPrice("");
        setMaxPrice("");
        setSort("");
        setPage(1);
        setAppliedFilters(null);
    }

    function removeChip(key) {
        if (key === "search") {
            setSearch("");
            applyFilters({ search: "" });
        } else if (key === "category") {
            setCategory("");
            applyFilters({ category: "" });
        } else if (key === "price") {
            setMinPrice("");
            setMaxPrice("");
            applyFilters({ minPrice: "", maxPrice: "" });
        }
    }

    useEffect(() => {
        let cancelled = false;

        async function fetchProducts() {
            try {
                setLoading(true);
                setError(null);
                let response;

                const hasFilters =
                    appliedFilters &&
                    (appliedFilters.search ||
                        appliedFilters.category ||
                        appliedFilters.minPrice ||
                        appliedFilters.maxPrice ||
                        appliedFilters.sort);

                if (hasFilters) {
                    response = await productApi.search({
                        search: appliedFilters.search,
                        category: appliedFilters.category,
                        minPrice: appliedFilters.minPrice,
                        maxPrice: appliedFilters.maxPrice,
                        sort: appliedFilters.sort,
                        page,
                        limit: PAGE_SIZE,
                    });
                } else {
                    response = await productApi.list(page, PAGE_SIZE);
                }

                if (cancelled) return;

                const result = normalizeResponse(response);
                setProducts(result.products);
                setTotalPages(result.totalPages);
                setTotal(result.total);
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || "Something went wrong while loading products.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchProducts();

        return () => {
            cancelled = true;
        };
    }, [page, appliedFilters, reloadKey]);

    useEffect(() => {
        async function loadWishlist() {
            try {
                const response = await wishListApi.get();

                console.log("Wishlist response:", response);

                const products =
                    response?.data?.products ||
                    response?.products ||
                    [];

                const productIds = products.map(
                    (product) => product._id
                );

                setWishlist(productIds);

            } catch (error) {
                console.error(
                    "Failed to load wishlist:",
                    error
                );
            }
        }

        loadWishlist();
    }, []);

    function goToPage(nextPage) {
        setPage(nextPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleCart(productId) {
        try {
            await cartApi.add(productId);
            window.dispatchEvent(
                new Event("cart-updated")
            );
            setAdded(productId);
        } catch (error) {
            setAdded(null);
        }
    }

    // active filter chips (based on what is really applied)
    const chips = [];
    if (appliedFilters?.search) {
        chips.push({ key: "search", label: `“${appliedFilters.search}”` });
    }
    if (appliedFilters?.category) {
        chips.push({ key: "category", label: appliedFilters.category });
    }
    if (appliedFilters?.minPrice || appliedFilters?.maxPrice) {
        const { minPrice: lo, maxPrice: hi } = appliedFilters;
        const label = lo && hi ? `₹${lo} – ₹${hi}` : lo ? `Over ₹${lo}` : `Under ₹${hi}`;
        chips.push({ key: "price", label });
    }

    const hasPrevious = page > 1;
    const hasNext = totalPages ? page < totalPages : products.length === PAGE_SIZE;

    return (
        <>
            {/* Hero + search */}
            <section className="shop-hero">
                <div>
                    <h1>Find something you’ll love</h1>
                    <p>Browse the catalogue, filter by category and price, and pick up the best deals.</p>
                </div>

                <form className="hero-search" onSubmit={handleSearchSubmit} role="search">
                    <input
                        type="search"
                        placeholder="Search for products, brands and more"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        aria-label="Search products"
                    />
                    <button type="submit">Search</button>
                </form>
            </section>

            <div className="shop-layout">
                {/* Filters */}
                <aside className="filters-panel">
                    <div className="filters-head">
                        <h2>Filters</h2>
                        {(chips.length > 0 || sort) && (
                            <button type="button" className="link-button" onClick={clearAll}>
                                Clear all
                            </button>
                        )}
                    </div>

                    <div className="filter-group">
                        <h3>Category</h3>
                        <div className="filter-options">
                            <label className="filter-option">
                                <input
                                    type="radio"
                                    name="category"
                                    checked={category === ""}
                                    onChange={() => handleCategory("")}
                                />
                                <span>All categories</span>
                            </label>
                            {CATEGORIES.map((name) => (
                                <label className="filter-option" key={name}>
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={category === name}
                                        onChange={() => handleCategory(name)}
                                    />
                                    <span>{name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="filter-group">
                        <h3>Price</h3>
                        <div className="price-filter">
                            <input
                                type="number"
                                min="0"
                                placeholder="Min ₹"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                aria-label="Minimum price"
                            />
                            <span>to</span>
                            <input
                                type="number"
                                min="0"
                                placeholder="Max ₹"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                aria-label="Maximum price"
                            />
                        </div>
                        <button
                            type="button"
                            className="filter-apply"
                            onClick={() => applyFilters()}
                        >
                            Apply price
                        </button>
                    </div>
                </aside>

                {/* Results */}
                <section className="shop-results">
                    <div className="results-toolbar">
                        <p className="results-count">
                            {loading
                                ? "Loading products…"
                                : total
                                    ? `${total} products`
                                    : totalPages
                                        ? `Page ${page} of ${totalPages}`
                                        : `Page ${page}`}
                        </p>

                        <label className="sort-control">
                            <span>Sort by</span>
                            <select value={sort} onChange={(e) => handleSort(e.target.value)}>
                                {SORT_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    {chips.length > 0 && (
                        <div className="filter-chips">
                            {chips.map((chip) => (
                                <span className="chip" key={chip.key}>
                                    {chip.label}
                                    <button
                                        type="button"
                                        aria-label={`Remove filter ${chip.label}`}
                                        onClick={() => removeChip(chip.key)}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Error */}
                    {error && !loading && (
                        <div className="products-message">
                            <h2>We couldn’t load the products</h2>
                            <p>{error}</p>
                            <button
                                className="button button--primary"
                                onClick={() => setReloadKey((k) => k + 1)}
                            >
                                Try again
                            </button>
                        </div>
                    )}

                    {/* Loading skeletons */}
                    {loading && (
                        <div className="products-grid">
                            {Array.from({ length: PAGE_SIZE }, (_, i) => (
                                <ProductSkeleton key={i} />
                            ))}
                        </div>
                    )}

                    {/* Products */}
                    {!loading && !error && products.length > 0 && (
                        <div className="products-grid">
                            {products.map((product) => {
                                const discount = getDiscountPercent(
                                    product.price,
                                    product.discountPrice
                                );
                                const outOfStock = product.stock <= 0;
                                const isAdded = added === product._id;

                                return (
                                    <div className="product-card" key={product._id}>
                                        <div className="product-image-wrap">

                                            {discount > 0 && (
                                                <span className="product-badge">
                                                    {discount}% OFF
                                                </span>
                                            )}

                                            <button
                                                type="button"
                                                className={`wishlist-button ${wishlist.includes(product._id) ? "active" : ""
                                                    }`}
                                                onClick={() => toggleWishlist(product._id)}
                                                aria-label="Add to wishlist"
                                            >
                                                {wishlist.includes(product._id) ? "♥" : "♡"}
                                            </button>

                                            <img
                                                src={
                                                    product.images?.[0] ||
                                                    FALLBACK_IMAGE
                                                }
                                                alt={product.name}
                                            />

                                        </div>

                                        <p className="product-brand">{product.brand}</p>
                                        <h2>{product.name}</h2>

                                        {product.rating > 0 && (
                                            <p className="product-rating">{product.rating} ★</p>
                                        )}

                                        <div className="product-price-row">
                                            <p className="product-price">
                                                ₹{product.discountPrice ?? product.price}
                                            </p>
                                            {discount > 0 && (
                                                <>
                                                    <p className="product-original-price">₹{product.price}</p>
                                                    <p className="product-discount">{discount}% off</p>
                                                </>
                                            )}
                                        </div>

                                        <StockLabel stock={product.stock} />

                                        <button
                                            className={`button button--primary ${isAdded ? "is-added" : ""}`}
                                            onClick={() => handleCart(product._id)}
                                            disabled={outOfStock}
                                        >
                                            {outOfStock
                                                ? "Out of stock"
                                                : isAdded
                                                    ? "Added ✓"
                                                    : "Add to cart"}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && !error && products.length === 0 && (
                        <div className="products-message">
                            <h2>No products found</h2>
                            <p>Try a different search term, or remove some filters.</p>
                            <button className="button button--primary" onClick={clearAll}>
                                Clear all filters
                            </button>
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && !error && (hasPrevious || hasNext) && (
                        <nav className="pagination" aria-label="Product pages">
                            <button
                                className="pagination-btn"
                                onClick={() => goToPage(page - 1)}
                                disabled={!hasPrevious}
                            >
                                ← Previous
                            </button>

                            {totalPages &&
                                getPageItems(page, totalPages).map((item) =>
                                    typeof item === "string" ? (
                                        <span className="pagination-gap" key={item}>
                                            …
                                        </span>
                                    ) : (
                                        <button
                                            key={item}
                                            className={`pagination-btn ${page === item ? "pagination-btn--active" : ""}`}
                                            onClick={() => goToPage(item)}
                                            aria-current={page === item ? "page" : undefined}
                                        >
                                            {item}
                                        </button>
                                    )
                                )}

                            <button
                                className="pagination-btn"
                                onClick={() => goToPage(page + 1)}
                                disabled={!hasNext}
                            >
                                Next →
                            </button>
                        </nav>
                    )}
                </section>
            </div>
        </>
    );
}