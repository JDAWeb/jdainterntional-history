/* Photos page: country filter and a small lightbox. Without JavaScript,
   each photo is a plain link to its large version. */
(function () {
    'use strict';
    var sections = Array.prototype.slice.call(document.querySelectorAll('.gallery-country'));
    var filters = document.querySelector('.filters');
    var status = document.querySelector('.filter-status');
    var names = { all: 'all countries', uzbekistan: 'Uzbekistan', afghanistan: 'Afghanistan', tractors: 'the two-wheel tractor section', kurdistan: 'Iraqi Kurdistan' };

    function applyFilter(value) {
        var shown = 0;
        sections.forEach(function (s) {
            var on = value === 'all' || (s.getAttribute('data-country') || '').split(' ').indexOf(value) !== -1;
            s.hidden = !on;
            if (on) { shown += s.querySelectorAll('figure').length; }
        });
        Array.prototype.forEach.call(filters.querySelectorAll('button'), function (b) {
            b.setAttribute('aria-pressed', b.getAttribute('data-filter') === value ? 'true' : 'false');
        });
        status.textContent = 'Showing ' + shown + ' photos from ' + names[value] + '.';
    }
    if (filters) {
        filters.hidden = false;
        filters.addEventListener('click', function (e) {
            var b = e.target.closest('button[data-filter]');
            if (b) { applyFilter(b.getAttribute('data-filter')); }
        });
    }

    var dlg = document.querySelector('dialog.lightbox');
    if (!dlg || typeof dlg.showModal !== 'function') { return; }
    var img = dlg.querySelector('img');
    var cap = dlg.querySelector('figcaption');
    var count = dlg.querySelector('.lightbox-count');
    var links = [];
    var index = 0;
    var opener = null;

    function visibleLinks() {
        return Array.prototype.slice.call(document.querySelectorAll('.gallery-country:not([hidden]) a.lb'));
    }
    function show(i) {
        index = (i + links.length) % links.length;
        var a = links[index];
        var thumb = a.querySelector('img');
        var fc = a.parentNode.querySelector('figcaption');
        img.src = a.getAttribute('href');
        img.alt = thumb ? thumb.alt : '';
        cap.textContent = fc ? fc.textContent : '';
        count.textContent = 'Photo ' + (index + 1) + ' of ' + links.length;
    }
    document.addEventListener('click', function (e) {
        var a = e.target.closest('a.lb');
        if (!a || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) { return; }
        e.preventDefault();
        links = visibleLinks();
        opener = a;
        show(links.indexOf(a));
        dlg.showModal();
        dlg.querySelector('.lb-close').focus();
    });
    dlg.querySelector('.lb-prev').addEventListener('click', function () { show(index - 1); });
    dlg.querySelector('.lb-next').addEventListener('click', function () { show(index + 1); });
    dlg.querySelector('.lb-close').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1); }
    });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) { dlg.close(); } });
    dlg.addEventListener('close', function () {
        img.src = 'data:,';
        if (opener) { opener.focus(); }
    });
}());
