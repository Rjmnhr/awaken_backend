const express = require("express");
const dotenv = require("dotenv");
const router = express.Router();
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
  // appInfo: {
  //   // For sample support and debugging, not required for production:
  //   name: 'stripe-samples/accept-a-payment/prebuilt-checkout-page',
  //   version: '0.0.1',
  //   url: 'https://github.com/stripe-samples',
  // },
});

// Fetch the Checkout Session to display the JSON result on the success page
router.get("/checkout-session", async (req, res) => {
  const { sessionId } = req.query;
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  res.send(session);
});

router.post("/create-checkout-session", async (req, res) => {
  const { price, product } = req.body;

  const domainURL =
    product === "workshop" ? process.env.WORKSHOP_DOMAIN : process.env.DOMAIN;

  let successRoute = "success.html";

  // Create new Checkout Session for the order
  // Other optional params include:
  // For full details see https://stripe.com/docs/api/checkout/sessions/create
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    allow_promotion_codes: true,

    line_items: [
      {
        price: price,
        quantity: 1,
      },
    ],
    // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
    success_url: `${domainURL}/${successRoute}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${domainURL}/canceled.html`,
    metadata: {
      // Add additional key-value pairs as needed
    },

    // automatic_tax: { enabled: true }
  });

  return res.status(200).json({ url: session.url });
});

// Webhook handler for asynchronous events.
// router.post("/webhook", async (req, res) => {
//   let event;

//   // Check if webhook signing is configured.
//   if (process.env.STRIPE_WEBHOOK_SECRET) {
//     // Retrieve the event by verifying the signature using the raw body and secret.
//     let signature = req.headers["stripe-signature"];

//     try {
//       event = stripe.webhooks.constructEvent(
//         req.rawBody,
//         signature,
//         process.env.STRIPE_WEBHOOK_SECRET
//       );
//     } catch (err) {
//       console.log(`⚠️  Webhook signature verification failed.`);
//       return res.sendStatus(400);
//     }
//   } else {
//     // Webhook signing is recommended, but if the secret is not configured in `.env`,
//     // retrieve the event data directly from the request body.
//     event = req.body;
//   }

//   if (event.type === "checkout.session.completed") {
//     console.log(`🔔  Payment received!`);

//     // Note: If you need access to the line items, for instance to
//     // automate fullfillment based on the the ID of the Price, you'll
//     // need to refetch the Checkout Session here, and expand the line items:
//     //
//     const session = await stripe.checkout.sessions.retrieve(
//       "we_1OH4gvDNZni9rE7FAqEMUENo",
//       {
//         expand: ["line_items"],
//       }
//     );

//     const lineItems = session.line_items;
//   }

//   res.sendStatus(200);
// });

// Webhook handler for asynchronous events.
router.post("/webhook", async (req, res) => {
  let event;

  // Check if webhook signing is configured.
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    // Retrieve the event by verifying the signature using the raw body and secret.
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
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `.env`,
    // retrieve the event data directly from the request body.
    event = req.body;
  }

  if (event.type === "checkout.session.completed") {
    console.log(`🔔  Payment received!`);

    // Retrieve the Checkout Session ID from the event
    const sessionID = event.data.object.id;

    // Retrieve the Checkout Session to get invoice information
    const session = await stripe.checkout.sessions.retrieve(sessionID, {
      expand: ["payment_intent"],
    });

    // Retrieve the Payment Intent ID from the session
    const paymentIntentID = session.payment_intent;

    // Retrieve the Payment Intent to get the associated invoice ID
    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentID,
      {
        expand: ["invoice"],
      }
    );

    // Now you can access the invoice details
    const invoiceID = paymentIntent.invoice;
    const invoice = await stripe.invoices.retrieve(invoiceID);

    console.log("Invoice Details:", invoice);
  }

  res.sendStatus(200);
});

module.exports = router;
