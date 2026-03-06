import { useTranslation } from 'react-i18next';
import { ShoppingCart, ArrowRight, Check } from 'lucide-react';

interface CartSummaryProps {
  subtotal: number;
  itemCount: number;
  onCheckout: () => void;
}

export function CartSummary({ subtotal, itemCount, onCheckout }: CartSummaryProps) {
  const { t } = useTranslation();

  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <ShoppingCart className="w-5 h-5 text-blue-400" />
          <h3 className="text-xl font-semibold">{t('cart.orderSummary')}</h3>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-3 py-4 border-t border-white/10">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">
              {t('cart.subtotal', { count: itemCount, items: itemCount === 1 ? t('cart.item') : t('cart.items') })}
            </span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>

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
