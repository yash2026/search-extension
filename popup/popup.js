// version 2.1
document.getElementById("start-search").addEventListener("click", () => {
  const numSearches = parseInt(
    document.getElementById("num-searches").value,
    10
  );
  const minInterval = parseInt(
    document.getElementById("min-interval").value,
    10
  );

  if (numSearches > 0 && minInterval >= 10) {
    chrome.storage.sync.set({ numSearches, minInterval }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error setting storage:", chrome.runtime.lastError);
      } else {
        chrome.runtime.sendMessage({ action: "startSearch" }).catch((error) => {
          console.error("Failed to send message to background script:", error);
        });
        // Change button background to green on successful submit
        document.getElementById("start-search").style.backgroundColor =
          "#28a745";
      }
    });
  }
});

function validateInputs() {
  const numSearchesInput = document.getElementById("num-searches");
  const minIntervalInput = document.getElementById("min-interval");
  const startSearchButton = document.getElementById("start-search");

  const numSearches = parseInt(numSearchesInput.value, 10);
  const minInterval = parseInt(minIntervalInput.value, 10);

  let valid = true;

  if (isNaN(numSearches) || numSearches <= 0) {
    numSearchesInput.style.border = "2px solid red";
    valid = false;
  } else {
    numSearchesInput.style.border = "";
  }

  if (isNaN(minInterval) || minInterval < 10) {
    minIntervalInput.style.border = "2px solid red";
    valid = false;
  } else {
    minIntervalInput.style.border = "";
  }

  startSearchButton.disabled = !valid;

  // Reset button background color if inputs are valid
  if (valid) {
    startSearchButton.style.backgroundColor = "#007bff"; // or the default button color
  }
}

document
  .getElementById("num-searches")
  .addEventListener("input", validateInputs);
document
  .getElementById("min-interval")
  .addEventListener("input", validateInputs);
