import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // Dynamic Stats
    const [stats, setStats] = useState({
        completedCount: 0,
        averageRating: "N/A",
        secondaryStat: "0",
        secondaryLabel: "Bookings Made"
    });

    useEffect(() => {
        const fetchProfileAndStats = async () => {
            setLoading(true);
            try {
                // 1. Fetch User Profile
                const profileRes = await api.get("/users/profile");
                const userProfile = profileRes.data;
                setProfile(userProfile);

                // 2. Fetch parallel data to calculate real insights
                const [bookingsRes, ridesRes, reviewsRes] = await Promise.all([
                    api.get("/bookings").catch(() => ({ data: [] })),
                    api.get("/rides").catch(() => ({ data: [] })),
                    api.get("/reviews").catch(() => ({ data: [] }))
                ]);

                // All bookings made by this user
                const myBookings = bookingsRes.data;
                const approvedBookings = myBookings.filter((b) => b.bookingStatus === "APPROVED");

                // Rides posted by this user
                const myRides = ridesRes.data.filter(
                    (r) => r.driverEmail && r.driverEmail.toLowerCase() === userProfile.email.toLowerCase()
                );

                // Average rating from reviews
                const myReviews = reviewsRes.data.filter(
                    (r) => r.reviewFor && (
                        r.reviewFor.toLowerCase() === userProfile.fullName.toLowerCase() ||
                        r.reviewFor.toLowerCase() === userProfile.email.toLowerCase()
                    )
                );
                let avgRating = "N/A";
                if (myReviews.length > 0) {
                    const totalRating = myReviews.reduce((sum, r) => sum + r.rating, 0);
                    avgRating = (totalRating / myReviews.length).toFixed(1);
                }

                setStats({
                    completedCount: approvedBookings.length,
                    averageRating: avgRating === "N/A" ? "—" : avgRating,
                    secondaryStat: myRides.length.toString(),
                    secondaryLabel: "Rides Posted"
                });
            } catch (error) {
                console.error("Fetch profile/stats error:", error);
                toast.error("Failed to load profile details!");
            } finally {
                setLoading(false);
            }
        };

        fetchProfileAndStats();
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        toast.info("Logged out successfully.");
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="min-vh-100 d-flex flex-column" style={{ background: "var(--bg-base)" }}>
                <Navbar />
                <div className="container my-auto text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-2" style={{ color: "var(--text-muted-color)" }}>Loading profile details...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-vh-100 d-flex flex-column" style={{ background: "var(--bg-base)" }}>
                <Navbar />
                <div className="container my-auto text-center py-5">
                    <h4 className="text-danger fw-bold">⚠️ Profile Load Error</h4>
                    <p className="text-muted">Unable to retrieve session profile details.</p>
                    <button className="btn btn-primary" onClick={() => navigate("/login")}>Go to Login</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100 d-flex flex-column" style={{ background: "var(--bg-base)" }}>
            <Navbar />

            <div className="container my-5 animated-fade-in flex-grow-1">
                <div className="row justify-content-center">
                    <div className="col-lg-8 col-xl-6">
                        <div className="glass-panel p-4 p-md-5 position-relative overflow-hidden">
                            {/* Top decorative color bar */}
                            <div className="position-absolute top-0 start-0 w-100" style={{ height: "6px", background: "var(--accent-gradient)" }}></div>

                            {/* Header Section */}
                            <div className="d-flex flex-column align-items-center text-center mb-4">
                                <div className="mb-3 d-flex align-items-center justify-content-center" style={{
                                    width: "80px",
                                    height: "80px",
                                    borderRadius: "50%",
                                    background: "var(--accent-light)",
                                    border: "2px solid var(--border)",
                                    boxShadow: "var(--shadow-sm)"
                                }}>
                                    <span className="fs-1">👤</span>
                                </div>
                                <h3 className="fw-bold mb-1" style={{ color: "var(--text-primary)" }}>{profile.fullName}</h3>
                                <p className="mb-0 small" style={{ color: "var(--text-muted-color)" }}>{profile.email}</p>
                            </div>

                            <hr className="my-4" style={{ borderColor: "var(--border)" }} />

                            {/* User Account Details */}
                            <h5 className="fw-bold mb-3" style={{ color: "var(--text-primary)" }}>Information</h5>
                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <div className="p-3 rounded-3" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                                        <small className="d-block mb-1" style={{ color: "var(--text-muted-color)", fontSize: "11px", fontWeight: "600", textTransform: "uppercase" }}>Email Address</small>
                                        <span className="fw-medium" style={{ color: "var(--text-primary)" }}>{profile.email}</span>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="p-3 rounded-3" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                                        <small className="d-block mb-1" style={{ color: "var(--text-muted-color)", fontSize: "11px", fontWeight: "600", textTransform: "uppercase" }}>Member ID</small>
                                        <span className="fw-medium" style={{ color: "var(--text-primary)" }}>#US-{profile.id}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Dynamic Statistics / Analytics */}
                            <h5 className="fw-bold mb-3" style={{ color: "var(--text-primary)" }}>📈 Travel Insights</h5>
                            <div className="p-4 mb-4 rounded-3 text-center" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                                <div className="row">
                                    <div className="col-4 border-end" style={{ borderColor: "var(--border)" }}>
                                        <h3 className="fw-extrabold mb-1" style={{ color: "var(--accent)" }}>{stats.completedCount}</h3>
                                        <small style={{ color: "var(--text-muted-color)", fontSize: "11px", fontWeight: "500" }}>Approved Rides</small>
                                    </div>
                                    <div className="col-4 border-end" style={{ borderColor: "var(--border)" }}>
                                        <h3 className="fw-extrabold mb-1" style={{ color: "#d97706" }}>{stats.averageRating}</h3>
                                        <small style={{ color: "var(--text-muted-color)", fontSize: "11px", fontWeight: "500" }}>Avg Rating</small>
                                    </div>
                                    <div className="col-4">
                                        <h3 className="fw-extrabold mb-1" style={{ color: "#059669" }}>{stats.secondaryStat}</h3>
                                        <small style={{ color: "var(--text-muted-color)", fontSize: "11px", fontWeight: "500" }}>{stats.secondaryLabel}</small>
                                    </div>
                                </div>
                            </div>

                            {/* Actions Area */}
                            <div className="d-grid gap-2">
                                <button className="btn btn-danger py-3 fw-bold" onClick={logout}>
                                    Log Out Securely
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="text-center py-4 small" style={{ borderTop: "1px solid var(--border)", color: "var(--text-dim)" }}>
                RideShare &copy; 2026. Made with love for Professional Portfolio.
            </footer>
        </div>
    );
}

export default ProfilePage;