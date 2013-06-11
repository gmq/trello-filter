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
			$('<label class="button-link danger label-list-filter"><input type="checkbox" class="list-filter" id="filter-all" checked> All</label>').appendTo('.window-module.gutter');
			$(uniquelists).each(function () {
				$('<label class="button-link label-list-filter"><input type="checkbox" class="list-filter" id="filter-' + this + '"> '  + this + '</label>').appendTo('.window-module.gutter');
			});
			$('.window-module.gutter').on('change', '.list-filter', function (e) {
				e.preventDefault();
				var currentId = this.id.replace('filter-', '');
				if (currentId == 'all') {
					$('.list-card-container').fadeIn();
					$('.list-filter').not($(this)).attr('checked', false);
					$(this).parent().siblings('.danger').removeClass('danger');
					$(this).parent().addClass('danger');
				}
				else {
					$('#filter-all').attr('checked', false);
					$('#filter-all').parent().removeClass('danger');
					$('.list-filter:checked').each(function() {
						$(this).parent().addClass('danger');
						currentId = this.id.replace('filter-', '');
						cards = $('.list-card-container').find('.list-card-position:contains("' + currentId + '")').parents('.list-card-container').filter(':hidden');
						$(cards).fadeIn();
					});
					$('.list-filter').not(':checked').each(function() {
						$(this).parent().removeClass('danger');
						currentId = this.id.replace('filter-', '');
						cards = $('.list-card-container').find('.list-card-position:contains("' + currentId + '")').parents('.list-card-container');
						$(cards).fadeOut();
					});
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