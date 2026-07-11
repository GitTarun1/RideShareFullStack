import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
    const navigate = useNavigate();
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(false);
    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [bookingLoading, setBookingLoading] = useState(null);
    const [selectedRide, setSelectedRide] = useState(null);
    const currentUserEmail = localStorage.getItem("email") || "";

    // Autocomplete suggestion lists
    const COMMON_CITIES = [
        "Gurgaon", "Noida", "Delhi", "Faridabad", "Ghaziabad", 
        "Bengaluru", "Mumbai", "Pune", "Hyderabad", "Chennai", 
        "Kolkata", "Ahmedabad", "Chandigarh", "Jaipur", "Lucknow"
    ];
    const uniqueSources = [...new Set([...COMMON_CITIES, ...rides.map(r => r.source).filter(Boolean)])];
    const uniqueDestinations = [...new Set([...COMMON_CITIES, ...rides.map(r => r.destination).filter(Boolean)])];

    // Fetch available rides
    const fetchRides = async () => {
        setLoading(true);
        try {
            const response = await api.get("/rides");
            setRides(response.data);
            if (response.data.length > 0) {
                setSelectedRide(response.data[0]); // Select first ride by default
            }
        } catch (error) {
            console.error("Fetch rides error:", error);
            toast.error("Failed to load rides!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRides();
    }, []);

    const bookRide = async (rideId) => {
        setBookingLoading(rideId);
        try {
            await api.post("/bookings", {
                rideId: rideId,
                seatsBooked: 1
            });
            toast.success("Ride booked successfully! You can view it under My Bookings.");
            
            // Optimistic UI update
            setRides((prevRides) =>
                prevRides.map((r) =>
                    r.id === rideId ? { ...r, availableSeats: r.availableSeats - 1 } : r
                )
            );
            
            // Update selected ride state to sync seat count
            if (selectedRide && selectedRide.id === rideId) {
                setSelectedRide(prev => ({ ...prev, availableSeats: prev.availableSeats - 1 }));
            }
        } catch (error) {
            console.error("Booking error:", error);
            const errMsg = error.response?.data?.message || "Booking failed! Not enough seats or expired ride.";
            toast.error(errMsg);
        } finally {
            setBookingLoading(null);
        }
    };

    const searchRides = async () => {
        if (!source && !destination) {
            fetchRides();
            return;
        }
        setLoading(true);
        try {
            const response = await api.get(`/rides/search?source=${source}&destination=${destination}`);
            setRides(response.data);
            if (response.data.length > 0) {
                setSelectedRide(response.data[0]);
            } else {
                setSelectedRide(null);
                toast.info("No rides found matching that criteria.");
            }
        } catch (error) {
            console.error("Search error:", error);
            toast.error("Search failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSource("");
        setDestination("");
        fetchRides();
    };

    return (
        <div className="min-vh-100 d-flex flex-column" style={{ background: "var(--dark-gradient)" }}>
            <Navbar />

            {/* Header Jumbotron */}
            <div className="page-header">
                <div className="container">
                    <h2>🔍 Find Your Next Ride</h2>
                    <p>Commute efficiently, share expenses, and reduce carbon emissions.</p>
                </div>
            </div>

            <div className="container my-5 animated-fade-in">
                <div className="row justify-content-center">
                    {/* Main Content: Search and Ride Cards */}
                    <div className="col-lg-10 col-xl-8">
                        {/* Search Control Card */}
                        <div className="glass-panel p-4 mb-4">
                            <h5 className="fw-bold mb-3" style={{ color: "var(--text-primary)" }}>🔍 Search Filters</h5>
                            <div className="row g-2">
                                <div className="col-md-5">
                                    <input
                                        className="form-control"
                                        placeholder="Leaving from (e.g. Gurgaon)"
                                        value={source}
                                        onChange={(e) => setSource(e.target.value)}
                                        list="sources-list"
                                    />
                                    <datalist id="sources-list">
                                        {uniqueSources.map(city => (
                                            <option key={city} value={city} />
                                        ))}
                                    </datalist>
                                </div>
                                <div className="col-md-5">
                                    <input
                                        className="form-control"
                                        placeholder="Going to (e.g. Noida)"
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                        list="destinations-list"
                                    />
                                    <datalist id="destinations-list">
                                        {uniqueDestinations.map(city => (
                                            <option key={city} value={city} />
                                        ))}
                                    </datalist>
                                </div>
                                <div className="col-md-2 d-grid">
                                    <button className="btn btn-primary" onClick={searchRides}>Search</button>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <button className="btn btn-secondary py-2 px-3" onClick={handleReset}>
                                    Reset Filters
                                </button>
                                <button className="btn btn-success py-2 px-3" onClick={() => navigate("/create-ride")}>
                                    + Offer a Ride
                                </button>
                            </div>
                        </div>

                        {/* Ride Cards List */}
                        <h4 className="fw-bold mb-3 d-flex justify-content-between align-items-center" style={{ color: "var(--text-primary)" }}>
                            <span>Available Journeys</span>
                            <span className="badge bg-secondary fs-6 rounded-pill">{rides.length} Found</span>
                        </h4>

                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status"></div>
                                <p className="text-muted mt-2">Scanning available journeys...</p>
                            </div>
                        ) : rides.length === 0 ? (
                            <div className="glass-panel p-5 text-center text-muted">
                                <h3>📭 No Rides Available</h3>
                                <p>Be the first to offer a ride along this route!</p>
                                <button className="btn btn-success mt-2" onClick={() => navigate("/create-ride")}>Offer a Ride</button>
                            </div>
                        ) : (
                            <div className="d-flex flex-column gap-3">
                                {rides.map((ride) => {
                                    const isSelected = selectedRide && selectedRide.id === ride.id;
                                    return (
                                        <div
                                            key={ride.id}
                                            className={`glass-panel p-3 border-start border-4 ${isSelected ? 'border-primary' : 'border-secondary border-opacity-25'}`}
                                            style={{ 
                                                cursor: "pointer", 
                                                background: isSelected ? "var(--bg-card-hover)" : "var(--bg-card)"
                                            }}
                                            onClick={() => setSelectedRide(ride)}
                                        >
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <h5 className="fw-bold mb-0" style={{ color: "var(--text-primary)" }}>
                                                    🚗 {ride.source} → {ride.destination}
                                                </h5>
                                                <span className="fs-5 fw-bold" style={{ color: "#d97706" }}>₹ {ride.pricePerSeat}</span>
                                            </div>
                                            
                                            <div className="row g-2 mb-3 small" style={{ color: "var(--text-muted-color)" }}>
                                                <div className="col-6 col-sm-3">👤 <strong style={{ color: "var(--text-secondary)" }}>Driver:</strong> <span style={{ color: "var(--text-primary)" }}>{ride.driverName}</span></div>
                                                <div className="col-6 col-sm-3">🚘 <strong style={{ color: "var(--text-secondary)" }}>Vehicle:</strong> <span style={{ color: "var(--text-primary)" }}>{ride.vehicleName}</span></div>
                                                <div className="col-6 col-sm-3">📅 <strong style={{ color: "var(--text-secondary)" }}>Date:</strong> <span style={{ color: "var(--text-primary)" }}>{ride.departureDate}</span></div>
                                                <div className="col-6 col-sm-3">🕒 <strong style={{ color: "var(--text-secondary)" }}>Time:</strong> <span style={{ color: "var(--text-primary)" }}>{ride.departureTime}</span></div>
                                            </div>

                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className={`badge ${ride.availableSeats > 0 ? 'bg-success' : 'bg-danger'} bg-opacity-20 text-${ride.availableSeats > 0 ? 'success' : 'danger'} border border-${ride.availableSeats > 0 ? 'success' : 'danger'} border-opacity-25 py-2 px-3`}>
                                                    💺 {ride.availableSeats} Seats Left
                                                </span>
                                                {ride.driverEmail && ride.driverEmail.toLowerCase() === currentUserEmail.toLowerCase() ? (
                                                    <span className="badge rounded-pill py-2 px-3" style={{
                                                        background: "#e0f2fe",
                                                        color: "#0369a1",
                                                        border: "1px solid #bae6fd",
                                                        fontSize: "12px",
                                                        fontWeight: "600"
                                                    }}>🚗 Your Ride</span>
                                                ) : (
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        disabled={bookingLoading === ride.id || ride.availableSeats <= 0}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            bookRide(ride.id);
                                                        }}
                                                    >
                                                        {bookingLoading === ride.id ? (
                                                            <span className="spinner-border spinner-border-sm me-1"></span>
                                                        ) : null}
                                                        {ride.availableSeats > 0 ? "Book Ride" : "Sold Out"}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;