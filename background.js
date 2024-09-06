// version 2.1
// let searchInterval;
// let searchCount = 0;
// let numSearches = 10;
// let minInterval = 10000;
// let maxInterval = 20000;
// let usedInputs = new Set();

// function getRandomInput() {
//   const characters = "abcdefghijklmnopqrstuvwxyz1234567890";
//   const length = Math.floor(Math.random() * 3) + 1;
//   let input;
//   do {
//     input = "";
//     for (let i = 0; i < length; i++) {
//       input += characters.charAt(Math.floor(Math.random() * characters.length));
//     }
//   } while (usedInputs.has(input));
//   usedInputs.add(input);
//   return input;
// }

// function getRandomInterval() {
//   return (
//     Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval
//   );
// }

// function performSearch(tabId) {
//   const randomInput = getRandomInput();

//   chrome.scripting.executeScript({
//     target: { tabId: tabId },
//     func: (randomInput) => {
//       const searchInput = document.querySelector("input#sb_form_q");
//       if (searchInput) {
//         searchInput.value = randomInput;
//         searchInput.dispatchEvent(new Event("input", { bubbles: true }));

//         setTimeout(() => {
//           const suggestions = document.querySelectorAll(".sa_sg");
//           if (suggestions.length > 0) {
//             const randomSuggestion =
//               suggestions[Math.floor(Math.random() * suggestions.length)];
//             randomSuggestion.click();
//           } else {
//             searchInput.form.submit();
//           }
//         }, 2000);
//       } else {
//         window.location.href = "https://www.bing.com";
//       }
//     },
//     args: [randomInput],
//   });

//   searchCount++;
//   // Update remaining searches
//   chrome.runtime
//     .sendMessage({
//       action: "updateCount",
//       remaining: numSearches - searchCount,
//     })
//     .catch((error) => {
//       console.error("Failed to send message:", error);
//     });

//   if (searchCount >= numSearches) {
//     clearInterval(searchInterval);
//     chrome.action.setIcon({ path: "icons/dice16.png" });
//   }
// }

// function startSearching() {
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     const tabId = tabs[0].id;

//     if (tabId) {
//       searchCount = 0;
//       clearInterval(searchInterval);
//       searchInterval = setInterval(() => {
//         performSearch(tabId);
//       }, getRandomInterval());
//     } else {
//       console.error("No active tab found");
//     }
//   });
// }

// chrome.runtime.onMessage.addListener((message) => {
//   if (message.action === "startSearch") {
//     chrome.storage.sync.get(["numSearches", "minInterval"], (data) => {
//       numSearches = data.numSearches || 10;
//       minInterval = (data.minInterval || 10) * 1000;
//       maxInterval = minInterval + 10000;
//       startSearching();
//     });
//   }
// });

// background.js

// version 2.1
let searchInterval;
let searchCount = 0;
let numSearches = 10;
let minInterval = 10000;
let maxInterval = 20000;
let usedInputs = new Set();

function getRandomInput() {
  const characters = "abcdefghijklmnopqrstuvwxyz1234567890";
  const length = Math.floor(Math.random() * 3) + 1;
  let input;
  do {
    input = "";
    for (let i = 0; i < length; i++) {
      input += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  } while (usedInputs.has(input));
  usedInputs.add(input);
  return input;
}

function getRandomInterval() {
  return (
    Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval
  );
}

function performSearch(tabId) {
  const randomInput = getRandomInput();

  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: (randomInput) => {
      const searchInput = document.querySelector("input#sb_form_q");
      if (searchInput) {
        searchInput.value = randomInput;
        searchInput.dispatchEvent(new Event("input", { bubbles: true }));

        setTimeout(() => {
          const suggestions = document.querySelectorAll(".sa_sg");
          if (suggestions.length > 0) {
            const randomSuggestion =
              suggestions[Math.floor(Math.random() * suggestions.length)];
            randomSuggestion.click();
          } else {
            searchInput.form.submit();
          }
        }, 2000);
      } else {
        window.location.href = "https://www.bing.com";
      }
    },
    args: [randomInput],
  });

  searchCount++;
  const remaining = numSearches - searchCount;
  chrome.storage.local.set({ remainingSearches: remaining });

  if (searchCount >= numSearches) {
    clearInterval(searchInterval);
    chrome.action.setIcon({ path: "icons/dice16.png" });
  }
}

function startSearching() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;

    if (tabId) {
      searchCount = 0;
      clearInterval(searchInterval);
      searchInterval = setInterval(() => {
        performSearch(tabId);
      }, getRandomInterval());
    } else {
      console.error("No active tab found");
    }
  });
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "startSearch") {
    chrome.storage.sync.get(["numSearches", "minInterval"], (data) => {
      numSearches = data.numSearches || 10;
      minInterval = (data.minInterval || 10) * 1000;
      maxInterval = minInterval + 10000;
      startSearching();
    });
  }
});

// Ensure the correct usage of the `webNavigation` API
chrome.webNavigation.onCompleted.addListener(
  (details) => {
    if (details.frameId === 0) {
      chrome.tabs.sendMessage(details.tabId, {
        action: "updateRemainingSearches",
      });
    }
  },
  { url: [{ hostContains: "bing.com" }] }
);
