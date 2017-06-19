// ==UserScript==
// @name         IGG-Games/MPC-G Skiper
// @namespace    https://greasyfork.org/zh-TW/scripts/19802-igg-games-mpc-g-skiper
// @version      1.2.1
// @description  Skip wating AD page in IGG games download link
// @author       Yu-Hsin Lu
// @include      http://igg-games.com/*
// @require      https://cdn.jsdelivr.net/lodash/4.17.4/lodash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.5.10/clipboard.min.js
// @grant        unsafeWindow
// ==/UserScript==

const pat = /http:\/\/igg-games.com\/urls\/.*/i;
const URLpat = /.*xurl=(.*)$/i;
const googlepat = /drive\.google\.com/;
const megapat = /mega\.nz/;

(function() {
    let collections = {mega: [],google: []};
    let anchors = document.querySelectorAll('a');
    let processes = [];
    anchors = _.filter(anchors, anchor => pat.test(anchor.href));
    anchors.forEach(anchor => {
        const process = fetch(anchor.href).then(res => res.text()).then(data => {
            const parser = document.createElement('html');
            parser.innerHTML = data;
            const targetDOM = parser.querySelector('meta[http-equiv="refresh"]');
            let targetURL = URLpat.exec(targetDOM.content) ? URLpat.exec(targetDOM.content)[1] : null;
            if(targetURL) {
                targetURL = decodeURIComponent(targetURL);
                targetURL = `http${targetURL}`;
                anchor.href=targetURL;
                if(googlepat.test(targetURL)) collections.google.push(targetURL);
                if(megapat.test(targetURL)) collections.mega.push(targetURL);
            }
        });
        processes.push(process);
    });
    Promise.all(processes).then(() => {
        console.log(collections);
    });
})();
