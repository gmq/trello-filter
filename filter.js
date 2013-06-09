"use strict"
/*global $:false, jQuery:false */

var createButtons = function () {
	var cards;
	$('#content').bind('DOMNodeInserted', function () {
		if ($('.window-sidebar').length == 1) {
			$('#content').unbind('DOMNodeInserted');
			var lists = $('.list-card-container').find('.list-card-position').children('strong:first-child').map(function (i, el) {
				return $(el).text();
			});
			var uniquelists = [];
			$.each(lists, function (i, el) {
				if ($.inArray(el, uniquelists) === -1) uniquelists.push(el);
			});
			$('<a class="button-link list-filter inline" href="#" id="filter-all">All</a>').appendTo('.window-module.gutter');
			$(uniquelists).each(function () {
				$('<a href="#" class="button-link list-filter inline" id="filter-' + this + '">' + this + '</a>').appendTo('.window-module.gutter');
			});
			$('.window-module.gutter').on('click', '.list-filter', function (e) {
				e.preventDefault();
				$(this).siblings('.danger').removeClass('danger');
				$(this).addClass('danger');
				var currentId = this.id.replace('filter-', '');
				if (currentId == 'all') {
					$('.list-card-container').fadeIn();
				} else {
					cards = $('.list-card-container').find('.list-card-position:contains("' + currentId + '")').parents('.list-card-container');
					$(cards).fadeIn();
					$('.list-card-container').not(cards).fadeOut();
				}
			});
		}
	});
};
var ran = 0;
var href = window.location.href;
if (href.substr(href.lastIndexOf('/') + 1) == 'cards') {
	createButtons();
	ran = 1;
}
setInterval(function () {
	var href = window.location.href;
	if (href.substr(href.lastIndexOf('/') + 1) == 'cards') {
		if (ran === 0) {
			ran = 1;
			createButtons();
		}
	} else {
		ran = 0;
	}
}, 500);