console.log("FrontPageColorizer Injected");
var cards; //array storing all front page cards.
var numCards, currNum;
var highlightColor = "red";
chrome.runtime.onMessage.addListener(
    function(msg, sender, sendResponse) {
        switch(msg.type) {
            case "sendingColor":
                highlightColor = msg.content;
            break;
        }
    }
);

const target = document.getElementById("contents");
const config = { attributes: true, childList: true, subtree: true };
const updateCards = function() {
    cards = target.getElementsByClassName("style-scope ytd-rich-item-renderer");
    console.log("Cards updated, new length " + cards.length);
    numCards = cards.length;
    if (numCards != currNum) {// when the number of videos in the feed changes.
        for (const card of cards) {
            if(checkViews(card, "900K views")) changeBackgroundColor(card, "hsl(10,50%,50%)", "8px");
            else changeBackgroundColor(card, "", "");
        }
        currNum = numCards;
    }  
};
/** creates an observer and starts observing for changes on the homepage */
const observer = new MutationObserver(updateCards);
observer.observe(target, config);

/**
 * Detects if a video has enough views, and changes its background color if it does have enough views.
 * @param {Element} card the card of the video.
 * @param {string} requiredViews the amount of views required in a format similar to "4K views" or "1400 views".
 * @returns boolean.
 */
function checkViews(card, requiredViews) {
    var metaDataLine = card.querySelectorAll("#metadata-line");
    if (metaDataLine.length == 0) return; //if null, return.
    var viewSpans = metaDataLine[0].getElementsByClassName("style-scope ytd-video-meta-block");
    /** ^ Gets the element that holds view count for conversion and comparison. */
    
    var viewNum = viewStringToNumber(viewSpans[0].innerHTML);
    var requirementNum = viewStringToNumber(requiredViews);
    console.log("this video has " + viewNum + " views, required views is " + requirementNum);
    
    if (viewNum >= requirementNum) return true;
    return false;
}

/** Helper function to change background colors */
function changeBackgroundColor(card, color, borderRadius) {card.style.backgroundColor = color; card.style.borderRadius = borderRadius}

/**
 * covert strings like "5K views" to numbers like "5000".
 * @param {string} str input string.
 * @returns view count in a number format.
 */
function viewStringToNumber(str) {
    str = str.replace(" views", "");
    var lastChar = str.charAt(str.length - 1);
    switch (lastChar) {
        case "B":
            return parseFloat(str.substring(0, str.length - 1)) * 1000000000;
        case "M":
            return parseFloat(str.substring(0, str.length - 1)) * 1000000;
        case "K":
            return parseFloat(str.substring(0, str.length - 1)) * 1000;
        default:
            return parseInt(str);
    }
}