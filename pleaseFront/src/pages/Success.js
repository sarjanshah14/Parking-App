import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Container, Alert, Button, Spinner, Card, 
  ListGroup 
} from 'react-bootstrap';
import { CheckCircleFill, ClockHistory } from 'react-bootstrap-icons';
import axios from 'axios';

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [state, setState] = useState({
    loading: true,
    error: null,
    payment: null
  });

  useEffect(() => {
    const verifyPayment = async () => {
      const query = new URLSearchParams(location.search);
      const sessionId = query.get('session_id');

      if (!sessionId) {
        setState({ loading: false, error: 'Missing payment session ID', payment: null });
        return;
      }

      try {
        const response = await axios.get('/api/verify-payment/', {
          params: { session_id: sessionId }
        });

        if (response.data.status === 'success') {
          setState({
            loading: false,
            error: null,
            payment: {
              id: response.data.payment_id,
              amount: response.data.amount,
              currency: response.data.currency,
              plan: response.data.plan_id,
              period: response.data.billing_period,
              nextBilling: response.data.next_billing_date,
              status: response.data.payment_status
            }
          });
        } else {
          setState({
            loading: false,
            error: response.data.message || 'Payment verification failed',
            payment: null
          });
        }
      } catch (err) {
        setState({
          loading: false,
          error: err.response?.data?.message || 'Payment verification error',
          payment: null
        });
      }
    };

    verifyPayment();
  }, [location]);

  if (state.loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted fw-semibold">Verifying your payment...</p>
      </Container>
    );
  }

  if (state.error) {
    return (
      <Container className="py-5 d-flex justify-content-center">
        <Card className="shadow-lg p-4" style={{ maxWidth: '500px', width: '100%' }}>
          <Alert variant="danger" className="text-center mb-4">
            <Alert.Heading className="fw-bold">Payment Verification Failed</Alert.Heading>
            <p className="fw-semibold">{state.error}</p>
          </Alert>
          <div className="d-flex justify-content-between">
            <Button variant="outline-danger" onClick={() => navigate('/pricing')}>
              Back to Pricing
            </Button>
            <Button variant="danger" onClick={() => window.location.reload()}>
              <ClockHistory className="me-2" />
              Try Again
            </Button>
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-5 d-flex justify-content-center">
      <Card 
        className="shadow-lg border-0"
        style={{
          maxWidth: '600px', 
          width: '100%', 
          borderRadius: '20px', 
          overflow: 'hidden'
        }}
      >
        {/* Top Blue Header */}
        <div 
          style={{
            background: 'linear-gradient(135deg, #007bff, #0056b3)',
            padding: '2rem',
            color: 'white'
          }}
          className="text-center"
        >
          <CheckCircleFill size={60} className="mb-3" />
          <h2 className="fw-bold">Payment Successful</h2>
          <p className="mb-0 fs-5 fw-semibold">Your {state.payment.plan} plan is now active</p>
        </div>

        <Card.Body className="p-4">
          <ListGroup variant="flush" className="mb-4">
            <ListGroup.Item className="py-3 fs-6 fw-semibold">
              Payment ID: <span className="text-dark">{state.payment.id || 'N/A'}</span>
            </ListGroup.Item>
            <ListGroup.Item className="py-3 fs-6 fw-semibold">
              Amount Paid: <span className="text-primary">{state.payment.amount} {state.payment.currency}</span>
            </ListGroup.Item>
            <ListGroup.Item className="py-3 fs-6 fw-semibold">
              Plan: <span className="text-dark">{state.payment.plan} ({state.payment.period})</span>
            </ListGroup.Item>
            {state.payment.nextBilling && (
              <ListGroup.Item className="py-3 fs-6 fw-semibold">
                Next Billing Date: <span className="text-dark">{new Date(state.payment.nextBilling).toLocaleDateString()}</span>
              </ListGroup.Item>
            )}
            <ListGroup.Item className="py-3 fs-6 fw-semibold">
              Status: <span style={{ color: state.payment.status === 'paid' ? 'green' : 'orange' }}>
                {state.payment.status}
              </span>
            </ListGroup.Item>
          </ListGroup>

          <div className="text-center">
            <Button 
              variant="primary" 
              size="lg"
              className="px-5 fw-bold"
              style={{
                borderRadius: '50px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={e => e.target.style.backgroundColor = '#0056b3'}
              onMouseLeave={e => e.target.style.backgroundColor = '#007bff'}
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Success;
