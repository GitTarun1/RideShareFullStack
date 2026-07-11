import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Switch between 'login' and 'signup'
    const [mode, setMode] = useState("login");
    
    // Form Inputs
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");

    
    const [loading, setLoading] = useState(false);

    // Sync mode with URL query parameters (e.g. ?mode=signup)
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const urlMode = queryParams.get("mode");
        if (urlMode === "signup" || urlMode === "login") {
            setMode(urlMode);
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email || !password || (mode === "signup" && !fullName)) {
            toast.warning("Please fill in all required fields!");
            return;
        }

        setLoading(true);

        try {
            if (mode === "login") {
                // Login Flow
                const response = await api.post("/users/login", { email, password });
                
                // Save credentials
                localStorage.setItem("token", response.data);
                localStorage.setItem("email", email);
                
                toast.success("Successfully logged in!");
                navigate("/dashboard");
            } else {
                // Register Flow
                await api.post("/users/register", {
                    fullName,
                    email,
                    password,
                    role: "USER"
                });
                
                toast.success("Registration successful! Logging you in...");
                
                // Auto login after signup
                const loginResponse = await api.post("/users/login", { email, password });
                localStorage.setItem("token", loginResponse.data);
                localStorage.setItem("email", email);
                
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Auth error:", error);
            const errMsg = error.response?.data?.message || "Authentication Failed. Please try again.";
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    // Credential-based Google login (returns ID token directly) — used via GoogleLogin component
    const handleGoogleCredential = async (credentialResponse) => {
        if (!credentialResponse?.credential) {
            toast.error("Google login failed: no credential received.");
            return;
        }
        setLoading(true);
        try {
            const response = await api.post("/users/google-login", {
                idToken: credentialResponse.credential,
            });
            localStorage.setItem("token", response.data);

            // Decode email from JWT payload
            const parts = response.data.split(".");
            if (parts.length === 3) {
                const payload = JSON.parse(atob(parts[1]));
                localStorage.setItem("email", payload.sub || "");
            }

            toast.success("Signed in with Google!");
            navigate("/dashboard");
        } catch (error) {
            const errMsg = error.response?.data?.message || "Google authentication failed.";
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 animated-fade-in" style={{ background: "var(--bg-base)" }}>
            <div className="glass-panel p-4 p-md-5" style={{ width: "450px" }}>
                {/* Brand Logo */}
                <div className="text-center mb-4">
                    <h2 className="fw-extrabold mb-1" style={{ cursor: "pointer", letterSpacing: "-1px", color: "var(--text-primary)" }} onClick={() => navigate("/")}>
                        🚗 <span style={{ color: "var(--accent)" }}>RideShare</span>
                    </h2>
                    <p className="small mb-0" style={{ color: "var(--text-muted-color)" }}>Ride-sharing portal for commuters</p>
                </div>

                {/* Tabs */}
                <div className="apple-tabs mb-4">
                    <button
                        className={`tab-btn ${mode === "login" ? "active" : ""}`}
                        onClick={() => { setMode("login"); navigate("/login"); }}
                    >
                        Sign In
                    </button>
                    <button
                        className={`tab-btn ${mode === "signup" ? "active" : ""}`}
                        onClick={() => { setMode("signup"); navigate("/login?mode=signup"); }}
                    >
                        Create Account
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {mode === "signup" && (
                        <div className="mb-3">
                            <label className="text-muted small mb-2 fw-medium">Full Name</label>
                            <input 
                                type="text"
                                className="form-control"
                                placeholder="John Doe"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="text-muted small mb-2 fw-medium">Email Address</label>
                        <input 
                            type="email"
                            className="form-control"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="text-muted small mb-2 fw-medium">Password</label>
                        <input 
                            type="password"
                            className="form-control"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>



                    <button type="submit" className="btn btn-primary w-100 py-3 mt-2" disabled={loading}>
                        {loading ? (
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        ) : null}
                        {mode === "login" ? "Sign In" : "Register & Start"}
                    </button>
                </form>

                {/* Google Sign-In Divider */}
                <div className="d-flex align-items-center my-4" style={{ gap: "12px" }}>
                    <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
                    <span className="small" style={{ color: "var(--text-muted-color)", whiteSpace: "nowrap" }}>or continue with Google</span>
                    <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
                </div>

                {/* Google Login Button */}
                <div className="d-flex justify-content-center">
                    <GoogleLogin
                        onSuccess={handleGoogleCredential}
                        onError={() => toast.error("Google Sign-In was cancelled or failed.")}
                        theme="outline"
                        shape="rectangular"
                        size="large"
                        text={mode === "login" ? "signin_with" : "signup_with"}
                        width="370"
                    />
                </div>

                <div className="text-center mt-4">
                    {mode === "login" ? (
                        <p className="text-muted small mb-0">
                            New here? <span className="text-primary fw-bold" style={{ cursor: "pointer" }} onClick={() => { setMode("signup"); navigate("/login?mode=signup"); }}>Create an account</span>
                        </p>
                    ) : (
                        <p className="text-muted small mb-0">
                            Already have an account? <span className="text-primary fw-bold" style={{ cursor: "pointer" }} onClick={() => { setMode("login"); navigate("/login"); }}>Sign in</span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LoginPage;