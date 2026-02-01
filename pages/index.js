import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import Image from 'next/image';
import Logo from '/public/logo.png';

const stripePromise = loadStripe('pk_test_51SvrQSGI6cib5uhzUB1zUUnP2zXZQ1wr0GMZHCUCjsfuByuXrVEz4wGvt25iZF0wAUJXUdV6CNUVffnNfFpJnDWB00Hbs9v8aW');

function CheckoutForm({ product }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
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
    <div>
      <CardElement />
      <button
        onClick={handleClick}
        disabled={!stripe || loading}
        style={{ marginTop: '10px', padding: '10px', backgroundColor:'#f43f5e', color:'#fff', borderRadius:'8px', width:'100%' }}
      >
        Cumpara acum
      </button>
    </div>
  );
}

export default function Storefront() {
  const products = [
    { id: 1, name: "Pat ortopedic pentru animale", price: "$49" },
    { id: 2, name: "Jucarie interactiva pentru recompense", price: "$19" },
    { id: 3, name: "Sticla portabila pentru apa", price: "$22" }
  ];

  return (
    <Elements stripe={stripePromise}>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ width: '150px', margin: '0 auto' }}>
          <Image src={Logo} alt="Pet Lover Logo" width={150} height={150} />
        </div>
        <h1>Pet Lover</h1>
        <div style={{ display:'flex', justifyContent:'center', gap:'20px', flexWrap:'wrap' }}>
          {products.map((p) => (
            <div key={p.id} style={{ border:'1px solid #ddd', borderRadius:'12px', padding:'15px', width:'200px' }}>
              <h3>{p.name}</h3>
              <p>{p.price}</p>
              <CheckoutForm product={p} />
            </div>
          ))}
        </div>
      </div>
    </Elements>
  );
      }
