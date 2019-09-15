const express = require('express')
const app = express()

// var bodyParser = require('body-parser')

const PORT = process.env.PORT || 3000;

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded());

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

let server = app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

const path = require('path');

var io = require('socket.io')(server);

// Tells node.js to use static front end assets
app.use(express.static('public'));

// Root url returns index.html
app.get('/',function(req,res) {
    res.sendFile(path.join(__dirname+'/public/index.html'));
});

let allTrees = [];

app.post('/addTrees', function(req,res){
    // Save data
    console.log(req.body);
    allTrees = allTrees.concat(req.body);
    res.send('Got POST request')
})

app.get('/getTrees', function(req, res){
    res.send(allTrees)
})



// Stripe Payment Info



app.use(
  express.json({
    // We need the raw body to verify webhook signatures.
    // Let's compute it only when hitting the Stripe webhook endpoint.
    verify: function(req, res, buf) {
      if (req.originalUrl.startsWith("/webhook")) {
        req.rawBody = buf.toString();
      }
    }
  })
);

// Fetch the Checkout Session to display the JSON result on the success page
app.get("/checkout-session", async (req, res) => {
  const { sessionId } = req.query;
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  res.send(session);
});

app.post("/create-checkout-session", async (req, res) => {
  const domainURL = process.env.DOMAIN;

  const { quantity } = req.body;
  // Create new Checkout Session for the order
  // Other optional params include:
  // [billing_address_collection] - to display billing address details on the page
  // [customer] - if you have an existing Stripe Customer ID
  // [payment_intent_data] - lets capture the payment later
  // [customer_email] - lets you prefill the email input in the form
  // For full details see https://stripe.com/docs/api/checkout/sessions/create
  session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        name: "Pasha photo",
        quantity: quantity,
        currency: "usd",
        amount: 500 // Keep the amount on the server to prevent customers from manipulating on client
      }
    ],
    // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
    success_url: `${domainURL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${domainURL}/canceled.html`
  });

  res.send({
    sessionId: session.id
  });
});

app.get("/public-key", (req, res) => {
  res.send({ publicKey: process.env.STRIPE_PUBLIC_KEY });
});

// Webhook handler for asynchronous events.
app.post("/webhook", async (req, res) => {
  let data;
  let eventType;
  // Check if webhook signing is configured.
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    // Extract the object from the event.
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }

  if (eventType === "checkout.session.completed") {
    console.log(`🔔  Payment received!`);
  }

  res.sendStatus(200);
});

app.listen(4242, () => console.log(`Node server listening on port ${4242}!`));
