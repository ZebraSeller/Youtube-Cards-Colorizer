document.addEventListener('DOMContentLoaded', function(event) {
    popUpMain();
});
function popUpMain() {
    chrome.storage.sync.get({"color" : "#64a6ed"}, function(data) {

        document.getElementById('colorPicker').value = data.color;
    });
    document.getElementById('saveColor').addEventListener('click', function() {onClickSave();});
    document.getElementById('reset').addEventListener('click', function() {reset();});
}

function onClickSave() {
    var color = document.getElementById('colorPicker').value;
    chrome.storage.sync.set({color: color});
}

function reset() {
    chrome.storage.sync.clear();
    chrome.storage.local.clear();
    document.getElementById('colorPicker').value = "#64a6ed";
}
