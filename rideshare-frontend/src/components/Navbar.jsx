import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar navbar-expand-md navbar-light py-3 px-4 sticky-top" style={{ 
            background: "#ffffff", 
            borderBottom: "1px solid var(--border)",
            zIndex: 1000
        }}>
            <div className="container-fluid">
                {/* Logo */}
                <h4 className="text-white mb-0 fw-extrabold d-flex align-items-center" 
                    style={{ cursor: "pointer", letterSpacing: "-1px" }} 
                    onClick={() => navigate("/dashboard")}
                >
                    🚗 <span style={{ background: "linear-gradient(90deg, var(--accent), #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>RideShare</span>
                </h4>

                {/* Mobile Toggle Button */}
                <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navigation Items */}
                <div className="collapse navbar-collapse justify-content-end mt-3 mt-md-0" id="navbarContent">
                    <div className="d-flex flex-column flex-md-row gap-2 align-items-md-center">
                        <button 
                            className={`btn text-start text-md-center px-3 py-2 border-0 ${isActive("/dashboard") ? "btn-primary text-white" : "text-secondary bg-transparent"}`}
                            onClick={() => navigate("/dashboard")}
                            style={{ fontSize: "0.95rem" }}
                        >
                            Find Rides
                        </button>
                        
                        <button 
                            className={`btn text-start text-md-center px-3 py-2 border-0 ${isActive("/bookings") ? "btn-primary text-white" : "text-secondary bg-transparent"}`}
                            onClick={() => navigate("/bookings")}
                            style={{ fontSize: "0.95rem" }}
                        >
                            My Bookings
                        </button>

                        <button 
                            className={`btn text-start text-md-center px-3 py-2 border-0 ${isActive("/reviews") ? "btn-primary text-white" : "text-secondary bg-transparent"}`}
                            onClick={() => navigate("/reviews")}
                            style={{ fontSize: "0.95rem" }}
                        >
                            Reviews
                        </button>

                        <button 
                            className={`btn text-start text-md-center px-3 py-2 border-0 ${isActive("/driver-bookings") ? "btn-primary text-white" : "text-secondary bg-transparent"}`}
                            onClick={() => navigate("/driver-bookings")}
                            style={{ fontSize: "0.95rem" }}
                        >
                            🚗 My Rides
                        </button>

                        <button 
                            className={`btn text-start text-md-center px-3 py-2 border-0 ${isActive("/profile") ? "btn-primary text-white" : "text-secondary bg-transparent"}`}
                            onClick={() => navigate("/profile")}
                            style={{ fontSize: "0.95rem" }}
                        >
                            Profile
                        </button>

                        <div className="vr d-none d-md-block mx-2" style={{ background: "var(--border)", height: "24px" }}></div>

                        <button className="btn btn-danger px-3 py-2" onClick={logout} style={{ fontSize: "0.95rem" }}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;