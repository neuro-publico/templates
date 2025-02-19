// Initialize Stripe
const stripe = Stripe(
  "pk_test_51QgrcRGXPDzubUfRPbz9i0C6chppEXFv6gpzfJEYARn2skrMF7QzqGeuMRa91ISjDOTRFJVNCqOyqc9tsi6Mqsix00KpN3JWP2"
); // Replace with your Stripe publishable key

// Create an instance of Elements
const elements = stripe.elements();

// Create an instance of the card Element
const card = elements.create("card");

// Add an instance of the card Element into the `card-element` <div>
card.mount("#card-element");

// Handle form submission
const form = document.getElementById("order-form");
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Call your backend to create a setup intent and get the client_secret
  const response = await fetch("/create-setup-intent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const { client_secret } = await response.json();

  // Confirm the setup intent
  const result = await stripe.confirmCardSetup(client_secret, {
    payment_method: {
      card: card,
      billing_details: {
        name: document.getElementById("nombre").value,
        email: document.getElementById("email").value,
      },
    },
  });

  if (result.error) {
    // Display error.message in your UI
    console.error(result.error.message);
  } else {
    // The setup has succeeded. You can now use the payment_method_id
    console.log("Setup succeeded:", result.setupIntent.payment_method);
  }
});
