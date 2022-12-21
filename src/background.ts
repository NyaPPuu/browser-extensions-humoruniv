

// chrome.webNavigation.onCommitted.addListener((details) => {
// 	if (details.parentFrameId == -1) {
// 		chrome.scripting.executeScript({ target: { tabId: details.tabId, allFrames: false }, files: ["dist/pages.js", "dist/routes/_.js"], injectImmediately: true }, function() {});
// 	}
// });
