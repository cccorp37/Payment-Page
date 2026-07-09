/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, FormEvent, useEffect, ChangeEvent } from "react";
import { ShieldCheck, Check, Download, Mail, ArrowLeft, Smartphone, User, CreditCard, Info, Lock, X } from "lucide-react";
import html2canvas from "html2canvas";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const COUNTRIES = [
    { code: 'BJ', name: 'Bénin', currency: 'XOF', dialCode: '229', methods: ['mtn', 'moov', 'card'] },
    { code: 'BF', name: 'Burkina Faso', currency: 'XOF', dialCode: '226', methods: ['orange', 'moov', 'card'] },
    { code: 'CM', name: 'Cameroun', currency: 'XAF', dialCode: '237', methods: ['orange', 'mtn', 'card'] },
    { code: 'CG', name: 'Congo', currency: 'XAF', dialCode: '242', methods: ['mtn', 'airtel', 'card'] },
    { code: 'CD', name: 'RDC', currency: 'CDF', dialCode: '243', methods: ['orange', 'vodacom', 'airtel', 'card'] },
    { code: 'GA', name: 'Gabon', currency: 'XAF', dialCode: '241', methods: ['airtel', 'moov', 'card'] },
    { code: 'GH', name: 'Ghana', currency: 'GHS', dialCode: '233', methods: ['mtn', 'vodafone', 'tigo', 'card'] },
    { code: 'CI', name: 'Côte d\'Ivoire', currency: 'XOF', dialCode: '225', methods: ['orange', 'mtn', 'moov', 'wave', 'card'] },
    { code: 'KE', name: 'Kenya', currency: 'KES', dialCode: '254', methods: ['mpesa', 'airtel', 'card'] },
    { code: 'RW', name: 'Rwanda', currency: 'RWF', dialCode: '250', methods: ['mtn', 'airtel', 'card'] },
    { code: 'SN', name: 'Sénégal', currency: 'XOF', dialCode: '221', methods: ['orange', 'free', 'wave', 'card'] },
    { code: 'SL', name: 'Sierra Leone', currency: 'SLL', dialCode: '232', methods: ['orange', 'afrimoney', 'card'] },
    { code: 'TZ', name: 'Tanzanie', currency: 'TZS', dialCode: '255', methods: ['vodacom', 'tigo', 'airtel', 'halopesa', 'card'] },
    { code: 'UG', name: 'Ouganda', currency: 'UGX', dialCode: '256', methods: ['mtn', 'airtel', 'card'] },
    { code: 'ZM', name: 'Zambie', currency: 'ZMW', dialCode: '260', methods: ['mtn', 'airtel', 'zamtel', 'card'] },
    { code: 'ML', name: 'Mali', currency: 'XOF', dialCode: '223', methods: ['orange', 'moov', 'card'] },
    { code: 'INT', name: 'International', currency: 'EUR', dialCode: '', methods: ['card'] },
  ];

  const PAYMENT_METHODS_DATA: Record<string, { id: string, name: string, short: string, bg: string, text: string, border: string, activeBg: string, activeBorder: string, type: 'momo' | 'card' }> = {
    'orange': { id: 'orange', name: 'Orange Money', short: 'OM', bg: 'bg-orange-500', text: 'text-white', border: 'border-orange-200', activeBg: 'peer-checked:bg-orange-50', activeBorder: 'peer-checked:border-orange-500', type: 'momo' },
    'mtn': { id: 'mtn', name: 'MTN Money', short: 'MoMo', bg: 'bg-yellow-400', text: 'text-blue-900', border: 'border-yellow-200', activeBg: 'peer-checked:bg-yellow-50', activeBorder: 'peer-checked:border-yellow-400', type: 'momo' },
    'moov': { id: 'moov', name: 'Moov Money', short: 'Moov', bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-200', activeBg: 'peer-checked:bg-blue-50', activeBorder: 'peer-checked:border-blue-600', type: 'momo' },
    'wave': { id: 'wave', name: 'Wave', short: 'Wave', bg: 'bg-cyan-400', text: 'text-white', border: 'border-cyan-200', activeBg: 'peer-checked:bg-cyan-50', activeBorder: 'peer-checked:border-cyan-400', type: 'momo' },
    'free': { id: 'free', name: 'Free Money', short: 'Free', bg: 'bg-red-600', text: 'text-white', border: 'border-red-200', activeBg: 'peer-checked:bg-red-50', activeBorder: 'peer-checked:border-red-600', type: 'momo' },
    'airtel': { id: 'airtel', name: 'Airtel Money', short: 'Airtel', bg: 'bg-red-500', text: 'text-white', border: 'border-red-200', activeBg: 'peer-checked:bg-red-50', activeBorder: 'peer-checked:border-red-500', type: 'momo' },
    'vodacom': { id: 'vodacom', name: 'Vodacom M-Pesa', short: 'M-Pesa', bg: 'bg-red-600', text: 'text-white', border: 'border-red-200', activeBg: 'peer-checked:bg-red-50', activeBorder: 'peer-checked:border-red-600', type: 'momo' },
    'mpesa': { id: 'mpesa', name: 'M-Pesa', short: 'M-Pesa', bg: 'bg-green-500', text: 'text-white', border: 'border-green-200', activeBg: 'peer-checked:bg-green-50', activeBorder: 'peer-checked:border-green-500', type: 'momo' },
    'vodafone': { id: 'vodafone', name: 'Vodafone Cash', short: 'Vodafone', bg: 'bg-red-600', text: 'text-white', border: 'border-red-200', activeBg: 'peer-checked:bg-red-50', activeBorder: 'peer-checked:border-red-600', type: 'momo' },
    'tigo': { id: 'tigo', name: 'Tigo Pesa', short: 'Tigo', bg: 'bg-blue-800', text: 'text-white', border: 'border-blue-200', activeBg: 'peer-checked:bg-blue-50', activeBorder: 'peer-checked:border-blue-800', type: 'momo' },
    'afrimoney': { id: 'afrimoney', name: 'Afrimoney', short: 'Afri', bg: 'bg-purple-600', text: 'text-white', border: 'border-purple-200', activeBg: 'peer-checked:bg-purple-50', activeBorder: 'peer-checked:border-purple-600', type: 'momo' },
    'halopesa': { id: 'halopesa', name: 'HaloPesa', short: 'Halo', bg: 'bg-orange-500', text: 'text-white', border: 'border-orange-200', activeBg: 'peer-checked:bg-orange-50', activeBorder: 'peer-checked:border-orange-500', type: 'momo' },
    'zamtel': { id: 'zamtel', name: 'Zamtel', short: 'Zamtel', bg: 'bg-green-600', text: 'text-white', border: 'border-green-200', activeBg: 'peer-checked:bg-green-50', activeBorder: 'peer-checked:border-green-600', type: 'momo' },
    'card': { id: 'card', name: 'Carte Bancaire', short: 'CB', bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200', activeBg: 'peer-checked:bg-pink-50', activeBorder: 'peer-checked:border-pink-600', type: 'card' },
  };

  const [country, setCountry] = useState(COUNTRIES[0]);
  const [amount, setAmount] = useState<number>(25000);
  const [paymentMethod, setPaymentMethod] = useState<string>("orange");
  const [momoNumber, setMomoNumber] = useState("");
  const [momoName, setMomoName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  
  const PHONE_FORMAT_DESCRIPTIONS: Record<string, { length: string; example: string; details: string }> = {
    'BJ': { length: '8', example: '67 00 00 00', details: '8 chiffres après +229 (ex: +229 67 00 00 00)' },
    'BF': { length: '8', example: '70 00 00 00', details: '8 chiffres après +226 (ex: +226 70 00 00 00)' },
    'CM': { length: '9', example: '690 00 00 00', details: '9 chiffres après +237 (ex: +237 690 00 00 00)' },
    'CG': { length: '9', example: '06 600 00 00', details: '9 chiffres après +242 (ex: +242 06 600 00 00)' },
    'CD': { length: '9', example: '81 000 00 00', details: '9 chiffres après +243 (ex: +243 81 000 00 00)' },
    'GA': { length: '7 ou 8', example: '66 00 00 00', details: '7 ou 8 chiffres après +241 (ex: +241 66 00 00 00)' },
    'GH': { length: '9', example: '24 000 0000', details: '9 chiffres après +233 (ex: +233 24 000 0000)' },
    'CI': { length: '10', example: '07 00 00 00 00', details: '10 chiffres après +225 (ex: +225 07 00 00 00 00)' },
    'KE': { length: '9', example: '700 000 000', details: '9 chiffres après +254 (ex: +254 700 000 000)' },
    'RW': { length: '9', example: '780 000 000', details: '9 chiffres après +250 (ex: +250 780 000 000)' },
    'SN': { length: '9', example: '77 000 00 00', details: '9 chiffres après +221 (ex: +221 77 000 00 00)' },
    'SL': { length: '8', example: '76 00 00 00', details: '8 chiffres après +232 (ex: +232 76 00 00 00)' },
    'TZ': { length: '9', example: '710 000 000', details: '9 chiffres après +255 (ex: +255 710 000 000)' },
    'UG': { length: '9', example: '770 000 000', details: '9 chiffres après +256 (ex: +256 770 000 000)' },
    'ZM': { length: '9', example: '970 000 000', details: '9 chiffres après +260 (ex: +260 970 000 000)' },
    'ML': { length: '8', example: '66 00 00 00', details: '8 chiffres après +223 (ex: +223 66 00 00 00)' },
  };

  const getPhoneValidation = () => {
    if (!momoNumber) {
      const desc = PHONE_FORMAT_DESCRIPTIONS[country.code];
      return { 
        isValid: false, 
        isEmpty: true, 
        text: desc ? `Format attendu : +${country.dialCode} suivi de ${desc.length} chiffres. (Ex: ${desc.example})` : `Saisissez votre numéro de téléphone.` 
      };
    }

    let cleaned = momoNumber.replace(/\D/g, '');
    if (country.dialCode) {
      if (cleaned.startsWith(country.dialCode)) {
        cleaned = cleaned.slice(country.dialCode.length);
      } else if (cleaned.startsWith('00' + country.dialCode)) {
        cleaned = cleaned.slice(country.dialCode.length + 2);
      }
    }
    const formattedAccount = country.dialCode + cleaned;

    const phoneRules: Record<string, RegExp> = {
      'BJ': /^229\d{8}$/,
      'BF': /^226\d{8}$/,
      'CM': /^237\d{9}$/,
      'CG': /^242\d{9}$/,
      'CD': /^243\d{9}$/,
      'GA': /^241\d{7,8}$/,
      'GH': /^233\d{9}$/,
      'CI': /^225\d{10}$/,
      'KE': /^254\d{9}$/,
      'RW': /^250\d{9}$/,
      'SN': /^221\d{9}$/,
      'SL': /^232\d{8}$/,
      'TZ': /^255\d{9}$/,
      'UG': /^256\d{9}$/,
      'ZM': /^260\d{9}$/,
      'ML': /^223\d{8}$/
    };

    const regex = phoneRules[country.code];
    const desc = PHONE_FORMAT_DESCRIPTIONS[country.code];

    if (!regex || !desc) {
      return { isValid: true, isEmpty: false, text: "Format libre" };
    }

    const isValid = regex.test(formattedAccount);
    if (isValid) {
      // Afficher une version agréable avec espaces
      const rawRest = formattedAccount.slice(country.dialCode.length);
      const formattedVisual = `+${country.dialCode} ${rawRest.replace(/(\d{2,3})(?=\d)/g, '$1 ')}`;
      return { 
        isValid: true, 
        isEmpty: false, 
        text: `Format de numéro valide pour ${country.name} (${formattedVisual})` 
      };
    } else {
      return { 
        isValid: false, 
        isEmpty: false, 
        text: `Format incorrect. Attendu : ${desc.details}` 
      };
    }
  };
  
  const [adminWhatsapp, setAdminWhatsapp] = useState("https://wa.me/");
  const [adminEmail, setAdminEmail] = useState("mailto:");
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState("");
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.whatsapp) setAdminWhatsapp(data.whatsapp);
        if (data.email) setAdminEmail(data.email);
      })
      .catch(err => console.error("Failed to load settings", err));
  }, []);

  const fetchTransactions = async (currentPin: string) => {
    try {
      const res = await fetch("/api/admin/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: currentPin })
      });
      if (res.ok) {
        const data = await res.json();
        setRecentTransactions(data.transactions || []);
      }
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    }
  };

  const handlePinSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (pin === "3173") {
      setShowPinModal(false);
      setShowAdminPanel(true);
      await fetchTransactions(pin);
      setPin("");
    } else {
      alert("Code PIN incorrect");
    }
  };

  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsapp: adminWhatsapp, email: adminEmail, pin: "3173" })
      });
      if (res.ok) {
        alert("Paramètres enregistrés !");
        setShowAdminPanel(false);
      } else {
        alert("Erreur d'autorisation");
      }
    } catch(err) {
      alert("Erreur lors de l'enregistrement");
    }
  };

  const receiptRef = useRef<HTMLDivElement>(null);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleExpiryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setExpiry(formatExpiry(e.target.value));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let formattedAccount = PAYMENT_METHODS_DATA[paymentMethod]?.type === 'card' ? cardNumber : momoNumber.replace(/\D/g, '');
    
    // Si c'est Mobile Money, assurer le format international sans '+'
    if (PAYMENT_METHODS_DATA[paymentMethod]?.type === 'momo' && country.dialCode) {
      let cleaned = momoNumber.replace(/\D/g, '');
      if (cleaned.startsWith(country.dialCode)) {
        cleaned = cleaned.slice(country.dialCode.length);
      } else if (cleaned.startsWith('00' + country.dialCode)) {
        cleaned = cleaned.slice(country.dialCode.length + 2);
      }
      formattedAccount = country.dialCode + cleaned;
      
      const phoneRules: Record<string, RegExp> = {
        'BJ': /^229\d{8}$/,
        'BF': /^226\d{8}$/,
        'CM': /^237\d{9}$/,
        'CG': /^242\d{9}$/,
        'CD': /^243\d{9}$/,
        'GA': /^241\d{7,8}$/,
        'GH': /^233\d{9}$/,
        'CI': /^225\d{10}$/,
        'KE': /^254\d{9}$/,
        'RW': /^250\d{9}$/,
        'SN': /^221\d{9}$/,
        'SL': /^232\d{8}$/,
        'TZ': /^255\d{9}$/,
        'UG': /^256\d{9}$/,
        'ZM': /^260\d{9}$/,
        'ML': /^223\d{8}$/
      };
      
      const regex = phoneRules[country.code];
      if (regex && !regex.test(formattedAccount)) {
        alert(`Le numéro de téléphone pour ${country.name} est invalide. Veuillez vérifier le format et la longueur.`);
        setIsSubmitting(false);
        return;
      }
    }

    const payload = {
      amount,
      currency: country.currency,
      method: paymentMethod,
      account: formattedAccount,
      fullName: PAYMENT_METHODS_DATA[paymentMethod]?.type === 'card' ? "Carte Bancaire" : momoName,
      country: country.code
    };

    try {
      const response = await fetch("/api/payment/tara", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setReceiptData(data.data);
        setIsPending(true);
      } else {
        alert("Erreur lors du paiement: " + data.error);
      }
    } catch (error) {
      alert("Une erreur est survenue lors de la communication avec le serveur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadReceipt = async () => {
    if (receiptRef.current) {
      try {
        const canvas = await html2canvas(receiptRef.current);
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `Recu_RC_AGENCY_${Date.now()}.png`;
        link.click();
      } catch (err) {
        console.error("Failed to generate receipt image", err);
        alert("Erreur lors du téléchargement du reçu.");
      }
    }
  };

  const checkPaymentStatus = async (transactionId: string, isManual = false) => {
    try {
      const response = await fetch(`/api/payment/status/${transactionId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.status === "success") {
          setIsPending(false);
          setIsSuccess(true);
        } else if (isManual) {
          alert("Le paiement n'est pas encore validé. Veuillez confirmer la transaction sur votre téléphone.");
        }
      } else if (isManual) {
        alert("Impossible de vérifier le statut du paiement pour le moment.");
      }
    } catch (e) {
      console.error("Erreur vérification paiement", e);
      if (isManual) {
        alert("Erreur de connexion.");
      }
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPending && receiptData?.transactionId) {
      // Poll every 60 seconds
      interval = setInterval(() => {
        checkPaymentStatus(receiptData.transactionId);
      }, 60000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPending, receiptData]);

  const resetForm = () => {
    setIsSuccess(false);
    setIsPending(false);
    setAmount(25000);
    setMomoNumber("");
    setMomoName("");
    setCardNumber("");
    setExpiry("");
    setCvc("");
    setReceiptData(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative bg-[#f3f4f6] font-sans">
      {/* Conteneur principal */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden z-10">
        
        {/* Colonne de gauche : Récapitulatif et Logo */}
        <div className="bg-pink-50 p-8 md:w-5/12 border-b md:border-b-0 md:border-r border-pink-100 flex flex-col">
          {/* Logo R&C AGENCY */}
          <div className="text-center mb-10 mt-4">
            <div className="flex items-end justify-center mb-1">
              <span className="text-7xl font-serif text-gray-900 leading-none" style={{ fontFamily: "'Times New Roman', Times, serif" }}>R</span>
              <span className="text-5xl font-serif text-pink-600 mx-1 leading-none pb-2" style={{ fontFamily: "'Times New Roman', Times, serif" }}>&amp;</span>
              <div className="relative">
                <span className="text-7xl font-serif text-gray-900 leading-none" style={{ fontFamily: "'Times New Roman', Times, serif" }}>C</span>
                {/* Cœur au dessus du C */}
                <svg className="w-12 h-12 absolute -top-6 -right-6 text-pink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
            </div>
            
            <h1 className="text-xl text-gray-800 tracking-[0.2em] mt-2 uppercase" style={{ fontFamily: "'Times New Roman', Times, serif" }}>AGENCY</h1>
            <div className="flex items-center justify-center mt-3">
              <div className="h-px bg-pink-300 w-16"></div>
              <svg className="w-4 h-4 mx-2 text-pink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <div className="h-px bg-pink-300 w-16"></div>
            </div>
          </div>

          <div className="flex-grow">
            <h2 className="text-pink-600 text-sm font-semibold uppercase tracking-wider mb-4 border-b border-pink-200 pb-2">Détails du paiement</h2>
            <div className="mb-6">
              <label htmlFor="amountInput" className="block text-sm font-medium text-gray-700 mb-2">Montant du service ({country.currency})</label>
              <div className="relative">
                <input 
                  type="number" 
                  id="amountInput" 
                  value={amount} 
                  onChange={(e) => setAmount(Number(e.target.value))}
                  min="500" 
                  step="100"
                  className="block w-full pl-4 pr-16 py-3 text-xl font-bold text-gray-900 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 transition-colors bg-white shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-medium text-sm">{country.currency}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 leading-relaxed">Saisissez le montant correspondant au service défini avec AGENCY.</p>
            </div>
          </div>

          {/* Sécurité */}
          <div className="pt-6 mt-6 border-t border-pink-200 text-center">
            <p className="text-xs text-gray-500 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 mr-1 text-green-600" />
              Transactions 100% sécurisées
            </p>
          </div>
        </div>

        {/* Colonne de droite : Formulaire de paiement */}
        <div className="p-8 md:w-7/12 relative bg-white flex flex-col justify-center overflow-hidden min-h-[600px]">
          
          <AnimatePresence mode="wait">
          {isPending ? (
            <motion.div 
              key="pending"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mb-6"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Paiement en attente</h2>
              
              {receiptData?.authUrl ? (
                <div className="mt-4 space-y-6">
                  <p className="text-gray-600">Veuillez cliquer sur le bouton ci-dessous pour valider votre paiement via l'application de votre opérateur Mobile Money.</p>
                  <a href={receiptData.authUrl} target="_blank" rel="noopener noreferrer" className="inline-block bg-pink-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors shadow-md">Valider le paiement</a>
                </div>
              ) : receiptData?.ussdCode ? (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-6 shadow-sm">
                  <p className="text-sm text-yellow-800 font-medium mb-3 uppercase tracking-wide">Action requise sur votre téléphone</p>
                  <p className="text-3xl font-bold text-gray-900 tracking-wider mb-3">
                    {receiptData.ussdCode}
                  </p>
                  <p className="text-sm text-yellow-700">
                    Veuillez composer ce code sur votre mobile pour valider la transaction.
                  </p>
                </div>
              ) : (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm max-w-md">
                  <p className="text-sm text-blue-800 font-medium mb-2 uppercase tracking-wide">Validation Push</p>
                  <p className="text-gray-700 mb-2">Une demande de paiement a été envoyée sur votre téléphone ({receiptData?.account}).</p>
                  <p className="text-sm text-gray-600">Veuillez consulter votre téléphone et entrer votre code secret pour valider.</p>
                </div>
              )}

              <div className="mt-10 w-full max-w-xs space-y-3">
                <button 
                  onClick={() => checkPaymentStatus(receiptData?.transactionId, true)}
                  className="w-full bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5" />
                  Vérifier le paiement
                </button>
                <button 
                  onClick={resetForm}
                  className="w-full bg-white text-gray-500 border border-gray-200 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler / Retour
                </button>
              </div>
            </motion.div>
          ) : isSuccess ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              id="successMessage" 
              className="absolute inset-0 bg-gray-50 z-20 flex flex-col items-center justify-center p-6 overflow-y-auto"
            >
              {/* Zone du reçu (Celle qui sera capturée pour le téléchargement) */}
              <div ref={receiptRef} id="receiptCard" className="bg-white w-full max-w-md rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-6">
                {/* En-tête du reçu */}
                <div className="bg-pink-50 p-6 text-center border-b border-pink-100 relative">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-md border-4 border-white">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-1">
                    Paiement Réussi
                  </h2>
                  <p className="text-sm text-gray-600 tracking-widest font-serif">R&C AGENCY</p>
                </div>
                
                {/* Corps du reçu */}
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Date</span>
                    <span className="text-sm font-medium text-gray-900" id="receiptDate">
                      {receiptData?.date ? new Date(receiptData.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '--'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">N° Transaction</span>
                    <span className="text-sm font-medium text-gray-900">{receiptData?.transactionId || `TRX-${Math.floor(Math.random() * 1000000)}`}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Moyen de paiement</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {receiptData?.method ? PAYMENT_METHODS_DATA[receiptData.method]?.name || receiptData.method : '--'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Compte / Numéro</span>
                    <span className="text-sm font-medium text-gray-900">
                      {PAYMENT_METHODS_DATA[receiptData?.method]?.type === 'card' ? `**** **** **** ${receiptData?.account?.slice(-4) || '****'}` : receiptData?.account}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 pb-2">
                    <span className="font-semibold text-gray-900">Montant total réglé</span>
                    <span className="text-2xl font-bold text-pink-600">{receiptData?.amount?.toLocaleString('fr-FR')} {receiptData?.currency || country.currency}</span>
                  </div>
                </div>
              </div>

              {/* Actions de la page de succès */}
              <div className="w-full max-w-md space-y-3">
                <button onClick={downloadReceipt} className="w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 transition-colors">
                  <Download className="w-4 h-4 mr-2" /> Télécharger le reçu
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <a href={adminWhatsapp} target="_blank" rel="noreferrer" className="flex justify-center items-center py-3 px-4 border border-green-500 text-green-600 rounded-lg shadow-sm text-sm font-medium hover:bg-green-50 transition-colors">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                    WhatsApp
                  </a>
                  <a href={adminEmail} target="_blank" rel="noreferrer" className="flex justify-center items-center py-3 px-4 border border-gray-300 text-gray-700 rounded-lg shadow-sm text-sm font-medium hover:bg-gray-50 transition-colors">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </a>
                </div>
                <button onClick={resetForm} className="w-full mt-4 px-6 py-3 text-gray-500 hover:text-gray-800 transition-colors font-medium flex items-center justify-center text-sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour à l'accueil
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full flex flex-col justify-center"
            >

          {/* FORMULAIRE DE PAIEMENT */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Paiement</h2>
            
            <div className="relative">
              <select 
                className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-3 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
                value={country.code}
                onChange={(e) => {
                  const newCountry = COUNTRIES.find(c => c.code === e.target.value) || COUNTRIES[0];
                  setCountry(newCountry);
                  if (!newCountry.methods.includes(paymentMethod)) {
                    setPaymentMethod(newCountry.methods[0]);
                  }
                }}
              >
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
          
          <form id="paymentForm" className="space-y-6" onSubmit={handleSubmit}>
            {/* Sélection du Mode de paiement */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {country.methods.map(methodKey => {
                const method = PAYMENT_METHODS_DATA[methodKey];
                if (!method) return null;
                const isSelected = paymentMethod === methodKey;
                
                return (
                  <label key={methodKey} className="cursor-pointer">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value={methodKey} 
                      className="peer sr-only" 
                      checked={isSelected} 
                      onChange={() => setPaymentMethod(methodKey)}
                    />
                    <div className={`flex flex-col items-center justify-center px-2 py-4 border-2 rounded-xl transition-all ${isSelected ? method.activeBorder + ' ' + method.activeBg : 'border-gray-200 hover:bg-gray-50'}`}>
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs mb-2 shadow-sm ${method.bg} ${method.text}`}>
                        {method.type === 'card' ? <CreditCard className="w-6 h-6" /> : method.short}
                      </div>
                      <span className="text-xs font-semibold text-gray-800 text-center">{method.name}</span>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Champs pour Mobile Money */}
            {PAYMENT_METHODS_DATA[paymentMethod]?.type === 'momo' && (() => {
              const validation = getPhoneValidation();
              return (
                <div id="momoFields" className="space-y-4">
                  <div>
                    <label htmlFor="momoNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Numéro de téléphone ({country.name})
                    </label>
                    <div className="relative flex rounded-lg shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-600 sm:text-sm font-semibold">
                        +{country.dialCode}
                      </span>
                      <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Smartphone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input 
                          type="tel" 
                          id="momoNumber" 
                          placeholder={`Ex: ${PHONE_FORMAT_DESCRIPTIONS[country.code]?.example || '690 00 00 00'}`}
                          required 
                          value={momoNumber}
                          onChange={(e) => setMomoNumber(e.target.value)}
                          className={`block w-full pl-10 pr-10 py-3 border rounded-r-lg sm:text-sm transition-colors ${
                            validation.isEmpty 
                              ? "border-gray-300 focus:ring-pink-500 focus:border-pink-500 focus:outline-none" 
                              : validation.isValid 
                              ? "border-green-500 focus:ring-green-500 focus:border-green-500 bg-green-50/20 focus:outline-none z-10 relative" 
                              : "border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50/20 focus:outline-none z-10 relative"
                          }`}
                        />
                        
                        {/* Icône de statut à droite du champ */}
                        {!validation.isEmpty && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none z-20">
                            {validation.isValid ? (
                              <Check className="h-5 w-5 text-green-500" />
                            ) : (
                              <X className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Indicateur textuel et explicatif sous le champ */}
                    <div className="mt-2 flex items-start gap-1.5 text-xs">
                      {validation.isEmpty ? (
                        <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                      ) : validation.isValid ? (
                        <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                      )}
                      <span className={`font-medium ${
                        validation.isEmpty ? "text-gray-500" : validation.isValid ? "text-green-600" : "text-red-600"
                      }`}>
                        {validation.text}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="momoName" className="block text-sm font-medium text-gray-700 mb-1">Nom complet du titulaire</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        id="momoName" 
                        placeholder="Ex: Jean Dupont" 
                        required 
                        value={momoName}
                        onChange={(e) => setMomoName(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 sm:text-sm transition-colors uppercase"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-2">Veuillez garder votre téléphone à proximité pour valider le retrait.</p>
                </div>
              );
            })()}

            {/* Champs pour Carte Bancaire */}
            {PAYMENT_METHODS_DATA[paymentMethod]?.type === 'card' && (
              <div id="cardFields" className="space-y-4">
                {/* Numéro de carte */}
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Numéro de carte</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      id="cardNumber" 
                      placeholder="0000 0000 0000 0000" 
                      maxLength={19}
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      required
                      className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 sm:text-sm font-mono transition-colors"
                    />
                  </div>
                </div>
                
                {/* Ligne Expiration & CVC */}
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">Expiration (MM/AA)</label>
                    <input 
                      type="text" 
                      id="expiry" 
                      placeholder="MM/AA" 
                      maxLength={5}
                      required
                      value={expiry}
                      onChange={handleExpiryChange}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 sm:text-sm font-mono text-center transition-colors"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="cvc" className="flex justify-between items-center text-sm font-medium text-gray-700 mb-1">
                      CVC
                      <Info className="h-4 w-4 text-gray-400 cursor-help" title="Code à 3 chiffres au dos" />
                    </label>
                    <input 
                      type="text" 
                      id="cvc" 
                      placeholder="123" 
                      maxLength={4}
                      required
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 sm:text-sm font-mono text-center transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bouton de soumission */}
            <div className="mt-8">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-lg shadow-md text-base font-bold text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span>Traitement...</span>
                    <div className="w-5 h-5 ml-2 border-2 border-white border-b-transparent rounded-full animate-spin"></div>
                  </>
                ) : (
                  <span>Payer {amount.toLocaleString('fr-FR')} FCFA</span>
                )}
              </button>
            </div>
          </form>

            </motion.div>
          )}
          </AnimatePresence>

        </div>
      </div>

      {/* Section Support Global (Bas de page principal) */}
      <div className="mt-8 mb-4 text-center z-10">
        <p className="text-sm text-gray-500 mb-3">Besoin d'aide ? Contactez-nous</p>
        <div className="flex justify-center space-x-6">
          <a href={adminWhatsapp} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-green-500 hover:bg-green-50 transition-colors" title="WhatsApp">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
          </a>
          <a href={adminEmail} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors" title="Email">
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Tiny Admin Lock */}
      <div 
        className="absolute bottom-2 right-2 p-2 cursor-pointer z-50 text-gray-300 hover:text-gray-400 transition-colors"
        onClick={() => setShowPinModal(true)}
      >
        <Lock className="w-3 h-3 opacity-30" />
      </div>

      {/* Modals */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in duration-200">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold text-gray-800">Accès Administrateur</h3>
              <button onClick={() => setShowPinModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handlePinSubmit} className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Code PIN</label>
              <input 
                type="password" 
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 mb-4 text-center tracking-[0.5em] font-mono text-lg outline-none"
                autoFocus
                placeholder="••••"
              />
              <button type="submit" className="w-full bg-gray-800 text-white font-medium py-2 rounded-lg hover:bg-gray-900 transition-colors">
                Valider
              </button>
            </form>
          </div>
        </div>
      )}

      {showAdminPanel && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50 sticky top-0 z-10">
              <h3 className="font-semibold text-gray-800">Espace Administrateur</h3>
              <button onClick={() => setShowAdminPanel(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6">
              <h4 className="font-semibold text-gray-800 mb-4 border-b pb-2">Paramètres de Contact</h4>
              <form onSubmit={handleSaveSettings} className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lien WhatsApp</label>
                  <input 
                    type="url" 
                    value={adminWhatsapp}
                    onChange={(e) => setAdminWhatsapp(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 text-sm outline-none"
                    placeholder="https://wa.me/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lien Email</label>
                  <input 
                    type="text" 
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 text-sm outline-none"
                    placeholder="mailto:contact@exemple.com"
                  />
                </div>
                <button type="submit" className="w-full bg-pink-600 text-white font-medium py-2.5 rounded-lg hover:bg-pink-700 transition-colors mt-2">
                  Enregistrer les modifications
                </button>
              </form>

              <h4 className="font-semibold text-gray-800 mb-4 border-b pb-2">Transactions Récentes</h4>
              {recentTransactions.length === 0 ? (
                <p className="text-sm text-gray-500 italic">Aucune transaction pour le moment.</p>
              ) : (
                <ul className="space-y-3">
                  {recentTransactions.map((tx, idx) => (
                    <li key={idx} className={`p-3 rounded-lg border text-sm flex flex-col gap-1 ${tx.status === 'success' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                      <div className="flex justify-between items-center font-medium">
                        <span className={tx.status === 'success' ? 'text-green-700' : 'text-red-700'}>
                          {tx.status === 'success' ? 'Succès' : 'Échec'}
                        </span>
                        <span className="text-gray-600">{new Date(tx.date).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <div className="flex justify-between items-center text-gray-600 text-xs mt-1">
                        <span className="uppercase">{tx.method}</span>
                        <span className="font-semibold text-gray-800">{tx.amount?.toLocaleString('fr-FR')} {tx.currency || "FCFA"}</span>
                      </div>
                      {tx.note && <span className="text-gray-500 text-xs italic mt-1 text-right">{tx.note}</span>}
                      {tx.error && <span className="text-red-500 text-xs mt-1">{tx.error}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

