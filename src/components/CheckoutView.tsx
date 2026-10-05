import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  Building,
  ShieldCheck,
  Lock,
  ArrowLeft,
  Tag,
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const {
    courses,
    selectedCourseId,
    setCurrentView,
    enrollInCourse,
    formatPrice,
    showToast,
  } = useApp();

  const course = courses.find((c) => c.id === selectedCourseId) || courses[0];

  const [paymentMethod, setPaymentMethod] = useState<'carte_bancaire' | 'virement' | 'cash'>('carte_bancaire');
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Card Form State
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('884');
  const [cardName, setCardName] = useState('AMINE EL AMRANI');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const finalPriceMAD = Math.round(course.priceMAD * (1 - discountPercent / 100));

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'EXCELIUM2026') {
      setDiscountPercent(100);
      showToast('Code Promo Appliqué', 'Remise de 100% accordée (Accès Démo Offert) !', 'success');
    } else if (couponCode.toUpperCase() === 'COMPTA20') {
      setDiscountPercent(20);
      showToast('Code Promo Appliqué', 'Remise de 20% appliquée.', 'success');
    } else {
      showToast('Code Invalide', 'Le code promo saisi n\'est pas valide.', 'error');
    }
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (finalPriceMAD === 0) {
      enrollInCourse(course.id, 'coupon');
      setCurrentView('classroom');
      return;
    }

    if (paymentMethod === 'carte_bancaire') {
      setShowOtpModal(true);
    } else {
      // Virement or Cash
      enrollInCourse(course.id, paymentMethod);
      setCurrentView('classroom');
    }
  };

  const handleConfirmOtp = () => {
    setShowOtpModal(false);
    enrollInCourse(course.id, 'carte_bancaire');
    setCurrentView('classroom');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <button
          onClick={() => setCurrentView('course-detail')}
          className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-2 hover:bg-slate-100 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à la formation</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-800">
          <Lock className="w-4 h-4 text-emerald-600" />
          <span>Paiement Sécurisé SSL 256-bit (CMI Maroc)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Payment Form */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <h2 className="text-xl font-bold text-slate-900">Choisissez votre mode de règlement</h2>

          {/* Payment Method Selector */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setPaymentMethod('carte_bancaire')}
              className={`p-3.5 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-2 ${
                paymentMethod === 'carte_bancaire'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CreditCard className="w-6 h-6 text-emerald-600" />
              <span>Carte Bancaire (CMI)</span>
            </button>

            <button
              onClick={() => setPaymentMethod('virement')}
              className={`p-3.5 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-2 ${
                paymentMethod === 'virement'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Building className="w-6 h-6 text-cyan-600" />
              <span>Virement Bancaire</span>
            </button>

            <button
              onClick={() => setPaymentMethod('cash')}
              className={`p-3.5 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-2 ${
                paymentMethod === 'cash'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-6 h-6 text-amber-600" />
              <span>Paiement en Agence</span>
            </button>
          </div>

          {/* Payment Details Body */}
          {paymentMethod === 'carte_bancaire' && (
            <form onSubmit={handleProcessPayment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-mono mb-1 font-bold">Nom du Titulaire :</label>
                <input
                  type="text"
                  required
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-mono mb-1 font-bold">Numéro de Carte Bancaire (CMI / Visa / MC) :</label>
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold tracking-widest"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-mono mb-1 font-bold">Date d'expiration :</label>
                  <input
                    type="text"
                    required
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-mono mb-1 font-bold">Code CVV (3 chiffres) :</label>
                  <input
                    type="text"
                    required
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-sm rounded-2xl shadow-lg hover:scale-[1.01] transition-transform"
              >
                Payer {formatPrice(finalPriceMAD)} & Activer l'Accès
              </button>
            </form>
          )}

          {paymentMethod === 'virement' && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 text-sm">Coordonnées Bancaires (RIB Cabinet Excelium) :</h4>
              <div className="space-y-1 font-mono text-slate-700 font-medium">
                <p>Banque : <strong className="text-slate-900">Attijariwafa Bank Maroc</strong></p>
                <p>Titulaire : <strong className="text-slate-900">EXCELIUM CONSULTING COMPTA S.A.R.L</strong></p>
                <p>RIB (24 chiffres) : <strong className="text-emerald-800 font-bold">007 780 0001234567890123 45</strong></p>
                <p>SWIFT / BIC : <strong className="text-cyan-800 font-bold">BCMA MA MC</strong></p>
              </div>
              <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                Indiquez votre nom en motif de virement. L'accès sera activé instantanément sur présentation du reçu.
              </p>
              <button
                onClick={handleProcessPayment}
                className="w-full py-3.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow"
              >
                Confirmer l'Ordre de Virement
              </button>
            </div>
          )}

          {paymentMethod === 'cash' && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 text-sm">Règlement au Cabinet :</h4>
              <p className="text-slate-700 font-medium">
                Vous pouvez vous présenter directement aux locaux du Cabinet Excelium à Casablanca Maarif / CFC pour régler par chèque ou espèces et obtenir votre reçu officiel.
              </p>
              <button
                onClick={handleProcessPayment}
                className="w-full py-3.5 bg-amber-600 text-white font-bold text-xs rounded-xl shadow"
              >
                Valider l'Inscription en Agence
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Récapitulatif de la Commande</h3>

          <div className="flex items-start gap-4">
            <img
              src={course.imageUrl}
              alt={course.title}
              className="w-20 h-16 rounded-xl object-cover border border-slate-200"
            />
            <div className="text-xs space-y-1">
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 font-mono font-bold text-[10px] rounded uppercase">
                {course.category}
              </span>
              <h4 className="font-bold text-slate-900 line-clamp-2 leading-snug">{course.title}</h4>
              <p className="text-[11px] text-slate-500 font-medium">{course.instructorName}</p>
            </div>
          </div>

          {/* Coupon Input */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-mono font-bold text-slate-700 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-amber-600" />
              <span>Code Promo / Coupon Réduction :</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="ex: EXCELIUM2026"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 uppercase font-mono font-bold"
              />
              <button
                onClick={handleApplyCoupon}
                className="px-4 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl font-mono"
              >
                Appliquer
              </button>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">Entrez "EXCELIUM2026" pour 100% de remise.</p>
          </div>

          {/* Financial Breakdown */}
          <div className="space-y-2 text-xs font-mono border-t border-slate-100 pt-4 text-slate-700 font-medium">
            <div className="flex justify-between">
              <span>Prix HT Formation :</span>
              <span>{formatPrice(Math.round(course.priceMAD / 1.2))}</span>
            </div>
            <div className="flex justify-between">
              <span>TVA (20%) :</span>
              <span>{formatPrice(course.priceMAD - Math.round(course.priceMAD / 1.2))}</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-emerald-800 font-bold">
                <span>Remise Code Promo ({discountPercent}%) :</span>
                <span>-{formatPrice(course.priceMAD - finalPriceMAD)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>TOTAL TTC À PAYER :</span>
              <span className="text-emerald-700 font-mono">{formatPrice(finalPriceMAD)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated 3D Secure SMS OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-6 text-center shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 mx-auto flex items-center justify-center">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">Validation 3D Secure (CMI Maroc)</h3>
              <p className="text-xs text-slate-600 font-medium">
                Un code SMS à 6 chiffres a été envoyé au numéro associé à votre carte bancaire (+212 6 ** ** 67).
              </p>
            </div>

            <input
              type="text"
              placeholder="1 2 3 4 5 6"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-xl font-mono text-emerald-800 font-bold tracking-widest focus:outline-none"
            />

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowOtpModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmOtp}
                className="px-6 py-2 bg-emerald-600 text-white font-black text-xs rounded-xl shadow"
              >
                Confirmer le Paiement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
