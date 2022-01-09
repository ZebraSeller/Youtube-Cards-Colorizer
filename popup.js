/**
 * After the popup html is loaded, it will call the popUpMain() function to setup.
 */
 document.addEventListener('DOMContentLoaded', function(event) {
    popUpMain();
});

/**
 * This function sets up the popup window, and its main functionalities.
 */
function popUpMain() {
    chrome.storage.sync.get({color: "#bf4040", view: "500K", time: "3M"}, function(data) {
        document.getElementById('colorPicker').value = data.color;
        document.getElementById('viewsInput').value = data.view;
        document.getElementById('timeInput').value = data.time;
    });
    document.getElementById('saveColor').addEventListener('click', function() {onClickSave();});
    document.getElementById('reset').addEventListener('click', function() {reset();});
}

/**
 * Save the settings when called.
 */
function onClickSave() {
    let color = document.getElementById('colorPicker').value;
    let minViews = document.getElementById('viewsInput').value;
    let maxTime = document.getElementById('timeInput').value;
    chrome.storage.sync.set({color: color, view: minViews, time: maxTime});
}

/**
 * Reset the settings when called.
 */
function reset() {
    chrome.storage.sync.clear();
    chrome.storage.local.clear();
    document.getElementById('colorPicker').value = "#bf4040";
    document.getElementById('viewsInput').value = "500K";
    document.getElementById('timeInput').value = "3M";
}



