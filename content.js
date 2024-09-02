// chrome.runtime.onMessage.addListener((message) => {
//   if (message.action === "startSearch") {
//     const searchTerm = message.searchTerm;
//     const searchInput = document.querySelector("input#sb_form_q");
//     if (searchInput) {
//       searchInput.value = searchTerm;
//       searchInput.dispatchEvent(new Event("input", { bubbles: true }));
//       searchInput.form.submit();
//     }
//   }
// });
