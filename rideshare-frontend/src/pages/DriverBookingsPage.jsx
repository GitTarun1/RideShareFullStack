import { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function DriverBookingsPage() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);

    // Fetch bookings for rides owned by the logged-in driver
    const fetchDriverBookings = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get("/bookings/driver");
            setBookings(response.data);
        } catch (error) {
            console.error("Fetch driver bookings error:", error);
            const msg = error.response?.data?.message || "Failed to load booking requests!";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDriverBookings();
    }, [fetchDriverBookings]);

    const approveBooking = async (bookingId) => {
        setActionLoading(`approve-${bookingId}`);
        try {
            await api.put(`/bookings/${bookingId}/approve`);
            toast.success("✅ Booking approved! Passenger has been confirmed.");
            // Optimistic UI update
            setBookings(prev =>
                prev.map(b => b.id === bookingId ? { ...b, bookingStatus: "APPROVED" } : b)
            );
        } catch (error) {
            console.error("Approve error:", error);
            const msg = error.response?.data?.message || "Failed to approve booking. Please try again.";
            toast.error(msg);
            // Refetch to sync state with server
            await fetchDriverBookings();
        } finally {
            setActionLoading(null);
        }
    };

    const rejectBooking = async (bookingId) => {
        setActionLoading(`cancel-${bookingId}`);
        try {
            await api.put(`/bookings/${bookingId}/cancel`);
            toast.info("Booking rejected and cancelled.");
            // Optimistic UI update
            setBookings(prev =>
                prev.map(b => b.id === bookingId ? { ...b, bookingStatus: "CANCELLED" } : b)
            );
        } catch (error) {
            console.error("Reject error:", error);
            const msg = error.response?.data?.message || "Failed to reject booking.";
            toast.error(msg);
            // Refetch to sync state with server
            await fetchDriverBookings();
        } finally {
            setActionLoading(null);
        }
    };

    const pendingCount = bookings.filter(b => b.bookingStatus === "PENDING").length;

    return (
        <div className="min-vh-100 d-flex flex-column" style={{ background: "var(--bg-base)" }}>
            <Navbar />

            {/* Page Header */}
            <div className="page-header">
                <div className="container d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                        <h2>🚗 Manage Booking Requests</h2>
                        <p>Review and accept passengers who want to join your rides</p>
                    </div>
                    <div className="d-flex gap-2 align-items-center">
                        {pendingCount > 0 && (
                            <span className="badge rounded-pill px-3 py-2" style={{
                                background: "#fef3c7",
                                color: "#92400e",
                                border: "1px solid #fde68a",
                                fontSize: "13px"
                            }}>
                                ⏳ {pendingCount} Pending
                            </span>
                        )}
                        <button
                            className="btn btn-secondary"
                            onClick={fetchDriverBookings}
                            disabled={loading}
                            style={{ fontSize: "13px" }}
                        >
                            {loading ? (
                                <span className="spinner-border spinner-border-sm me-1" />
                            ) : "↻ "} Refresh
                        </button>
                    </div>
                </div>
            </div>

            <div className="container my-5 animated-fade-in flex-grow-1">
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status" />
                        <p className="mt-3" style={{ color: "var(--text-muted-color)" }}>Loading booking requests...</p>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="glass-panel p-5 text-center mx-auto" style={{ maxWidth: "580px" }}>
                        <div style={{ fontSize: "52px", marginBottom: "16px" }}>📭</div>
                        <h4 className="fw-bold mb-2" style={{ color: "var(--text-primary)" }}>No Booking Requests Yet</h4>
                        <p style={{ color: "var(--text-muted-color)" }} className="mb-4">
                            When passengers book one of your rides, their requests will appear here for you to approve or reject.
                        </p>
                        <button className="btn btn-primary" onClick={() => navigate("/create-ride")}>
                            + Offer a New Ride
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Summary Stats */}
                        <div className="row g-3 mb-5">
                            <div className="col-4">
                                <div className="stat-pill">
                                    <span className="stat-number" style={{ color: "#fbbf24" }}>
                                        {bookings.filter(b => b.bookingStatus === "PENDING").length}
                                    </span>
                                    <span className="stat-label">Pending</span>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="stat-pill">
                                    <span className="stat-number" style={{ color: "#4ade80" }}>
                                        {bookings.filter(b => b.bookingStatus === "APPROVED").length}
                                    </span>
                                    <span className="stat-label">Approved</span>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="stat-pill">
                                    <span className="stat-number" style={{ color: "#f87171" }}>
                                        {bookings.filter(b => b.bookingStatus === "CANCELLED").length}
                                    </span>
                                    <span className="stat-label">Rejected</span>
                                </div>
                            </div>
                        </div>

                        {/* Booking Cards */}
                        <div className="row g-4">
                            {bookings.map((booking) => {
                                const isPending   = booking.bookingStatus === "PENDING";
                                const isApproved  = booking.bookingStatus === "APPROVED";
                                const isCancelled = booking.bookingStatus === "CANCELLED";

                                let statusColor  = "#fbbf24";
                                let statusBg     = "rgba(251,191,36,0.14)";
                                let statusBorder = "rgba(251,191,36,0.28)";
                                if (isApproved)  { statusColor = "#4ade80"; statusBg = "rgba(74,222,128,0.12)";  statusBorder = "rgba(74,222,128,0.28)"; }
                                if (isCancelled) { statusColor = "#f87171"; statusBg = "rgba(248,113,113,0.12)"; statusBorder = "rgba(248,113,113,0.28)"; }

                                return (
                                    <div key={booking.id} className="col-md-6 col-lg-4">
                                        <div
                                            className="glass-panel h-100 p-4 d-flex flex-column"
                                            style={{ borderLeft: `4px solid ${statusColor}` }}
                                        >
                                            {/* Card header */}
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <span style={{ color: "var(--text-dim)", fontSize: "12px" }}>
                                                    Request #{booking.id}
                                                </span>
                                                <span className="badge px-3 py-2 rounded-pill" style={{
                                                    background: statusBg,
                                                    color: statusColor,
                                                    border: `1px solid ${statusBorder}`,
                                                    fontSize: "11px",
                                                    fontWeight: "600"
                                                }}>
                                                    {booking.bookingStatus}
                                                </span>
                                            </div>

                                            {/* Passenger avatar */}
                                            <div className="d-flex align-items-center gap-2 mb-3">
                                                <div style={{
                                                    width: "38px", height: "38px", borderRadius: "50%",
                                                    background: "linear-gradient(135deg, #14b8a6, #06b6d4)",
                                                    display: "flex", alignItems: "center",
                                                    justifyContent: "center", fontSize: "18px",
                                                    flexShrink: 0
                                                }}>
                                                    👤
                                                </div>
                                                <div>
                                                    <div className="fw-semibold" style={{ color: "var(--text-primary)", fontSize: "14px" }}>
                                                        {booking.passengerName}
                                                    </div>
                                                    <div style={{ color: "var(--text-dim)", fontSize: "11px" }}>Passenger</div>
                                                </div>
                                            </div>

                                            {/* Route */}
                                            <div className="route-box mb-3">
                                                <div className="d-flex align-items-center gap-2 mb-2">
                                                    <span style={{ color: "var(--accent)", fontSize: "10px" }}>●</span>
                                                    <span style={{ color: "var(--text-primary)", fontSize: "13px", fontWeight: "500" }}>
                                                        {booking.source}
                                                    </span>
                                                </div>
                                                <div style={{ color: "var(--text-dim)", fontSize: "10px", marginLeft: "18px", marginBottom: "4px" }}>↓</div>
                                                <div className="d-flex align-items-center gap-2">
                                                    <span style={{ color: "#4ade80", fontSize: "10px" }}>●</span>
                                                    <span style={{ color: "var(--text-primary)", fontSize: "13px", fontWeight: "500" }}>
                                                        {booking.destination}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Trip details */}
                                            <div className="d-flex flex-column gap-2 mb-3 flex-grow-1" style={{ fontSize: "13px", color: "var(--text-muted-color)" }}>
                                                <div>
                                                    💺 <strong style={{ color: "var(--text-secondary)" }}>Seats:</strong>{" "}
                                                    <span style={{ color: "var(--text-primary)" }}>{booking.seatsBooked}</span>
                                                </div>
                                                <div>
                                                    💰 <strong style={{ color: "var(--text-secondary)" }}>Total:</strong>{" "}
                                                    <span className="fw-bold" style={{ color: "#fbbf24" }}>
                                                        ₹ {(booking.pricePerSeat * booking.seatsBooked).toFixed(0)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Action Buttons — only for PENDING */}
                                            {isPending && (
                                                <div className="d-flex gap-2 mt-auto">
                                                    <button
                                                        id={`approve-btn-${booking.id}`}
                                                        className="btn btn-success flex-grow-1 py-2"
                                                        disabled={actionLoading !== null}
                                                        onClick={() => approveBooking(booking.id)}
                                                        style={{ fontSize: "13px" }}
                                                    >
                                                        {actionLoading === `approve-${booking.id}` ? (
                                                            <span className="spinner-border spinner-border-sm me-1" />
                                                        ) : "✓ "}
                                                        Accept
                                                    </button>
                                                    <button
                                                        id={`reject-btn-${booking.id}`}
                                                        className="btn btn-danger flex-grow-1 py-2"
                                                        disabled={actionLoading !== null}
                                                        onClick={() => rejectBooking(booking.id)}
                                                        style={{ fontSize: "13px" }}
                                                    >
                                                        {actionLoading === `cancel-${booking.id}` ? (
                                                            <span className="spinner-border spinner-border-sm me-1" />
                                                        ) : "✗ "}
                                                        Reject
                                                    </button>
                                                </div>
                                            )}

                                            {isApproved && (
                                                <div className="text-center py-2 rounded-3 mt-auto" style={{
                                                    background: "rgba(74,222,128,0.09)",
                                                    border: "1px solid rgba(74,222,128,0.22)",
                                                    color: "#4ade80",
                                                    fontSize: "13px",
                                                    fontWeight: "600"
                                                }}>
                                                    ✓ Passenger Confirmed
                                                </div>
                                            )}

                                            {isCancelled && (
                                                <div className="text-center py-2 rounded-3 mt-auto" style={{
                                                    background: "rgba(248,113,113,0.09)",
                                                    border: "1px solid rgba(248,113,113,0.22)",
                                                    color: "#f87171",
                                                    fontSize: "13px",
                                                    fontWeight: "600"
                                                }}>
                                                    ✗ Booking Rejected
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            <footer className="text-center py-4 border-top text-muted small" style={{ borderColor: "var(--border) !important" }}>
                RideShare © 2026. Made with ❤️ for Professional Portfolio.
            </footer>
        </div>
    );
}

export default DriverBookingsPage;
