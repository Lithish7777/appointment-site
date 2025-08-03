document.getElementById("appointmentForm").addEventListener("submit", function (e) {
  e.preventDefault();
  document.getElementById("successMessage").classList.remove("hidden");
});
