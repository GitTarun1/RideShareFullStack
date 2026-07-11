import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function MyBookingsPage() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cancelLoading, setCancelLoading] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            try {
                const response = await api.get("/bookings");
                setBookings(response.data);
            } catch (error) {
                console.error("Fetch bookings error:", error);
                toast.error("Failed to load bookings!");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const cancelBooking = async (bookingId) => {
        setCancelLoading(bookingId);
        try {
            await api.put(`/bookings/${bookingId}/cancel`);
            toast.success("Booking cancelled successfully.");
            
            // Optimistic update of state instead of page reload
            setBookings((prevBookings) =>
                prevBookings.map((b) =>
                    b.id === bookingId ? { ...b, bookingStatus: "CANCELLED" } : b
                )
            );
        } catch (error) {
            console.error("Cancel booking error:", error);
            const errMsg = error.response?.data?.message || "Cancellation failed.";
            toast.error(errMsg);
        } finally {
            setCancelLoading(null);
        }
    };

    return (
        <div className="min-vh-100 d-flex flex-column" style={{ background: "var(--dark-gradient)" }}>
            <Navbar />

            {/* Header */}
            <div className="page-header">
                <div className="container">
                    <h2>🎫 My Booked Rides</h2>
                    <p>View your upcoming journeys and check trip status details.</p>
                </div>
            </div>

            <div className="container my-5 animated-fade-in flex-grow-1">
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                        <p className="text-muted mt-2">Loading booking history...</p>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="glass-panel p-5 text-center text-muted mx-auto" style={{ maxWidth: "600px" }}>
                        <h4 className="fw-bold mb-2" style={{ color: "var(--text-primary)" }}>No Bookings Yet</h4>
                        <p className="mb-4">You haven't booked any rides. Check out the dashboard to find available journeys.</p>
                        <button className="btn btn-primary" onClick={() => navigate("/dashboard")}>Find Rides</button>
                    </div>
                ) : (
                    <div className="row g-4">
                        {bookings.map((booking) => {
                            const isPending = booking.bookingStatus === "PENDING";
                            const isCancelled = booking.bookingStatus === "CANCELLED";
                            
                            return (
                                <div key={booking.id} className="col-md-6 col-lg-4">
                                    <div className="glass-panel h-100 p-4 d-flex flex-column">
                                        {/* Status header */}
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <span className="text-muted small">Booking #{booking.id}</span>
                                            <span className={`badge py-2 px-3 rounded-pill ${
                                                isPending 
                                                    ? 'bg-warning text-dark bg-opacity-20 border border-warning border-opacity-25' 
                                                    : isCancelled 
                                                        ? 'bg-danger text-danger bg-opacity-20 border border-danger border-opacity-25' 
                                                        : 'bg-success text-success bg-opacity-20 border border-success border-opacity-25'
                                            }`}>
                                                {booking.bookingStatus}
                                            </span>
                                        </div>

                                        {/* Journey */}
                                        <h5 className="fw-bold mb-3" style={{ color: "var(--text-primary)" }}>
                                            {booking.source} &rarr; {booking.destination}
                                        </h5>

                                        <hr className="my-2 border-secondary border-opacity-20" />

                                        {/* Details */}
                                        <div className="d-flex flex-column gap-2 my-3 small flex-grow-1" style={{ color: "var(--text-muted-color)" }}>
                                            <div>👤 <strong style={{ color: "var(--text-secondary)" }}>Driver:</strong> <span style={{ color: "var(--text-primary)" }}>{booking.driverName}</span></div>
                                            <div>🚘 <strong style={{ color: "var(--text-secondary)" }}>Vehicle:</strong> <span style={{ color: "var(--text-primary)" }}>{booking.vehicleName}</span></div>
                                            <div>💺 <strong style={{ color: "var(--text-secondary)" }}>Seats Booked:</strong> <span style={{ color: "var(--text-primary)" }}>{booking.seatsBooked}</span></div>
                                            <div>💰 <strong style={{ color: "var(--text-secondary)" }}>Total Price:</strong> <span className="fw-bold" style={{ color: "#fbbf24" }}>₹ {booking.pricePerSeat * booking.seatsBooked}</span></div>
                                        </div>

                                        {/* Actions */}
                                        {isPending && (
                                            <button
                                                className="btn btn-danger w-100 py-2 mt-auto"
                                                disabled={cancelLoading === booking.id}
                                                onClick={() => cancelBooking(booking.id)}
                                            >
                                                {cancelLoading === booking.id ? (
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                ) : null}
                                                Cancel Journey
                                            </button>
                                        )}
                                        
                                        {isCancelled && (
                                            <button className="btn btn-secondary w-100 py-2 mt-auto" disabled>
                                                Cancelled
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            
            <footer className="text-center py-4 border-top border-secondary border-opacity-10 text-muted small">
                RideShare © 2026. Made with ❤️ for Professional Portfolio.
            </footer>
        </div>
    );
}

export default MyBookingsPage;