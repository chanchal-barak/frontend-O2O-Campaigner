import React, { createContext, useContext, useEffect, useState } from 'react';
import { Link, Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { api, formatMoneyPaise, formatMoneyRupees, getBrowserLocation } from './api';

const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);
const cx = (...x) => x.filter(Boolean).join(' ');

function ErrorMessage({ children }) {
    return children ? <div className="alert error" role="alert">{children}</div> : null;
}

function SuccessMessage({ children }) {
    return children ? <div className="alert success" role="status">{children}</div> : null;
}

function Loading({ children = 'Loading…' }) {
    return <div className="loading"><span className="spinner" />{children}</div>;
}

function PageTitle({ eyebrow, title, subtitle, action }) {
    return (
        <div className="page-title">
            <div>
                <div className="eyebrow">{eyebrow}</div>
                <h1>{title}</h1>
                {subtitle && <p>{subtitle}</p>}
            </div>
            {action}
        </div>
    );
}

function Shell({ children }) {
    const { user, logout } = useAuth();

    const links = user?.role === 'merchant'
        ? [
            ['/merchant', 'Overview'],
            ['/merchant/stores', 'My stores'],
            ['/merchant/offers', 'Offers'],
            ['/merchant/billing', 'Billing']
        ]
        : user?.role === 'admin'
            ? [['/admin', 'Admin overview']]
            : [
                ['/customer', 'Discover offers'],
                ['/customer/vouchers', 'My vouchers']
            ];

    return (
        <div className="app-shell">
            <aside className="sidebar">
                <Link to="/" className="brand">
                    <span className="brand-mark">O</span>
                    <span>
                        O2O <b>Campaigner</b>
                        <small>Local offers. Real connections.</small>
                    </span>
                </Link>

                <div className="side-label">WORKSPACE</div>

                <nav>
                    {links.map(([to, label]) => (
                        <NavLink
                            key={to}
                            to={to}
                            end
                            className={({ isActive }) =>
                                cx('nav-link', isActive && 'active')
                            }
                        >
                            <span className="nav-dot" />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-bottom">
                    <div className="profile-chip">
                        <div className="avatar">
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="profile-info">
                            <b>{user?.name || 'User'}</b>
                            <span>{user?.role || 'customer'}</span>
                        </div>
                    </div>

                    <button
                        className="btn btn-quiet btn-full"
                        onClick={logout}
                    >
                        Sign out
                    </button>
                </div>
            </aside>

            <main className="main-area">
                <header className="topbar">
                    <div className="breadcrumb">
                        Workspace <span>/</span> <b>{user?.role || 'Customer'}</b>
                    </div>

                    <div className="topbar-right">
                        <span className="status-pill">
                            <span /> API-connected UI
                        </span>
                        <div className="avatar avatar-small">
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                    </div>
                </header>

                <div className="page-content">{children}</div>
            </main>
        </div>
    );
}

function PublicLayout({ children }) {
    return (
        <div className="public-page">
            <header className="public-nav">
                <Link to="/" className="brand">
                    <span className="brand-mark">O</span>
                    <span>
                        O2O <b>Campaigner</b>
                        <small>Local offers. Real connections.</small>
                    </span>
                </Link>

                <div>
                    <Link className="btn btn-quiet" to="/login">Log in</Link>
                    <Link className="btn btn-primary" to="/register">
                        Get started <span>↗</span>
                    </Link>
                </div>
            </header>

            {children}

            <footer className="public-footer">
                Made for neighbourhood commerce <span>•</span> O2O Campaigner
            </footer>
        </div>
    );
}

function Landing() {
    return (
        <PublicLayout>
            <section className="hero">
                <div className="hero-copy">
                    <div className="eyebrow">
                        <span className="eyebrow-dot" />
                        HYPERLOCAL COMMERCE, REIMAGINED
                    </div>

                    <h1>
                        Great offers are<br />
                        closer than <em>you think.</em>
                    </h1>

                    <p>
                        Discover nearby shops, compare real savings, and claim
                        store-specific digital vouchers. A simpler way for
                        customers and local merchants to connect.
                    </p>

                    <div className="hero-actions">
                        <Link to="/register" className="btn btn-primary btn-lg">
                            Explore local offers <span>→</span>
                        </Link>
                        <Link to="/login" className="text-link">
                            Already have an account ↗
                        </Link>
                    </div>

                    <div className="hero-proof">
                        <div className="proof-avatars">
                            <i>C</i><i>M</i><i>+</i>
                        </div>
                        <span>
                            <b>Built for local communities</b>
                            <small>Discover. Save. Support local.</small>
                        </span>
                    </div>
                </div>

                <div className="hero-art">
                    <div className="art-ring ring-one" />
                    <div className="art-ring ring-two" />
                    <div className="art-tag tag-top"><span>✦</span> Nearby deals</div>

                    <div className="store-illustration">
                        <div className="store-pin">⌖</div>
                        <div className="awning">
                            <i /><i /><i /><i /><i />
                        </div>
                        <div className="store-window">
                            <div /><div />
                        </div>
                        <div className="store-door" />
                    </div>

                    <div className="art-tag tag-left"><span>↗</span> Save more</div>
                    <div className="art-tag tag-right"><span>◎</span> 2 km radius</div>
                    <div className="art-spark spark-a">✳</div>
                    <div className="art-spark spark-b">✦</div>
                </div>
            </section>

            <section className="feature-strip">
                <div>
                    <span className="feature-icon">⌖</span>
                    <b>Discover nearby</b>
                    <small>Offers from local shops</small>
                </div>
                <div>
                    <span className="feature-icon">％</span>
                    <b>Compare savings</b>
                    <small>See beyond big percentages</small>
                </div>
                <div>
                    <span className="feature-icon">▦</span>
                    <b>Digital vouchers</b>
                    <small>Shop-specific redemption</small>
                </div>
                <div>
                    <span className="feature-icon">↗</span>
                    <b>Merchant insights</b>
                    <small>Understand campaign activity</small>
                </div>
            </section>

            <section className="landing-bottom">
                <div>
                    <div className="eyebrow">ONE LOCAL LOOP</div>
                    <h2>
                        From discovery to redemption,<br />
                        all in one place.
                    </h2>
                </div>
                <p>
                    Helping shoppers make informed choices while giving
                    neighbourhood businesses a clearer way to manage offers
                    and review campaign activity.
                </p>
            </section>
        </PublicLayout>
    );
}

function AuthPage({ mode }) {
    const { login, register } = useAuth();
    const nav = useNavigate();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'customer'
    });

    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');

    const set = (k, v) => setForm(s => ({ ...s, [k]: v }));

    async function submit(e) {
        e.preventDefault();
        setBusy(true);
        setError('');

        try {
            if (mode === 'register') {
                await register(form);
                setNotice('Account created. Please log in.');
                nav('/login', { replace: true });
            } else {
                const u = await login(form.email, form.password);

                nav(
                    u.role === 'merchant'
                        ? '/merchant'
                        : u.role === 'admin'
                            ? '/admin'
                            : '/customer',
                    { replace: true }
                );
            }
        } catch (e) {
            setError(e.message);
        } finally {
            setBusy(false);
        }
    }

    return (
        <PublicLayout>
            <div className="auth-wrap">
                <div className="auth-aside">
                    <div className="auth-orbit">⌖</div>
                    <div className="eyebrow">YOUR NEIGHBOURHOOD, CONNECTED</div>
                    <h2>
                        {mode === 'login'
                            ? 'Welcome back.'
                            : 'Your next great deal is nearby.'}
                    </h2>
                    <p>
                        {mode === 'login'
                            ? 'Sign in to discover offers or manage your local store.'
                            : 'Join a local commerce experience built around relevant offers and clear savings.'}
                    </p>
                    <div className="auth-mini-stats">
                        <div><b>2 km</b><span>default discovery</span></div>
                        <div><b>One loop</b><span>claim to redeem</span></div>
                    </div>
                </div>

                <form className="auth-card" onSubmit={submit}>
                    <div className="eyebrow">
                        {mode === 'login' ? 'GOOD TO SEE YOU' : 'CREATE AN ACCOUNT'}
                    </div>
                    <h1>{mode === 'login' ? 'Sign in' : 'Get started'}</h1>
                    <p className="muted">
                        {mode === 'login'
                            ? 'Enter your account details below.'
                            : 'Choose how you’ll use O2O Campaigner.'}
                    </p>

                    <ErrorMessage>{error}</ErrorMessage>
                    {notice && <SuccessMessage>{notice}</SuccessMessage>}

                    {mode === 'register' && (
                        <>
                            <label>
                                Full name
                                <input
                                    required
                                    autoComplete="name"
                                    value={form.name}
                                    onChange={e => set('name', e.target.value)}
                                    placeholder="Your name"
                                />
                            </label>

                            <label>
                                I am joining as
                                <select
                                    value={form.role}
                                    onChange={e => set('role', e.target.value)}
                                >
                                    <option value="customer">Customer</option>
                                    <option value="merchant">Merchant / shop owner</option>
                                </select>
                            </label>
                        </>
                    )}

                    <label>
                        Email address
                        <input
                            required
                            type="email"
                            autoComplete="email"
                            value={form.email}
                            onChange={e => set('email', e.target.value)}
                            placeholder="you@example.com"
                        />
                    </label>

                    <label>
                        Password
                        <input
                            required
                            type="password"
                            minLength={6}
                            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                            value={form.password}
                            onChange={e => set('password', e.target.value)}
                            placeholder="Enter your password"
                        />
                    </label>

                    <button className="btn btn-primary btn-full btn-lg" disabled={busy}>
                        {busy
                            ? 'Please wait…'
                            : mode === 'login'
                                ? 'Sign in →'
                                : 'Create account →'}
                    </button>

                    <p className="auth-switch">
                        {mode === 'login'
                            ? "Don't have an account? "
                            : 'Already registered? '}
                        <Link to={mode === 'login' ? '/register' : '/login'}>
                            {mode === 'login' ? 'Create account' : 'Sign in'}
                        </Link>
                    </p>

                    <p className="tiny-note">
                        Your account role determines which workspace you can access.
                    </p>
                </form>
            </div>
        </PublicLayout>
    );
}
function AdminLogin() {
    const { user, loading, loginAsAdmin } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    if (loading) return <Loading />;

    if (user) {
        return (
            <Navigate
                to={
                    user.role === 'admin'
                        ? '/admin'
                        : user.role === 'merchant'
                            ? '/merchant'
                            : '/customer'
                }
                replace
            />
        );
    }

    async function submit(e) {
        e.preventDefault();
        setBusy(true);
        setError('');

        try {
            await loginAsAdmin(email, password);
            navigate('/admin', { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setBusy(false);
        }
    }

    return (
        <PublicLayout>
            <div className="auth-wrap">
                <div className="auth-aside">
                    <div className="auth-orbit">O</div>
                    <div className="eyebrow">RESTRICTED ACCESS</div>
                    <h2>Platform administration.</h2>
                    <p>
                        Sign in with your existing administrator account to
                        manage the O2O Campaigner platform.
                    </p>
                </div>

                <form className="auth-card" onSubmit={submit}>
                    <div className="eyebrow">ADMINISTRATOR</div>
                    <h1>Admin sign in</h1>
                    <p className="muted">
                        Use your administrator credentials.
                    </p>

                    <ErrorMessage>{error}</ErrorMessage>

                    <label>
                        Email address
                        <input
                            required
                            type="email"
                            autoComplete="username"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                        />
                    </label>

                    <label>
                        Password
                        <input
                            required
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Administrator password"
                        />
                    </label>

                    <button
                        className="btn btn-primary btn-full btn-lg"
                        disabled={busy}
                    >
                        {busy ? 'Signing in…' : 'Sign in as admin →'}
                    </button>

                    <p className="auth-switch">
                        Not an administrator? <Link to="/login">Go to login</Link>
                    </p>
                </form>
            </div>
        </PublicLayout>
    );
}

function Protected({ role, children }) {
    const { user, loading } = useAuth();

    if (loading) return <Loading />;
    if (!user) return <Navigate to="/login" replace />;

    if (role && user.role !== role) {
        return (
            <Navigate
                to={
                    user.role === 'admin'
                        ? '/admin'
                        : user.role === 'merchant'
                            ? '/merchant'
                            : '/customer'
                }
                replace
            />
        );
    }

    return <Shell>{children}</Shell>;
}

function distanceKm(lat1, lon1, lat2, lon2) {
    const rad = value => value * Math.PI / 180;
    const dLat = rad(lat2 - lat1), dLon = rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function CustomerOffers() {
    const [categories, setCategories] = useState([]), [category, setCategory] = useState(''), [radius, setRadius] = useState('10'), [location, setLocation] = useState(null), [locationLabel, setLocationLabel] = useState(''), [offers, setOffers] = useState([]), [loading, setLoading] = useState(false), [error, setError] = useState(''), [query, setQuery] = useState(''), [notice, setNotice] = useState(''), [locationBusy, setLocationBusy] = useState(false), [claimedCodes, setClaimedCodes] = useState({});
    useEffect(() => {
        api.get('/merchant/stores/categories').then(setCategories).catch(e => setError(`Could not load store categories: ${e.message}`));
        api.get('/customer/vouchers').then(vouchers => {
            const existing = {};
            (Array.isArray(vouchers) ? vouchers : []).forEach(v => { if (v.offer_id && v.code) existing[v.offer_id] = v; });
            setClaimedCodes(existing);
        }).catch(() => {});
    }, []);
    async function searchOffers(coords = location) {
        if (coords?.latitude == null || coords?.longitude == null) throw new Error('Please use your location or enter latitude and longitude.');
        const params = { latitude: Number(coords.latitude), longitude: Number(coords.longitude), radius_km: Number(radius), limit: 100, offset: 0 };
        if (category) params.category_id = category;
        // The registered backend route is /customer/offers (not /customer/offers/nearby).
        const result = await api.get('/customer/offers', { params });
        const rows = Array.isArray(result) ? result : result?.offers || [];
        const withDistances = rows.map(offer => {
            const rawLat = offer.store?.lat ?? offer.store?.latitude, rawLng = offer.store?.lng ?? offer.store?.longitude;
            const lat = Number(rawLat), lng = Number(rawLng);
            const hasCoords = rawLat != null && rawLng != null && Number.isFinite(lat) && Number.isFinite(lng);
            const backendDistance = Number(offer.store?.distance_km);
            const distance = hasCoords ? distanceKm(Number(coords.latitude), Number(coords.longitude), lat, lng) : (Number.isFinite(backendDistance) ? backendDistance : null);
            return { ...offer, store: { ...offer.store, distance_km: distance == null ? offer.store?.distance_km : distance } };
        });
        const nearby = withDistances.filter(o => { const d = Number(o.store?.distance_km); return !Number.isFinite(d) || d <= Number(radius) + 0.01; });
        nearby.sort((a, b) => { const da = Number(a.store?.distance_km), db = Number(b.store?.distance_km); if (!Number.isFinite(da)) return 1; if (!Number.isFinite(db)) return -1; return da - db; });
        setOffers(nearby);
        setNotice(nearby.length ? `Showing ${nearby.length} active offer${nearby.length === 1 ? '' : 's'}, nearest first.` : `No active offers found within ${radius} km. Try another radius or category.`);
    }
    async function useLocation() {
        setLocationBusy(true); setLoading(true); setError(''); setNotice('');
        try {
            const p = await getBrowserLocation();
            const coords = { latitude: Number(p.latitude ?? p.lat), longitude: Number(p.longitude ?? p.lng) };
            setLocation(coords); setLocationLabel('Using your current browser location');
            await searchOffers(coords);
        } catch (e) { setError(e.message); }
        finally { setLocationBusy(false); setLoading(false); }
    }
    async function search(e) {
        e?.preventDefault(); setLoading(true); setError(''); setNotice('');
        try { await searchOffers(location); } catch (e) { setError(e.message); }
        finally { setLoading(false); }
    }
    async function claim(offerId) {
        setError(''); setNotice('');
        try {
            // Claim endpoint returns the server-generated voucher code and expiry.
            const voucher = await api.post(`/customer/offers/${encodeURIComponent(offerId)}/claim`, {});
            setClaimedCodes(current => ({ ...current, [offerId]: voucher }));
            setNotice(`Voucher claimed. Save code ${voucher.code} and show it to the merchant when paying.`);
            return voucher;
        } catch (e) { setError(e.message); throw e; }
    }
    const filtered = offers.filter(o => `${o.title || ''} ${o.description || ''} ${o.store?.name || ''} ${o.store?.address || ''}`.toLowerCase().includes(query.toLowerCase()));
    return <><PageTitle eyebrow="CUSTOMER SPACE" title="Discover nearby offers" subtitle="Find active deals from local shops and compare what you could actually save." action={<span className="radius-badge"><span /> {radius} km radius</span>} />
        <form className="search-panel" onSubmit={search}><div className="search-panel-head"><div><h3>Your local discovery</h3><p>Use your current location to see active offers nearest to you.</p></div><button type="button" className="btn btn-outline" onClick={useLocation} disabled={locationBusy || loading}>{locationBusy ? 'Locating…' : '⌖ Use my location'}</button></div>
            <div className="filters-grid"><label>Store category<select value={category} onChange={e => setCategory(e.target.value)}><option value="">All categories</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select><small>{categories.length ? `${categories.length} categories loaded from backend` : 'Loading live categories…'}</small></label>
                <label>Search radius<select value={radius} onChange={e => setRadius(e.target.value)}><option value="2">2 km · Nearby</option><option value="3">3 km</option><option value="5">5 km</option><option value="10">10 km · Expanded</option></select></label>
                <label>Latitude<input type="number" step="any" min="-90" max="90" value={location?.latitude ?? ''} onChange={e => setLocation(s => ({ ...s, latitude: e.target.value === '' ? null : Number(e.target.value) }))} placeholder="Use location or enter latitude" required /></label>
                <label>Longitude<input type="number" step="any" min="-180" max="180" value={location?.longitude ?? ''} onChange={e => setLocation(s => ({ ...s, longitude: e.target.value === '' ? null : Number(e.target.value) }))} placeholder="Use location or enter longitude" required /></label></div>
            <div className="search-footer"><span className="muted small">{locationLabel || 'Location coordinates are sent with each search.'}</span><button className="btn btn-primary" disabled={loading}>{loading ? 'Searching…' : 'Find nearby offers →'}</button></div></form>
        <ErrorMessage>{error}</ErrorMessage><SuccessMessage>{notice}</SuccessMessage>
        <div className="section-heading"><div><h2>Offers around you</h2><p>{offers.length} results · nearest first</p></div><div className="search-input-wrap"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search shops or offers…" /></div></div>
        {loading ? <Loading>Finding offers near you…</Loading> : filtered.length ? <div className="offer-grid">{filtered.map(o => <OfferCard key={o.id} offer={o} claimedVoucher={claimedCodes[o.id]} onClaim={() => claim(o.id)} />)}</div> : <EmptyState icon="⌖" title="Your next local deal starts here" text="Use your location and search to see active offers from verified local stores." />}
    </>;
}
function OfferCard({ offer, onClaim, claimedVoucher }) {
    const [busy, setBusy] = useState(false), pct = offer.type === 'percentage' || offer.type === 'percent';
    return <article className="offer-card"><div className="offer-card-top"><span className="offer-label">{pct ? 'PERCENTAGE OFFER' : 'FIXED SAVING'}</span><span className="offer-distance">⌖ {offer.store?.distance_km != null ? `${Number(offer.store.distance_km).toFixed(1)} km away` : 'Nearby'}</span></div>
        <div className="offer-value">{pct ? `${offer.value}% OFF` : `${formatMoneyRupees(offer.value)} OFF`}</div><h3>{offer.title}</h3><p className="offer-description">{offer.description || 'A local offer from your neighbourhood store.'}</p>
        <div className="offer-store"><div className="store-avatar">▦</div><div><b>{offer.store?.name || 'Local store'}</b><span>{offer.store?.address || 'Address unavailable'}</span></div></div>
        <div className="offer-meta"><span>Min. order {offer.min_order_paise ? formatMoneyPaise(offer.min_order_paise) : '—'}</span>{offer.max_discount_paise && <span>Max save {formatMoneyPaise(offer.max_discount_paise)}</span>}</div>
        {claimedVoucher?.code ? <div className="alert success" role="status"><b>Your voucher code</b><br /><span className="code-text">{claimedVoucher.code}</span><br /><small>Show this code to the merchant when the bill is created.</small>{claimedVoucher.expires_at && <small> Expires: {new Date(claimedVoucher.expires_at).toLocaleString('en-IN')}</small>}</div> : <button className="btn btn-primary btn-full" disabled={busy} onClick={async () => { setBusy(true); try { await onClaim(); } catch (_) { /* Page displays the error. */ } finally { setBusy(false); } }}>{busy ? 'Claiming…' : 'Claim voucher →'}</button>}
        {offer.store?.google_maps_link && <a className="map-link" href={offer.store.google_maps_link} target="_blank" rel="noreferrer">View shop location ↗</a>}</article>;
}
function EmptyState({ icon = '▦', title, text, action }) {
    return (
        <div className="empty-state">
            <div className="empty-icon">{icon}</div>
            <h3>{title}</h3>
            <p>{text}</p>
            {action}
        </div>
    );
}

function CustomerVouchers() {
    const [data, setData] = useState([]), [loading, setLoading] = useState(true), [error, setError] = useState('');
    async function refresh() { setLoading(true); setError(''); try { const result = await api.get('/customer/vouchers'); setData(Array.isArray(result) ? result : []); } catch (e) { setError(e.message); } finally { setLoading(false); } }
    useEffect(() => { refresh(); }, []);
    return <><PageTitle eyebrow="YOUR SAVINGS" title="My vouchers" subtitle="Your claimed codes, redemption status and expiry." action={<button className="btn btn-quiet" onClick={refresh}>Refresh ↻</button>} /><ErrorMessage>{error}</ErrorMessage>
        {loading ? <Loading /> : data.length ? <div className="table-card"><table><thead><tr><th>Voucher</th><th>Store / Offer</th><th>Claimed</th><th>Expires</th><th>Status</th></tr></thead><tbody>{data.map(v => {
            const expiredByTime = v.expires_at && new Date(v.expires_at).getTime() <= Date.now();
            const terminal = ['used', 'redeemed', 'cancelled', 'expired'].includes(String(v.status).toLowerCase());
            const displayStatus = expiredByTime && !terminal ? 'expired' : v.status;
            return <tr key={v.id}><td><b className="code-text">{v.code}</b></td><td><b>{v.store_name || v.store?.name || 'Local store'}</b><span className="cell-sub">{v.offer_title || v.offer?.title || 'Offer voucher'}</span></td>
                <td>{v.claimed_at ? new Date(v.claimed_at).toLocaleDateString('en-IN') : '—'}</td><td>{v.expires_at ? new Date(v.expires_at).toLocaleString('en-IN') : '—'}</td><td><span className={cx('status-tag', String(displayStatus).toLowerCase())}>{displayStatus}</span></td></tr>;
        })}</tbody></table></div> : <EmptyState icon="▦" title="No vouchers yet" text="Browse nearby offers and claim a voucher to see it here." action={<Link className="btn btn-primary" to="/customer">Explore offers</Link>} />}</>;
}
function MerchantHome() {
    const [dashboard, setDashboard] = useState(null);
    const [stores, setStores] = useState([]);
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        Promise.all([
            api.get('/merchant/dashboard'),
            api.get('/merchant/stores'),
            api.get('/merchant/offers')
        ])
            .then(([d, s, o]) => {
                setDashboard(d);
                setStores(s);
                setOffers(o);
            })
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <PageTitle
                eyebrow="MERCHANT WORKSPACE"
                title="Your local business"
                subtitle="Manage stores, publish offers and understand recorded campaign activity."
                action={<Link className="btn btn-primary" to="/merchant/offers">+ Create offer</Link>}
            />

            <ErrorMessage>{error}</ErrorMessage>

            {loading ? <Loading /> : (
                <>
                    <div className="metric-grid">
                        <Metric
                            label="Stores"
                            value={stores.length}
                            note={`${stores.filter(s => s.verification_status === 'verified').length} verified`}
                        />
                        <Metric label="Offers" value={offers.length} note="Across your stores" />
                        <Metric
                            label="Invoices"
                            value={dashboard?.billing?.invoices_count ?? '—'}
                            note="Recorded in app"
                        />
                        <Metric
                            label="Paid total"
                            value={dashboard?.billing
                                ? formatMoneyPaise(dashboard.billing.paid_total_paise)
                                : '—'}
                            note="Invoice payment status"
                        />
                    </div>

                    <div className="two-col">
                        <section className="panel">
                            <div className="panel-heading">
                                <div>
                                    <h2>Your stores</h2>
                                    <p>Verification status controls offer publishing.</p>
                                </div>
                                <Link className="text-link" to="/merchant/stores">Manage →</Link>
                            </div>

                            {stores.length ? stores.slice(0, 4).map(s => (
                                <div className="list-row" key={s.id}>
                                    <div className="store-avatar">▦</div>
                                    <div className="list-row-main">
                                        <b>{s.name}</b>
                                        <span>{s.address}</span>
                                    </div>
                                    <span className={cx('status-tag', String(s.verification_status).toLowerCase())}>
                                        {s.verification_status}
                                    </span>
                                </div>
                            )) : (
                                <EmptyState
                                    icon="▦"
                                    title="Add your first store"
                                    text="Create your storefront with category and location details."
                                    action={<Link className="btn btn-outline" to="/merchant/stores">Add store</Link>}
                                />
                            )}
                        </section>

                        <section className="panel">
                            <div className="panel-heading">
                                <div>
                                    <h2>Recent offers</h2>
                                    <p>Offer lifecycle from draft to active.</p>
                                </div>
                                <Link className="text-link" to="/merchant/offers">View all →</Link>
                            </div>

                            {offers.length ? offers.slice(0, 5).map(o => (
                                <div className="list-row" key={o.id}>
                                    <div className="offer-mini-icon">％</div>
                                    <div className="list-row-main">
                                        <b>{o.title}</b>
                                        <span>
                                            {o.type === 'percentage'
                                                ? `${o.value}% off`
                                                : `${formatMoneyRupees(o.value)} off`}
                                        </span>
                                    </div>
                                    <span className={cx('status-tag', String(o.status).toLowerCase())}>
                                        {o.status}
                                    </span>
                                </div>
                            )) : (
                                <EmptyState
                                    icon="％"
                                    title="No offers created"
                                    text="Create an offer once a store is verified."
                                />
                            )}
                        </section>
                    </div>

                    <div className="notice-panel">
                        <span className="notice-icon">i</span>
                        <div>
                            <b>Analytics integrity</b>
                            <p>
                                Sales and invoice totals reflect records entered into this app.
                                They do not indicate automatic UPI detection or external POS synchronisation.
                            </p>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

function Metric({ label, value, note }) {
    return (
        <div className="metric-card">
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{note}</small>
        </div>
    );
}

function MerchantStores() {
    const [stores, setStores] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [busy, setBusy] = useState(false);
    const [geoBusy, setGeoBusy] = useState(false);

    const [form, setForm] = useState({
        name: '',
        address: '',
        phone: '',
        category_id: '',
        google_maps_link: '',
        lat: '',
        lng: '',
        hours: {}
    });

    const set = (k, v) => setForm(s => ({ ...s, [k]: v }));

    async function refresh() {
        setLoading(true);
        try {
            const [s, c] = await Promise.all([
                api.get('/merchant/stores'),
                api.get('/merchant/stores/categories')
            ]);
            setStores(s);
            setCategories(c);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        refresh();
    }, []);

    async function locate() {
        setGeoBusy(true);
        setError('');

        try {
            const p = await getBrowserLocation();
            set('lat', String(p.lat));
            set('lng', String(p.lng));
            setNotice(`Coordinates captured (accuracy approximately ${Math.round(p.accuracy)} m).`);
        } catch (e) {
            setError(e.message);
        } finally {
            setGeoBusy(false);
        }
    }

    async function create(e) {
        e.preventDefault();
        setBusy(true);
        setError('');
        setNotice('');

        try {
            const payload = {
                name: form.name.trim(),
                address: form.address.trim(),
                lat: Number(form.lat),
                lng: Number(form.lng),
                category_id: form.category_id || null,
                google_maps_link: form.google_maps_link.trim(),
                phone: form.phone.trim() || null
            };

            const result = await api.post('/merchant/stores', payload);
            setNotice(`Store created. Verification status: ${result.verification_status}.`);

            setForm({
                name: '',
                address: '',
                phone: '',
                category_id: '',
                google_maps_link: '',
                lat: '',
                lng: '',
                hours: {}
            });

            await refresh();
        } catch (e) {
            setError(e.message);
        } finally {
            setBusy(false);
        }
    }

    async function remove(id) {
        if (!confirm('Suspend this store? Its records will be retained.')) return;

        try {
            await api.delete(`/merchant/stores/${id}`);
            await refresh();
        } catch (e) {
            setError(e.message);
        }
    }

    return (
        <>
            <PageTitle
                eyebrow="MERCHANT WORKSPACE"
                title="My stores"
                subtitle="Register store details and use the browser to capture the store's coordinates."
            />

            <ErrorMessage>{error}</ErrorMessage>
            <SuccessMessage>{notice}</SuccessMessage>

            <div className="two-col store-layout">
                <section className="panel">
                    <div className="panel-heading">
                        <div>
                            <h2>Register a store</h2>
                            <p>New stores begin with pending verification.</p>
                        </div>
                    </div>

                    <form className="form-grid" onSubmit={create}>
                        <label className="span-two">
                            Store name
                            <input
                                required
                                value={form.name}
                                onChange={e => set('name', e.target.value)}
                                placeholder="e.g. Asha Kirana"
                            />
                        </label>

                        <label className="span-two">
                            Full address
                            <input
                                required
                                value={form.address}
                                onChange={e => set('address', e.target.value)}
                                placeholder="Shop address, area, city"
                            />
                        </label>

                        <label className="span-two">
                            Store category
                            <select
                                required
                                value={form.category_id}
                                onChange={e => set('category_id', e.target.value)}
                            >
                                <option value="">Choose from backend categories</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            <small>
                                {categories.length} category options loaded live.
                                The selected UUID is sent unchanged as category_id.
                            </small>
                        </label>

                        <label>
                            Contact phone
                            <input
                                value={form.phone}
                                onChange={e => set('phone', e.target.value)}
                                inputMode="tel"
                                placeholder="Phone (optional)"
                            />
                        </label>

                        <label>
                            Google Maps sharing link
                            <input
                                required
                                type="url"
                                value={form.google_maps_link}
                                onChange={e => set('google_maps_link', e.target.value)}
                                placeholder="https://maps.app.goo.gl/…"
                            />
                        </label>

                        <div className="span-two location-capture">
                            <div>
                                <b>Store coordinates</b>
                                <span>These are sent as lat and lng in the store creation request.</span>
                            </div>
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={locate}
                                disabled={geoBusy}
                            >
                                {geoBusy ? 'Getting location…' : '⌖ Capture current location'}
                            </button>
                        </div>

                        <label>
                            Latitude
                            <input
                                type="number"
                                step="any"
                                min="-90"
                                max="90"
                                required
                                value={form.lat}
                                onChange={e => set('lat', e.target.value)}
                                placeholder="28.7041"
                            />
                        </label>

                        <label>
                            Longitude
                            <input
                                type="number"
                                step="any"
                                min="-180"
                                max="180"
                                required
                                value={form.lng}
                                onChange={e => set('lng', e.target.value)}
                                placeholder="77.1025"
                            />
                        </label>

                        <div className="span-two">
                            <button
                                className="btn btn-primary"
                                disabled={busy || categories.length === 0}
                            >
                                {busy ? 'Saving store…' : 'Create store →'}
                            </button>
                        </div>
                    </form>
                </section>

                <section className="panel">
                    <div className="panel-heading">
                        <div>
                            <h2>Your registered stores</h2>
                            <p>Only verified stores can publish offers.</p>
                        </div>
                        <button className="btn btn-quiet" onClick={refresh}>Refresh ↻</button>
                    </div>

                    {loading ? <Loading /> : stores.length ? stores.map(s => (
                        <div className="store-record" key={s.id}>
                            <div className="store-record-head">
                                <div className="store-avatar">▦</div>
                                <span className={cx('status-tag', String(s.verification_status).toLowerCase())}>
                                    {s.verification_status}
                                </span>
                            </div>

                            <h3>{s.name}</h3>
                            <p>{s.address}</p>

                            <div className="store-record-meta">
                                <span>{categories.find(c => c.id === s.category_id)?.name || 'Category'}</span>
                                <span>{s.lat}, {s.lng}</span>
                            </div>

                            {s.google_maps_link && (
                                <a
                                    className="text-link"
                                    href={s.google_maps_link}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Open in Maps ↗
                                </a>
                            )}

                            <button
                                className="btn btn-quiet danger-text"
                                onClick={() => remove(s.id)}
                            >
                                Suspend store
                            </button>
                        </div>
                    )) : (
                        <EmptyState
                            title="No stores yet"
                            text="Complete the form to register your first shop."
                        />
                    )}
                </section>
            </div>
        </>
    );
}
function MerchantOffers() {
    const [stores, setStores] = useState([]);
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [busy, setBusy] = useState(false);

    const [f, setF] = useState({
        store_id: '',
        title: '',
        description: '',
        type: 'percentage',
        value: '10',
        min_order_rupees: '0',
        max_discount_rupees: '',
        starts_at: '',
        ends_at: '',
        max_claims: '100',
        per_customer_limit: '1',
        terms: ''
    });

    const set = (k, v) => setF(s => ({ ...s, [k]: v }));

    async function refresh() {
        setLoading(true);
        try {
            const [s, o] = await Promise.all([
                api.get('/merchant/stores'),
                api.get('/merchant/offers')
            ]);
            setStores(s);
            setOffers(o);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        refresh();
    }, []);

    async function create(e) {
        e.preventDefault();
        setBusy(true);
        setError('');
        setNotice('');

        try {
            const payload = {
                store_id: f.store_id,
                title: f.title,
                description: f.description || null,
                type: f.type,
                value: Number(f.value),
                min_order_paise: Math.round(Number(f.min_order_rupees || 0) * 100),
                max_discount_paise: f.max_discount_rupees === ''
                    ? null
                    : Math.round(Number(f.max_discount_rupees) * 100),
                starts_at: new Date(f.starts_at).toISOString(),
                ends_at: new Date(f.ends_at).toISOString(),
                max_claims: Number(f.max_claims),
                per_customer_limit: Number(f.per_customer_limit),
                terms: f.terms || null
            };

            const o = await api.post('/merchant/offers', payload);
            setNotice(`Offer saved as ${o.status}.`);
            await refresh();
        } catch (e) {
            setError(e.message);
        } finally {
            setBusy(false);
        }
    }

    async function action(id, kind) {
        setError('');
        setNotice('');

        try {
            if (kind === 'publish') {
                const o = await api.post(`/merchant/offers/${id}/publish`, {});
                setNotice(`Offer is now ${o.status}.`);
            } else {
                if (!confirm('Cancel this offer? Existing claimed vouchers may also be cancelled.')) {
                    return;
                }
                await api.delete(`/merchant/offers/${id}`);
                setNotice('Offer cancelled.');
            }
            await refresh();
        } catch (e) {
            setError(e.message);
        }
    }

    const verified = stores.filter(s => s.verification_status === 'verified');

    return (
        <>
            <PageTitle
                eyebrow="MERCHANT WORKSPACE"
                title="Offer management"
                subtitle="Create clear, time-bound offers for your local customers."
            />

            <ErrorMessage>{error}</ErrorMessage>
            <SuccessMessage>{notice}</SuccessMessage>

            <div className="two-col store-layout">
                <section className="panel">
                    <div className="panel-heading">
                        <div>
                            <h2>Create an offer</h2>
                            <p>Offers can only be published for verified stores.</p>
                        </div>
                    </div>

                    {stores.length === 0 ? (
                        <div className="inline-warning">
                            Add a store first before creating an offer.
                        </div>
                    ) : verified.length === 0 ? (
                        <div className="inline-warning">
                            Your stores are awaiting verification. You can prepare
                            the form, but the backend will reject offer creation
                            until the selected store is verified.
                        </div>
                    ) : null}

                    <form className="form-grid" onSubmit={create}>
                        <label className="span-two">
                            Store
                            <select
                                required
                                value={f.store_id}
                                onChange={e => set('store_id', e.target.value)}
                            >
                                <option value="">Choose a verified store</option>
                                {verified.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </label>

                        <label className="span-two">
                            Offer title
                            <input
                                required
                                value={f.title}
                                onChange={e => set('title', e.target.value)}
                                placeholder="e.g. 10% off your grocery bill"
                            />
                        </label>

                        <label className="span-two">
                            Description
                            <textarea
                                value={f.description}
                                onChange={e => set('description', e.target.value)}
                                placeholder="Describe the offer clearly"
                                rows="2"
                            />
                        </label>

                        <label>
                            Discount type
                            <select value={f.type} onChange={e => set('type', e.target.value)}>
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed amount (₹)</option>
                            </select>
                        </label>

                        <label>
                            {f.type === 'percentage' ? 'Discount percentage' : 'Discount amount (₹)'}
                            <input
                                type="number"
                                min="1"
                                max={f.type === 'percentage' ? 70 : 100000}
                                required
                                value={f.value}
                                onChange={e => set('value', e.target.value)}
                            />
                        </label>

                        <label>
                            Minimum order (₹)
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                required
                                value={f.min_order_rupees}
                                onChange={e => set('min_order_rupees', e.target.value)}
                            />
                        </label>

                        <label>
                            Maximum discount cap (₹)
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={f.max_discount_rupees}
                                onChange={e => set('max_discount_rupees', e.target.value)}
                                placeholder="Required for discounts over 20%"
                            />
                        </label>

                        <label>
                            Starts at
                            <input
                                type="datetime-local"
                                required
                                value={f.starts_at}
                                onChange={e => set('starts_at', e.target.value)}
                            />
                        </label>

                        <label>
                            Ends at
                            <input
                                type="datetime-local"
                                required
                                value={f.ends_at}
                                onChange={e => set('ends_at', e.target.value)}
                            />
                        </label>

                        <label>
                            Maximum total claims
                            <input
                                type="number"
                                min="1"
                                required
                                value={f.max_claims}
                                onChange={e => set('max_claims', e.target.value)}
                            />
                        </label>

                        <label>
                            Claims per customer
                            <input
                                type="number"
                                min="1"
                                required
                                value={f.per_customer_limit}
                                onChange={e => set('per_customer_limit', e.target.value)}
                            />
                        </label>

                        <label className="span-two">
                            Terms and conditions
                            <textarea
                                value={f.terms}
                                onChange={e => set('terms', e.target.value)}
                                rows="2"
                                placeholder="Conditions customers should know"
                            />
                        </label>

                        <div className="span-two">
                            <button
                                className="btn btn-primary"
                                disabled={busy || verified.length === 0}
                            >
                                {busy ? 'Saving…' : 'Save as draft →'}
                            </button>
                        </div>
                    </form>
                </section>

                <section className="panel">
                    <div className="panel-heading">
                        <div>
                            <h2>Offers you manage</h2>
                            <p>Publish, review or cancel existing offers.</p>
                        </div>
                        <button className="btn btn-quiet" onClick={refresh}>Refresh ↻</button>
                    </div>

                    {loading ? <Loading /> : offers.length ? offers.map(o => (
                        <div className="offer-record" key={o.id}>
                            <div className="offer-record-top">
                                <span className="status-tag">{o.status}</span>
                                <span className="muted small">
                                    {o.type === 'percentage'
                                        ? `${o.value}% off`
                                        : `${formatMoneyRupees(o.value)} off`}
                                </span>
                            </div>

                            <h3>{o.title}</h3>
                            <p>{o.description}</p>

                            <div className="offer-record-meta">
                                <span>
                                    Starts {o.starts_at
                                        ? new Date(o.starts_at).toLocaleString('en-IN')
                                        : '—'}
                                </span>
                                <span>
                                    Ends {o.ends_at
                                        ? new Date(o.ends_at).toLocaleString('en-IN')
                                        : '—'}
                                </span>
                            </div>

                            <div className="row-actions">
                                {o.status === 'draft' && (
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => action(o.id, 'publish')}
                                    >
                                        Publish offer
                                    </button>
                                )}

                                {!['cancelled', 'expired'].includes(String(o.status).toLowerCase()) && (
                                    <button
                                        className="btn btn-outline"
                                        onClick={() => action(o.id, 'cancel')}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    )) : (
                        <EmptyState
                            icon="％"
                            title="No offers yet"
                            text="Create your first offer after a store is verified."
                        />
                    )}
                </section>
            </div>
        </>
    );
}

function MerchantBilling() {
    const [dashboard, setDashboard] = useState(null);
    const [invoices, setInvoices] = useState([]);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');

    const [form, setForm] = useState({
        store_id: '',
        items: [{ description: '', quantity: 1, unit_price_rupees: '' }],
        voucher_code: ''
    });

    const set = (k, v) => setForm(s => ({ ...s, [k]: v }));

    async function refresh() {
        setLoading(true);
        try {
            const [d, i, s] = await Promise.all([
                api.get('/merchant/billing/dashboard'),
                api.get('/merchant/billing/invoices'),
                api.get('/merchant/stores')
            ]);
            setDashboard(d);
            setInvoices(i);
            setStores(s);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        refresh();
    }, []);

    function itemChange(index, k, v) {
        setForm(s => ({
            ...s,
            items: s.items.map((it, i) =>
                i === index ? { ...it, [k]: v } : it
            )
        }));
    }

    async function create(e) {
        e.preventDefault();
        setError('');
        setNotice('');

        try {
            const payload = {
                store_id: form.store_id,
                items: form.items.map(i => ({
                    description: i.description,
                    quantity: Number(i.quantity),
                    unit_price_paise: Math.round(Number(i.unit_price_rupees) * 100)
                }))
            };

            if (form.voucher_code.trim()) {
                payload.voucher_code = form.voucher_code.trim();
            }

            const invoice = await api.post('/merchant/billing/invoices', payload);
            setNotice(`Invoice ${invoice.code} created.`);

            setForm({
                store_id: '',
                items: [{ description: '', quantity: 1, unit_price_rupees: '' }],
                voucher_code: ''
            });

            await refresh();
        } catch (e) {
            setError(e.message);
        }
    }

    async function payment(code, status) {
        try {
            await api.patch(`/merchant/billing/invoices/${code}/payment-status`, {
                payment_status: status
            });
            setNotice(`Invoice marked ${status}.`);
            await refresh();
        } catch (e) {
            setError(e.message);
        }
    }

    return (
        <>
            <PageTitle
                eyebrow="MERCHANT WORKSPACE"
                title="Billing & invoices"
                subtitle="Record sales and invoices inside O2O Campaigner. This is not a payment gateway or POS integration."
            />

            <ErrorMessage>{error}</ErrorMessage>
            <SuccessMessage>{notice}</SuccessMessage>

            {loading ? <Loading /> : (
                <>
                    <div className="metric-grid">
                        <Metric
                            label="Invoices"
                            value={dashboard?.invoices_count ?? 0}
                            note="Total recorded"
                        />
                        <Metric
                            label="Paid"
                            value={dashboard?.paid_invoices_count ?? 0}
                            note="Marked paid manually"
                        />
                        <Metric
                            label="Invoiced total"
                            value={formatMoneyPaise(dashboard?.invoiced_total_paise)}
                            note="Paise converted to ₹"
                        />
                        <Metric
                            label="Paid total"
                            value={formatMoneyPaise(dashboard?.paid_total_paise)}
                            note="Recorded payment status"
                        />
                    </div>

                    <div className="two-col">
                        <section className="panel">
                            <div className="panel-heading">
                                <div>
                                    <h2>Create invoice</h2>
                                    <p>Amounts are converted to paise before sending.</p>
                                </div>
                            </div>

                            <form className="form-grid" onSubmit={create}>
                                <label className="span-two">
                                    Store
                                    <select
                                        required
                                        value={form.store_id}
                                        onChange={e => set('store_id', e.target.value)}
                                    >
                                        <option value="">Choose a store</option>
                                        {stores
                                            .filter(s => ['pending', 'verified'].includes(s.verification_status))
                                            .map(s => (
                                                <option key={s.id} value={s.id}>
                                                    {s.name} · {s.verification_status}
                                                </option>
                                            ))}
                                    </select>
                                </label>

                                {form.items.map((it, i) => (
                                    <React.Fragment key={i}>
                                        <label className="span-two">
                                            Item description
                                            <input
                                                required
                                                value={it.description}
                                                onChange={e => itemChange(i, 'description', e.target.value)}
                                                placeholder="Product / service"
                                            />
                                        </label>

                                        <label>
                                            Quantity
                                            <input
                                                type="number"
                                                min="1"
                                                required
                                                value={it.quantity}
                                                onChange={e => itemChange(i, 'quantity', e.target.value)}
                                            />
                                        </label>

                                        <label>
                                            Unit price (₹)
                                            <input
                                                type="number"
                                                min="0.01"
                                                step="0.01"
                                                required
                                                value={it.unit_price_rupees}
                                                onChange={e => itemChange(i, 'unit_price_rupees', e.target.value)}
                                                placeholder="0.00"
                                            />
                                        </label>
                                    </React.Fragment>
                                ))}

                                <div className="span-two row-actions">
                                    <button
                                        type="button"
                                        className="btn btn-outline"
                                        onClick={() => set('items', [
                                            ...form.items,
                                            { description: '', quantity: 1, unit_price_rupees: '' }
                                        ])}
                                    >
                                        + Add item
                                    </button>

                                    {form.items.length > 1 && (
                                        <button
                                            type="button"
                                            className="btn btn-quiet"
                                            onClick={() => set('items', form.items.slice(0, -1))}
                                        >
                                            Remove last
                                        </button>
                                    )}
                                </div>

                                <label className="span-two">
                                    Customer voucher code (optional)
                                    <input
                                        value={form.voucher_code}
                                        onChange={e => set('voucher_code', e.target.value)}
                                        placeholder="Enter claimed voucher code"
                                    />
                                </label>

                                <div className="span-two">
                                    <button className="btn btn-primary">Create invoice →</button>
                                </div>
                            </form>
                        </section>

                        <section className="panel">
                            <div className="panel-heading">
                                <div>
                                    <h2>Recent invoices</h2>
                                    <p>Payment status is a manual record, not verified payment detection.</p>
                                </div>
                                <button className="btn btn-quiet" onClick={refresh}>Refresh ↻</button>
                            </div>

                            {invoices.length ? invoices.map(inv => (
                                <div className="invoice-record" key={inv.code}>
                                    <div className="invoice-top">
                                        <b>{inv.code}</b>
                                        <span className={cx('status-tag', inv.payment_status)}>
                                            {inv.payment_status}
                                        </span>
                                    </div>

                                    <div className="invoice-total">
                                        {formatMoneyPaise(inv.total_paise ?? inv.subtotal_paise)}
                                    </div>

                                    <p>
                                        {inv.line_items?.length || 0} line items ·{' '}
                                        {inv.issued_at
                                            ? new Date(inv.issued_at).toLocaleString('en-IN')
                                            : 'Date unavailable'}
                                    </p>

                                    <div className="row-actions">
                                        {inv.payment_status !== 'paid' ? (
                                            <button
                                                className="btn btn-outline"
                                                onClick={() => payment(inv.code, 'paid')}
                                            >
                                                Mark paid
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-quiet"
                                                onClick={() => payment(inv.code, 'unpaid')}
                                            >
                                                Mark unpaid
                                            </button>
                                        )}

                                        <button className="btn btn-quiet" onClick={() => window.print()}>
                                            Print / Save PDF
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <EmptyState
                                    title="No invoices yet"
                                    text="Create an invoice to see it listed here."
                                />
                            )}
                        </section>
                    </div>
                </>
            )}
        </>
    );
}
function AdminHome() {
    const [data, setData] = useState(null);
    const [merchants, setMerchants] = useState([]);
    const [pendingStores, setPendingStores] = useState([]);
    const [deletedStores, setDeletedStores] = useState([]);
    const [activeTab, setActiveTab] = useState('review');
    const [merchantFilter, setMerchantFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState('');
    const [notice, setNotice] = useState('');
    const [rejectingStore, setRejectingStore] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    async function refresh() {
        setLoading(true);
        setError('');

        try {
            const [dashboard, merchantRows, deletedRows] = await Promise.all([
                api.get('/admin/dashboard'),
                api.get('/admin/merchants', {
                    params: {
                        limit: 100,
                        ...(merchantFilter === 'all'
                            ? {}
                            : { is_active: merchantFilter === 'active' })
                    }
                }),
                api.get('/admin/stores/deleted', {
                    params: { limit: 100 }
                })
            ]);

            setData(dashboard);
            setMerchants(
                Array.isArray(merchantRows)
                    ? merchantRows
                    : merchantRows?.items || merchantRows?.merchants || []
            );
            setDeletedStores(
                Array.isArray(deletedRows)
                    ? deletedRows
                    : deletedRows?.items || deletedRows?.stores || []
            );
        } catch (e) {
            setError(e.message || 'Could not load admin data.');
        } finally {
            setLoading(false);
        }
    }

    async function loadPendingStores() {
        try {
            const rows = await api.get('/admin/stores/pending', {
                params: { limit: 100 }
            });

            setPendingStores(
                Array.isArray(rows)
                    ? rows
                    : rows?.items || rows?.stores || []
            );
        } catch (e) {
            setPendingStores([]);
            setError(current =>
                current ||
                `Pending store list could not be loaded: ${e.message}. The backend needs GET /api/v1/admin/stores/pending.`
            );
        }
    }

    useEffect(() => {
        refresh();
        loadPendingStores();
    }, []);

    async function deactivate(id) {
        if (!window.confirm('Deactivate this merchant? Their stores will be archived.')) {
            return;
        }

        setBusyId(String(id));
        setError('');
        setNotice('');

        try {
            await api.delete(`/admin/merchants/${id}`);
            setNotice('Merchant deactivated. Its stores remain retained and archived.');
            await refresh();
        } catch (e) {
            setError(e.message);
        } finally {
            setBusyId('');
        }
    }

    async function restoreMerchant(id) {
        setBusyId(String(id));
        setError('');
        setNotice('');

        try {
            await api.post(`/admin/merchants/${id}/restore`, {});
            setNotice('Merchant restored. Archived stores may need to be restored individually.');
            await refresh();
        } catch (e) {
            setError(e.message);
        } finally {
            setBusyId('');
        }
    }

    async function reviewStore(id, decision, reason = '') {
        setBusyId(String(id));
        setError('');
        setNotice('');

        try {
            await api.patch(`/admin/stores/${id}/verification`, {
                decision,
                ...(decision === 'reject' ? { reason: reason.trim() } : {})
            });

            setPendingStores(rows =>
                rows.filter(store => String(store.id) !== String(id))
            );

            setRejectingStore(null);
            setRejectReason('');
            setNotice(decision === 'approve' ? 'Store approved.' : 'Store rejected.');

            await refresh();
            await loadPendingStores();
        } catch (e) {
            setError(e.message);
        } finally {
            setBusyId('');
        }
    }

    async function deleteStore(id) {
        if (!window.confirm('Archive this store? Its records will be retained and can be restored.')) {
            return;
        }

        setBusyId(String(id));
        setError('');
        setNotice('');

        try {
            await api.delete(`/admin/stores/${id}`);
            setNotice('Store archived.');
            await refresh();
            await loadPendingStores();
        } catch (e) {
            setError(e.message);
        } finally {
            setBusyId('');
        }
    }

    async function restoreStore(id) {
        setBusyId(String(id));
        setError('');
        setNotice('');

        try {
            await api.post(`/admin/stores/${id}/restore`, {});
            setNotice('Store restored.');
            await refresh();
        } catch (e) {
            setError(e.message);
        } finally {
            setBusyId('');
        }
    }

    const visibleMerchants = merchants.filter(merchant => {
        const query = search.trim().toLowerCase();
        return !query ||
            `${merchant.name || ''} ${merchant.email || ''}`
                .toLowerCase()
                .includes(query);
    });

    const visiblePendingStores = pendingStores.filter(store => {
        const query = search.trim().toLowerCase();
        return !query ||
            `${store.name || ''} ${store.address || ''} ${store.merchant_name || store.owner_name || ''}`
                .toLowerCase()
                .includes(query);
    });

    return (
        <>
            <PageTitle
                eyebrow="ADMIN WORKSPACE"
                title="Platform overview"
                subtitle="Review store applications, manage merchant access, and restore retained records."
                action={
                    <button
                        className="btn btn-quiet"
                        onClick={() => {
                            refresh();
                            loadPendingStores();
                        }}
                    >
                        Refresh ↻
                    </button>
                }
            />

            <ErrorMessage>{error}</ErrorMessage>
            <SuccessMessage>{notice}</SuccessMessage>

            {loading ? <Loading /> : (
                <>
                    <div className="metric-grid">
                        <Metric
                            label="Merchants"
                            value={merchants.length}
                            note="Returned by admin API"
                        />
                        <Metric
                            label="Active merchants"
                            value={merchants.filter(m => m.is_active).length}
                            note="Account status"
                        />
                        <Metric
                            label="Pending stores"
                            value={pendingStores.length}
                            note="Awaiting review"
                        />
                        <Metric
                            label="Archived stores"
                            value={deletedStores.length}
                            note="Retained records"
                        />
                    </div>

                    <section className="panel">
                        <div className="panel-heading">
                            <div>
                                <h2>Administration</h2>
                                <p>Search records and switch between review and retention tasks.</p>
                            </div>
                        </div>

                        <div
                            className="row-actions"
                            style={{ flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}
                        >
                            <button
                                className={`btn ${activeTab === 'review' ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => setActiveTab('review')}
                            >
                                Store review ({pendingStores.length})
                            </button>

                            <button
                                className={`btn ${activeTab === 'merchants' ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => setActiveTab('merchants')}
                            >
                                Merchants ({merchants.length})
                            </button>

                            <button
                                className={`btn ${activeTab === 'deleted' ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => setActiveTab('deleted')}
                            >
                                Archived stores ({deletedStores.length})
                            </button>
                        </div>

                        {activeTab === 'review' && (
                            <div>
                                <div className="panel-heading">
                                    <div>
                                        <h2>Pending store applications</h2>
                                        <p>Approve legitimate stores or reject with a reason.</p>
                                    </div>
                                    <button
                                        className="btn btn-quiet"
                                        onClick={loadPendingStores}
                                    >
                                        Reload review queue ↻
                                    </button>
                                </div>

                                {!pendingStores.length ? (
                                    <div className="empty-state">
                                        <div className="empty-icon">✓</div>
                                        <h3>No pending stores shown</h3>
                                        <p>
                                            If stores are waiting for approval, confirm the backend
                                            exposes GET /api/v1/admin/stores/pending. The documented
                                            verification endpoint only updates a store; it does not
                                            list the queue.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="table-card">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Store</th>
                                                    <th>Merchant</th>
                                                    <th>Address</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {visiblePendingStores.map(store => (
                                                    <tr key={store.id}>
                                                        <td>
                                                            <b>{store.name || 'Unnamed store'}</b>
                                                            <div className="tiny-note">
                                                                {store.category_name || store.category?.name || ''}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {store.merchant_name ||
                                                                store.owner_name ||
                                                                store.merchant?.name ||
                                                                '—'}
                                                            <div className="tiny-note">
                                                                {store.merchant_email || store.merchant?.email || ''}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {store.address || '—'}
                                                            {store.google_maps_link && (
                                                                <div>
                                                                    <a
                                                                        href={store.google_maps_link}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                    >
                                                                        Open map ↗
                                                                    </a>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <span className="status-tag">
                                                                {store.verification_status || 'pending'}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="row-actions">
                                                                <button
                                                                    className="btn btn-primary"
                                                                    disabled={busyId === String(store.id)}
                                                                    onClick={() => reviewStore(store.id, 'approve')}
                                                                >
                                                                    {busyId === String(store.id)
                                                                        ? 'Working…'
                                                                        : 'Approve'}
                                                                </button>

                                                                <button
                                                                    className="btn btn-quiet danger-text"
                                                                    disabled={busyId === String(store.id)}
                                                                    onClick={() => {
                                                                        setRejectingStore(store);
                                                                        setRejectReason('');
                                                                    }}
                                                                >
                                                                    Reject
                                                                </button>

                                                                <button
                                                                    className="btn btn-quiet danger-text"
                                                                    disabled={busyId === String(store.id)}
                                                                    onClick={() => deleteStore(store.id)}
                                                                >
                                                                    Archive
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'merchants' && (
                            <div>
                                <div className="panel-heading">
                                    <div>
                                        <h2>Merchant accounts</h2>
                                        <p>Deactivate accounts when needed, or restore inactive accounts.</p>
                                    </div>

                                    <div className="row-actions">
                                        <select
                                            aria-label="Merchant status filter"
                                            value={merchantFilter}
                                            onChange={e => setMerchantFilter(e.target.value)}
                                        >
                                            <option value="all">All merchants</option>
                                            <option value="active">Active only</option>
                                            <option value="inactive">Inactive only</option>
                                        </select>
                                        <button className="btn btn-quiet" onClick={refresh}>
                                            Refresh ↻
                                        </button>
                                    </div>
                                </div>

                                <label className="search-field">
                                    Search merchants
                                    <input
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        placeholder="Name or email"
                                    />
                                </label>

                                <div className="table-card">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Merchant</th>
                                                <th>Email</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {visibleMerchants.map(merchant => (
                                                <tr key={merchant.id}>
                                                    <td><b>{merchant.name || '—'}</b></td>
                                                    <td>{merchant.email || '—'}</td>
                                                    <td>
                                                        <span
                                                            className={cx(
                                                                'status-tag',
                                                                merchant.is_active ? 'verified' : 'suspended'
                                                            )}
                                                        >
                                                            {merchant.is_active ? 'active' : 'inactive'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {merchant.is_active ? (
                                                            <button
                                                                className="btn btn-quiet danger-text"
                                                                disabled={busyId === String(merchant.id)}
                                                                onClick={() => deactivate(merchant.id)}
                                                            >
                                                                {busyId === String(merchant.id)
                                                                    ? 'Working…'
                                                                    : 'Deactivate'}
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="btn btn-outline"
                                                                disabled={busyId === String(merchant.id)}
                                                                onClick={() => restoreMerchant(merchant.id)}
                                                            >
                                                                {busyId === String(merchant.id)
                                                                    ? 'Working…'
                                                                    : 'Restore'}
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}

                                            {!visibleMerchants.length && (
                                                <tr>
                                                    <td colSpan="4">
                                                        No merchants match this search/filter.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'deleted' && (
                            <div>
                                <div className="panel-heading">
                                    <div>
                                        <h2>Archived stores</h2>
                                        <p>Soft-deleted stores remain in the database and can be restored.</p>
                                    </div>
                                    <button className="btn btn-quiet" onClick={refresh}>
                                        Refresh ↻
                                    </button>
                                </div>

                                <div className="table-card">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Store</th>
                                                <th>Address</th>
                                                <th>Archived</th>
                                                <th>Reason</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {deletedStores.map(store => (
                                                <tr key={store.id}>
                                                    <td>
                                                        <b>{store.name || 'Unnamed store'}</b>
                                                        <div className="tiny-note">
                                                            {store.merchant_name || store.owner_name || ''}
                                                        </div>
                                                    </td>
                                                    <td>{store.address || '—'}</td>
                                                    <td>
                                                        {store.deleted_at
                                                            ? new Date(store.deleted_at).toLocaleString('en-IN')
                                                            : '—'}
                                                    </td>
                                                    <td>{store.deletion_reason || store.reason || '—'}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-outline"
                                                            disabled={busyId === String(store.id)}
                                                            onClick={() => restoreStore(store.id)}
                                                        >
                                                            {busyId === String(store.id)
                                                                ? 'Working…'
                                                                : 'Restore'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}

                                            {!deletedStores.length && (
                                                <tr>
                                                    <td colSpan="5">
                                                        No archived stores returned by the API.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </section>

                    <section className="panel">
                        <div className="panel-heading">
                            <div>
                                <h2>Platform analytics</h2>
                                <p>Usage and activity metrics returned by the admin dashboard.</p>
                            </div>
                        </div>

                        <div className="metric-grid">
                            <Metric
                                label="Voucher claims"
                                value={data?.voucher_claims ?? data?.vouchers_claimed ?? data?.total_voucher_claims ?? '—'}
                                note="Platform-wide"
                            />
                            <Metric
                                label="Vouchers used"
                                value={data?.vouchers_used ?? data?.voucher_uses ?? data?.total_voucher_uses ?? '—'}
                                note="Platform-wide"
                            />
                            <Metric
                                label="Offers"
                                value={data?.offers_count ?? data?.total_offers ?? '—'}
                                note="Platform-wide"
                            />
                            <Metric
                                label="Stores"
                                value={data?.stores_count ?? data?.total_stores ?? '—'}
                                note="Platform-wide"
                            />
                        </div>

                        {(data?.offer_counts_by_status || data?.offers_by_status) && (
                            <div className="table-card">
                                <table>
                                    <thead>
                                        <tr><th>Offer status</th><th>Count</th></tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(
                                            data.offer_counts_by_status || data.offers_by_status
                                        ).map(([status, count]) => (
                                            <tr key={status}>
                                                <td>{status}</td>
                                                <td>
                                                    {typeof count === 'object'
                                                        ? count.count ?? count.total ?? '—'
                                                        : count}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {(Array.isArray(data?.top_offers) ||
                            Array.isArray(data?.top_offers_by_voucher_usage)) && (
                            <div className="table-card">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Top offers</th>
                                            <th>Merchant / store</th>
                                            <th>Voucher usage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(data.top_offers || data.top_offers_by_voucher_usage).map(
                                            (offer, index) => (
                                                <tr key={offer.id || offer.offer_id || index}>
                                                    <td>
                                                        {offer.title || offer.name || offer.offer_title || 'Offer'}
                                                    </td>
                                                    <td>{offer.merchant_name || offer.store_name || '—'}</td>
                                                    <td>
                                                        {offer.vouchers_used ??
                                                            offer.voucher_uses ??
                                                            offer.claim_count ??
                                                            offer.vouchers_claimed ??
                                                            '—'}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {(Array.isArray(data?.top_merchants) ||
                            Array.isArray(data?.top_merchants_by_voucher_usage)) && (
                            <div className="table-card">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Top merchants</th>
                                            <th>Email</th>
                                            <th>Voucher usage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(data.top_merchants || data.top_merchants_by_voucher_usage).map(
                                            (merchant, index) => (
                                                <tr key={merchant.id || merchant.merchant_id || index}>
                                                    <td>{merchant.name || merchant.merchant_name || 'Merchant'}</td>
                                                    <td>{merchant.email || '—'}</td>
                                                    <td>
                                                        {merchant.vouchers_used ??
                                                            merchant.voucher_uses ??
                                                            merchant.claim_count ??
                                                            merchant.vouchers_claimed ??
                                                            '—'}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>

                    <div className="notice-panel">
                        <span className="notice-icon">i</span>
                        <div>
                            <b>Admin data boundary</b>
                            <p>
                                Admin analytics intentionally omit billing amounts and invoice details.
                                Merchant and store delete actions are soft operations that retain records.
                            </p>
                        </div>
                    </div>
                </>
            )}

            {rejectingStore && (
                <div className="modal-backdrop" role="presentation">
                    <form
                        className="auth-card"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="reject-store-title"
                        onSubmit={e => {
                            e.preventDefault();
                            if (rejectReason.trim()) {
                                reviewStore(rejectingStore.id, 'reject', rejectReason);
                            }
                        }}
                    >
                        <h2 id="reject-store-title">
                            Reject {rejectingStore.name || 'store'}?
                        </h2>
                        <p className="muted">
                            A rejection reason is required and will be sent to the backend.
                        </p>

                        <label>
                            Reason
                            <textarea
                                required
                                minLength={3}
                                value={rejectReason}
                                onChange={e => setRejectReason(e.target.value)}
                                placeholder="Explain what needs to be corrected."
                                rows={4}
                            />
                        </label>

                        <div className="row-actions">
                            <button
                                type="button"
                                className="btn btn-quiet"
                                onClick={() => setRejectingStore(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                disabled={!rejectReason.trim() || !!busyId}
                            >
                                Confirm rejection
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}

function NotFound() {
    return (
        <div className="empty-state">
            <div className="empty-icon">?</div>
            <h3>Page not found</h3>
            <p>This route doesn't exist.</p>
            <Link to="/" className="btn btn-primary">Go home</Link>
        </div>
    );
}

export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('o2o_access_token');

        if (!token) {
            setLoading(false);
            return;
        }

        api.get('/auth/me')
            .then(setUser)
            .catch(() => {
                sessionStorage.removeItem('o2o_access_token');
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    async function login(email, password) {
        const response = await api.post('/auth/login', { email, password });
        sessionStorage.setItem('o2o_access_token', response.access_token);

        const currentUser = await api.get('/auth/me');
        setUser(currentUser);
        return currentUser;
    }

    async function loginAsAdmin(email, password) {
        const response = await api.post('/auth/login', { email, password });

        if (!response?.access_token) {
            throw new Error('Login response did not contain an access token.');
        }

        sessionStorage.setItem('o2o_access_token', response.access_token);

        try {
            const currentUser = await api.get('/auth/me');

            if (currentUser?.role !== 'admin') {
                throw new Error('Access denied. This account is not an administrator.');
            }

            setUser(currentUser);
            return currentUser;
        } catch (error) {
            sessionStorage.removeItem('o2o_access_token');
            setUser(null);
            throw error;
        }
    }

    async function register(data) {
        return api.post('/auth/register', {
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role
        });
    }

    function logout() {
        sessionStorage.removeItem('o2o_access_token');
        setUser(null);
        navigate('/login', { replace: true });
    }

    const auth = {
        user,
        loading,
        login,
        loginAsAdmin,
        register,
        logout
    };

    const homeRoute = user
        ? user.role === 'merchant'
            ? '/merchant'
            : user.role === 'admin'
                ? '/admin'
                : '/customer'
        : null;

    return (
        <AuthContext.Provider value={auth}>
            <Routes>
                <Route
                    path="/"
                    element={user ? <Navigate to={homeRoute} replace /> : <Landing />}
                />

                <Route
                    path="/login"
                    element={user
                        ? <Navigate to={homeRoute} replace />
                        : <AuthPage mode="login" />}
                />

                <Route
                    path="/register"
                    element={user
                        ? <Navigate to={homeRoute} replace />
                        : <AuthPage mode="register" />}
                />

                <Route path="/admin/login" element={<AdminLogin />} />

                <Route
                    path="/customer"
                    element={
                        <Protected role="customer">
                            <CustomerOffers />
                        </Protected>
                    }
                />

                <Route
                    path="/customer/vouchers"
                    element={
                        <Protected role="customer">
                            <CustomerVouchers />
                        </Protected>
                    }
                />

                <Route
                    path="/merchant"
                    element={
                        <Protected role="merchant">
                            <MerchantHome />
                        </Protected>
                    }
                />

                <Route
                    path="/merchant/stores"
                    element={
                        <Protected role="merchant">
                            <MerchantStores />
                        </Protected>
                    }
                />

                <Route
                    path="/merchant/offers"
                    element={
                        <Protected role="merchant">
                            <MerchantOffers />
                        </Protected>
                    }
                />

                <Route
                    path="/merchant/billing"
                    element={
                        <Protected role="merchant">
                            <MerchantBilling />
                        </Protected>
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <Protected role="admin">
                            <AdminHome />
                        </Protected>
                    }
                />

                <Route path="*" element={<NotFound />} />
            </Routes>
        </AuthContext.Provider>
    );
}