// version 1.0
// let searchInterval;
// let searchCount = 0;
// let numSearches = 10; // Default value
// let minInterval = 10000; // Default minimum time in ms (10 seconds)
// let maxInterval = 20000; // Max time in ms (20 seconds)
// let usedInputs = new Set(); // Track used inputs to prevent repetition

// // Helper function to generate a random input
// function getRandomInput() {
//   const characters = "abcdefghijklmnopqrstuvwxyz";
//   const length = Math.floor(Math.random() * 3) + 1; // Random length between 1 and 3
//   let input;
//   do {
//     input = "";
//     for (let i = 0; i < length; i++) {
//       input += characters.charAt(Math.floor(Math.random() * characters.length));
//     }
//   } while (usedInputs.has(input)); // Ensure no repeats
//   usedInputs.add(input);
//   return input;
// }

// // Function to get a random interval between searches
// function getRandomInterval() {
//   return (
//     Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval
//   );
// }

// // Function to perform a search
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
//           // Updated to reflect Bing's suggestion dropdown structure
//           const suggestions = document.querySelectorAll(".sa_sg .sa_sg"); // Example class names, adjust accordingly
//           if (suggestions.length > 0) {
//             const randomSuggestion =
//               suggestions[Math.floor(Math.random() * suggestions.length)];
//             randomSuggestion.click(); // Click on a random suggestion
//           } else {
//             searchInput.form.submit(); // If no suggestions, submit the form
//           }
//         }, 2000); // Adjust the delay if necessary
//       } else {
//         console.error("Search input not found");
//       }
//     },
//     args: [randomInput],
//   });

//   searchCount++;
//   if (searchCount >= numSearches) {
//     clearInterval(searchInterval);
//     chrome.action.setIcon({ path: "icons/dice16.png" });
//   }
// }

// // Function to start searching
// function startSearching() {
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     const tabId = tabs[0].id;

//     if (tabId) {
//       searchCount = 0;
//       clearInterval(searchInterval); // Ensure no previous interval is running
//       searchInterval = setInterval(() => {
//         performSearch(tabId);
//       }, getRandomInterval());
//     } else {
//       console.error("No active tab found");
//     }
//   });
// }

// // Listener for the popup's start button
// chrome.runtime.onMessage.addListener((message) => {
//   if (message.action === "startSearch") {
//     chrome.storage.sync.get(["numSearches", "minInterval"], (data) => {
//       numSearches = data.numSearches || 10;
//       minInterval = (data.minInterval || 10) * 1000;
//       maxInterval = minInterval + 10000; // Max interval is 10 seconds more than minInterval
//       startSearching();
//     });
//   }
// });

// version 2.0
let searchInterval;
let searchCount = 0;
let numSearches = 10; // Default value
let minInterval = 10000; // Default minimum time in ms (10 seconds)
let maxInterval = 20000; // Max time in ms (20 seconds)
let usedInputs = new Set(); // Track used inputs to prevent repetition

// Helper function to generate a random input
function getRandomInput() {
  const characters = "abcdefghijklmnopqrstuvwxyz1234567890";
  const length = Math.floor(Math.random() * 3) + 1; // Random length between 1 and 3
  let input;
  do {
    input = "";
    for (let i = 0; i < length; i++) {
      input += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  } while (usedInputs.has(input)); // Ensure no repeats
  usedInputs.add(input);
  return input;
}

// Function to get a random interval between searches
function getRandomInterval() {
  return (
    Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval
  );
}

// Function to perform a search
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
          // Updated to reflect Bing's suggestion dropdown structure
          const suggestions = document.querySelectorAll(".sa_sg"); // Adjusted class name
          if (suggestions.length > 0) {
            const randomSuggestion =
              suggestions[Math.floor(Math.random() * suggestions.length)];
            randomSuggestion.click(); // Click on a random suggestion
          } else {
            searchInput.form.submit(); // If no suggestions, submit the form
          }
        }, 2000); // Adjust the delay if necessary
      } else {
        console.error("Search input not found");
      }
    },
    args: [randomInput],
  });

  searchCount++;
  if (searchCount >= numSearches) {
    clearInterval(searchInterval);
    chrome.action.setIcon({ path: "icons/dice16.png" });
  }
}

// Function to start searching
function startSearching() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;

    if (tabId) {
      searchCount = 0;
      clearInterval(searchInterval); // Ensure no previous interval is running
      searchInterval = setInterval(() => {
        performSearch(tabId);
      }, getRandomInterval());
    } else {
      console.error("No active tab found");
    }
  });
}

// Listener for the popup's start button
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "startSearch") {
    chrome.storage.sync.get(["numSearches", "minInterval"], (data) => {
      numSearches = data.numSearches || 10;
      minInterval = (data.minInterval || 10) * 1000;
      maxInterval = minInterval + 10000; // Max interval is 10 seconds more than minInterval
      startSearching();
    });
  }
});
