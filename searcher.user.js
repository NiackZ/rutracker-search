// ==UserScript==
// @name         rutracker search
// @namespace    rutracker helpers
// @version      0.7
// @description  Поиск по названию из заголовка
// @author       NiackZ
// @homepage     https://github.com/NiackZ/rutracker-search
// @downloadURL  https://github.com/NiackZ/rutracker-search/raw/master/searcher.user.js
// @updateURL    https://github.com/NiackZ/rutracker-search/raw/master/searcher.user.js
// @match        https://rutracker.org/forum/viewtopic.php?t=*
// @match        https://rutracker.net/forum/viewtopic.php?t=*
// @match        https://rutracker.nl/forum/viewtopic.php?t=*
// @match        https://rutracker.org/forum/viewtopic.php?p=*
// @match        https://rutracker.net/forum/viewtopic.php?p=*
// @match        https://rutracker.nl/forum/viewtopic.php?p=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rutracker.org
// @grant        none
// ==/UserScript==

(function() {

    const SELECTOR = '#main_content_wrap .w100 .maintitle';
    const HEADER_SELECTOR = '#topic-title';
    const DIV_ID = 'custom-search-div';
    const BRACKETS_REGEX = /\([^)]*\)/g;
    const SEARCHERS = [
        {
            name: 'По разделу',
            url: 'https://rutracker.org/forum/tracker.php?f=1105,1106,1386,1387,1389,1390,1391,1642,2484,2491,2544,404,599,809,893&nm=%s',
            encode: true,
            maxLen: 100
        },
        {
            name: 'Shikimori',
            url: 'https://shikimori.me/animes?search=%s',
            encode: true
        },
        {
            name: 'World-Art',
            url: 'http://www.world-art.ru/search.php?name=%s&global_sector=animation'
        },
        {
            name: 'AniDB',
            url: 'https://anidb.net/search/anime/?adb.search=%s',
            encode: true
        },
        {
            name: 'MAL',
            url: 'https://myanimelist.net/search/all?q=%s',
            encode: true
        },
        {
            name: 'КиноПоиск',
            url: 'https://www.kinopoisk.ru/index.php?kp_query=%s',
            encode: true
        },
        {
            name: 'IMDb',
            url: 'https://www.imdb.com/find/?q=%s',
            encode: true
        }
    ]
    const NAMES = [];


    const createBlockAfterSelector = (selector) => {
        const element = document.querySelector(selector);
        if (element) {
            const newDiv = document.createElement('div');
            newDiv.style.width = '100%';
            newDiv.style.padding = '5px 0px';
            newDiv.style.marginTop = '10px';
            newDiv.style.fontSize = '17px';
            newDiv.id = DIV_ID;

            element.appendChild(newDiv);
        }
    }

    const getNames = () => {
        const header = document.querySelector(HEADER_SELECTOR);
        if (header) {
            let headerText = header.innerText;
            headerText = headerText.slice(0, headerText.indexOf("["));
            headerText = headerText.replace(BRACKETS_REGEX, '');
            for(let name of headerText.split('/')) {
                NAMES.push(name
                    .trim()
                    .replaceAll("  ", " ")
                    .replaceAll(" ,",","))
            }
        }
        else console.error("Не найден заголовок!")
    }

    const createSearchHelper = () => {
        if (NAMES.length !== 0 && SEARCHERS.length !== 0) {
            const customDiv = document.getElementById(DIV_ID);
            NAMES.forEach(name => {
                const span = document.createElement("span");
                span.textContent = `${name}: `;
                span.style.display = 'block';
                SEARCHERS.forEach((searcher, index) => {
                    const a = document.createElement('a');
                    a.textContent = searcher.name;
                    let maxName = name;
                    if (searcher.maxLen) {
                        maxName = name.slice(0, searcher.maxLen);
                        maxName = maxName.slice(0, maxName.lastIndexOf(" ") + 1);
                    }
                    a.href = searcher.encode
                        ? encodeURI(searcher.url.replace('%s', maxName))
                        : searcher.url.replace('%s', maxName)
                    a.target = '_blank';

                    span.appendChild(a);
                    if (index < SEARCHERS.length - 1) {
                        span.appendChild(document.createTextNode(' | '));
                    }
                });
                customDiv.appendChild(span)
            })
        }
    }

    createBlockAfterSelector(SELECTOR);
    getNames();
    createSearchHelper();

})();