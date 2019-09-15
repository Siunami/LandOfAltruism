const stripe = require("stripe")("sk_test_YBpqmJq92HiCOX2IFEotRETy00velDjXK0");

stripe.charges.create({
  amount: 2000,
  currency: "usd",
  source: "tok_mastercard", // obtained with Stripe.js
  metadata: {'order_id': '6735'}
});