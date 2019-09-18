var PUBLIC_KEY = "pk_test_dpshPpu0W1VyYyw1hI39OGKS";

// var SKU_ID = "sku_FoTjBWEVlHGL2x";

var stripe = Stripe(PUBLIC_KEY);

var elements = stripe.elements();

var style = {
    base: {
      color: "#32325d",
      fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4"
      }
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  };

  
var cardElement = elements.create('card',{
    style:style
});
cardElement.mount('#card-element');

var donateButton = document.getElementsByClassName("donate")[0]

function toggleElementsModalVisibility() {
    var modal = document.querySelector(".ElementsModal--modal");
    modal.classList.toggle("ElementsModal--show-modal");
}

function stripePaymentHandler() {
    toggleElementsModalVisibility();
    let jsonData = sendTrees();
    currentPlacedState = placedState.NONE_PLACED;

    fetch("/addTrees", {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(jsonData), // data can be `string` or {object}!
        headers:{
            'Content-Type': 'application/json'
        }
    })
    // .then(res => res.json())
    .then((response) => {
        console.log('Success:', JSON.stringify(response))
        fetchServerData()
    })
    .catch(error => console.error('Error:', error));
}

// Helper function for setup
function sendTrees(){
    //Convert current tree position into JSON files to send to the server

    let sendTreeList = [];
    for (var i = 0 ; i < tempTreeSprite.length ; i++){
        sendTreeList.push({
            "x":tempTreeSprite[i].position.x, 
            "y":tempTreeSprite[i].position.y,
            "treetype":tempTreeSprite[i].getAnimationLabel().split("_")[0],
            "meta": {
                "name":nameInput.value(),
                "date": new Date(),
                "url":urlInput.value(),
                "comment":commentInput.value(),
                "payment_data":50
            }
        })
    }
    return sendTreeList;
}



donateButton.addEventListener("click",function(){

    //only fire when there is temporary tree placed
    if(currentPlacedState == placedState.TEMP_PLACED){
    toggleElementsModalVisibility();
    }
})

var form = document.getElementById("payment-form");
form.addEventListener("submit", function(event) {
    event.preventDefault();
    let total = document.getElementById("total");
    fetch('/checkout/' + total.innerHTML).then(function(response){
        return response.json();
    }).then(function(paymentIntent){
        stripe
        .handleCardPayment(paymentIntent.client_secret, cardElement, {
            payment_method_data: {
            billing_details: { name: "asdfasdf" }
            }
        })
        .then(function(result) {
            if (result.error) {
                var displayError = document.getElementById("card-errors");
                displayError.textContent = result.error.message;
            } else {
                stripePaymentHandler();
            }
        });
    });
});

// UI enhancement to dismiss the Elements modal when the user clicks
// outside of the modal and in the window.
function dismissElementsModalOnWindowClick(event) {
    var modal = document.querySelector(".ElementsModal--modal");
    if (
        event.target === modal &&
        modal.classList[1] === "ElementsModal--show-modal"
    ) {
        toggleElementsModalVisibility();
    }
}
window.addEventListener("click", dismissElementsModalOnWindowClick);

// Allows the user to dismiss the Elements modal when using the esc key
document.addEventListener("keyup", function(event) {
    if (event.defaultPrevented) {
        return;
    }

    var key = event.key || event.keyCode;

    if (key === "Escape" || key === "Esc" || key === 27) {
        var modal = document.querySelector(".ElementsModal--modal");
        if (modal.classList[1] === "ElementsModal--show-modal") {
        toggleElementsModalVisibility();
        }
    }
});

// donateButton.addEventListener("click", function() {
//     console.log("temp tree")
//     fetch('/checkout/' + "50").then(function(response){
//         return response.json();
//     }).then(function(paymentIntent){
//         stripe
//         .handleCardPayment(paymentIntent.client_secret, cardElement, {
//           payment_method_data: {
//             billing_details: { name: "fds" }
//           }
//         })
//         .then(function(result) {
//           if (result.error) {
//             // var displayError = document.getElementById("card-errors");
//             // displayError.textContent = result.error.message;
//             console.log(result.error.message)
//           } else {
//             stripePaymentHandler();
//           }
//         });
//     })
// })





// console.log(tempTreeSprite)

// setTimeout(function(){
//     var donateButton = document.getElementsByClassName("donate")[0];

//     // var handleResult = function(result) {
//     //     if (result.error) {
//     //         console.log(result.error.message);
//     //     //   var displayError = document.getElementById("error-message");
//     //     //   displayError.textContent = result.error.message;
//     //     }
//     //   };

//     // donateButton.addEventListener("click", function() {
//     //     var quantity = 10
//     //     // Make the call to Stripe.js to redirect to the checkout page
//     //     // with the current quantity
//     //     stripe
//     //         .redirectToCheckout({
//     //         items: [{ sku: SKU_ID, quantity: quantity }],
//     //         successUrl: "http://localhost:3000/success.html?session_id={CHECKOUT_SESSION_ID}",
//     //         cancelUrl: "http://localhost:3000/canceled.html"
//     //         })
//     //         .then(handleResult);
//     //     });
// }, 4000)



