'use client';
import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

export default function CheckoutForm({ product }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    const res = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: parseInt(product.price.replace('$','')) * 100 })
    });
    const data = await res.json();
    const result = await stripe.confirmCardPayment(data.clientSecret, {
      payment_method: { card: elements.getElement(CardElement) }
    });
    if (result.error) {
      alert(result.error.message);
    } else if (result.paymentIntent.status === 'succeeded') {
      alert('Plata a fost efectuata cu succes!');
    }
    setLoading(false);
  };

  return (
    <div style={{ marginTop: '10px' }}>
      <CardElement />
      <button
        onClick={handleClick}
        disabled={!stripe || loading}
        style={{
          marginTop: '10px',
          padding: '10px',
          backgroundColor: '#f43f5e',
          color: '#fff',
          borderRadius: '8px',
          width: '100%',
          cursor: 'pointer'
        }}
      >
        Cumpara acum
      </button>
    </div>
  );
}
