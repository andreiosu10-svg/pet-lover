'use client';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import Image from 'next/image';

const stripePromise = loadStripe('pk_test_51SvrQSGI6cib5uhzUB1zUUnP2zXZQ1wr0GMZHCUCjsfuByuXrVEz4wGvt25iZF0wAUJXUdV6CNUVffnNfFpJnDWB00Hbs9v8aW');

function CheckoutForm({ product }) {
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
    <div style
