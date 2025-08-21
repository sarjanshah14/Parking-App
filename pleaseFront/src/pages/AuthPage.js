import { useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const primaryColor = "rgb(9, 184, 247)";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.username || !form.password || (!isLogin && !form.email)) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (!isLogin && form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // Login API call
        const res = await fetch("/api/users/login/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: form.username,
            password: form.password,
          }),
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.detail || "Login failed.");
          setLoading(false);
          return;
        }

        // Save token in localStorage (or context)
        localStorage.setItem("token", data.access);
        localStorage.setItem("refreshToken", data.refresh);

        // Redirect to dashboard
        navigate("/dashboard");

      } else {
        // Signup API call
        const res = await fetch("/api/users/signup/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: form.username,
            email: form.email,
            password: form.password,
          }),
        });

        if (res.status === 201) {
          // Signup successful, switch to login form
          setIsLogin(true);
          setForm({ username: "", email: "", password: "", confirmPassword: "" });
          setError("");
          alert("Signup successful! Please login.");
          navigate('/dashboard')
        } else {
          const data = await res.json();
          setError(data.username ? data.username[0] : "Signup failed.");
        }
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="auth-page d-flex align-items-center" style={{marginTop:'100px',marginBottom:'100px'}}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
              <div className="row g-0">
                {/* Left Side - Welcome Section */}
                <div
                  className="col-lg-6 d-flex align-items-center"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor} 0%, rgb(2, 128, 172) 100%)`,
                    color: "white",
                  }}
                >
                  <div className="p-5 text-center">
                    <h1 className="display-4 fw-bold mb-4">Welcome to LetsPark</h1>
                    <p className="lead mb-4">
                      Your ultimate parking solution. Find, book, and manage your parking spots with ease.
                    </p>
                    <div className="row text-center">
                      <div className="col-4">
                        <div className="h2 fw-bold">24/7</div>
                        <small>Parking Availability</small>
                      </div>
                      <div className="col-4">
                        <div className="h2 fw-bold">5K+</div>
                        <small>Happy Users</small>
                      </div>
                      <div className="col-4">
                        <div className="h2 fw-bold">99%</div>
                        <small>Success Rate</small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Auth Forms */}
                <div className="col-lg-6 bg-white">
                  <div className="p-5">
                    {/* Toggle Buttons */}
                    <div className="d-flex mb-4">
                      <Button
                        className="flex-fill me-2"
                        style={{
                          backgroundColor: isLogin ? primaryColor : "white",
                          borderColor: primaryColor,
                          color: isLogin ? "white" : primaryColor,
                          fontWeight: "bold",
                        }}
                        onClick={() => {
                          setIsLogin(true);
                          setError("");
                        }}
                      >
                        Login
                      </Button>
                      <Button
                        className="flex-fill"
                        style={{
                          backgroundColor: !isLogin ? primaryColor : "white",
                          borderColor: primaryColor,
                          color: !isLogin ? "white" : primaryColor,
                          fontWeight: "bold",
                        }}
                        onClick={() => {
                          setIsLogin(false);
                          setError("");
                        }}
                      >
                        Sign Up
                      </Button>
                    </div>

                    {error && <Alert variant="danger">{error}</Alert>}

                    {isLogin ? (
                      <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                          <Form.Label>Username</Form.Label>
                          <Form.Control
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            required
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Password</Form.Label>
                          <Form.Control
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                          />
                        </Form.Group>

                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-100 py-3 mb-3"
                          style={{
                            backgroundColor: primaryColor,
                            borderColor: primaryColor,
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "1.1rem",
                          }}
                        >
                          {loading ? "Logging in..." : "🔓 Login"}
                        </Button>

                        <div className="text-center">
                          <Button
                            variant="link"
                            style={{
                              color: primaryColor,
                              textDecoration: "none",
                              padding: 0,
                            }}
                            onClick={() => alert("Forgot password feature coming soon!")}
                          >
                            Forgot Password?
                          </Button>
                        </div>
                      </Form>
                    ) : (
                      <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                          <Form.Label>Username</Form.Label>
                          <Form.Control
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Choose a username"
                            required
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Password</Form.Label>
                          <Form.Control
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            required
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Confirm Password</Form.Label>
                          <Form.Control
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            required
                          />
                        </Form.Group>

                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-100 py-3 mb-3"
                          style={{
                            backgroundColor: primaryColor,
                            borderColor: primaryColor,
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "1.1rem",
                          }}
                        >
                          {loading ? "Signing up..." : "🚀 Sign Up"}
                        </Button>

                        <div className="text-center small text-muted">
                          Already have an account?{" "}
                          <Button
                            variant="link"
                            style={{
                              color: primaryColor,
                              textDecoration: "none",
                              padding: 0,
                            }}
                            onClick={() => {
                              setIsLogin(true);
                              setError("");
                            }}
                          >
                            Login here
                          </Button>
                        </div>
                      </Form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
