function showAlert(message, duration) {
  const alertBox = document.createElement("div");
  alertBox.textContent = message;
  alertBox.style.position = "fixed";
  alertBox.style.top = "50%";
  alertBox.style.left = "50%";
  alertBox.style.transform = "translate(-50%, -50%)";
  alertBox.style.backgroundColor = "#007bff";
  alertBox.style.color = "#fff";
  alertBox.style.padding = "15px 25px";
  alertBox.style.borderRadius = "5px";
  alertBox.style.fontSize = "18px";
  alertBox.style.textAlign = "center";
  alertBox.style.zIndex = "1000";

  document.body.appendChild(alertBox);

  setTimeout(() => {
    alertBox.remove();
  }, duration);
}

function checkAndDisplayRemainingSearches() {
  chrome.storage.local.get("remainingSearches", (data) => {
    const remaining = data.remainingSearches;
    if (remaining !== undefined) {
      showAlert(`Remaining Searches: ${remaining}`, 2000);
    }
  });
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "updateRemainingSearches") {
    setTimeout(checkAndDisplayRemainingSearches, 2000);
  }
});
