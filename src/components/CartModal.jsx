import { useState } from "react";
import { useCart } from "../context/CartContext";

function CheckoutForm({ onClose }) {
  const { cart, total, clearCart } = useCart();
  const [fields, setFields] = useState({ name: "", email: "", address: "", card: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!fields.name.trim()) e.name = "Full name is required.";
    if (!fields.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Enter a valid email address.";
    if (!fields.address.trim()) e.address = "Shipping address is required.";
    if (!/^\d{16}$/.test(fields.card.replace(/\s/g, ""))) e.card = "Card number must be exactly 16 digits.";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSuccess(true);
    clearCart();
  };

  const set = (k, v) => { setFields(f => ({ ...f, [k]: v })); setErrors(er => ({ ...er, [k]: "" })); };

  if (success) return (
    <div className="text-center py-10 fade-in">
      <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
      </div>
      <h3 className="font-display text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Order Confirmed!</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Thank you, {fields.name.split(" ")[0]}! Your order is on its way.</p>
      <button onClick={onClose} className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors">Continue Shopping</button>
    </div>
  );

  const inputClass = (k) => `w-full px-4 py-2.5 rounded-xl border text-sm transition-colors bg-gray-50 dark:bg-gray-800 dark:text-gray-100 ${errors[k] ? 'border-red-400 focus:border-red-500' : 'border-gray-200 dark:border-gray-700 focus:border-primary-400'}`;

  return (
    <div className="space-y-4">
      <h3 className="font-display text-xl font-bold text-gray-800 dark:text-gray-100">Checkout</h3>
      <div className="space-y-3">
        <div>
          <input className={inputClass("name")} placeholder="Full Name" value={fields.name} onChange={e => set("name", e.target.value)} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <input className={inputClass("email")} type="email" placeholder="Email Address" value={fields.email} onChange={e => set("email", e.target.value)} />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        <div>
          <input className={inputClass("address")} placeholder="Shipping Address" value={fields.address} onChange={e => set("address", e.target.value)} />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>
        <div>
          <input
            className={inputClass("card")}
            placeholder="Card Number (16 digits)"
            value={fields.card}
            maxLength={19}
            onChange={e => {
              const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
              const formatted = raw.match(/.{1,4}/g)?.join(" ") || raw;
              set("card", formatted);
            }}
          />
          {errors.card && <p className="text-red-500 text-xs mt-1">{errors.card}</p>}
        </div>
      </div>
      <div className="border-t dark:border-gray-700 pt-4 flex items-center justify-between">
        <span className="text-gray-600 dark:text-gray-300 font-medium">Total: <span className="font-bold text-primary-700 dark:text-primary-400">{total.toLocaleString()} DZD</span></span>
        <button onClick={handleSubmit} className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors active:scale-95">
          Confirm Order
        </button>
      </div>
    </div>
  );
}

export default function CartModal({ open, onClose }) {
  const { cart, removeFromCart, updateQty, total } = useCart();
  const [checkout, setCheckout] = useState(false);

  if (!open) return null;

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50">
      <div className="slide-in bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-800">
          <h2 className="font-display text-xl font-bold text-gray-800 dark:text-gray-100">
            {checkout ? "Checkout" : "Your Cart"}
          </h2>
          <button onClick={() => { onClose(); setCheckout(false); }} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">✕</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {checkout ? (
            <CheckoutForm onClose={() => { onClose(); setCheckout(false); }} />
          ) : cart.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              <p className="font-medium">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.id} className="flex gap-3 items-center">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{item.name}</p>
                    <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold">{(item.price * item.qty).toLocaleString()} DZD</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900 text-sm font-bold transition-colors">−</button>
                    <span className="text-sm font-semibold w-4 text-center dark:text-gray-100">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900 text-sm font-bold transition-colors">+</button>
                    <button onClick={() => removeFromCart(item.id)} className="ml-1 text-gray-300 hover:text-red-400 transition-colors text-sm">✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!checkout && cart.length > 0 && (
          <div className="px-6 py-4 border-t dark:border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600 dark:text-gray-300">Total</span>
              <span className="font-display font-bold text-xl text-primary-700 dark:text-primary-400">{total.toLocaleString()} DZD</span>
            </div>
            <button onClick={() => setCheckout(true)} className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors active:scale-95">
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
