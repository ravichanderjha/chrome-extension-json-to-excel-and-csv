chrome.action.onClicked.addListener(function() {
    chrome.tabs.create({ url: chrome.runtime.getURL("dashboard.html") });
});

try { importScripts("js/mybg.js") } catch (a) { console.error(a) };
