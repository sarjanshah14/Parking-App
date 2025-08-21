import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Badge, Spinner, Carousel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const getValidToken = async () => {
    let token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!token || !refreshToken) return null;

    try {
      // Try a test request to see if token is valid
      await axios.get("/api/bookings/user-bookings/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return token; // token is valid
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Token expired, refresh it
        try {
          const res = await axios.post("/api/users/token/refresh/", {
            refresh: refreshToken,
          });

          const newToken = res.data.access;
          localStorage.setItem("token", newToken);
          return newToken;
        } catch (refreshErr) {
          console.error("Refresh token failed", refreshErr);
          return null;
        }
      }
      return null;
    }
  };

  // Function to render star ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-warning" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-warning" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-warning" />);
      }
    }

    return stars;
  };

  useEffect(() => {
    const fetchBookings = async () => {
      const token = await getValidToken();
      if (!token) {
        console.error("No valid token, redirect to login");
        return;
      }

      try {
        const res = await axios.get("/api/bookings/user-bookings/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const lastFive = res.data.slice(-6).reverse(); // last 5, latest first
        setBookings(lastFive);
      } catch (err) {
        console.error("Error fetching bookings", err);
      }
    };

    const fetchReviews = async () => {
      try {
        setLoadingReviews(true);
        const response = await axios.get("/api/reviews/");
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews", error);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchBookings();
    fetchReviews();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      {bookings.length > 0 && (
        <div
          className="d-flex align-items-center justify-content-center text-center text-white shadow-lg mb-4 hero-glass"
          style={{
            minHeight: "25vh",
            width: "100%",
            backgroundImage: "linear-gradient(135deg,rgb(5, 50, 100) 0%,rgb(56, 130, 194) 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div className="px-4">
            <h1 className="fw-bold display-3">
              Hi, {bookings.length > 0 ? bookings[0].name : 'User'} 👋🏻
            </h1>
            <p className="lead fw-semibold">
              Skip the endless circles, dodge the parking chaos, and claim your perfect spot in style!<br />
              With Let’s Park every ride starts smooth.
            </p>
          </div>
          <div className="glare"></div>
          <img
            src="images/car.png"
            alt="Car"
            className="car-animation delay"
            style={{ position: "absolute", bottom: "-35px", left: "-150px", height: "100px" }}
          />
          <img
            src="images/car1.png"
            alt="Car"
            className="car-animation"
            style={{ position: "absolute", bottom: "-35px", left: "-150px", height: "100px" }}
          />
          <img
            src="images/car2.png"
            alt="Car"
            className="car-animation delayed"
            style={{ position: "absolute", bottom: "-35px", left: "-150px", height: "100px" }}
          />
        </div>
      )}

      <Container className="my-5">
        {/* Why Choose Us */}
        <h2 className="text-center mb-4 fw-bold">Why Choose Let’s Park?</h2>
        <Row>
          {[
            {
              title: "Real-Time Availability",
              text: "See which spots are free right now so you never waste time circling.",
            },
            {
              title: "Secure Parking",
              text: "Every premise is verified for safety, so your car is always in safe hands.",
            },
            {
              title: "Affordable Pricing",
              text: "Book by the hour or the day — only pay for what you use.",
            },
            {
              title: "Instant Booking",
              text: "Reserve with one click, no waiting or endless calls required.",
            },
          ].map((item, idx) => (
            <Col md={6} lg={3} key={idx} className="mb-4">
              <Card className="h-100 shadow border-1 rounded-4 hover-shadow">
                <Card.Body>
                  <Card.Title className="fw-bold">
                    {item.title}
                  </Card.Title>
                  <Card.Text>{item.text}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Customer Reviews Section */}
        <h2 className="text-center mb-2 fw-bold mt-5">What Our Customers Say</h2>


        <div className="reviews-carousel">
          <div className="reviews-track">
            {/* Original reviews */}
            {reviews.map((review, idx) => (
              <Card key={idx} className="review-card shadow rounded-4 border-1">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex align-items-center mb-2">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-2"
                      style={{
                        width: 40,
                        height: 40,
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "16px",
                        backgroundImage: "linear-gradient(135deg, rgb(5, 50, 100) 0%, rgb(56, 130, 194) 100%)",
                      }}
                    >
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold">{review.name}</h6>
                      <small className="text-muted">
                        {new Date(review.created_at).toLocaleDateString()}
                      </small>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-2">
                    {renderStars(review.rating)}
                    <span className="ms-2 fw-semibold">{review.rating.toFixed(1)}</span>
                  </div>

                  <Card.Text className="review-text">
                    {review.review.length > 100
                      ? `${review.review.substring(0, 100)}...`
                      : review.review}
                  </Card.Text>
                </Card.Body>
              </Card>
            ))}

            {/* Duplicate reviews for seamless loop */}
            {reviews.map((review, idx) => (
              <Card key={`dup-${idx}`} className="review-card rounded-4">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex align-items-center mb-2">
                    <div
                      className="rounded-circle d-flex align-items-center shadow border-1 justify-content-center me-2"
                      style={{
                        width: 40,
                        height: 40,
                        backgroundImage: "linear-gradient(135deg, rgb(5, 50, 100) 0%, rgb(56, 130, 194) 100%)",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "16px",
                      }}
                    >
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold">{review.name}</h6>
                      <small className="text-muted">
                        {new Date(review.created_at).toLocaleDateString()}
                      </small>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-2">
                    {renderStars(review.rating)}
                    <span className="ms-2 fw-semibold">{review.rating.toFixed(1)}</span>
                  </div>

                  <Card.Text className="review-text">
                    {review.review.length > 100
                      ? `${review.review.substring(0, 100)}...`
                      : review.review}
                  </Card.Text>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>




        {/* Smart Tips */}
        <h2 className="text-center mb-4 fw-bold mt-5">Smart Parking Tips 💡</h2>
        <Row>
          {[
            "Book in advance during peak hours to avoid last-minute stress.",
            "Always check premise reviews for safety and convenience.",
            "Set reminders for your parking end-time to avoid extra charges.",
            "Prefer digital payments — it's faster and keeps bookings trackable.",
          ].map((tip, idx) => (
            <Col md={6} lg={3} key={idx} className="mb-4">
              <Card className="shadow border-1 rounded-4 hover-shadow h-100">
                <Card.Body>
                  <h6 className="fw-bold">Tip #{idx + 1}</h6>
                  <p>{tip}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Last 5 Bookings */}
        <h2 className="text-center mb-4 fw-bold mt-5">Your Recent Bookings</h2>
        <Row>
          {bookings.length > 0 ? (
            bookings.map((b, idx) => (
              <Col md={6} lg={4} key={idx} className="mb-4">
                <Card className="shadow border-1 rounded-4 h-100 hover-shadow">
                  <Card.Body>
                    <h5 className="fw-bold">{b.premise.name}</h5>
                    <p className="mb-1">
                      Duraion: <span className="fw-semibold">{b.duration} hrs</span>
                    </p>
                    <p className="mb-1">
                      Date & Time: <span className="fw-semibold">{b.booking_time}</span>
                    </p>
                    <Badge
                      bg={
                        b.status === "confirmed"
                          ? "success"
                          : b.status === "cancelled"
                            ? "danger"
                            : "secondary"
                      }
                    >
                      {b.status}
                    </Badge>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p className="text-center">No bookings found.</p>
          )}
        </Row>
      </Container>

      {/* Floating Button */}
      <Button
        className="rounded-circle shadow-lg position-fixed d-flex align-items-center justify-content-center animate-pulse"
        style={{
          bottom: "30px",
          right: "30px",
          width: "60px",
          height: "60px",
          fontSize: "42px",
          lineHeight: "1",
          transition: "all 0.3s ease-in-out",
          backgroundImage: "linear-gradient(135deg, rgb(5, 50, 100) 0%, rgb(56, 130, 194) 100%)",
          color: "white",
          border: "none",
          boxShadow: "0 0 15px rgba(0, 123, 255, 0.6)", // glowing effect
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.15)";
          e.currentTarget.style.boxShadow = "0 0 25px rgba(0, 123, 255, 0.9)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 0 15px rgba(0, 123, 255, 0.6)";
        }}
        onClick={() => navigate("/book")}
      >
        Ⓟ
      </Button>
    </div>
  );
};

export default Dashboard;