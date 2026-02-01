'use client';
import Image from 'next/image';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';

const stripePromise = loadStripe('pk_test_51SvrQSGI6cib5uhzUB1zUUnP2zXZQ1wr0GMZHCUCjsfuByuXrVEz4wGvt25iZF0wAUJXUdV6CNUVffnNfFpJnDWB00Hbs9v8aW');

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
          <Image src="/logo.png" alt="Pet Lover Logo" width={150} height={150} />
        </div>
        <h1>Pet Lover</h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {products.map((p) => (
            <div key={p.id} style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '15px', width: '200px' }}>
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
