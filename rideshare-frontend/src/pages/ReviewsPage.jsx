import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { toast } from "react-toastify";

function ReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Approved bookings used to build driver dropdown
    const [approvedDrivers, setApprovedDrivers] = useState([]);

    // Form inputs
    const [reviewFor, setReviewFor] = useState("");
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch reviews and the user's own bookings in parallel
                const [reviewsRes, bookingsRes] = await Promise.all([
                    api.get("/reviews"),
                    api.get("/bookings")
                ]);

                setReviews(reviewsRes.data);

                // Build a unique list of driver names from APPROVED bookings
                const approved = bookingsRes.data.filter(
                    (b) => b.bookingStatus === "APPROVED"
                );
                const uniqueDrivers = [
                    ...new Map(
                        approved.map((b) => [b.driverName, b.driverName])
                    ).values()
                ];
                setApprovedDrivers(uniqueDrivers);

                // Pre-select first eligible driver
                if (uniqueDrivers.length > 0) {
                    setReviewFor(uniqueDrivers[0]);
                }
            } catch (error) {
                console.error("Failed to load data:", error);
                toast.error("Failed to load reviews.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const createReview = async (e) => {
        e.preventDefault();

        if (!reviewFor || !comment) {
            toast.warning("Please select a driver and write your comment.");
            return;
        }

        setSubmitting(true);
        try {
            const response = await api.post("/reviews", {
                reviewFor,
                rating: parseInt(rating),
                comment
            });

            toast.success("Review published successfully!");
            setReviews(prev => [response.data, ...prev]);
            setComment("");
            setRating(5);
        } catch (error) {
            console.error("Create review error:", error);
            const msg = error.response?.data?.message
                || "Failed to submit review. Make sure you have an approved booking with this driver.";
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const hasEligibleDrivers = approvedDrivers.length > 0;

    return (
        <div className="min-vh-100 d-flex flex-column" style={{ background: "var(--bg-base)" }}>
            <Navbar />

            {/* Header */}
            <div className="page-header">
                <div className="container">
                    <h2>Feedback &amp; Reviews</h2>
                    <p>Read experiences shared by our community or write your own verified review.</p>
                </div>
            </div>

            <div className="container my-5 animated-fade-in flex-grow-1">
                <div className="row g-4">

                    {/* Write Review Panel */}
                    <div className="col-lg-5">
                        <div className="glass-panel p-4 position-sticky" style={{ top: "90px" }}>
                            <h5 className="fw-bold mb-1" style={{ color: "var(--text-primary)" }}>Write a Review</h5>

                            {/* Info / eligibility box */}
                            {hasEligibleDrivers ? (
                                <div className="p-3 rounded-3 mb-4" style={{
                                    background: "#dcfce7",
                                    border: "1px solid #bbf7d0",
                                    fontSize: "13px",
                                    color: "#166534"
                                }}>
                                    You have <strong>{approvedDrivers.length}</strong> approved ride{approvedDrivers.length > 1 ? "s" : ""}. Select a driver below to write your review.
                                </div>
                            ) : (
                                <div className="p-3 rounded-3 mb-4" style={{
                                    background: "#fef9c3",
                                    border: "1px solid #fde68a",
                                    fontSize: "13px",
                                    color: "#854d0e"
                                }}>
                                    You can only review drivers after your booking has been <strong>approved</strong> by them. Book a ride and wait for approval to unlock reviews.
                                </div>
                            )}

                            <form onSubmit={createReview}>
                                <div className="mb-3">
                                    <label className="form-label small fw-medium">Select Driver to Review</label>
                                    {hasEligibleDrivers ? (
                                        <select
                                            id="reviewFor"
                                            className="form-select"
                                            value={reviewFor}
                                            onChange={(e) => setReviewFor(e.target.value)}
                                            required
                                        >
                                            {approvedDrivers.map((driver) => (
                                                <option key={driver} value={driver}>{driver}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            className="form-control"
                                            value="No approved bookings yet"
                                            disabled
                                        />
                                    )}
                                    <div className="form-text" style={{ color: "var(--text-dim)", fontSize: "11px" }}>
                                        Only drivers from your approved bookings are shown.
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small fw-medium">Rating Score</label>
                                    <div className="star-rating">
                                        {[5, 4, 3, 2, 1].map((star) => (
                                            <span key={star}>
                                                <input
                                                    type="radio"
                                                    id={`star-${star}`}
                                                    name="rating"
                                                    value={star}
                                                    checked={rating === star}
                                                    onChange={() => setRating(star)}
                                                    disabled={!hasEligibleDrivers}
                                                />
                                                <label htmlFor={`star-${star}`} style={{
                                                    color: rating >= star ? "#f59e0b" : "#d1d5db",
                                                    opacity: hasEligibleDrivers ? 1 : 0.4
                                                }}>&#9733;</label>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label small fw-medium">Your Experience</label>
                                    <textarea
                                        id="reviewComment"
                                        className="form-control"
                                        rows="4"
                                        placeholder={hasEligibleDrivers ? "Share details of your journey experience..." : "You need an approved booking to write a review."}
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        required
                                        disabled={!hasEligibleDrivers}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 py-3 fw-semibold"
                                    disabled={submitting || !hasEligibleDrivers}
                                >
                                    {submitting
                                        ? <><span className="spinner-border spinner-border-sm me-2" />Submitting...</>
                                        : "Submit Review"
                                    }
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Reviews List */}
                    <div className="col-lg-7">
                        <h5 className="fw-bold mb-4" style={{ color: "var(--text-primary)" }}>
                            Community Reviews
                            <span className="ms-2 badge rounded-pill" style={{
                                background: "#e0f2fe", color: "#0369a1",
                                border: "1px solid #bae6fd", fontSize: "12px"
                            }}>{reviews.length}</span>
                        </h5>

                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border" style={{ color: "var(--accent)" }} role="status" />
                                <p className="mt-3" style={{ color: "var(--text-muted-color)" }}>Loading reviews...</p>
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="glass-panel p-5 text-center">
                                <div style={{ fontSize: "48px", marginBottom: "12px" }}>&#128172;</div>
                                <h5 className="fw-bold mb-2" style={{ color: "var(--text-primary)" }}>No Reviews Yet</h5>
                                <p style={{ color: "var(--text-muted-color)" }}>Be the first to share your carpooling experience!</p>
                            </div>
                        ) : (
                            <div className="d-flex flex-column gap-3">
                                {reviews.map((review) => (
                                    <div key={review.id} className="glass-panel p-4 animated-fade-in">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div>
                                                <span className="fw-semibold" style={{ color: "var(--text-primary)", fontSize: "15px" }}>
                                                    {review.reviewFor}
                                                </span>
                                                <span className="ms-2 badge rounded-pill" style={{
                                                    background: "#f1f5f9", color: "#64748b",
                                                    border: "1px solid #e2e8f0", fontSize: "11px"
                                                }}>Driver</span>
                                            </div>
                                            <div style={{ color: "#f59e0b", fontSize: "18px", letterSpacing: "2px" }}>
                                                {"\u2605".repeat(review.rating)}
                                                <span style={{ color: "#d1d5db" }}>{"\u2605".repeat(5 - review.rating)}</span>
                                            </div>
                                        </div>

                                        <p className="mb-3" style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6" }}>
                                            "{review.comment}"
                                        </p>

                                        <div className="d-flex justify-content-between align-items-center" style={{ fontSize: "12px", color: "var(--text-dim)" }}>
                                            <span><strong style={{ color: "var(--text-muted-color)" }}>{review.reviewerName}</strong></span>
                                            <span className="badge rounded-pill" style={{
                                                background: "#d1fae5", color: "#065f46",
                                                border: "1px solid #a7f3d0", fontSize: "10px"
                                            }}>Verified Commuter</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <footer className="text-center py-4 small" style={{ borderTop: "1px solid var(--border)", color: "var(--text-dim)" }}>
                RideShare &copy; 2026. Made with love for Professional Portfolio.
            </footer>
        </div>
    );
}

export default ReviewsPage;