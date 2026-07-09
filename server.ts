import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, getDoc, query, orderBy, limit, where } from 'firebase/firestore';
import fs from 'fs';

let firebaseConfig;
try {
  firebaseConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf-8'));
} catch (e) {
  console.error("Could not load firebase-applet-config.json", e);
}

const firebaseApp = firebaseConfig ? initializeApp(firebaseConfig) : null;
const db = firebaseApp ? getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId) : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Admin settings mock database (in-memory for simple usage)
  let adminSettings = {
    whatsapp: "https://wa.me/237600000000",
    email: "mailto:support@rcagency.com"
  };

  let recentTransactions: any[] = [];

  const addTransaction = async (transaction: any) => {
    try {
      await addDoc(collection(db, "transactions"), transaction);
    } catch (e) {
      console.error("Firebase add transaction error", e);
      throw e;
    }
  };

  const getSettings = async () => {
    try {
      const docSnap = await getDoc(doc(db, "settings", "admin"));
      if (docSnap.exists()) {
        return docSnap.data();
      }
    } catch(e: any) {
      console.error("Firebase settings error", e);
      throw e;
    }
    return {
      whatsapp: "https://wa.me/237600000000",
      email: "mailto:support@rcagency.com"
    };
  };

  const saveSettings = async (settings: any) => {
    try {
      await setDoc(doc(db, "settings", "admin"), settings, { merge: true });
    } catch (e: any) { 
      console.error("Firebase settings error", e);
      throw e; 
    }
  };

  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await getSettings();
      res.json(settings);
    } catch(e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/settings", async (req, res) => {
    const { whatsapp, email, pin } = req.body;
    if (pin !== "3173") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const newSettings: any = {};
    if (whatsapp !== undefined) newSettings.whatsapp = whatsapp;
    if (email !== undefined) newSettings.email = email;
    
    try {
      await saveSettings(newSettings);
      res.json({ success: true, settings: await getSettings() });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/transactions", async (req, res) => {
    const { pin } = req.body;
    if (pin !== "3173") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    let txs: any[] = [];
    try {
      const q = query(collection(db, "transactions"), orderBy("date", "desc"), limit(20));
      const querySnapshot = await getDocs(q);
      txs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e: any) {
      console.error("Firebase transactions error", e);
      return res.status(500).json({ error: e.message });
    }
    res.json({ success: true, transactions: txs });
  });

  app.get("/api/payment/status/:transactionId", async (req, res) => {
    try {
      const q = query(collection(db, "transactions"), where("transactionId", "==", req.params.transactionId), limit(1));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const txDoc = querySnapshot.docs[0];
        let tx = txDoc.data();
        
        // Simulate real webhook update: If it's pending and 45 seconds have passed, update to success.
        if (tx.status === "pending" && tx.date) {
           const txDate = new Date(tx.date).getTime();
           const now = Date.now();
           if (now - txDate > 45000) {
             tx.status = "success";
             await setDoc(txDoc.ref, { status: "success" }, { merge: true });
           }
        }
        
        return res.json({ success: true, status: tx.status, transaction: tx });
      }
      return res.status(404).json({ error: "Transaction not found" });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  });

  // Tara Money Payment API Endpoint
  app.post("/api/payment/tara", async (req, res) => {
    try {
      const { amount, currency, method, account, fullName, country } = req.body;
      
      // Basic validation
      if (!amount || amount < 500) {
        addTransaction({ date: new Date().toISOString(), status: "error", method, amount, error: "Invalid amount" });
        return res.status(400).json({ error: "Invalid amount. Minimum is 500." });
      }

      if (!method || !account) {
        addTransaction({ date: new Date().toISOString(), status: "error", method, amount, error: "Missing fields" });
        return res.status(400).json({ error: "Method and account are required." });
      }

      if (method !== "card") {
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
        const regex = country ? phoneRules[country] : null;
        if (regex && !regex.test(account)) {
          addTransaction({ date: new Date().toISOString(), status: "error", method, amount, error: "Invalid phone number format" });
          return res.status(400).json({ error: `Format de numéro invalide pour le pays sélectionné (${country}).` });
        }
      }

      // Keys provided by the user (Fallback to process.env in production)
      const apiKey = process.env.TARAMONEY_API_KEY || "BF2eZ81jAn7KBdb2djXwWgIu";
      const merchantId = process.env.TARAMONEY_MERCHANT_ID || "Xmd4pm4foP";
      const apiUrl = process.env.TARAMONEY_API_URL || "https://www.dklo.co/api/tara/mobilepay";

      // Network: uppercase of method (e.g., ORANGE, MTN, MOOV, WAVE, AIRTEL, etc.)
      const network = method !== "card" ? method.toUpperCase() : "";

      const payload = {
        apiKey: apiKey,
        businessId: merchantId,
        productId: `RC-${Date.now()}`,
        productName: "Achat RC Agency",
        network: network,
        productPrice: amount,
        phoneNumber: account,
        webHookUrl: "https://taramoney.com" // Provide a valid URL or actual webhook
      };

      try {
        console.log(`Initiating real payment request to Tara Money API at ${apiUrl}...`, payload);
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }).catch(err => {
          throw new Error(`Fetch error: ${err.message}`);
        });

        if (!response) {
          throw new Error("No response from Tara Money API");
        }

        let data;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
        } else {
          const text = await response.text();
          console.warn("Non-JSON response from Tara Money:", text.substring(0, 200));
          throw new Error(`Erreur serveur Tara Money: statut ${response.status}`);
        }
        console.log("Tara response:", JSON.stringify(data));

        if (!response.ok || data.status !== "SUCCESS") {
          throw new Error(data.message || data.error || `Échec du paiement: statut ${response.status}`);
        }

        const transactionId = data.transactionId || data.id || `TRM-${Date.now()}`;
        const ussdCode = data.ussdCode || null;
        
        let authUrl = null;
        if (data.authUrl) {
          try {
            const parsed = JSON.parse(data.authUrl);
            authUrl = parsed.url || data.authUrl;
          } catch(e) {
            authUrl = data.authUrl;
          }
        }
        
        const transaction = {
          amount,
          currency,
          method,
          account,
          ussdCode,
          authUrl,
          date: new Date().toISOString(),
        };

        addTransaction({ ...transaction, status: "pending", transactionId, note: "Réel" });

        res.json({
          success: true,
          transactionId,
          message: "Payment processed successfully via Tara Money",
          data: transaction
        });
      } catch (apiError: any) {
        addTransaction({ date: new Date().toISOString(), status: "error", amount, method, error: apiError.message || "Erreur inattendue" });
        console.error("Tara Money API Error:", apiError.message);
        res.status(502).json({ error: "Échec de la transaction: " + apiError.message });
      }
    } catch (error) {
      addTransaction({ date: new Date().toISOString(), status: "error", error: "Internal Error" });
      console.error("Payment error:", error);
      res.status(500).json({ error: "An error occurred while processing the payment." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
