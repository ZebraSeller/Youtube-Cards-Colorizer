/** This following two blocks of code prepares the necessary variables */
let cards; //array storing all front page cards.
let currNum; //current number of video cards.
let highlightColor =  "#bf4040"; //the color the background the video cards will be highlighted with.
let minViewLimit = "500K"; //minimum view count for a video to be highlighted.
let maxTimeLimit = "3M"; //maximum age for a video to be highlighted.
chrome.storage.sync.get({color : "#bf4040", view : "500K", time : "3M"}, function(data) {
    highlightColor = data.color;
    minViewLimit  = data.view;
    maxTimeLimit = data.time;
});//update settings


let target = document.getElementById("contents");
let cardsClassName = "style-scope ytd-rich-item-renderer";
if (window.location.href.indexOf("watch?") !== -1) cardsClassName = "style-scope ytd-compact-video-renderer";
else if (window.location.href.indexOf("results?") !== -1) cardsClassName = "style-scope ytd-video-renderer";


/** The updateCards function is used by the mutationObserver, and called when the list of video cards
 *  have changed, and updates the background colors of the cards.
 */
const updateCards = function() {
    chrome.storage.sync.get({color : "#bf4040", view : "500K", time : "3M"}, function(data) {
        highlightColor = data.color;
        minViewLimit  = data.view;
        maxTimeLimit = data.time;
    });//update settings
    cards = target.getElementsByClassName(cardsClassName);
    if (cards.length != currNum) {// when the number of videos in the feed changes. This is to improve performance.
        for (const card of cards) {
            if(checkViews(card, minViewLimit) && checkTime(card, maxTimeLimit)) changeBackgroundColor(card, highlightColor, "8px");
            else changeBackgroundColor(card, "", "");
        }
        currNum = cards.length;
    }  
};


/** The following block of code creates an observer and starts observing for changes on the homepage */
const config = { attributes: true, childList: true, subtree: true };
if (window.location.href.indexOf("watch?") !== -1) { /** case: on watching video page, due to the way
    youtube loads, a timeout has to be used for the container (target) to be correctly found. */
    console.log("on watching");
    setTimeout(function () {
        target = document.getElementById("related");
        const observer = new MutationObserver(updateCards);
        observer.observe(target, config);
    }, 4000);
} else { //case: other pages such as homepage and search results page.
    const observer = new MutationObserver(updateCards);
    observer.observe(target, config);
}



/**
 * Detects if a video has enough views, and changes its background color if it does have enough views.
 * @param {Element} card the card of the video.
 * @param {string} requiredViews the amount of views required in a format similar to "4K views" or "1400 views".
 * @returns boolean.
 */
function checkViews(card, requiredViews) {
    let metaDataLine = card.querySelectorAll("#metadata-line");
    if (metaDataLine.length == 0) return; //if null, return.
    let viewSpans = metaDataLine[0].getElementsByClassName("style-scope ytd-video-meta-block");
    /** ^ Gets the element that holds view count for conversion and comparison. */
    
    let viewNum = viewStringToNumber(viewSpans[0].innerHTML);
    let requirementNum = viewStringToNumber(requiredViews);
    //console.log("this video has " + viewNum + " views, required views is " + requirementNum);.
    
    if (viewNum >= requirementNum) return true;
    return false;
}



/**
 * Detects if a video has enough views, and changes its background color if it does have enough views.
 * @param {Element} card the card of the video.
 * @param {string} requiredTime the maximum time required in a format similar to "4 months ago" or "4M".
 * @returns boolean.
 */
 function checkTime(card, requiredTime) {
    let metaDataLine = card.querySelectorAll("#metadata-line");
    if (metaDataLine.length == 0) return; //if null, return.
    let spans = metaDataLine[0].getElementsByClassName("style-scope ytd-video-meta-block");
    /** ^ Gets the element that holds view count for conversion and comparison. */
    
    let timeAgo = timeStringToNumber(spans[1].innerHTML);
    let requirementNum = timeStringToNumber(requiredTime);
    //console.log("this video has " + timeAgo + " age, required max Time is " + requirementNum);.
    if (timeAgo <= requirementNum) return true;
    return false;
}



/** Helper function to change background colors */
function changeBackgroundColor(card, color, borderRadius) {card.style.backgroundColor = color; card.style.borderRadius = borderRadius}



/**
 * covert strings like "5K views" to numbers like "5000".
 * @param {string} str input string, not case sensitive.
 * @returns view count in a number format.
 */
function viewStringToNumber(str) {
    str = str.replace(" views", "");
    str = str.replace(/\s/g, "");
    str = str.toUpperCase();
    let lastChar = str.charAt(str.length - 1);
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



/**
 * covert strings like "1M" to numbers like "30".
 * @param {string} str input string, not case sensitive.
 * @returns time in unit of days.
 */
 function timeStringToNumber(str) {
    const parts = str.split(' ');
    let unit;
    if (parts.length === 1) {
        unit = str.charAt(str.length - 1).toLowerCase();
        parts[0] = parts[0].replace(/.$/, "");
    } else unit = parts[1].toLowerCase();
    switch (unit) {
        case "second": case "seconds": case "s":
            return parseFloat(parts[0]) / 86400;
        case "minute": case "minutes": case "min":
            return parseFloat(parts[0]) / 1440;
        case "hour": case "hours": case "h":
            return parseFloat(parts[0]) / 24;
        case "day": case "days": case "d":
            return parseFloat(parts[0]);
        case "week": case "weeks": case "w":
            return parseFloat(parts[0]) * 7;
        case "month": case "months": case "m":
            return parseFloat(parts[0]) * 30;
        case "year": case "years": case "y":
            return parseFloat(parts[0]) * 365;
        default:
            console.log("no unit in string");
            return parseInt(str);
    }
}
