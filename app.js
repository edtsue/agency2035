/* ============================================================
   The Agency Industrial Complex, 2035 — interactive edition
   Vanilla JS. No dependencies. State persists in localStorage.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Data: Portfolio comparison ---------- */
  var PORT_ROWS = [
    { dim: "Marketer's role", creative: "<strong>Hedge fund</strong> — concentrated bets for outsized returns", media: "<strong>Endowment</strong> — preserve and compound, forever" },
    { dim: "Number of firms", creative: "<strong>More</strong> of them", media: "<strong>Fewer</strong> of them" },
    { dim: "Size & shape", creative: "Smaller, boutique craftshops", media: "Bigger, mechanized utilities" },
    { dim: "The people", creative: "Very senior craftspeople, AI-powered", media: "Mid-level engineers overseeing the AI" },
    { dim: "What they deliver", creative: "High-impact, rare <strong>home runs</strong>", media: "Low-impact, <strong>proven outcomes</strong>" },
    { dim: "Specialized by", creative: "Output — Super Bowl, creator, OOH, experiential", media: "Scale across all channels" },
    { dim: "How they're paid", creative: "Small retainer <strong>+ performance bonus</strong>", media: "Small subscription, like an index fund's expense ratio" },
    { dim: "Marketer works with", creative: "<strong>Several</strong> at once — spread the bets", media: "<strong>One</strong> — concentrate the spend" },
    { dim: "Reports to", creative: "The <strong>CEO</strong> — a bet on the brand's direction", media: "The <strong>CFO</strong> — it's capital allocation" },
    { dim: "Entry-level work", creative: "Little to none", media: "Little to none" },
    { dim: "The missing middle", creative: "No mid-sized creative agencies", media: "No mid-sized media agencies" }
  ];

  /* ---------- Data: Sources ---------- */
  var SOURCES = [
    {
      id: "juniors", num: "1", title: "AI ate the junior layer",
      claim: "“Research, first drafts, exploratory layouts, performance variants — absorbed by tools that didn't exist three years ago.”",
      links: [
        { t: "How entry-level agency jobs are changing due to AI", u: "https://adage.com/career-development/aa-entry-level-ad-jobs-change-with-ai-what-to-know/", o: "Ad Age" },
        { t: "‘There's no room for purists’: GenAI is altering the junior talent search", u: "https://digiday.com/marketing/theres-no-room-for-purists-generative-ai-is-altering-the-agency-junior-talent-search/", o: "Digiday" },
        { t: "Why replacing junior staff with AI could spark a ‘talent doom cycle’", u: "https://www.cnbc.com/2025/11/16/why-replacing-junior-staff-with-ai-will-backfire-.html", o: "CNBC" }
      ]
    },
    {
      id: "merger", num: "2", title: "The holdcos have merged",
      claim: "“Storied agencies, shuttered. Symptoms of structural collapse being financialized.”",
      links: [
        { t: "Omnicom completes acquisition of IPG, creating world's largest ad holding company", u: "https://www.campaignlive.com/article/omnicom-completes-acquisition-ipg-creating-worlds-largest-ad-holding-company/1941216", o: "Campaign" },
        { t: "Omnicom acquires IPG — everything you need to know", u: "https://adage.com/agencies/aa-omnicom-acquires-ipg-what-you-need-to-know/", o: "Ad Age" },
        { t: "Omnicom's mega-merger doubles down on media — at creativity's expense", u: "https://martech.org/omnicoms-mega-merger-doubles-down-on-media-at-creativitys-expense/", o: "MarTech" }
      ]
    },
    {
      id: "selfserve", num: "3", title: "Media tools route around agencies",
      claim: "“The largest media buying tools now route around agencies by default … platforms with their own self-serve suite of AI tools.”",
      links: [
        { t: "Advertisers shifting in-housing efforts, away from tactical media buying", u: "https://digiday.com/marketing/away-from-tactical-media-buying-advertisers-are-shifting-their-in-housing-efforts/", o: "Digiday" },
        { t: "Meta Advantage+ and AI: the hottest new updates for marketers", u: "https://coinis.com/blog/meta-advantage-plus-ai-ads-updates-2025", o: "Coinis" },
        { t: "How Google Ads and AI will transform small-business advertising", u: "https://www.adventureppc.com/blog/how-google-ads-and-ai-will-transform-small-business-advertising-in-2026", o: "AdventurePPC" }
      ]
    },
    {
      id: "procurement", num: "4", title: "Procurement won",
      claim: "“Transparency tools dissolved the media cross-subsidy that propped up creative for thirty years.”",
      links: [
        { t: "3 new agency models taking over after procurement destroyed media margins", u: "https://marketingeconomics.substack.com/p/3-new-agency-models-taking-over-after", o: "Marketing Economics" },
        { t: "Media Agency MSA Transparency Report 2025", u: "https://ebiquity.com/guides/media-agency-msa-transparency-report-2025/", o: "Ebiquity / WFA" },
        { t: "The rise of ‘Proprietary Media’: how procurement should respond", u: "https://www.mediamarketingcompliance.com/post/the-rise-of-proprietary-media-how-procurement-should-respond", o: "MMC" }
      ]
    },
    {
      id: "cmo", num: "5", title: "CMO tenure keeps shrinking",
      claim: "“Too short to be the single buyer the agency industrial complex relied on.”",
      links: [
        { t: "CMOs face even shorter tenures (Spencer Stuart study)", u: "https://www.marketingdive.com/news/cmo-tenure-length-spencer-stuart/649279/", o: "Marketing Dive" },
        { t: "Why CMO tenure remains stubbornly short", u: "https://www.adweek.com/brand-marketing/why-cmo-tenure-remains-stubbornly-short/", o: "Adweek" }
      ]
    }
  ];

  var STORE_KEY = "aic2035_highlights_v1";
  var THEME_KEY = "aic2035_theme";

  /* ---------- tiny helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function uid() { return "h" + Math.abs(hashStr(JSON.stringify(arguments[0] || "") + perfNow())).toString(36); }
  var _ctr = 0;
  function perfNow() { _ctr += 1; return (window.performance && performance.now ? performance.now() : 0) + _ctr; }
  function hashStr(s) { var h = 0, i; for (i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; } return h; }

  function loadHL() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch (e) { return []; } }
  function saveHL(list) { try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch (e) {} }

  var highlights = loadHL();

  /* ============================================================
     BUILD: Portfolio table
     ============================================================ */
  function buildPortfolio() {
    var grid = $("#port-grid");
    if (!grid) return;
    PORT_ROWS.forEach(function (row, i) {
      var dim = document.createElement("div");
      dim.className = "port-cell port-dim port-row-dim";
      dim.textContent = row.dim;

      var c = document.createElement("div");
      c.className = "port-cell port-val port-val-creative";
      c.innerHTML = row.creative;

      var m = document.createElement("div");
      m.className = "port-cell port-val port-val-media";
      m.innerHTML = row.media;

      // group as a logical row for the dim/contrast toggle
      dim.setAttribute("data-row", i);
      c.setAttribute("data-row", i);
      m.setAttribute("data-row", i);

      dim.addEventListener("click", function () {
        // toggle: dim all other rows to spotlight this contrast
        var on = dim.classList.toggle("spot");
        $$(".port-cell[data-row]").forEach(function (cell) {
          var same = cell.getAttribute("data-row") === String(i);
          cell.style.opacity = (!same && on) ? ".32" : "";
        });
      });

      grid.appendChild(dim);
      grid.appendChild(c);
      grid.appendChild(m);
    });
  }

  /* ============================================================
     BUILD: Sources
     ============================================================ */
  function buildSources() {
    var wrap = $("#source-groups");
    if (!wrap) return;
    SOURCES.forEach(function (g) {
      var el = document.createElement("div");
      el.className = "src-group";
      el.id = "s-" + g.id;
      var linksHtml = g.links.map(function (l) {
        return '<a class="src-link" href="' + l.u + '" target="_blank" rel="noopener">' +
          '<svg class="src-out" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M14 5h5v5M19 5l-8 8M11 5H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '<span>' + l.t + '</span><span class="outlet">' + l.o + '</span></a>';
      }).join("");
      el.innerHTML = '<h3><span class="sg-num">' + g.num + '.</span> ' + g.title + '</h3>' +
        '<p class="src-claim">' + g.claim + '</p>' +
        '<div class="src-links">' + linksHtml + '</div>';
      wrap.appendChild(el);
    });

    // source marker click -> scroll + flash
    $$("a.src").forEach(function (a) {
      a.addEventListener("click", function (e) {
        var tgt = $(a.getAttribute("href"));
        if (tgt) {
          e.preventDefault();
          tgt.scrollIntoView({ behavior: "smooth", block: "center" });
          tgt.classList.remove("flash"); void tgt.offsetWidth; tgt.classList.add("flash");
        }
      });
    });
  }

  /* ============================================================
     HIGHLIGHTS & NOTES
     Offsets are computed against a block's textContent so they
     survive reloads; re-application wraps only text nodes, so
     inline <a>/<em>/<strong> inside paragraphs are preserved.
     ============================================================ */

  function getBlocks() { return $$("[data-pid]"); }
  function blockByPid(pid) { return $('[data-pid="' + pid + '"]'); }

  // character offset of a (node, offset) point within root.textContent
  function offsetInBlock(root, node, off) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var total = 0, n;
    while ((n = walker.nextNode())) {
      if (n === node) return total + off;
      total += n.nodeValue.length;
    }
    return total;
  }

  // wrap [start,end) of root's text in a <mark>; returns the mark or null
  function wrapRange(root, start, end, cls, hid, hasNote) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var pos = 0, n, startNode = null, startOff = 0, endNode = null, endOff = 0;
    while ((n = walker.nextNode())) {
      // skip text already inside a mark to avoid nesting
      if (n.parentNode && n.parentNode.nodeName === "MARK") { pos += n.nodeValue.length; continue; }
      var len = n.nodeValue.length;
      if (startNode === null && pos + len > start) { startNode = n; startOff = start - pos; }
      if (pos + len >= end) { endNode = n; endOff = end - pos; break; }
      pos += len;
    }
    if (!startNode || !endNode) return null;
    var range = document.createRange();
    try {
      range.setStart(startNode, startOff);
      range.setEnd(endNode, endOff);
    } catch (e) { return null; }
    var mark = document.createElement("mark");
    mark.className = "hl hl-" + cls + (hasNote ? " has-note" : "");
    mark.setAttribute("data-hid", hid);
    try { range.surroundContents(mark); }
    catch (e) {
      // range crosses element boundaries: fall back to extract+insert
      try {
        var frag = range.extractContents();
        mark.appendChild(frag);
        range.insertNode(mark);
      } catch (e2) { return null; }
    }
    return mark;
  }

  function applyHighlight(h) {
    var block = blockByPid(h.pid);
    if (!block) return;
    var mark = wrapRange(block, h.start, h.end, h.color, h.id, !!(h.note && h.note.length));
    if (mark) {
      mark.addEventListener("click", function (ev) {
        ev.stopPropagation();
        openNoteModal(h.id);
      });
    }
  }

  function renderAllHighlights() {
    // re-apply from scratch: strip existing marks first
    $$("mark.hl").forEach(unwrapMark);
    // sort by pid then start so earlier ranges wrap first within a block
    highlights.slice().sort(function (a, b) {
      if (a.pid === b.pid) return a.start - b.start;
      return 0;
    }).forEach(applyHighlight);
  }

  function unwrapMark(mark) {
    var parent = mark.parentNode;
    while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
    parent.removeChild(mark);
    parent.normalize();
  }

  /* ---------- selection popover ---------- */
  var pop = $("#sel-popover");
  var pendingSel = null; // {pid,start,end,text}

  function captureSelection() {
    var sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) return null;
    var range = sel.getRangeAt(0);
    var text = sel.toString().trim();
    if (text.length < 2) return null;
    // find the data-pid block that fully contains the selection
    var block = range.commonAncestorContainer;
    if (block.nodeType === 3) block = block.parentNode;
    block = block.closest ? block.closest("[data-pid]") : null;
    if (!block) return null;
    if (!block.contains(range.startContainer) || !block.contains(range.endContainer)) return null;
    var start = offsetInBlock(block, range.startContainer, range.startOffset);
    var end = offsetInBlock(block, range.endContainer, range.endOffset);
    if (end <= start) return null;
    return { pid: block.getAttribute("data-pid"), start: start, end: end, text: text, rect: range.getBoundingClientRect() };
  }

  function showPopover(rect) {
    pop.classList.add("show");
    var pr = pop.getBoundingClientRect();
    var x = rect.left + rect.width / 2 - pr.width / 2 + window.scrollX;
    var y = rect.top - pr.height - 12 + window.scrollY;
    x = Math.max(8 + window.scrollX, Math.min(x, window.scrollX + document.documentElement.clientWidth - pr.width - 8));
    pop.style.left = x + "px";
    pop.style.top = y + "px";
  }
  function hidePopover() { pop.classList.remove("show"); }

  document.addEventListener("mouseup", function (e) {
    if (pop.contains(e.target)) return;
    setTimeout(function () {
      var s = captureSelection();
      if (s) { pendingSel = s; showPopover(s.rect); }
      else hidePopover();
    }, 10);
  });
  document.addEventListener("mousedown", function (e) {
    if (!pop.contains(e.target)) hidePopover();
  });

  // swatch -> create highlight
  $$(".sel-popover .swatch").forEach(function (sw) {
    sw.addEventListener("click", function () {
      if (!pendingSel) return;
      createHighlight(pendingSel, sw.getAttribute("data-color"), "");
      window.getSelection().removeAllRanges();
      hidePopover();
    });
  });
  // +note -> create (yellow default) then open editor
  $("#add-note-btn").addEventListener("click", function () {
    if (!pendingSel) return;
    var h = createHighlight(pendingSel, "yellow", "");
    window.getSelection().removeAllRanges();
    hidePopover();
    openNoteModal(h.id);
  });

  function createHighlight(sel, color, note) {
    var h = {
      id: uid(sel), pid: sel.pid, start: sel.start, end: sel.end,
      text: sel.text, color: color, note: note || "", ts: nowLabel()
    };
    highlights.push(h);
    saveHL(highlights);
    renderAllHighlights();
    refreshNotesUI();
    toast(note ? "Note added" : "Highlighted");
    return h;
  }

  function nowLabel() {
    // Date()/new Date() are fine in the browser runtime
    try {
      var d = new Date();
      return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch (e) { return ""; }
  }

  /* ============================================================
     NOTE MODAL
     ============================================================ */
  var modal = $("#note-modal"), modalScrim = $("#modal-scrim");
  var nmText = $("#nm-text"), nmQuote = $("#nm-quote");
  var editingId = null;

  function openNoteModal(id) {
    var h = findHL(id);
    if (!h) return;
    editingId = id;
    nmQuote.textContent = "“" + h.text + "”";
    nmText.value = h.note || "";
    modal.classList.add("show");
    modalScrim.classList.add("show");
    setTimeout(function () { nmText.focus(); }, 50);
  }
  function closeNoteModal() {
    modal.classList.remove("show");
    modalScrim.classList.remove("show");
    editingId = null;
  }
  $("#nm-save").addEventListener("click", function () {
    var h = findHL(editingId);
    if (h) { h.note = nmText.value.trim(); saveHL(highlights); renderAllHighlights(); refreshNotesUI(); toast("Saved"); }
    closeNoteModal();
  });
  $("#nm-cancel").addEventListener("click", closeNoteModal);
  $("#nm-delete").addEventListener("click", function () {
    if (editingId) deleteHL(editingId);
    closeNoteModal();
  });
  modalScrim.addEventListener("click", closeNoteModal);
  nmText.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { $("#nm-save").click(); }
  });

  function findHL(id) { for (var i = 0; i < highlights.length; i++) if (highlights[i].id === id) return highlights[i]; return null; }
  function deleteHL(id) {
    highlights = highlights.filter(function (h) { return h.id !== id; });
    saveHL(highlights);
    renderAllHighlights();
    refreshNotesUI();
    toast("Deleted");
  }

  /* ============================================================
     NOTES DRAWER
     ============================================================ */
  var drawer = $("#notes-drawer"), drawerScrim = $("#drawer-scrim");
  function openDrawer() { drawer.classList.add("open"); drawerScrim.classList.add("show"); }
  function closeDrawer() { drawer.classList.remove("open"); drawerScrim.classList.remove("show"); }
  $("#notes-toggle").addEventListener("click", openDrawer);
  $("#close-drawer").addEventListener("click", closeDrawer);
  drawerScrim.addEventListener("click", closeDrawer);

  function refreshNotesUI() {
    var list = $("#notes-list"), empty = $("#notes-empty");
    var count = highlights.length;
    var badge = $("#notes-count");
    badge.textContent = count;
    badge.classList.toggle("show", count > 0);

    list.innerHTML = "";
    if (!count) { empty.style.display = "block"; return; }
    empty.style.display = "none";

    // order by document position (pid order in DOM, then start)
    var order = {};
    getBlocks().forEach(function (b, i) { order[b.getAttribute("data-pid")] = i; });
    highlights.slice().sort(function (a, b) {
      var oa = order[a.pid] == null ? 999 : order[a.pid];
      var ob = order[b.pid] == null ? 999 : order[b.pid];
      return oa - ob || a.start - b.start;
    }).forEach(function (h) {
      var item = document.createElement("div");
      item.className = "note-item";
      var sw = '<span class="note-swatch" style="background:var(--hl-' + h.color + ')"></span>';
      var noteHtml = h.note ? '<p class="ni-note">' + escapeHtml(h.note) + '</p>' : '';
      var meta = '<div class="ni-meta">' + (h.note ? '✎ note' : '✶ highlight') + (h.ts ? ' · ' + escapeHtml(h.ts) : '') + '</div>';
      item.innerHTML = sw + '<p class="ni-quote">“' + escapeHtml(h.text) + '”</p>' + noteHtml + meta;
      item.addEventListener("click", function () {
        var mark = $('mark[data-hid="' + h.id + '"]');
        if (mark) {
          closeDrawer();
          mark.scrollIntoView({ behavior: "smooth", block: "center" });
          setTimeout(function () { openNoteModal(h.id); }, 400);
        } else { openNoteModal(h.id); }
      });
      list.appendChild(item);
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* export / clear */
  $("#export-notes").addEventListener("click", function () {
    if (!highlights.length) { toast("Nothing to export"); return; }
    var order = {};
    getBlocks().forEach(function (b, i) { order[b.getAttribute("data-pid")] = i; });
    var sorted = highlights.slice().sort(function (a, b) {
      return (order[a.pid] || 0) - (order[b.pid] || 0) || a.start - b.start;
    });
    var md = "# Notes — The Agency Industrial Complex, 2035\n\n";
    sorted.forEach(function (h) {
      md += "> " + h.text + "\n";
      if (h.note) md += "\n" + h.note + "\n";
      md += "\n---\n\n";
    });
    copyText(md);
    toast("Notes copied as Markdown");
  });
  $("#clear-notes").addEventListener("click", function () {
    if (!highlights.length) return;
    if (!confirm("Delete all " + highlights.length + " highlights and notes? This can't be undone.")) return;
    highlights = [];
    saveHL(highlights);
    renderAllHighlights();
    refreshNotesUI();
    toast("Cleared");
  });

  /* ============================================================
     THEME
     ============================================================ */
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
  }
  (function initTheme() {
    var saved;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    if (!saved) saved = (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
    applyTheme(saved);
  })();
  $("#theme-toggle").addEventListener("click", function () {
    var cur = document.documentElement.getAttribute("data-theme");
    applyTheme(cur === "dark" ? "light" : "dark");
  });

  /* ============================================================
     READING PROGRESS + TOC scroll-spy + read time
     ============================================================ */
  var bar = $("#progress-bar");
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (h.scrollTop || document.body.scrollTop) / max * 100 : 0;
    bar.style.width = pct + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // scroll spy
  var spyTargets = ["act-1", "act-2", "portfolio", "act-3", "timeline", "sources"];
  var tocLinks = {};
  $$(".toc a").forEach(function (a) { tocLinks[a.getAttribute("data-sec")] = a; });
  var spyObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        Object.keys(tocLinks).forEach(function (k) { tocLinks[k].classList.remove("active"); });
        var link = tocLinks[en.target.id];
        if (link) link.classList.add("active");
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  spyTargets.forEach(function (id) { var el = document.getElementById(id); if (el) spyObserver.observe(el); });

  // read time
  (function readTime() {
    var words = ($("#article").innerText || "").trim().split(/\s+/).length;
    var mins = Math.max(1, Math.round(words / 220));
    $("#read-time").textContent = mins + " min read";
  })();

  /* timeline node -> scroll to act */
  $$(".tl-node").forEach(function (n) {
    n.addEventListener("click", function () {
      var t = document.getElementById(n.getAttribute("data-target"));
      if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* ============================================================
     SHARE + TOAST + keyboard
     ============================================================ */
  $("#share-btn").addEventListener("click", function () {
    copyText(location.href.split("#")[0]);
    toast("Link copied");
  });

  function copyText(txt) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).catch(function () { fallbackCopy(txt); });
    } else { fallbackCopy(txt); }
  }
  function fallbackCopy(txt) {
    var ta = document.createElement("textarea");
    ta.value = txt; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
  }

  var toastEl = $("#toast"), toastTimer = null;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 1900);
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { hidePopover(); closeDrawer(); if (modal.classList.contains("show")) closeNoteModal(); }
  });

  /* ============================================================
     INIT
     ============================================================ */
  buildPortfolio();
  buildSources();
  renderAllHighlights();
  refreshNotesUI();
})();
