import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51SvrQSGI6cib5uhzUB1zUUnP2zXZQ1wr0GMZHCUCjsfuByuXrVEz4wGvt25iZF0wAUJXUdV6CNUVffnNfFpJnDWB00Hbs9v8aW');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { amount } = req.body;

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'usd'
      });
      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
