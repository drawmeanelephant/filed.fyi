/* Cantilever — progressive enhancement for the Filed & Forgotten archive.
   Optional throughout; the archive reads and navigates without this file.
   No dependencies and no external requests. It reads markup Boris already
   emitted and the search index Boris publishes beside it.
*/
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    syncNavDrawer();
    buildSearch();
  });

  /* The navigation drawer ships closed so narrow screens open on the page,
     not on the menu. On wide screens it is the sidebar, so open it there and
     keep it in step with the viewport. The media query mirrors the CSS
     breakpoint that hides the drawer's summary. */
  function syncNavDrawer() {
    var drawer = document.querySelector('.site-nav-drawer');
    if (!drawer || typeof window.matchMedia !== 'function') return;
    var wide = window.matchMedia('(min-width: 961px)');
    function sync() { drawer.open = wide.matches; }
    sync();
    if (typeof wide.addEventListener === 'function') {
      wide.addEventListener('change', sync);
    } else if (typeof wide.addListener === 'function') {
      wide.addListener(sync);
    }
  }

  /* Rendered-site search.
     Boris publishes one deterministic JSON index beside the generated site.
     The UI reads only that artifact, validates its v1 shape before use, and
     builds text-only links so archived content is never treated as markup. */
  function buildSearch() {
    var ui = document.querySelector('[data-cantilever-search-ui]');
    if (!ui) return;

    var input = ui.querySelector('#cantilever-search-input');
    var form = ui.querySelector('[data-cantilever-search-form]');
    var status = ui.querySelector('[data-cantilever-search-status]');
    var results = ui.querySelector('[data-cantilever-search-results]');
    if (!input || !form || !status || !results || typeof fetch !== 'function') return;

    var siteRootPrefix = getSiteRootPrefix();
    var indexUrl = new URL(siteRootPrefix + '_boris/search/search-index.json', document.baseURI);
    var expectedFormat = 'boris-rendered-search-index';
    var expectedSchema = 1;
    var documents = [];
    var indexReady = false;
    var indexFailed = false;

    form.action = siteRootPrefix + '_boris/search/';

    function setStatus(message) {
      status.textContent = message;
    }

    function clearResults() {
      while (results.firstChild) results.removeChild(results.firstChild);
    }

    function renderSearch() {
      clearResults();
      var query = normalize(input.value);

      if (!query) {
        if (indexFailed) {
          setStatus('Search index unavailable. Browse the collections.');
        } else if (indexReady) {
          setStatus(documents.length ? 'Search ' + documents.length.toLocaleString('en-US') + ' records.' + shortcutHint() : 'Search index is empty.');
        } else {
          setStatus('Loading archive index…');
        }
        return;
      }

      if (!indexReady) {
        setStatus(indexFailed ? 'Search index unavailable. Browse the collections.' : 'Search index is still loading…');
        return;
      }

      var terms = query.split(' ').filter(function (term) { return term.length > 0; });
      var matches = [];
      documents.forEach(function (doc) {
        var match = scoreDocument(doc, terms, query);
        if (match) matches.push(match);
      });
      matches.sort(function (a, b) {
        return b.score - a.score || compareBytes(a.doc.path, b.doc.path) || a.sectionIndex - b.sectionIndex;
      });

      if (!matches.length) {
        setStatus('No matches. Try a different search.');
        return;
      }

      var visible = matches.slice(0, 10);
      setStatus((matches.length > visible.length ? 'Showing ' + visible.length + ' of ' : '') + matches.length + ' result' + (matches.length === 1 ? '' : 's') + '.');
      visible.forEach(function (match) {
        results.appendChild(renderResult(match, terms));
      });
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      renderSearch();
      input.focus();
    });

    input.addEventListener('input', renderSearch);
    input.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        input.value = '';
        renderSearch();
      }
    });

    document.addEventListener('keydown', function (event) {
      var active = document.activeElement;
      var tagName = active && active.tagName ? active.tagName : '';
      if (event.key === '/' && active !== input && !/INPUT|TEXTAREA|SELECT/.test(tagName)) {
        event.preventDefault();
        input.focus();
      }
    });

    fetch(indexUrl.href, { credentials: 'same-origin' })
      .then(function (response) {
        if (!response.ok) throw new Error('search index request failed');
        return response.json();
      })
      .then(function (index) {
        if (!isValidIndex(index, expectedFormat, expectedSchema)) throw new Error('unsupported search index');
        documents = index.documents;
        indexReady = true;
        renderSearch();
      })
      .catch(function () {
        documents = [];
        indexFailed = true;
        clearResults();
        setStatus('Search index unavailable. Browse the collections.');
      });
  }

  /* The "/" shortcut needs a keyboard. Mirrors the CSS query that shows the
     <kbd> hint, so touch screens are not told to press a key they lack. */
  function shortcutHint() {
    var fine = typeof window.matchMedia === 'function' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    return fine ? ' Press / to focus.' : '';
  }

  function getSiteRootPrefix() {
    var sheet = document.querySelector('link[rel="stylesheet"][href*="assets/"]');
    var href = sheet ? (sheet.getAttribute('href') || '') : '';
    var marker = href.lastIndexOf('assets/');
    return marker >= 0 ? href.slice(0, marker) : '';
  }

  function normalize(value) {
    var text = String(value || '');
    if (typeof text.normalize === 'function') {
      text = text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
    }
    return text.toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function isValidIndex(index, expectedFormat, expectedSchema) {
    if (!index || index.format !== expectedFormat || index.schema_version !== expectedSchema || !Array.isArray(index.documents)) return false;
    return index.documents.every(function (doc) {
      if (!doc || typeof doc.path !== 'string' || !isValidDocumentPath(doc.path) || typeof doc.title !== 'string' || !Array.isArray(doc.sections)) return false;
      return doc.sections.every(function (section) {
        return section && typeof section.level === 'number' && isFinite(section.level) && Math.floor(section.level) === section.level && section.level >= 0 && section.level <= 6 && typeof section.heading === 'string' &&
          typeof section.fragment === 'string' && typeof section.text === 'string' && typeof section.code === 'string';
      });
    });
  }

  function isValidDocumentPath(path) {
    if (!path || path.charAt(0) === '/' || path.indexOf('\\') >= 0 || !/\.html$/.test(path)) return false;
    return path.split('/').every(function (segment) { return segment && segment !== '.' && segment !== '..'; });
  }

  function scoreDocument(doc, terms, phrase) {
    var title = normalize(doc.title);
    var best = null;
    doc.sections.forEach(function (section, sectionIndex) {
      var values = [normalize(section.heading), normalize(section.text), normalize(section.code)];
      var score = 0;
      terms.forEach(function (term) {
        if (title.indexOf(term) >= 0) score += 16;
        if (values[0].indexOf(term) >= 0) score += 10;
        if (values[1].indexOf(term) >= 0) score += 2;
        if (values[2].indexOf(term) >= 0) score += 1;
      });
      if (phrase && (title.indexOf(phrase) >= 0 || values.some(function (value) { return value.indexOf(phrase) >= 0; }))) score += 8;
      if (score && section.level === 1) score += 1;
      if (score && (!best || score > best.score)) best = { doc: doc, section: section, sectionIndex: sectionIndex, score: score };
    });
    return best;
  }

  function renderResult(match, terms) {
    var item = document.createElement('li');
    item.className = 'site-search__result';

    var link = document.createElement('a');
    var path = String(match.doc.path).replace(/^\/+/, '');
    var fragment = match.section.fragment ? '#' + encodeURIComponent(String(match.section.fragment)) : '';
    link.href = new URL(siteRootPath(path + fragment), document.baseURI).href;

    var title = document.createElement('span');
    title.className = 'site-search__title';
    title.textContent = match.section.heading || match.doc.title;

    var pathLabel = document.createElement('span');
    pathLabel.className = 'site-search__path';
    pathLabel.textContent = match.doc.path + (match.section.fragment ? '#' + match.section.fragment : '');

    var excerpt = document.createElement('span');
    excerpt.className = 'site-search__excerpt';
    excerpt.textContent = buildExcerpt(match.section, terms);

    link.appendChild(title);
    link.appendChild(pathLabel);
    link.appendChild(excerpt);
    item.appendChild(link);
    return item;
  }

  function siteRootPath(path) {
    var sheet = document.querySelector('link[rel="stylesheet"][href*="assets/"]');
    var href = sheet ? (sheet.getAttribute('href') || '') : '';
    var marker = href.lastIndexOf('assets/');
    var prefix = marker >= 0 ? href.slice(0, marker) : '';
    return prefix + path;
  }

  function buildExcerpt(section, terms) {
    var source = String(section.text || section.code || section.heading || '').replace(/\s+/g, ' ').trim();
    if (!source) return '';
    var lower = source.toLowerCase();
    var needle = terms.find(function (term) { return lower.indexOf(term) >= 0; });
    var start = needle ? Math.max(0, lower.indexOf(needle) - 54) : 0;
    return (start ? '…' : '') + source.slice(start, start + 164) + (start + 164 < source.length ? '…' : '');
  }

  function compareBytes(left, right) {
    if (left < right) return -1;
    if (left > right) return 1;
    return 0;
  }

})();
