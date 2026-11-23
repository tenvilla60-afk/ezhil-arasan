import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import {
  AutomationTask,
  BusinessCustomer,
  CartItem,
  DivisionId,
  PageId,
  PaymentOrder,
  PlanTier,
  PRICING_PLANS,
  ProductItem,
  UserProfile,
} from '../types/platform';

export interface ScannerCheckoutPayload {
  orderType: 'merchandise' | 'subscription';
  itemSummary: string;
  totalAmount: number;
  planToActivate?: PlanTier;
  requiresAddress?: boolean;
}

interface PlatformContextValue {
  currentPage: PageId;
  navigate: (page: PageId) => void;
  authUser: User | null;
  authReady: boolean;
  profile: UserProfile | null;
  automations: AutomationTask[];
  customers: BusinessCustomer[];
  orders: PaymentOrder[];
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: {
    displayName: string;
    phone: string;
    company: string;
    activeServices?: DivisionId[];
  }) => Promise<void>;
  incrementAiCredits: (amount?: number) => Promise<void>;
  createAutomation: (input: {
    title: string;
    category: AutomationTask['category'];
    trigger: string;
  }) => Promise<void>;
  toggleAutomationStatus: (task: AutomationTask, nextStatus: AutomationTask['status']) => Promise<void>;
  deleteAutomation: (id: string) => Promise<void>;
  createBusinessCustomer: (input: {
    name: string;
    email: string;
    company: string;
    stage: BusinessCustomer['stage'];
    monthlyValue: number;
  }) => Promise<void>;
  updateCustomerStage: (customer: BusinessCustomer, stage: BusinessCustomer['stage']) => Promise<void>;
  deleteBusinessCustomer: (id: string) => Promise<void>;
  submitScannerPayment: (input: {
    payload: ScannerCheckoutPayload;
    upiTransactionRef: string;
    payerName: string;
    payerPhone: string;
    shippingAddress: string;
  }) => Promise<string>;
  cart: CartItem[];
  addToCart: (product: ProductItem, size: string) => void;
  updateCartQty: (productId: string, size: string, delta: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  scannerPayload: ScannerCheckoutPayload | null;
  openScannerCheckout: (payload: ScannerCheckoutPayload) => void;
  closeScannerCheckout: () => void;
}

const PlatformContext = createContext<PlatformContextValue | null>(null);

const ALLOWED_DIVISIONS: DivisionId[] = [
  'ai-robot',
  'ai-automation',
  'ai-shopping',
  'ai-business',
  'ai-video',
];

function makeSafeId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now().toString(36)}_${rand}`;
}

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [automations, setAutomations] = useState<AutomationTask[]>([]);
  const [customers, setCustomers] = useState<BusinessCustomer[]>([]);
  const [orders, setOrders] = useState<PaymentOrder[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [scannerPayload, setScannerPayload] = useState<ScannerCheckoutPayload | null>(null);

  const navigate = useCallback((page: PageId) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const ensureUserProfile = useCallback(async (user: User) => {
    const userPath = `users/${user.uid}`;
    const userRef = doc(db, 'users', user.uid);
    try {
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        const displayName = (user.displayName || user.email?.split('@')[0] || 'Enterprise User').slice(0, 100);
        const email = (user.email || 'user@ezaiworld.com').slice(0, 150);
        await setDoc(userRef, {
          uid: user.uid,
          displayName,
          email,
          phone: '',
          company: '',
          plan: 'starter',
          role: 'customer',
          aiCreditsUsed: 0,
          aiCreditsLimit: 2500,
          activeServices: ['ai-robot', 'ai-automation', 'ai-shopping', 'ai-business', 'ai-video'],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, userPath);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthUser(user);
      setAuthReady(true);
      if (user) {
        await ensureUserProfile(user).catch((err) => {
          console.error('Profile initialization error:', err);
        });
      } else {
        setProfile(null);
        setAutomations([]);
        setCustomers([]);
        setOrders([]);
      }
    });
    return () => unsubscribe();
  }, [ensureUserProfile]);

  useEffect(() => {
    if (!authReady || !authUser) return;

    const uid = authUser.uid;
    const profilePath = `users/${uid}`;
    const unsubProfile = onSnapshot(
      doc(db, 'users', uid),
      (snap) => {
        if (snap.exists()) {
          setProfile(snap.data() as UserProfile);
        }
      },
      (err) => handleFirestoreError(err, OperationType.GET, profilePath)
    );

    const autoPath = `users/${uid}/automations`;
    const autoQ = query(
      collection(db, autoPath),
      where('userId', '==', uid),
      orderBy('createdAt', 'desc')
    );
    const unsubAuto = onSnapshot(
      autoQ,
      (snap) => {
        setAutomations(
          snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<AutomationTask, 'id'>) }))
        );
      },
      (err) => handleFirestoreError(err, OperationType.LIST, autoPath)
    );

    const custPath = `users/${uid}/customers`;
    const custQ = query(
      collection(db, custPath),
      where('userId', '==', uid),
      orderBy('createdAt', 'desc')
    );
    const unsubCust = onSnapshot(
      custQ,
      (snap) => {
        setCustomers(
          snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<BusinessCustomer, 'id'>) }))
        );
      },
      (err) => handleFirestoreError(err, OperationType.LIST, custPath)
    );

    const ordPath = `users/${uid}/orders`;
    const ordQ = query(
      collection(db, ordPath),
      where('userId', '==', uid),
      orderBy('createdAt', 'desc')
    );
    const unsubOrders = onSnapshot(
      ordQ,
      (snap) => {
        setOrders(
          snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<PaymentOrder, 'id'>) }))
        );
      },
      (err) => handleFirestoreError(err, OperationType.LIST, ordPath)
    );

    return () => {
      unsubProfile();
      unsubAuto();
      unsubCust();
      unsubOrders();
    };
  }, [authReady, authUser]);

  const signInWithGoogle = useCallback(async () => {
    const res = await signInWithPopup(auth, googleProvider);
    if (res.user) {
      await ensureUserProfile(res.user);
    }
  }, [ensureUserProfile]);

  const logout = useCallback(async () => {
    await signOut(auth);
    setCurrentPage('home');
  }, []);

  const updateUserProfile = useCallback(
    async (updates: {
      displayName: string;
      phone: string;
      company: string;
      activeServices?: DivisionId[];
    }) => {
      if (!authUser) throw new Error('Please sign in first.');
      const path = `users/${authUser.uid}`;
      const services = (updates.activeServices || profile?.activeServices || ALLOWED_DIVISIONS)
        .filter((s) => ALLOWED_DIVISIONS.includes(s))
        .slice(0, 5);
      try {
        await updateDoc(doc(db, 'users', authUser.uid), {
          displayName: updates.displayName.trim().slice(0, 100) || 'Customer',
          phone: updates.phone.trim().slice(0, 30),
          company: updates.company.trim().slice(0, 120),
          activeServices: services,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, path);
      }
    },
    [authUser, profile]
  );

  const incrementAiCredits = useCallback(
    async (amount = 1) => {
      if (!authUser || !profile) return;
      const path = `users/${authUser.uid}`;
      const nextUsed = Math.min(profile.aiCreditsUsed + amount, 10000000);
      try {
        await updateDoc(doc(db, 'users', authUser.uid), {
          aiCreditsUsed: nextUsed,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.warn('Credit telemetry update skipped:', err);
      }
    },
    [authUser, profile]
  );

  const createAutomation = useCallback(
    async (input: { title: string; category: AutomationTask['category']; trigger: string }) => {
      if (!authUser) throw new Error('Sign in required to save workflows.');
      const id = makeSafeId('auto');
      const path = `users/${authUser.uid}/automations/${id}`;
      try {
        await setDoc(doc(db, 'users', authUser.uid, 'automations', id), {
          userId: authUser.uid,
          title: input.title.trim().slice(0, 140),
          category: input.category,
          status: 'active',
          trigger: input.trigger.trim().slice(0, 200),
          runsCount: 1,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, path);
      }
    },
    [authUser]
  );

  const toggleAutomationStatus = useCallback(
    async (task: AutomationTask, nextStatus: AutomationTask['status']) => {
      if (!authUser) return;
      const path = `users/${authUser.uid}/automations/${task.id}`;
      try {
        await updateDoc(doc(db, 'users', authUser.uid, 'automations', task.id), {
          status: nextStatus,
          runsCount: nextStatus === 'active' ? task.runsCount + 1 : task.runsCount,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, path);
      }
    },
    [authUser]
  );

  const deleteAutomation = useCallback(
    async (id: string) => {
      if (!authUser) return;
      const path = `users/${authUser.uid}/automations/${id}`;
      try {
        await deleteDoc(doc(db, 'users', authUser.uid, 'automations', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, path);
      }
    },
    [authUser]
  );

  const createBusinessCustomer = useCallback(
    async (input: {
      name: string;
      email: string;
      company: string;
      stage: BusinessCustomer['stage'];
      monthlyValue: number;
    }) => {
      if (!authUser) throw new Error('Sign in required to save CRM customers.');
      const id = makeSafeId('cust');
      const path = `users/${authUser.uid}/customers/${id}`;
      try {
        await setDoc(doc(db, 'users', authUser.uid, 'customers', id), {
          userId: authUser.uid,
          name: input.name.trim().slice(0, 100),
          email: input.email.trim().slice(0, 150),
          company: input.company.trim().slice(0, 120),
          stage: input.stage,
          monthlyValue: Math.max(0, Math.min(Number(input.monthlyValue) || 0, 10000000)),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, path);
      }
    },
    [authUser]
  );

  const updateCustomerStage = useCallback(
    async (customer: BusinessCustomer, stage: BusinessCustomer['stage']) => {
      if (!authUser) return;
      const path = `users/${authUser.uid}/customers/${customer.id}`;
      try {
        await updateDoc(doc(db, 'users', authUser.uid, 'customers', customer.id), {
          stage,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, path);
      }
    },
    [authUser]
  );

  const deleteBusinessCustomer = useCallback(
    async (id: string) => {
      if (!authUser) return;
      const path = `users/${authUser.uid}/customers/${id}`;
      try {
        await deleteDoc(doc(db, 'users', authUser.uid, 'customers', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, path);
      }
    },
    [authUser]
  );

  const submitScannerPayment = useCallback(
    async (input: {
      payload: ScannerCheckoutPayload;
      upiTransactionRef: string;
      payerName: string;
      payerPhone: string;
      shippingAddress: string;
    }) => {
      if (!authUser) throw new Error('Please sign in with Google to record your scanner payment receipt.');
      const orderId = makeSafeId('ord');
      const path = `users/${authUser.uid}/orders/${orderId}`;
      try {
        await setDoc(doc(db, 'users', authUser.uid, 'orders', orderId), {
          userId: authUser.uid,
          orderType: input.payload.orderType,
          itemSummary: input.payload.itemSummary.trim().slice(0, 300),
          totalAmount: Math.max(0, Number(input.payload.totalAmount) || 0),
          currency: 'INR',
          paymentMethod: 'upi_scanner',
          upiTransactionRef: input.upiTransactionRef.trim().slice(0, 100),
          payerName: input.payerName.trim().slice(0, 100),
          payerPhone: input.payerPhone.trim().slice(0, 30),
          shippingAddress: input.shippingAddress.trim().slice(0, 300),
          status: 'pending_verification',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        if (input.payload.orderType === 'subscription' && input.payload.planToActivate) {
          const planObj = PRICING_PLANS.find((p) => p.id === input.payload.planToActivate);
          if (planObj) {
            await updateDoc(doc(db, 'users', authUser.uid), {
              plan: planObj.id,
              updatedAt: serverTimestamp(),
            });
          }
        }
        return orderId;
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, path);
      }
    },
    [authUser]
  );

  const addToCart = useCallback((product: ProductItem, size: string) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id && i.size === size);
      if (idx >= 0) {
        return prev.map((item, k) =>
          k === idx ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, size, quantity: 1 }];
    });
    setCartOpen(true);
  }, []);

  const updateCartQty = useCallback((productId: string, size: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId && item.size === size
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeFromCart = useCallback((productId: string, size: string) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.size === size)));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const openScannerCheckout = useCallback((payload: ScannerCheckoutPayload) => {
    setScannerPayload(payload);
  }, []);

  const closeScannerCheckout = useCallback(() => {
    setScannerPayload(null);
  }, []);

  return (
    <PlatformContext.Provider
      value={{
        currentPage,
        navigate,
        authUser,
        authReady,
        profile,
        automations,
        customers,
        orders,
        signInWithGoogle,
        logout,
        updateUserProfile,
        incrementAiCredits,
        createAutomation,
        toggleAutomationStatus,
        deleteAutomation,
        createBusinessCustomer,
        updateCustomerStage,
        deleteBusinessCustomer,
        submitScannerPayment,
        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        cartOpen,
        setCartOpen,
        scannerPayload,
        openScannerCheckout,
        closeScannerCheckout,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform(): PlatformContextValue {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error('usePlatform must be used inside PlatformProvider');
  return ctx;
}
