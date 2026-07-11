import { useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function CreateRidePage() {
    const navigate = useNavigate();

    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [availableSeats, setAvailableSeats] = useState("");
    const [pricePerSeat, setPricePerSeat] = useState("");
    const [driverName, setDriverName] = useState("");
    const [vehicleName, setVehicleName] = useState("");
    const [departureDate, setDepartureDate] = useState("");
    const [departureTime, setDepartureTime] = useState("");

    const [loading, setLoading] = useState(false);

    const createRide = async (e) => {
        e.preventDefault();

        if (!source || !destination || !availableSeats || !pricePerSeat || !driverName || !vehicleName || !departureDate || !departureTime) {
            toast.warning("Please fill in all the details!");
            return;
        }

        setLoading(true);

        try {
            await api.post("/rides", {
                source,
                destination,
                availableSeats: parseInt(availableSeats),
                pricePerSeat: parseFloat(pricePerSeat),
                driverName,
                vehicleName,
                departureDate,
                departureTime
            });

            toast.success("Ride offered successfully!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Create ride error:", error);
            const errMsg = error.response?.data?.message || "Failed to create ride. Please check input formats.";
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex flex-column" style={{ background: "var(--dark-gradient)" }}>
            <Navbar />

            <div className="container my-5 animated-fade-in">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="glass-panel p-4 p-md-5">
                            {/* Header */}
                            <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary border-opacity-10">
                                <div>
                                    <h3 className="fw-bold text-white mb-1">🚗 Offer a Ride</h3>
                                    <p className="text-muted mb-0 small">Share details to match with passengers</p>
                                </div>
                                <button className="btn btn-secondary py-2" onClick={() => navigate("/dashboard")}>
                                    ← Back
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={createRide}>
                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <label className="text-muted small mb-2 fw-medium">Leaving From</label>
                                        <input
                                            className="form-control"
                                            placeholder="e.g. Gurgaon Hub"
                                            value={source}
                                            onChange={(e) => setSource(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="text-muted small mb-2 fw-medium">Going To</label>
                                        <input
                                            className="form-control"
                                            placeholder="e.g. Noida Cyber City"
                                            value={destination}
                                            onChange={(e) => setDestination(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="text-muted small mb-2 fw-medium">Departure Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={departureDate}
                                            onChange={(e) => setDepartureDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="text-muted small mb-2 fw-medium">Departure Time</label>
                                        <input
                                            type="time"
                                            className="form-control"
                                            value={departureTime}
                                            onChange={(e) => setDepartureTime(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="text-muted small mb-2 fw-medium">Available Seats</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="e.g. 4"
                                            min="1"
                                            value={availableSeats}
                                            onChange={(e) => setAvailableSeats(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="text-muted small mb-2 fw-medium">Price Per Seat (₹)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="e.g. 150"
                                            min="0"
                                            value={pricePerSeat}
                                            onChange={(e) => setPricePerSeat(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="text-muted small mb-2 fw-medium">Driver Name</label>
                                        <input
                                            className="form-control"
                                            placeholder="e.g. Rajat Sharma"
                                            value={driverName}
                                            onChange={(e) => setDriverName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="text-muted small mb-2 fw-medium">Vehicle Details</label>
                                        <input
                                            className="form-control"
                                            placeholder="e.g. Honda City (Black)"
                                            value={vehicleName}
                                            onChange={(e) => setVehicleName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-success w-100 py-3 fw-bold" disabled={loading}>
                                    {loading ? (
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                    ) : null}
                                    Publish Ride Offer
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateRidePage;