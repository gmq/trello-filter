'use strict';

// Script injection from: http://stackoverflow.com/a/9517879
var actualCode = '(' + function() {
  // XHR interception from: http://stackoverflow.com/a/13768794
  var XHR = window.XMLHttpRequest.prototype;
    // Remember references to original methods
    var open = XHR.open;
    var send = XHR.send;

    // Overwrite native methods
    // Collect data:
    XHR.open = function(method, url) {
        this._method = method;
        this._url = url;
        return open.apply(this, arguments);
    };

    // Implement "ajaxSuccess" functionality
    XHR.send = function (postData) {
      this.addEventListener('load', function () {
        getAndGenerateCards(this.responseText);
      });
      return send.apply(this, arguments);
    };

    function getAndGenerateCards(responseText) {
      let json;
      let lists;
      try {
        json = JSON.parse(responseText);
      } catch(error) {
      }
      if (json.cards && json.boards) {
        lists = getLists(json.boards, json.cards);
        generateDomButtons(lists);
      }
    }

    function getLists(boards, cards) {
      let listsById = {};
      let listsByName = {};

      boards.forEach((board) => {
        board.lists.forEach((list) => {
          listsById[list.id] = list.name.toLowerCase();
        });
      });

      cards.forEach((card) => {
        listsByName[listsById[card.idList]] = listsByName[listsById[card.idList]] || [];
        listsByName[listsById[card.idList]].push(card);
      });

      return listsByName;
    }

    function generateDomButtons(lists) {
      let filterList = document.createElement('ul');
      filterList.className = 'filter-list';
      Object.keys(lists).forEach((key) => {
        checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.className = "filter-list__checkbox";
        checkbox.name = "card-filter";
        checkbox.value = key;
        checkbox.addEventListener('change', handleCheck);

        label = document.createElement('label');

        domList = document.createElement('li');
        domList.className = 'button-link filter-list__filter';

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' ' + key + ' (' + lists[key].length + ')'));

        domList.appendChild(label);

        filterList.appendChild(domList);
      });

      let getWrapper = window.setInterval(function (){
        let wrapper = document.querySelector('.tabbed-pane-main-col-wrapper .window-module.u-gutter');
        if (wrapper){
          wrapper.insertBefore(filterList, wrapper.firstChild);
          window.clearInterval(getWrapper);
        }
      },500)
    }

    function handleCheck(event) {
      let allCheckedFilters = Array.prototype.slice.call(document.querySelectorAll('input[name="card-filter"]:checked'));
      let cards = Array.prototype.slice.call(document.querySelectorAll('.card-grid-container'));
      let allCards;
      cards.forEach((card) => {
        position = card.querySelector('.list-card-position strong');
        itsChecked = (allCheckedFilters.length === 0) || allCheckedFilters.find((check) => check.value == position.innerText.toLowerCase());
        if (itsChecked) {
          card.classList.remove('card--filtered');
          card.classList.add('card--unfiltered');
        } else {
          card.classList.remove('card--unfiltered');
          card.classList.add('card--filtered');
        }
      });
    }
} + ')();';

var script = document.createElement('script');
script.textContent = actualCode;
(document.head || document.documentElement).appendChild(script);
script.remove();