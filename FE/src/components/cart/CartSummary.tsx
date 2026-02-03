import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Tag, ArrowRight, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { availablePromoCodes, type PromoCode } from './mockCartData';

interface CartSummaryProps {
  subtotal: number;
  itemCount: number;
  onCheckout: () => void;
}

export function CartSummary({ subtotal, itemCount, onCheckout }: CartSummaryProps) {
  const { t } = useTranslation();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState('');
  const [showPromoSuggestions, setShowPromoSuggestions] = useState(false);

  const applyPromoCode = (code: string) => {
    const promo = availablePromoCodes.find(
      (p) => p.code.toLowerCase() === code.toLowerCase()
    );

    if (promo) {
      setAppliedPromo(promo);
      setPromoCode(code);
      setPromoError('');
      setShowPromoSuggestions(false);
    } else {
      setPromoError(t('cart.invalidPromoCode'));
      setAppliedPromo(null);
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
  };

  // Calculate discount
  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percentage') {
      discount = (subtotal * appliedPromo.discount) / 100;
    } else {
      discount = appliedPromo.discount;
    }
  }

  const tax = (subtotal - discount) * 0.1; // 10% tax
  const total = subtotal - discount + tax;

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <ShoppingCart className="w-5 h-5 text-blue-400" />
          <h3 className="text-xl font-semibold">{t('cart.orderSummary')}</h3>
        </div>

        {/* Promo Code Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">{t('cart.promoCode')}</label>
          <div className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value);
                    setPromoError('');
                  }}
                  onFocus={() => setShowPromoSuggestions(true)}
                  placeholder={t('cart.enterPromoCode')}
                  disabled={!!appliedPromo}
                  className={`w-full px-4 py-2.5 rounded-lg bg-white/5 border ${
                    promoError
                      ? 'border-red-500/50'
                      : appliedPromo
                      ? 'border-green-500/50'
                      : 'border-white/10'
                  } outline-none focus:border-blue-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                />
                {appliedPromo && (
                  <button
                    onClick={removePromo}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {!appliedPromo && (
                <button
                  onClick={() => applyPromoCode(promoCode)}
                  disabled={!promoCode.trim()}
                  className="px-6 py-2.5 rounded-lg bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('cart.apply')}
                </button>
              )}
            </div>

            {/* Error Message */}
            {promoError && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-2"
              >
                {promoError}
              </motion.p>
            )}

            {/* Success Message */}
            {appliedPromo && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-green-400 text-sm mt-2"
              >
                <Check className="w-4 h-4" />
                <span>{t(`cart.promoDescriptions.${appliedPromo.code.toLowerCase()}`)}</span>
              </motion.div>
            )}

            {/* Promo Suggestions */}
            <AnimatePresence>
              {showPromoSuggestions && !appliedPromo && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 w-full mt-2 backdrop-blur-xl bg-slate-900 border border-white/10 rounded-lg overflow-hidden shadow-xl"
                >
                  <div className="p-3">
                    <p className="text-xs text-slate-400 mb-2">{t('cart.availableCodes')}</p>
                    <div className="space-y-2">
                      {availablePromoCodes.map((promo) => (
                        <button
                          key={promo.code}
                          onClick={() => applyPromoCode(promo.code)}
                          className="w-full text-left p-2 rounded hover:bg-white/5 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-mono font-medium text-blue-400 text-sm">
                                {promo.code}
                              </span>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {t(`cart.promoDescriptions.${promo.code.toLowerCase()}`)}
                              </p>
                            </div>
                            <Tag className="w-4 h-4 text-green-400" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-3 py-4 border-t border-white/10">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">
              {t('cart.subtotal', { count: itemCount, items: itemCount === 1 ? t('cart.item') : t('cart.items') })}
            </span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>

          {appliedPromo && discount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex justify-between text-sm"
            >
              <span className="text-green-400">{t('cart.discount')} ({appliedPromo.code})</span>
              <span className="font-medium text-green-400">-${discount.toFixed(2)}</span>
            </motion.div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-slate-400">{t('cart.tax')}</span>
            <span className="font-medium">${tax.toFixed(2)}</span>
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-4 border-t border-white/10">
          <span className="text-lg font-semibold">{t('cart.total')}</span>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">${total.toFixed(2)}</div>
            {discount > 0 && (
              <div className="text-xs text-green-400">
                {t('cart.youSave', { amount: discount.toFixed(2) })}
              </div>
            )}
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={onCheckout}
          className="w-full mt-6 py-4 px-6 rounded-xl bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 transition-all font-semibold text-lg shadow-lg hover:shadow-xl group flex items-center justify-center gap-2"
        >
          <span>{t('cart.proceedToCheckout')}</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Info Text */}
        <p className="text-xs text-slate-400 text-center mt-4">
          {t('cart.secureCheckout')}
        </p>
      </div>

      {/* Payment Methods */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-sm font-medium mb-4">{t('cart.acceptedPaymentMethods')}</h4>
        <div className="flex flex-wrap gap-3">
          {['Visa', 'Mastercard', 'PayPal', 'American Express'].map((method) => (
            <div
              key={method}
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-400"
            >
              {method}
            </div>
          ))}
        </div>
      </div>

      {/* Money Back Guarantee */}
      <div className="backdrop-blur-xl bg-green-500/10 border border-green-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-green-400 mb-1">
              {t('cart.moneyBackGuarantee')}
            </h4>
            <p className="text-xs text-green-400/80">
              {t('cart.moneyBackDesc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
