import { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Plus,
  Minus,
  Trash2,
  QrCode,
  X,
  Copy,
  Check,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { ProductItem, SHOP_PRODUCTS } from '../types/platform';
import { ResilientImage } from '../components/ResilientImage';

const CATEGORIES = [
  'All Collection',
  'Fashion & Apparel',
  'Footwear',
  'Accessories',
  'Affiliate Partner',
] as const;

export function AiShoppingPage() {
  const {
    cart,
    addToCart,
    updateCartQty,
    removeFromCart,
    cartOpen,
    setCartOpen,
    openScannerCheckout,
  } = usePlatform();

  const [selectedCategory, setSelectedCategory] = useState<string>('All Collection');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [copiedAffiliate, setCopiedAffiliate] = useState<string | null>(null);

  const filteredProducts = SHOP_PRODUCTS.filter((p) => {
    const matchesCat =
      selectedCategory === 'All Collection' || p.category === selectedCategory;
    const matchesQuery =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.priceInr * item.quantity,
    0
  );

  const getSize = (product: ProductItem) =>
    selectedSizes[product.id] || product.sizes[0];

  const handleCopyAffiliateLink = async (product: ProductItem) => {
    const link = `${window.location.origin}/?ref=ezaiworld&sku=${product.sku}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedAffiliate(product.id);
      setTimeout(() => setCopiedAffiliate(null), 2000);
    } catch {
      setCopiedAffiliate(null);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const summary = cart
      .map((c) => `${c.product.name} (${c.size}) x${c.quantity}`)
      .join(', ');
    openScannerCheckout({
      orderType: 'merchandise',
      itemSummary: summary,
      totalAmount: cartSubtotal,
      requiresAddress: true,
    });
  };

  return (
    <div className="bg-[#060913] min-h-screen py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        {/* Storefront Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-medium text-blue-400">
              Division 03 · Online Shopping &amp; Affiliate Drops
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Technical fashion, footwear, accessories, and creator partner kits.
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Curated apparel, engineered footwear, and affiliate partner bundles with instant UPI Scanner checkout.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 text-sm font-semibold rounded-lg bg-[#0C1324] border border-white/15 text-white hover:border-blue-500 transition-colors whitespace-nowrap shrink-0"
          >
            <ShoppingBag className="w-4 h-4 text-blue-400" />
            <span>Shopping Bag</span>
            <span className="font-mono-tabular text-blue-400">({cartCount})</span>
          </button>
        </div>

        {/* Category Filter & Search Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-[#0C1324] border border-white/10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-[#0C1324] border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-[#0C1324] border border-white/10 rounded-xl p-12 text-center text-sm text-slate-400">
            No catalog items match your search criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredProducts.map((product) => {
              const activeSize = getSize(product);
              return (
                <article
                  key={product.id}
                  className="bg-[#0C1324] border border-white/10 rounded-xl overflow-hidden flex flex-col justify-between hover:-translate-y-0.5 transition-transform duration-200"
                >
                  <div>
                    <div className="aspect-[4/3] w-full bg-[#060913] border-b border-white/10 overflow-hidden">
                      <ResilientImage
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                        <span>{product.category}</span>
                        <span className="font-mono-tabular">{product.sku}</span>
                      </div>
                      <h2 className="text-lg font-semibold text-white">{product.name}</h2>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {product.description}
                      </p>

                      {product.affiliateBadge && (
                        <div className="text-xs text-violet-300 font-medium pt-1">
                          {product.affiliateBadge}
                        </div>
                      )}

                      <div className="flex items-baseline gap-2.5 pt-2">
                        <span className="text-lg font-semibold text-white font-mono-tabular">
                          ₹{product.priceInr.toLocaleString('en-IN')}
                        </span>
                        {product.originalPriceInr && (
                          <span className="text-xs text-slate-500 line-through font-mono-tabular">
                            ₹{product.originalPriceInr.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      {/* Size Selector */}
                      <div className="pt-2">
                        <span className="block text-[11px] text-slate-400 mb-1.5">Select Variant</span>
                        <div className="flex flex-wrap gap-1.5">
                          {product.sizes.map((size) => (
                            <button
                              key={size}
                              type="button"
                              onClick={() =>
                                setSelectedSizes((prev) => ({ ...prev, [product.id]: size }))
                              }
                              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                                activeSize === size
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-[#060913] border border-white/10 text-slate-300 hover:text-white'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6 space-y-2">
                    <button
                      type="button"
                      onClick={() => addToCart(product, activeSize)}
                      className="w-full py-2.5 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors"
                    >
                      Add to Bag
                    </button>
                    {product.category === 'Affiliate Partner' && (
                      <button
                        type="button"
                        onClick={() => handleCopyAffiliateLink(product)}
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 transition-colors"
                      >
                        {copiedAffiliate === product.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Partner Referral Link Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Affiliate Promotion Link</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Slide-Over Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0C1324] border-l border-white/10 h-full flex flex-col justify-between">
            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-400" />
                <h2 className="text-base font-semibold text-white">
                  Shopping Bag ({cartCount})
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Close bag"
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 text-sm text-slate-400">
                  Your shopping bag is currently empty.
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={`${item.product.id}_${item.size}`}
                    className="flex gap-4 p-3.5 rounded-xl bg-[#060913] border border-white/10"
                  >
                    <ResilientImage
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">
                        {item.product.name}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Variant: {item.size}
                      </div>
                      <div className="text-sm font-mono-tabular text-blue-400 mt-1">
                        ₹{(item.product.priceInr * item.quantity).toLocaleString('en-IN')}
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="inline-flex items-center border border-white/10 rounded-lg bg-[#0C1324]">
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.product.id, item.size, -1)}
                            aria-label="Decrease quantity"
                            className="p-1.5 text-slate-300 hover:text-white"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-mono-tabular text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.product.id, item.size, 1)}
                            aria-label="Increase quantity"
                            className="p-1.5 text-slate-300 hover:text-white"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id, item.size)}
                          aria-label="Remove item"
                          className="p-1.5 text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-white/10 bg-[#060913] space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-xl font-semibold text-white font-mono-tabular">
                  ₹{cartSubtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <button
                type="button"
                disabled={cart.length === 0}
                onClick={handleCheckout}
                className="w-full inline-flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 transition-colors"
              >
                <QrCode className="w-4 h-4" />
                <span>Proceed to UPI Scanner Checkout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
