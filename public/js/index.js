// Get the modal
var modal = document.getElementsByClassName("modal-content")[0];

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// Default modal visible
modal.style.visibility = "visible";

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.visibility = "visible";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.visibility = "hidden";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.visibility = "hidden";
  }
}
