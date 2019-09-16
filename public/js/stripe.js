var PUBLIC_KEY = "pk_test_aXZVed6JzeuDVydHdLevnu1K0015vcVZca";

var SKU_ID = "sku_FoTjBWEVlHGL2x";

var stripe = Stripe(PUBLIC_KEY);

// setTimeout(function(){
//     var donateButton = document.getElementsByClassName("donate")[0];

//     var handleResult = function(result) {
//         if (result.error) {
//             console.log(result.error.message);
//         //   var displayError = document.getElementById("error-message");
//         //   displayError.textContent = result.error.message;
//         }
//       };

//     donateButton.addEventListener("click", function() {
//         var quantity = 10
//         // Make the call to Stripe.js to redirect to the checkout page
//         // with the current quantity
//         stripe
//             .redirectToCheckout({
//             items: [{ sku: SKU_ID, quantity: quantity }],
//             successUrl: "http://localhost:3000/success.html?session_id={CHECKOUT_SESSION_ID}",
//             cancelUrl: "http://localhost:3000/canceled.html"
//             })
//             .then(handleResult);
//         });
// }, 4000)



