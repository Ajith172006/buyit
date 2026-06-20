const express = require('express');
const router = express.Router();
const stripe = process.env.STRIPE_SECRET_KEY
  ? require('stripe')(process.env.STRIPE_SECRET_KEY)
  : null;

router.post('/create-checkout-session', async (req, res) => {
  try {
    const { items, customer_email } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const origin = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

    if (!stripe) {
      console.warn('WARNING: STRIPE_SECRET_KEY is not defined in environment variables. Simulating successful checkout.');
      const mockSessionId = 'mock_stripe_session_' + Date.now();
      return res.status(200).json({
        url: `${origin}/?success=true&session_id=${mockSessionId}`,
        id: mockSessionId,
        mock: true
      });
    }

    const line_items = items.map(item => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects amount in paise (cents)
      },
      quantity: item.qty || 1,
    }));

    // Generate the frontend URL
    const client_reference_id = 'SN' + Date.now();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${origin}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=true`,
      customer_email: customer_email || undefined,
      client_reference_id, // We can use this to verify the order later
    });

    res.status(200).json({ url: session.url, id: session.id });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
