import { useNavigate } from "react-router-dom";

function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-vh-100 d-flex flex-column" style={{ background: "var(--bg-base)" }}>

            {/* Top Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light py-3 px-4 px-md-5" style={{
                background: "#ffffff",
                borderBottom: "1px solid var(--border)"
            }}>
                <div className="container-fluid d-flex justify-content-between align-items-center">
                    <span className="fw-extrabold fs-4" style={{ letterSpacing: "-0.5px", color: "var(--text-primary)" }}>
                        🚗 <span style={{ color: "var(--accent)" }}>RideShare</span>
                    </span>
                    <div className="d-flex gap-2">
                        <button className="btn btn-secondary px-4" onClick={() => navigate("/login")}>Sign In</button>
                        <button className="btn btn-primary px-4" onClick={() => navigate("/login?mode=signup")}>Join Now</button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="container my-auto py-5 animated-fade-in">
                <div className="row align-items-center g-5">
                    <div className="col-lg-6 text-center text-lg-start">

                        {/* Pill Badge */}
                        <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-4 small fw-semibold" style={{
                            background: "#e0f2fe",
                            color: "#0369a1",
                            border: "1px solid #bae6fd"
                        }}>
                            🚀 Next-Generation Shared Mobility
                        </div>

                        <h1 className="display-4 fw-extrabold mb-3" style={{ lineHeight: "1.15", color: "var(--text-primary)" }}>
                            Travel Smarter.<br />
                            <span style={{ color: "var(--accent)" }}>Travel Together.</span>
                        </h1>

                        <p className="lead mb-4" style={{ color: "var(--text-muted-color)", maxWidth: "500px" }}>
                            Connect with verified drivers, share empty seats, split fuel costs, and make your daily commute eco-friendly and affordable.
                        </p>

                        <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start gap-3">
                            <button className="btn btn-primary btn-lg px-5 py-3 fw-semibold" onClick={() => navigate("/login")}>
                                Find a Ride →
                            </button>
                            <button className="btn btn-secondary btn-lg px-5 py-3 fw-semibold" onClick={() => navigate("/login?mode=signup")}>
                                Offer a Seat
                            </button>
                        </div>

                        {/* Stats Panel */}
                        <div className="row mt-5 pt-4 text-center text-sm-start" style={{ borderTop: "1px solid var(--border)" }}>
                            <div className="col-4">
                                <h3 className="fw-bold mb-0" style={{ color: "var(--text-primary)" }}>10k+</h3>
                                <small style={{ color: "var(--text-muted-color)" }}>Active Users</small>
                            </div>
                            <div className="col-4">
                                <h3 className="fw-bold mb-0" style={{ color: "var(--text-primary)" }}>50k+</h3>
                                <small style={{ color: "var(--text-muted-color)" }}>Rides Booked</small>
                            </div>
                            <div className="col-4">
                                <h3 className="fw-bold mb-0" style={{ color: "var(--text-primary)" }}>₹1.2M</h3>
                                <small style={{ color: "var(--text-muted-color)" }}>Saved Daily</small>
                            </div>
                        </div>
                    </div>

                    {/* Demo Card */}
                    <div className="col-lg-6 d-none d-lg-block">
                        <div className="glass-panel p-5 mx-auto" style={{ maxWidth: "440px" }}>

                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="d-flex align-items-center gap-3">
                                    <div style={{
                                        width: "10px", height: "10px", borderRadius: "50%",
                                        background: "#10b981", boxShadow: "0 0 0 4px #d1fae5"
                                    }} />
                                    <div>
                                        <div className="fw-semibold" style={{ fontSize: "14px", color: "var(--text-primary)" }}>Active Route Matching</div>
                                        <small style={{ color: "var(--text-muted-color)" }}>Near Sector-62</small>
                                    </div>
                                </div>
                                <span className="badge rounded-pill px-3 py-2" style={{
                                    background: "#d1fae5", color: "#065f46",
                                    border: "1px solid #a7f3d0", fontSize: "11px"
                                }}>Live Match</span>
                            </div>

                            <div className="p-3 mb-3 rounded-3" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span style={{ color: "var(--text-muted-color)", fontSize: "12px" }}>Route Summary</span>
                                    <span className="fw-bold" style={{ color: "#d97706", fontSize: "13px" }}>₹ 180 / seat</span>
                                </div>
                                <div className="fw-semibold mb-1" style={{ color: "var(--text-primary)", fontSize: "14px" }}>📍 Gurgaon Hub</div>
                                <div style={{ color: "var(--text-dim)", marginLeft: "4px", fontSize: "12px" }}>↓  40 min</div>
                                <div className="fw-semibold mt-1" style={{ color: "var(--text-primary)", fontSize: "14px" }}>📍 Noida Cyber City</div>
                            </div>

                            <div className="d-flex align-items-center justify-content-between mb-4" style={{ fontSize: "13px", color: "var(--text-muted-color)" }}>
                                <span>👤 Driver: Rajat Sharma</span>
                                <span>🚘 Honda City</span>
                            </div>

                            <button className="btn btn-primary w-100 py-3 fw-semibold" onClick={() => navigate("/login")}>
                                Try Booking Simulation →
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature Cards */}
            <div className="container py-5 mt-3">
                <div className="row g-4 justify-content-center">
                    <div className="col-md-4">
                        <div className="glass-panel p-4 h-100">
                            <div className="mb-3" style={{ fontSize: "32px" }}>🛡️</div>
                            <h5 className="fw-bold mb-2" style={{ color: "var(--text-primary)" }}>Safe & Verified</h5>
                            <p className="mb-0" style={{ color: "var(--text-muted-color)", fontSize: "14px" }}>Every driver and rider profile is validated with strict government ID checks and continuous rating audits.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="glass-panel p-4 h-100">
                            <div className="mb-3" style={{ fontSize: "32px" }}>💰</div>
                            <h5 className="fw-bold mb-2" style={{ color: "var(--text-primary)" }}>Cost Efficient</h5>
                            <p className="mb-0" style={{ color: "var(--text-muted-color)", fontSize: "14px" }}>Split fuel cost, toll tax, and city tax equally. Save up to 70% compared to private ride rentals.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="glass-panel p-4 h-100">
                            <div className="mb-3" style={{ fontSize: "32px" }}>🌱</div>
                            <h5 className="fw-bold mb-2" style={{ color: "var(--text-primary)" }}>Eco-Friendly</h5>
                            <p className="mb-0" style={{ color: "var(--text-muted-color)", fontSize: "14px" }}>Carpooling reduces urban traffic gridlocks and greenhouse carbon emissions drastically.</p>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="text-center py-4 mt-auto small" style={{ borderTop: "1px solid var(--border)", color: "var(--text-dim)" }}>
                RideShare © 2026. Made with ❤️ for Professional Portfolio.
            </footer>
        </div>
    );
}

export default LandingPage;