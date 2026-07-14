import React, { useState, useEffect, useMemo } from "react";
import {
  Search, ShoppingCart, Package, User, LogOut, Plus, Minus, Trash2,
  ClipboardList, LayoutGrid, ShieldCheck, X, ChevronRight, Truck, Check
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Design tokens                                                      */
/*  Subject: wholesale auto-parts trading terminal (Kyrgyzstan).       */
/*  Palette: steel blue + amber (workshop/industrial), off-white base. */
/* ------------------------------------------------------------------ */
const COLORS = {
  bg: "#F2F4F7",
  panel: "#FFFFFF",
  ink: "#1B222C",
  inkSoft: "#5B6472",
  steel: "#154D8B",
  steelDark: "#0D3B6E",
  amber: "#FF7A30",
  amberDark: "#E5661F",
  line: "#E2E6EC",
  danger: "#C1443B",
  success: "#2F9E58",
};

const BRAND = "ЗапчастOpt";
const LOCATION_TEXT = "Бишкек, Борбордук кеңсе";
const PHONE_TEXT = "+996 (555) 00-00-00";
const HOURS_TEXT = "Дш-Жм 9:00 - 18:00, Иш, Жш - дем алыш";

const SIDEBAR_CATEGORIES = [
  "Автокресла и бустеры", "Автоодеяла", "АКБ", "Антисептики", "Аптечки медицинские",
  "Aреометры", "Ароматизаторы", "Аэрозоли для быстрого старта", "Батарейки",
  "Бокорезы и кусачки", "Бытовая химия", "Брызговики универсальные", "Вентили (для бескамерных шин)",
  "Видеорегистраторы", "Вилки нагрузочные", "Воронки", "Герметики", "Головки торцевые",
  "Гофры глушителя", "Грузики (для балансировки)", "Диски колёсные", "Домкраты",
  "Дистиллированная вода", "Жидкости AdBlue", "Жидкости амортизаторные", "Жидкости охлаждающие",
  "Жидкости стеклоомыв.", "Жидкости тормозные", "Жилеты светоотражающ.", "Знаки аварийные",
];

/* ------------------------------------------------------------------ */
/*  Mock catalog seed                                                   */
/* ------------------------------------------------------------------ */
const CATEGORIES = ["Баары", "Автокресла и бустеры", "Тормоз тутуму", "Кыймылдаткыч", "Майлар", "Фильтрлер", "Электрика", "Асма (подвеска)"];

const SEED_PRODUCTS = [
  { 
    id: "p16", 
    name: "Детское автокресло Siger МЯКИШ (көк)", 
    brand: "Siger", 
    model: "Бустер Группа 3 (22-36 кг)", 
    category: "Автокресла и бустеры", 
    price: 1339, 
    stock: 12, 
    sku: "KRES0017",
    image: "https://images.unsplash.com/photo-1595155604144-ec8f3883a48e?auto=format&fit=crop&q=80&w=300"
  },
  { 
    id: "p17", 
    name: "Детское автокресло Siger МЯКИШ (кызыл)", 
    brand: "Siger", 
    model: "Бустер Группа 3 (22-36 кг)", 
    category: "Автокресла и бустеры", 
    price: 1389, 
    stock: 8, 
    sku: "KRES0023",
    image: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&q=80&w=300"
  },
  { 
    id: "p1", 
    name: "Тормоз колодкасы (алдыңкы)", 
    brand: "TRW", 
    model: "Toyota Camry", 
    category: "Тормоз тутуму", 
    price: 1450, 
    stock: 34, 
    sku: "TRW-4501",
    image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=300"
  },
  { 
    id: "p2", 
    name: "Тормоз дискасы", 
    brand: "Brembo", 
    model: "Hyundai Solaris", 
    category: "Тормоз тутуму", 
    price: 2100, 
    stock: 18, 
    sku: "BRM-2290",
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=300"
  },
  { 
    id: "p3", 
    name: "Майлоочу май 5W-30 (4л)", 
    brand: "Mobil 1", 
    model: "Универсал", 
    category: "Майлар", 
    price: 3200, 
    stock: 60, 
    sku: "MOB-5304",
    image: "https://images.unsplash.com/photo-1635843343482-1262ab00609b?auto=format&fit=crop&q=80&w=300"
  },
  { 
    id: "p4", 
    name: "Май фильтри", 
    brand: "Mann", 
    model: "VAG тобу", 
    category: "Фильтрлер", 
    price: 420, 
    stock: 120, 
    sku: "MNN-0071",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=300"
  },
  { 
    id: "p5", 
    name: "Аба фильтри", 
    brand: "Bosch", 
    model: "Kia Rio", 
    category: "Фильтрлер", 
    price: 610, 
    stock: 75, 
    sku: "BSH-1123",
    image: "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?auto=format&fit=crop&q=80&w=300"
  },
  { 
    id: "p6", 
    name: "Свеча (кубик)", 
    brand: "NGK", 
    model: "Универсал", 
    category: "Электрика", 
    price: 380, 
    stock: 200, 
    sku: "NGK-6612",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=300"
  },
  { 
    id: "p7", 
    name: "Аккумулятор 60Ah", 
    brand: "Bosch", 
    model: "Универсал", 
    category: "Электрика", 
    price: 6800, 
    stock: 22, 
    sku: "BSH-BAT60", 
    featured: true,
    image: "https://images.unsplash.com/photo-1620912189866-474843ba5c14?auto=format&fit=crop&q=80&w=300"
  },
];

/* ------------------------------------------------------------------ */
/*  Storage helpers                                                   */
/* ------------------------------------------------------------------ */
async function storageGet(key, shared = false) {
  try {
    const res = localStorage.getItem(key);
    return res ? JSON.parse(res) : null;
  } catch {
    return null;
  }
}

async function storageSet(key, value, shared = false) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("storage set failed", e);
  }
}

function money(n) {
  return n.toLocaleString("ru-RU") + " сом";
}

/* ------------------------------------------------------------------ */
/*  Root App                                                            */
/* ------------------------------------------------------------------ */
export default function App() {
  const [booted, setBooted] = useState(false);
  const [products, setProducts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); 
  const [authMode, setAuthMode] = useState("login"); 
  const [view, setView] = useState("catalog"); 
  const [cart, setCart] = useState({}); 
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    (async () => {
      let p = await storageGet("products", true);
      if (!p || p.length < 10) { // Жаңы өзгөрүүлөр кирүүсү үчүн шарт
        p = SEED_PRODUCTS;
        await storageSet("products", p, true);
      }
      setProducts(p);
      setBooted(true);
    })();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  async function loadUserData(username) {
    const c = (await storageGet(`cart:${username}`, false)) || {};
    const o = (await storageGet(`orders:${username}`, false)) || [];
    setCart(c);
    setOrders(o);
  }

  async function handleLogin(username, password) {
    const users = (await storageGet("users", true)) || {};
    if (username === "admin" && password === "admin123" && !users["admin"]) {
      users["admin"] = { password: "admin123", isAdmin: true };
      await storageSet("users", users, true);
    }
    const rec = users[username];
    if (!rec || rec.password !== password) {
      setToast({ type: "error", text: "Логин же сырсөз туура эмес" });
      return;
    }
    setCurrentUser({ username, isAdmin: !!rec.isAdmin });
    await loadUserData(username);
    setView("catalog");
    setToast({ type: "success", text: `Кош келиңиз, ${username}!` });
  }

  async function handleRegister(username, password) {
    if (!username || !password) {
      setToast({ type: "error", text: "Barsyk talaalardy tolturunuz" });
      return;
    }
    const users = (await storageGet("users", true)) || {};
    if (users[username]) {
      setToast({ type: "error", text: "Бул колдонуучу мурунтан бар" });
      return;
    }
    users[username] = { password, isAdmin: false };
    await storageSet("users", users, true);
    setCurrentUser({ username, isAdmin: false });
    await loadUserData(username);
    setView("catalog");
    setToast({ type: "success", text: "Каттоо ийгиликтүү өттү!" });
  }

  function handleLogout() {
    setCurrentUser(null);
    setCart({});
    setOrders([]);
    setView("catalog");
  }

  function handleGuest() {
    setCurrentUser({ username: "Конок", isAdmin: false, isGuest: true });
    setCart({});
    setOrders([]);
    setView("catalog");
    setToast({ type: "success", text: "Конок катары кирдиңиз" });
  }

  async function addToCart(productId, qty = 1) {
    const next = { ...cart, [productId]: (cart[productId] || 0) + qty };
    setCart(next);
    await storageSet(`cart:${currentUser.username}`, next, false);
    setToast({ type: "success", text: "Себетке кошулду" });
  }

  async function updateCartQty(productId, qty) {
    const next = { ...cart };
    if (qty <= 0) delete next[productId];
    else next[productId] = qty;
    setCart(next);
    await storageSet(`cart:${currentUser.username}`, next, false);
  }

  async function placeOrder() {
    const items = Object.entries(cart).map(([id, qty]) => {
      const p = products.find((x) => x.id === id);
      return { id, name: p?.name, sku: p?.sku, price: p?.price, qty };
    });
    if (items.length === 0) return;
    const total = items.reduce((s, i) => s + i.price * i.qty, 0);
    const order = {
      id: "ORD-" + Date.now().toString().slice(-8),
      date: new Date().toLocaleString("ru-RU"),
      items,
      total,
      status: "Кабыл алынды",
    };
    const nextOrders = [order, ...orders];
    setOrders(nextOrders);
    await storageSet(`orders:${currentUser.username}`, nextOrders, false);
    setCart({});
    await storageSet(`cart:${currentUser.username}`, {}, false);
    setView("orders");
    setToast({ type: "success", text: `Буйрутма №${order.id} түзүлдү` });
  }

  async function saveProducts(next) {
    setProducts(next);
    await storageSet("products", next, true);
  }

  const cartCount = useMemo(() => Object.values(cart).reduce((a, b) => a + b, 0), [cart]);
  const cartTotal = useMemo(
    () => Object.entries(cart).reduce((s, [id, qty]) => {
      const p = products.find((x) => x.id === id);
      return s + (p ? p.price * qty : 0);
    }, 0),
    [cart, products]
  );

  if (!booted) {
    return (
      <div style={{ background: COLORS.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", color: COLORS.inkSoft }}>
        Жүктөлүүдө…
      </div>
    );
  }

  if (!currentUser) {
    return (
      <AuthScreen
        mode={authMode}
        setMode={setAuthMode}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onGuest={handleGuest}
        toast={toast}
      />
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "Inter, sans-serif", color: COLORS.ink }}>
      <style>{`
        * { box-sizing: border-box; }
        button { font-family: inherit; cursor: pointer; }
        input, select { font-family: inherit; }
        ::selection { background: ${COLORS.amber}55; }
      `}</style>

      <TopBar
        user={currentUser}
        view={view}
        setView={setView}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onLogout={handleLogout}
        query={query}
        setQuery={setQuery}
      />

      <main style={{ maxWidth: 1180, margin: "0 auto", padding: "28px 20px 80px" }}>
        {view === "catalog" && (
          <Catalog products={products} onAdd={addToCart} query={query} setQuery={setQuery} />
        )}
        {view === "cart" && (
          <CartView
            cart={cart}
            products={products}
            onUpdateQty={updateCartQty}
            onCheckout={placeOrder}
          />
        )}
        {view === "orders" && <OrdersView orders={orders} />}
        {view === "admin" && currentUser.isAdmin && (
          <AdminPanel products={products} onSave={saveProducts} />
        )}
      </main>

      {toast && <Toast toast={toast} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Auth Screen                                                         */
/* ------------------------------------------------------------------ */
function AuthScreen({ mode, setMode, onLogin, onRegister, onGuest, toast }) {
  const [loginType, setLoginType] = useState("login"); 
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [showAgreeWarn, setShowAgreeWarn] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (!agree) {
      setShowAgreeWarn(true);
      return;
    }
    const id = loginType === "login" ? username.trim() : phone.trim();
    if (mode === "login") onLogin(id, password);
    else onRegister(id, password);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "Inter, sans-serif", background: `linear-gradient(135deg, ${COLORS.steelDark} 0%, ${COLORS.steel} 60%)` }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 64px", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: COLORS.amber, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Truck size={22} color={COLORS.steelDark} />
          </div>
          <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>{BRAND}</span>
        </div>
        <h1 style={{ fontSize: 42, lineHeight: 1.15, fontWeight: 800, maxWidth: 460, letterSpacing: -1 }}>
          Автозапчастарды <span style={{ color: COLORS.amber }}>көтөрмө</span> баада тапшыруу терминалы
        </h1>
        <p style={{ marginTop: 20, maxWidth: 420, color: "#C7D0DC", fontSize: 15, lineHeight: 1.6 }}>
          Кыргызстандагы автосервистер жана дүкөндөр үчүн: реалдуу убакыттагы калдык, тез буйрутма жана толук тарых бир жерде.
        </p>
        <div style={{ display: "flex", gap: 28, marginTop: 48 }}>
          {[["1500+", "SKU каталогдо"], ["24 саат", "Буйрутма иштетүү"], ["30+", "Бренддер"]].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontSize: 24, fontWeight: 800, color: COLORS.amber }}>{n}</div>
              <div style={{ fontSize: 12.5, color: "#9FADBE" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ width: 440, background: COLORS.panel, display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 48px" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 20, background: COLORS.bg, padding: 4, borderRadius: 10 }}>
          {["login", "register"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1,
                padding: "10px 0",
                border: "none",
                borderRadius: 7,
                fontWeight: 700,
                fontSize: 13.5,
                background: mode === m ? COLORS.panel : "transparent",
                color: mode === m ? COLORS.steel : COLORS.inkSoft,
                boxShadow: mode === m ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {m === "login" ? "Вход" : "Регистрация"}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 18, marginBottom: 20, borderBottom: `1px solid ${COLORS.line}` }}>
          {[["login", "По логину"], ["phone", "По телефону"]].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setLoginType(key)}
              style={{
                border: "none",
                background: "transparent",
                padding: "0 0 10px 0",
                fontWeight: 700,
                fontSize: 13.5,
                color: loginType === key ? COLORS.steel : COLORS.inkSoft,
                borderBottom: loginType === key ? `2px solid ${COLORS.amber}` : "2px solid transparent",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {loginType === "login" ? (
            <Field label="Логин">
              <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="mekanik_75" style={inputStyle} required />
            </Field>
          ) : (
            <Field label="Телефон">
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+996 700 000 000" style={inputStyle} required />
            </Field>
          )}
          <Field label="Пароль">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle} required />
          </Field>

          <label style={{ display: "flex", gap: 9, alignItems: "flex-start", fontSize: 11.5, color: COLORS.inkSoft, lineHeight: 1.5, cursor: "pointer" }}>
            <input type="checkbox" checked={agree} onChange={(e) => { setAgree(e.target.checked); setShowAgreeWarn(false); }} style={{ marginTop: 2 }} />
            <span>
              Мен жеке маалыматтарымды иштетүүгө макулмун жана <a href="#" onClick={(e) => e.preventDefault()} style={{ color: COLORS.steel, fontWeight: 700 }}>Купуялык саясаты</a> менен таанышып чыктым
            </span>
          </label>
          {showAgreeWarn && <div style={{ fontSize: 12, color: COLORS.danger, fontWeight: 600, marginTop: -8 }}>Улантуу үчүн макулдук белгисин коюңуз</div>}

          <button type="submit" style={{ marginTop: 2, padding: "13px 0", borderRadius: 9, border: "none", background: COLORS.amber, color: "#fff", fontWeight: 800, fontSize: 14.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {mode === "login" ? "Войти" : "Катталуу"} <ChevronRight size={17} />
          </button>

          {mode === "login" && (
            <button type="button" onClick={onGuest} style={{ padding: "12px 0", borderRadius: 9, border: `1.5px solid ${COLORS.line}`, background: "transparent", color: COLORS.steel, fontWeight: 700, fontSize: 13.5 }}>
              Войти как гость
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5, fontWeight: 700, color: COLORS.inkSoft }}>
      {label}
      {children}
    </label>
  );
}

const inputStyle = {
  padding: "11px 13px",
  borderRadius: 9,
  border: `1.5px solid ${COLORS.line}`,
  fontSize: 14,
  outline: "none",
  color: COLORS.ink,
};

/* ------------------------------------------------------------------ */
/*  Top bar / nav                                                       */
/* ------------------------------------------------------------------ */
function TopBar({ user, view, setView, cartCount, cartTotal, onLogout, query, setQuery }) {
  const navItem = (key, label, Icon, badge) => (
    <button
      onClick={() => setView(key)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding: "8px 14px",
        borderRadius: 8,
        border: "none",
        background: view === key ? COLORS.steel : "transparent",
        color: view === key ? "#fff" : COLORS.inkSoft,
        fontWeight: 700,
        fontSize: 13.5,
                position: "relative",
      }}
    >
      <Icon size={16} /> {label}
      {badge > 0 && (
        <span style={{ position: "absolute", top: -6, right: -6, background: COLORS.amber, color: "#fff", borderRadius: 999, fontSize: 10.5, fontWeight: 800, width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {badge}
        </span>
      )}
    </button>
  );

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 10 }}>
      <div style={{ background: COLORS.steelDark, color: "#D9E4F2", fontSize: 12.5 }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "7px 20px", display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
          <span>📍 {LOCATION_TEXT}</span>
          <span>📞 {PHONE_TEXT}</span>
          <span>🕒 {HOURS_TEXT}</span>
        </div>
      </div>

      <div style={{ background: COLORS.steel, padding: "14px 20px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: COLORS.amber, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Truck size={19} color="#fff" />
            </div>
            <div style={{ lineHeight: 1.15 }}>
              <div style={{ fontWeight: 800, fontSize: 17, color: "#fff", letterSpacing: -0.4 }}>{BRAND}</div>
              <div style={{ fontSize: 10.5, color: "#B9CBE4" }}>Автозапчастар маалымат системасы</div>
            </div>
          </div>

          <div style={{ flex: 1, position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: 14, top: 12, color: COLORS.inkSoft }} />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setView("catalog"); }}
              placeholder="Артикул же деталдын номери боюнча издөө..."
              style={{ width: "100%", padding: "10px 14px 10px 38px", borderRadius: 8, border: "none", fontSize: 13.5, outline: "none" }}
            />
          </div>

          <button onClick={() => setView("cart")} style={{ display: "flex", alignItems: "center", gap: 10, border: "none", background: "transparent", color: "#fff", flexShrink: 0 }}>
            <div style={{ position: "relative" }}>
              <ShoppingCart size={22} />
              <span style={{ position: "absolute", top: -8, right: -8, background: COLORS.amber, color: "#fff", borderRadius: 999, fontSize: 10, fontWeight: 800, width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {cartCount}
              </span>
            </div>
            <div style={{ textAlign: "left", lineHeight: 1.2 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 0.4 }}>СЕБЕТ</div>
              <div style={{ fontSize: 13, fontWeight: 800 }}>{money(cartTotal)}</div>
            </div>
          </button>
        </div>
      </div>

      <div style={{ background: COLORS.panel, borderBottom: `1px solid ${COLORS.line}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <nav style={{ display: "flex", gap: 4 }}>
            {navItem("catalog", "Каталог", LayoutGrid)}
            {navItem("cart", "Себет", ShoppingCart, cartCount)}
            {navItem("orders", "Буйрутмаларым", ClipboardList)}
            {user.isAdmin && navItem("admin", "Админ", ShieldCheck)}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: COLORS.inkSoft, fontWeight: 600 }}>
              <User size={15} /> {user.username}
            </div>
            <button onClick={onLogout} title="Чыгуу" style={{ border: "none", background: COLORS.bg, borderRadius: 8, padding: 8, color: COLORS.inkSoft }}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Catalog                                                             */
/* ------------------------------------------------------------------ */
function Catalog({ products, onAdd, query, setQuery }) {
  const [category, setCategory] = useState("Баары");

  const filtered = products.filter((p) => {
    const matchesCat = category === "Баары" || p.category === category;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.model.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  return (
    <div style={{ display: "flex", gap: 22, alignItems: "flex-start" }}>
      <aside style={{ width: 240, flexShrink: 0, background: COLORS.panel, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: "16px 18px", position: "sticky", top: 210, maxHeight: "calc(100vh - 240px)", overflowY: "auto" }}>
        <div style={{ fontWeight: 800, fontSize: 13, letterSpacing: 0.4, color: COLORS.steel, marginBottom: 10 }}>КАТАЛОГДОР</div>
        <div onClick={() => setCategory("Баары")} style={{ fontSize: 12.5, padding: "4px 0", cursor: "pointer", fontWeight: category === "Баары" ? 800 : 500, color: category === "Баары" ? COLORS.amber : COLORS.steel }}>
          - Баары
        </div>
        {CATEGORIES.slice(1).map((c) => (
          <div key={c} onClick={() => setCategory(c)} style={{ fontSize: 12.5, padding: "4px 0", cursor: "pointer", fontWeight: category === c ? 800 : 500, color: category === c ? COLORS.amber : COLORS.steel }}>
            - {c}
          </div>
        ))}
        <div style={{ height: 1, background: COLORS.line, margin: "10px 0" }} />
        {SIDEBAR_CATEGORIES.map((c) => (
          <div key={c} onClick={() => setCategory(c)} style={{ fontSize: 12.5, padding: "4px 0", color: COLORS.steel, cursor: "pointer", opacity: category === c ? 1 : 0.75, fontWeight: category === c ? 800 : 500 }}>- {c}</div>
        ))}
      </aside>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
          {filtered.map((p) => (
            <div key={p.id} style={{ background: COLORS.panel, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 8, justifyContent: "space-between" }}>
              <div>
                {/* Товардын Сүрөтү (Image Container) */}
                <div style={{ width: "100%", height: 150, background: "#F8FAFC", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", marginBottom: 10, border: "1px solid #F1F5F9" }}>
                  {p.image ? (
                    <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 6 }} />
                  ) : (
                    <span style={{ fontSize: 12, color: COLORS.inkSoft }}>Сүрөтү жок</span>
                  )}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: COLORS.amberDark, background: "#FCF1DE", padding: "3px 8px", borderRadius: 6, maxWdith: "70%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.category}</span>
                  {p.featured && <span style={{ fontSize: 10.5, fontWeight: 800, color: COLORS.steel }}>★ ТОП</span>}
                </div>
                
                <div style={{ window: "700", fontWeight: 700, fontSize: 14, color: COLORS.ink, lineHeight: 1.3, minHeight: 36, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontSize: 12.5, color: COLORS.inkSoft, marginBottom: 2 }}>{p.brand} · {p.model}</div>
                <div style={{ fontSize: 11, color: COLORS.inkSoft, marginBottom: 6 }}>Артикул: {p.sku}</div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6, borderTop: `1px solid ${COLORS.line}`, paddingTop: 8 }}>
                  <span style={{ fontWeight: 800, fontSize: 15, color: COLORS.steel }}>{money(p.price)}</span>
                  <span style={{ fontSize: 11.5, color: p.stock > 10 ? COLORS.success : COLORS.danger, fontWeight: 700 }}>
                    {p.stock > 10 ? `Складда: ${p.stock}` : `Аз калды: ${p.stock}`}
                  </span>
                </div>
                <button
                  onClick={() => onAdd(p.id)}
                  style={{ width: "100%", marginTop: 10, padding: "9px 0", borderRadius: 8, border: "none", background: COLORS.steel, color: "#fff", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                >
                  <Plus size={15} /> Себетке кошуу
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 40, color: COLORS.inkSoft }}>
              Эч нерсе табылган жок. Издөөнү өзгөртүп көрүңүз.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Cart View                                                            */
/* ------------------------------------------------------------------ */
function CartView({ cart, products, onUpdateQty, onCheckout }) {
  const items = Object.entries(cart).map(([id, qty]) => ({ product: products.find((p) => p.id === id), qty })).filter((i) => i.product);
  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0);

  if (items.length === 0) {
    return (
      <EmptyState icon={ShoppingCart} title="Себет бош" text="Каталогдон керектүү бөлүктөрдү тандап, себетке кошуңуз." />
    );
  }

  return (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
      <div style={{ flex: 2, minWidth: 320, display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map(({ product, qty }) => (
          <div key={product.id} style={{ background: COLORS.panel, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: 14, display: "flex", alignItems: "center", gap: 14 }}>
            {/* Себеттеги кичинекей сүрөт */}
            <div style={{ width: 50, height: 50, background: "#F8FAFC", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "1px solid #E2E6EC", flexShrink: 0 }}>
              {product.image ? (
                <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 2 }} />
              ) : (
                <Package size={18} color={COLORS.inkSoft} />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14.5 }}>{product.name}</div>
              <div style={{ fontSize: 12, color: COLORS.inkSoft }}>{product.brand} · {product.model} · {product.sku}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: COLORS.bg, borderRadius: 8, padding: "4px 8px" }}>
              <button onClick={() => onUpdateQty(product.id, qty - 1)} style={iconBtn}><Minus size={13} /></button>
              <span style={{ fontWeight: 700, minWidth: 20, textAlign: "center" }}>{qty}</span>
              <button onClick={() => onUpdateQty(product.id, qty + 1)} style={iconBtn}><Plus size={13} /></button>
            </div>
            <div style={{ fontWeight: 800, minWidth: 90, textAlign: "right", color: COLORS.steel }}>
              {money(product.price * qty)}
            </div>
            <button onClick={() => onUpdateQty(product.id, 0)} style={{ border: "none", background: "transparent", color: COLORS.danger }}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, minWidth: 280, background: COLORS.panel, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: 20 }}>
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 14 }}>Буйрутманы тастыктоо</div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 14, color: COLORS.inkSoft }}>
          <span>Товардын түрү:</span>
          <span>{items.length}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, fontSize: 15, fontWeight: 800 }}>
          <span>Жалпы суммасы:</span>
          <span style={{ color: COLORS.amberDark, fontSize: 18 }}>{money(total)}</span>
        </div>
        <button onClick={onCheckout} style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: "none", background: COLORS.amber, color: "#fff", fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          Буйрутма берүү <Check size={16} />
        </button>
      </div>
    </div>
  );
}

const iconBtn = { border: "none", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, color: COLORS.inkSoft };

/* ------------------------------------------------------------------ */
/*  Orders View                                                          */
/* ------------------------------------------------------------------ */
function OrdersView({ orders }) {
  if (orders.length === 0) {
    return <EmptyState icon={ClipboardList} title="Буйрутмалар жок" text="Сиз азырынча буйрутма бере элексиз." />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Менин буйрутмаларым</h2>
      {orders.map((o) => (
        <div key={o.id} style={{ background: COLORS.panel, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${COLORS.line}`, paddingBottom: 10, marginBottom: 12 }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: COLORS.steel }}>Буйрутма #{o.id}</div>
            <div style={{ fontSize: 13, color: COLORS.inkSoft }}>{o.date}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {o.items.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5 }}>
                <span>{item.name} <span style={{ color: COLORS.inkSoft }}>x{item.qty}</span></span>
                <span style={{ fontWeight: 700 }}>{money(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${COLORS.line}`, marginTop: 12, paddingTop: 10 }}>
            <div>
              <span style={{ fontSize: 12, color: COLORS.inkSoft }}>Статус: </span>
              <span style={{ fontSize: 12.5, fontWeight: 800, color: COLORS.success }}>{o.status}</span>
            </div>
            <div style={{ fontWeight: 800, fontSize: 16, color: COLORS.amberDark }}>{money(o.total)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Admin Panel                                                         */
/* ------------------------------------------------------------------ */
function AdminPanel({ products, onSave }) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [category, setCategory] = useState("Тормоз тутуму");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [sku, setSku] = useState("");
  const [image, setImage] = useState("");

  function addProduct(e) {
    e.preventDefault();
    if (!name || !price || !stock || !sku) return;
    const newP = {
      id: "p-" + Date.now(),
      name, brand, model, category,
      price: Number(price),
      stock: Number(stock),
      sku,
      image: image || "https://images.unsplash.com/photo-1595155604144-ec8f3883a48e?auto=format&fit=crop&q=80&w=300"
    };
    onSave([newP, ...products]);
    setName(""); setBrand(""); setModel(""); setPrice(""); setStock(""); setSku(""); setImage("");
  }

  return (
    <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, color: COLORS.steel }}>Жаңы товар кошуу (Админ)</h2>
      <form onSubmit={addProduct} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="Товардын аталышы *">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Детское автокресло..." style={inputStyle} required />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Бренд">
            <input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Siger" style={inputStyle} />
          </Field>
          <Field label="Модель / Тиби">
            <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Группа 3" style={inputStyle} />
          </Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Категория">
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
              {CATEGORIES.slice(1).map((c) => <option key={c} value={c}>{c}</option>)}
              {SIDEBAR_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Артикул *">
            <input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="KRES-001" style={inputStyle} required />
          </Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Баасы (сом) *">
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="1500" style={inputStyle} required />
          </Field>
          <Field label="Складдагы саны *">
            <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="10" style={inputStyle} required />
          </Field>
        </div>
        <Field label="Сүрөттүн шилтемеси (URL)">
          <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." style={inputStyle} />
        </Field>
        <button type="submit" style={{ marginTop: 10, padding: "12px 0", borderRadius: 8, border: "none", background: COLORS.amber, color: "#fff", fontWeight: 800, fontSize: 14 }}>
          Каталогго кошуу
        </button>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty State & Toast                                                 */
/* ------------------------------------------------------------------ */
function EmptyState({ icon: Icon, title, text }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px", background: COLORS.panel, borderRadius: 12, border: `1px solid ${COLORS.line}`, maxWidth: 500, margin: "40px auto" }}>
      <div style={{ width: 56, height: 56, borderRadius: 99, background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: COLORS.steel }}><Icon size={24} /></div>
      <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>{title}</h3>
      <p style={{ fontSize: 13, color: COLORS.inkSoft, lineHeight: 1.5 }}>{text}</p>
    </div>
  );
}

function Toast({ toast }) {
  const isErr = toast.type === "error";
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, background: isErr ? COLORS.danger : COLORS.steelDark, color: "#fff", padding: "12px 20px", borderRadius: 10, fontWeight: 700, fontSize: 13.5, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", gap: 10, zIndex: 999 }}>
      {!isErr && <Check size={16} color={COLORS.amber} />}
      {toast.text}
    </div>
  );
}