// Copyright (c) 2016 Lelis Alves, Rodrigo Vieira. All rights reserved.
// Use of this source code is governed by a Apache license that can be
// found in the LICENSE file.


setTimeout(initExecution, 1000); //Init execution of the process all chats

/**
 * Strip special caracter of string
 *  @memberof String
 */
String.prototype.strip = function() {
    return this
        .replace(/[áàãâä]/gi, "a")
        .replace(/[éè¨ê]/gi, "e")
        .replace(/[íìïî]/gi, "i")
        .replace(/[óòöôõ]/gi, "o")
        .replace(/[úùüû]/gi, "u")
        .replace(/[ç]/gi, "c")
        .replace(/[ñ]/gi, "n")
        .replace(/[^a-zA-Z0-9]/g, " ");
}

/**
 * Veirfy if a specific string contains any substring in subtrings param
 *  @param {Array.<string>} subtrings Substrings Array to check if contains in string
 *  @memberof String
 */
String.prototype.containsAny = function(substrings) {

    for (var i = 0; i != substrings.length; i++) {
        var substring = substrings[i].toLowerCase().strip().split(" ");
        var containsSub = true;
        for (var j = 0; j < substring.length; j++) {
            if (this.indexOf(substring[j]) == -1) {
                containsSub = false;
                break;
            }
        }
        if (containsSub) {
            return containsSub;
        }
    }
    return false;
}

/**
 * Process a chat of the WhatsApp Web
 *  @param {number} index Index of the current chat
 */
function processChat(index) {
    let el = $(this);
    let str = el.html();

    if (str.toLowerCase().strip().containsAny(substrings)) {
        el.hide();
        el.css({"pointer-events": "none"});
    } else {
        el.show();
    }
}

/**
 * Var with the substrings of the storage
 */
var substrings;


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * On get value of the current Storage
 *  @param {Array.<Object>} item Arrays of Words in the storage
 */
function onGetValue(item) {

    substrings = [];
    if (item && item.words && Object.prototype.toString.call(item.words) === '[object Array]') {
        for (var i = 0; i < item.words.length; i++) {
            if (item.words[i].active) {
                substrings = substrings.concat(item.words[i].value);
            }
        }
    }
    //Put correct id
    var items = document.querySelectorAll("._1MZWu");
    // console.log(items);
    //Process all chats

    $(items).each(processChat);


    //Continue the execution
    setTimeout(initExecution, 10);
}

/**
 * init Execution
 */
async function initExecution() {
    //wait for chat
    while (!document.querySelector("._1MZWu")) {
        // console.log(document.querySelector("._1MZWu"));
        await sleep(100);
    }
    chrome.storage.sync.get('words', onGetValue);
}
