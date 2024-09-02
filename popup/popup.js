// document.getElementById("start-search").addEventListener("click", () => {
//   const numSearches = parseInt(
//     document.getElementById("num-searches").value,
//     10
//   );
//   const minInterval = parseInt(
//     document.getElementById("min-interval").value,
//     10
//   );

//   if (numSearches > 0 && minInterval >= 10) {
//     chrome.storage.sync.set({ numSearches, minInterval }, () => {
//       if (chrome.runtime.lastError) {
//         console.error("Error setting storage:", chrome.runtime.lastError);
//       } else {
//         chrome.runtime.sendMessage({ action: "startSearch" });
//         alert("Search started!");
//       }
//     });
//   } else {
//     alert("Please enter valid values.");
//   }
// });

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
        chrome.runtime.sendMessage({ action: "startSearch" });
        alert("Search started!");
      }
    });
  } else {
    alert("Please enter valid values.");
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "updateCount") {
    document.getElementById(
      "remaining-searches"
    ).textContent = `Remaining Searches: ${message.remaining}`;
  }
});
