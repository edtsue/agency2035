/* ============================================================
   The Agency Industrial Complex, 2035 — FT "Big Read" edition
   Vanilla JS. No dependencies. State persists in localStorage.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- tiny helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  var _ctr = 0;
  function uid() { _ctr += 1; return "h" + Math.abs(hashStr(JSON.stringify(arguments[0] || "")) + _ctr).toString(36); }
  function hashStr(s) { var h = 0, i; for (i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; } return h; }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function escapeXml(s) { return String(s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }

  /* ============================================================
     CHARTS — hand-built FT-style SVG (classes styled in CSS)
     ============================================================ */
  function svgWrap(w, h, inner) {
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="xMidYMid meet" role="img">' + inner + '</svg>';
  }

  // Horizontal bar chart. opts: {max, ticks, tickFmt, valFmt, labelAbove}
  function hbar(rows, opts) {
    opts = opts || {};
    var W = 680, padR = opts.padR || 64, padTop = 6, axisGap = 30;
    var rowH = opts.rowH || (opts.labelAbove ? 62 : 54);
    var barH = opts.barH || 24;
    var x0 = opts.labelAbove ? 4 : (opts.padL || 206);
    var x1 = W - padR;
    var max = opts.max || Math.max.apply(null, rows.map(function (r) { return r.value; })) * 1.12;
    var H = padTop + rows.length * rowH + axisGap;
    var sx = function (v) { return x0 + (v / max) * (x1 - x0); };
    var p = [];

    (opts.ticks || []).forEach(function (t) {
      var x = sx(t);
      p.push('<line class="ch-grid" x1="' + x + '" y1="' + padTop + '" x2="' + x + '" y2="' + (padTop + rows.length * rowH) + '"/>');
      p.push('<text class="ch-tick" x="' + x + '" y="' + (padTop + rows.length * rowH + 20) + '" text-anchor="middle">' + (opts.tickFmt ? opts.tickFmt(t) : t) + '</text>');
    });
    p.push('<line class="ch-axis" x1="' + x0 + '" y1="' + padTop + '" x2="' + x0 + '" y2="' + (padTop + rows.length * rowH) + '"/>');

    rows.forEach(function (r, i) {
      var cy = padTop + i * rowH;
      var by, lx, ly, anchor;
      if (opts.labelAbove) {
        ly = cy + 16; lx = x0; anchor = "start"; by = cy + 24;
      } else {
        by = cy + (rowH - barH) / 2; lx = x0 - 12; ly = by + barH / 2 + 5; anchor = "end";
      }
      p.push('<text class="ch-label" x="' + lx + '" y="' + ly + '" text-anchor="' + anchor + '">' + escapeXml(r.label) + '</text>');
      var bw = Math.max(0, sx(r.value) - x0);
      var cls = r.cls || (r.hl ? "ch-bar hl" : "ch-bar");
      p.push('<rect class="' + cls.replace("ch-bar", "ch-bar") + '" x="' + x0 + '" y="' + by + '" width="' + bw + '" height="' + barH + '"/>');
      var vcls = "ch-value" + (r.hl ? " hl" : "");
      p.push('<text class="' + vcls + '" x="' + (sx(r.value) + 8) + '" y="' + (by + barH / 2 + 5) + '">' + (opts.valFmt ? opts.valFmt(r.value) : r.value) + '</text>');
    });
    return svgWrap(W, H, p.join(""));
  }

  function chartTenure() {
    return hbar([
      { label: "Chief executive", value: 7.6 },
      { label: "Chief financial officer", value: 4.7 },
      { label: "Chief marketing officer", value: 4.1, hl: true },
      { label: "Chief operating officer", value: 3.3 }
    ], { max: 8, ticks: [0, 2, 4, 6, 8], tickFmt: function (t) { return t; }, valFmt: function (v) { return v.toFixed(1); }, padL: 200 });
  }

  function chartHoldco() {
    return hbar([
      { label: "New Omnicom (Omnicom + IPG)", value: 25.6, hl: true },
      { label: "Publicis Groupe", value: 15.0 },
      { label: "WPP", value: 15.0 },
      { label: "Dentsu", value: 8.0 }
    ], { labelAbove: true, max: 28, ticks: [0, 10, 20], valFmt: function (v) { return "$" + v.toFixed(1) + "bn"; }, padR: 80, rowH: 60 });
  }

  function chartEntry() {
    var W = 680, H = 300, padL = 44, padR = 36, padTop = 22, padB = 46;
    var pts = [{ x: 0, y: 100, lab: "2023" }, { x: 1, y: 84, lab: "2024" }, { x: 2, y: 65, lab: "2025" }];
    var x0 = padL, x1 = W - padR, y0 = H - padB, y1 = padTop, maxX = 2, maxY = 110;
    var sx = function (x) { return x0 + (x / maxX) * (x1 - x0); };
    var sy = function (y) { return y0 - (y / maxY) * (y0 - y1); };
    var p = [];
    [0, 50, 100].forEach(function (g) {
      p.push('<line class="ch-grid" x1="' + x0 + '" y1="' + sy(g) + '" x2="' + x1 + '" y2="' + sy(g) + '"/>');
      p.push('<text class="ch-tick" x="' + (x0 - 8) + '" y="' + (sy(g) + 4) + '" text-anchor="end">' + g + '</text>');
    });
    var line = pts.map(function (pt, i) { return (i ? "L" : "M") + sx(pt.x) + " " + sy(pt.y); }).join(" ");
    var area = "M" + sx(0) + " " + sy(0) + " " + pts.map(function (pt) { return "L" + sx(pt.x) + " " + sy(pt.y); }).join(" ") + " L" + sx(maxX) + " " + sy(0) + " Z";
    p.push('<path class="ch-area-c" d="' + area + '"/>');
    p.push('<path class="ch-line-c" d="' + line + '"/>');
    pts.forEach(function (pt) {
      p.push('<circle class="ch-dot" cx="' + sx(pt.x) + '" cy="' + sy(pt.y) + '" r="4.5"/>');
      p.push('<text class="ch-tick" x="' + sx(pt.x) + '" y="' + (y0 + 20) + '" text-anchor="middle">' + pt.lab + '</text>');
    });
    // value labels at endpoints
    p.push('<text class="ch-value" x="' + (sx(0) + 6) + '" y="' + (sy(100) - 9) + '">100</text>');
    p.push('<text class="ch-value hl" x="' + (sx(2) - 6) + '" y="' + (sy(65) - 9) + '" text-anchor="end">65</text>');
    p.push('<text class="ch-annot" x="' + (sx(2) - 6) + '" y="' + (sy(65) + 22) + '" text-anchor="end">−35% since 2023</text>');
    p.push('<line class="ch-axis" x1="' + x0 + '" y1="' + y0 + '" x2="' + x1 + '" y2="' + y0 + '"/>');
    return svgWrap(W, H, p.join(""));
  }

  function chartBarbell() {
    var W = 680, H = 320, padL = 16, padR = 16, padTop = 28, padB = 78;
    var x0 = padL, x1 = W - padR, yBase = H - padB, yTop = padTop;
    var val = function (x) { return Math.min(1, 3 * Math.pow(x - 0.5, 2) + 0.15); }; // U-shape 0..1
    var sx = function (x) { return x0 + x * (x1 - x0); };
    var sy = function (v) { return yBase - v * (yBase - yTop); };
    var p = [], d = "M" + sx(0) + " " + yBase;
    for (var i = 0; i <= 40; i++) { var x = i / 40; d += " L" + sx(x).toFixed(1) + " " + sy(val(x)).toFixed(1); }
    d += " L" + sx(1) + " " + yBase + " Z";
    p.push('<path class="ch-area-c" d="' + d + '" style="opacity:.16"/>');
    var dl = "M" + sx(0) + " " + sy(val(0));
    for (var j = 0; j <= 40; j++) { var xx = j / 40; dl += " L" + sx(xx).toFixed(1) + " " + sy(val(xx)).toFixed(1); }
    p.push('<path class="ch-line-c" d="' + dl + '"/>');
    p.push('<line class="ch-axis" x1="' + x0 + '" y1="' + yBase + '" x2="' + x1 + '" y2="' + yBase + '"/>');
    // dip annotation
    p.push('<text class="ch-annot" x="' + sx(0.5) + '" y="' + (sy(val(0.5)) - 14) + '" text-anchor="middle">THE MISSING MIDDLE</text>');
    p.push('<line class="ch-grid" x1="' + sx(0.5) + '" y1="' + (sy(val(0.5)) - 8) + '" x2="' + sx(0.5) + '" y2="' + (sy(val(0.5)) + 2) + '" style="stroke:var(--claret)"/>');
    // end zone labels
    p.push('<text class="ch-q-axislabel" x="' + sx(0.02) + '" y="' + (yBase + 26) + '" text-anchor="start">Commodity work</text>');
    p.push('<text class="ch-q-tag" x="' + sx(0.02) + '" y="' + (yBase + 44) + '" text-anchor="start">too cheap to bill hours</text>');
    p.push('<text class="ch-q-axislabel" x="' + sx(0.98) + '" y="' + (yBase + 26) + '" text-anchor="end">High-stakes work</text>');
    p.push('<text class="ch-q-tag" x="' + sx(0.98) + '" y="' + (yBase + 44) + '" text-anchor="end">performance-billed</text>');
    p.push('<text class="ch-q-tag" x="' + sx(0.5) + '" y="' + (yBase + 35) + '" text-anchor="middle" style="font-style:italic">← volume of billable work →</text>');
    return svgWrap(W, H, p.join(""));
  }

  function chartQuadrant() {
    var W = 720, H = 470, padL = 64, padR = 34, padTop = 30, padB = 54;
    var x0 = padL, x1 = W - padR, y0 = H - padB, y1 = padTop;
    var sx = function (x) { return x0 + x * (x1 - x0); };
    var sy = function (y) { return y0 - y * (y0 - y1); };
    var p = [];
    // quadrant crosshair (faint dashed)
    p.push('<line class="ch-grid" x1="' + sx(0.5) + '" y1="' + y1 + '" x2="' + sx(0.5) + '" y2="' + y0 + '" stroke-dasharray="3 5"/>');
    p.push('<line class="ch-grid" x1="' + x0 + '" y1="' + sy(0.5) + '" x2="' + x1 + '" y2="' + sy(0.5) + '" stroke-dasharray="3 5"/>');
    // zone words
    p.push('<text class="ch-q-zone" x="' + sx(0.97) + '" y="' + sy(0.97) + '" text-anchor="end">High risk · High return</text>');
    p.push('<text class="ch-q-zone" x="' + sx(0.03) + '" y="' + sy(0.04) + '" text-anchor="start">Low risk · Low return</text>');
    // axes (L-shape)
    p.push('<line class="ch-q-axis" x1="' + x0 + '" y1="' + y0 + '" x2="' + x1 + '" y2="' + y0 + '"/>');
    p.push('<line class="ch-q-axis" x1="' + x0 + '" y1="' + y0 + '" x2="' + x0 + '" y2="' + y1 + '"/>');
    // axis labels
    p.push('<text class="ch-q-axislabel" x="' + sx(0.5) + '" y="' + (y0 + 38) + '" text-anchor="middle">Risk / variance →</text>');
    p.push('<text class="ch-q-axislabel" transform="translate(' + (x0 - 40) + ' ' + sy(0.5) + ') rotate(-90)" text-anchor="middle">Impact per win / return ↑</text>');
    // points
    function pt(x, y, cls, name, tag, side) {
      var cx = sx(x), cy = sy(y), a = side === "left" ? "end" : "start", dx = side === "left" ? -18 : 18;
      p.push('<circle class="' + cls + '" cx="' + cx + '" cy="' + cy + '" r="13"/>');
      p.push('<text class="ch-q-name" x="' + (cx + dx) + '" y="' + (cy - 2) + '" text-anchor="' + a + '" fill="' + (cls === "ch-q-pt-c" ? "var(--creative)" : "var(--media)") + '">' + name + '</text>');
      p.push('<text class="ch-q-tag" x="' + (cx + dx) + '" y="' + (cy + 16) + '" text-anchor="' + a + '">' + tag + '</text>');
    }
    pt(0.74, 0.78, "ch-q-pt-c", "Creative · the hedge fund", "rare, high-variance home runs", "left");
    pt(0.27, 0.28, "ch-q-pt-m", "Media · the endowment", "steady, proven returns", "right");
    return svgWrap(W, H, p.join(""));
  }

  function renderCharts() {
    var map = { tenure: chartTenure, holdco: chartHoldco, entry: chartEntry, barbell: chartBarbell, quadrant: chartQuadrant };
    $$("[data-chart]").forEach(function (el) {
      var fn = map[el.getAttribute("data-chart")];
      if (fn) el.innerHTML = fn();
    });
  }

  /* ============================================================
     SOURCES
     ============================================================ */
  var SOURCES = [
    { id: "juniors", num: "1", title: "AI ate the junior layer",
      claim: "Research, first drafts, exploratory layouts and performance variants — absorbed by tools that didn't exist three years ago.",
      links: [
        { t: "How entry-level agency jobs are changing due to AI", u: "https://adage.com/career-development/aa-entry-level-ad-jobs-change-with-ai-what-to-know/", o: "Ad Age" },
        { t: "‘There's no room for purists’: GenAI is altering the junior talent search", u: "https://digiday.com/marketing/theres-no-room-for-purists-generative-ai-is-altering-the-agency-junior-talent-search/", o: "Digiday" },
        { t: "Why replacing junior staff with AI could spark a ‘talent doom cycle’", u: "https://www.cnbc.com/2025/11/16/why-replacing-junior-staff-with-ai-will-backfire-.html", o: "CNBC" }
      ] },
    { id: "merger", num: "2", title: "The holdcos have merged",
      claim: "Storied agencies, shuttered. Structural collapse being financialized.",
      links: [
        { t: "Omnicom completes acquisition of IPG, creating world's largest ad holding company", u: "https://www.campaignlive.com/article/omnicom-completes-acquisition-ipg-creating-worlds-largest-ad-holding-company/1941216", o: "Campaign" },
        { t: "Omnicom acquires IPG — everything you need to know", u: "https://adage.com/agencies/aa-omnicom-acquires-ipg-what-you-need-to-know/", o: "Ad Age" },
        { t: "Omnicom's mega-merger doubles down on media — at creativity's expense", u: "https://martech.org/omnicoms-mega-merger-doubles-down-on-media-at-creativitys-expense/", o: "MarTech" }
      ] },
    { id: "selfserve", num: "3", title: "Media tools route around agencies",
      claim: "The largest buying tools route around agencies by default; platforms ship their own self-serve AI suites.",
      links: [
        { t: "Advertisers shifting in-housing efforts, away from tactical media buying", u: "https://digiday.com/marketing/away-from-tactical-media-buying-advertisers-are-shifting-their-in-housing-efforts/", o: "Digiday" },
        { t: "Meta Advantage+ and AI: the hottest new updates for marketers", u: "https://coinis.com/blog/meta-advantage-plus-ai-ads-updates-2025", o: "Coinis" },
        { t: "How Google Ads and AI will transform small-business advertising", u: "https://www.adventureppc.com/blog/how-google-ads-and-ai-will-transform-small-business-advertising-in-2026", o: "AdventurePPC" }
      ] },
    { id: "procurement", num: "4", title: "Procurement won",
      claim: "Transparency tools dissolved the media cross-subsidy that propped up creative for thirty years.",
      links: [
        { t: "3 new agency models taking over after procurement destroyed media margins", u: "https://marketingeconomics.substack.com/p/3-new-agency-models-taking-over-after", o: "Marketing Economics" },
        { t: "Media Agency MSA Transparency Report 2025", u: "https://ebiquity.com/guides/media-agency-msa-transparency-report-2025/", o: "Ebiquity / WFA" },
        { t: "The rise of ‘Proprietary Media’: how procurement should respond", u: "https://www.mediamarketingcompliance.com/post/the-rise-of-proprietary-media-how-procurement-should-respond", o: "MMC" }
      ] },
    { id: "cmo", num: "5", title: "CMO tenure keeps shrinking",
      claim: "Too short to be the single buyer the agency industrial complex relied on.",
      links: [
        { t: "CMOs face even shorter tenures (Spencer Stuart study)", u: "https://www.marketingdive.com/news/cmo-tenure-length-spencer-stuart/649279/", o: "Marketing Dive" },
        { t: "Why CMO tenure remains stubbornly short", u: "https://www.adweek.com/brand-marketing/why-cmo-tenure-remains-stubbornly-short/", o: "Adweek" }
      ] }
  ];

  function buildSources() {
    var wrap = $("#source-groups");
    if (!wrap) return;
    SOURCES.forEach(function (g) {
      var el = document.createElement("div");
      el.className = "src-group";
      el.id = "s-" + g.id;
      var links = g.links.map(function (l) {
        return '<a class="src-link" href="' + l.u + '" target="_blank" rel="noopener">' +
          '<svg class="src-out" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M14 5h5v5M19 5l-8 8M11 5H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '<span>' + l.t + '</span><span class="outlet">' + l.o + '</span></a>';
      }).join("");
      el.innerHTML = '<h4><span class="sg-num">' + g.num + '. </span>' + g.title + '</h4>' +
        '<p class="src-claim">' + g.claim + '</p><div class="src-links">' + links + '</div>';
      wrap.appendChild(el);
    });
    $$("a.src").forEach(function (a) {
      a.addEventListener("click", function (e) {
        var tgt = $(a.getAttribute("href"));
        if (tgt) {
          e.preventDefault();
          var d = tgt.closest("details"); if (d) d.open = true;
          setTimeout(function () { tgt.scrollIntoView({ behavior: "smooth", block: "center" }); tgt.classList.remove("flash"); void tgt.offsetWidth; tgt.classList.add("flash"); }, d ? 60 : 0);
        }
      });
    });
  }

  /* ============================================================
     HIGHLIGHTS & NOTES (offset-based, survives reload)
     ============================================================ */
  var STORE_KEY = "aic2035_highlights_v1";
  function loadHL() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch (e) { return []; } }
  function saveHL(l) { try { localStorage.setItem(STORE_KEY, JSON.stringify(l)); } catch (e) {} }
  var highlights = loadHL();

  function getBlocks() { return $$("[data-pid]"); }
  function blockByPid(pid) { return $('[data-pid="' + pid + '"]'); }

  function offsetInBlock(root, node, off) {
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), t = 0, n;
    while ((n = w.nextNode())) { if (n === node) return t + off; t += n.nodeValue.length; }
    return t;
  }
  function wrapRange(root, start, end, cls, hid, hasNote) {
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), pos = 0, n, sN = null, sO = 0, eN = null, eO = 0;
    while ((n = w.nextNode())) {
      if (n.parentNode && n.parentNode.nodeName === "MARK") { pos += n.nodeValue.length; continue; }
      var len = n.nodeValue.length;
      if (sN === null && pos + len > start) { sN = n; sO = start - pos; }
      if (pos + len >= end) { eN = n; eO = end - pos; break; }
      pos += len;
    }
    if (!sN || !eN) return null;
    var range = document.createRange();
    try { range.setStart(sN, sO); range.setEnd(eN, eO); } catch (e) { return null; }
    var mark = document.createElement("mark");
    mark.className = "hl hl-" + cls + (hasNote ? " has-note" : "");
    mark.setAttribute("data-hid", hid);
    try { range.surroundContents(mark); }
    catch (e2) { try { var f = range.extractContents(); mark.appendChild(f); range.insertNode(mark); } catch (e3) { return null; } }
    return mark;
  }
  function applyHighlight(h) {
    var block = blockByPid(h.pid);
    if (!block) return;
    var mark = wrapRange(block, h.start, h.end, h.color, h.id, !!(h.note && h.note.length));
    if (mark) mark.addEventListener("click", function (ev) { ev.stopPropagation(); openNoteModal(h.id); });
  }
  function unwrapMark(m) { var p = m.parentNode; while (m.firstChild) p.insertBefore(m.firstChild, m); p.removeChild(m); p.normalize(); }
  function renderAllHighlights() {
    $$("mark.hl").forEach(unwrapMark);
    highlights.slice().sort(function (a, b) { return a.pid === b.pid ? a.start - b.start : 0; }).forEach(applyHighlight);
  }

  var pop = $("#sel-popover"), pendingSel = null;
  function captureSelection() {
    var sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) return null;
    var range = sel.getRangeAt(0), text = sel.toString().trim();
    if (text.length < 2) return null;
    var block = range.commonAncestorContainer;
    if (block.nodeType === 3) block = block.parentNode;
    block = block.closest ? block.closest("[data-pid]") : null;
    if (!block || !block.contains(range.startContainer) || !block.contains(range.endContainer)) return null;
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
    pop.style.left = x + "px"; pop.style.top = y + "px";
  }
  function hidePopover() { pop.classList.remove("show"); }
  document.addEventListener("mouseup", function (e) {
    if (pop.contains(e.target)) return;
    setTimeout(function () { var s = captureSelection(); if (s) { pendingSel = s; showPopover(s.rect); } else hidePopover(); }, 10);
  });
  document.addEventListener("mousedown", function (e) { if (!pop.contains(e.target)) hidePopover(); });
  // touch devices: surface the popover after a selection settles
  document.addEventListener("touchend", function (e) {
    if (pop.contains(e.target)) return;
    setTimeout(function () { var s = captureSelection(); if (s) { pendingSel = s; showPopover(s.rect); } }, 60);
  }, { passive: true });
  $$(".sel-popover .swatch").forEach(function (sw) {
    sw.addEventListener("click", function () { if (!pendingSel) return; createHighlight(pendingSel, sw.getAttribute("data-color"), ""); window.getSelection().removeAllRanges(); hidePopover(); });
  });
  $("#add-note-btn").addEventListener("click", function () { if (!pendingSel) return; var h = createHighlight(pendingSel, "yellow", ""); window.getSelection().removeAllRanges(); hidePopover(); openNoteModal(h.id); });

  function nowLabel() { try { return new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" }); } catch (e) { return ""; } }
  function createHighlight(sel, color, note) {
    var h = { id: uid(sel), pid: sel.pid, start: sel.start, end: sel.end, text: sel.text, color: color, note: note || "", ts: nowLabel() };
    highlights.push(h); saveHL(highlights); renderAllHighlights(); refreshNotesUI(); toast(note ? "Note added" : "Highlighted");
    return h;
  }
  function findHL(id) { for (var i = 0; i < highlights.length; i++) if (highlights[i].id === id) return highlights[i]; return null; }
  function deleteHL(id) { highlights = highlights.filter(function (h) { return h.id !== id; }); saveHL(highlights); renderAllHighlights(); refreshNotesUI(); toast("Deleted"); }

  /* note modal */
  var modal = $("#note-modal"), modalScrim = $("#modal-scrim"), nmText = $("#nm-text"), nmQuote = $("#nm-quote"), editingId = null;
  function openNoteModal(id) { var h = findHL(id); if (!h) return; editingId = id; nmQuote.textContent = "“" + h.text + "”"; nmText.value = h.note || ""; modal.classList.add("show"); modalScrim.classList.add("show"); setTimeout(function () { nmText.focus(); }, 50); }
  function closeNoteModal() { modal.classList.remove("show"); modalScrim.classList.remove("show"); editingId = null; }
  $("#nm-save").addEventListener("click", function () { var h = findHL(editingId); if (h) { h.note = nmText.value.trim(); saveHL(highlights); renderAllHighlights(); refreshNotesUI(); toast("Saved"); } closeNoteModal(); });
  $("#nm-cancel").addEventListener("click", closeNoteModal);
  $("#nm-delete").addEventListener("click", function () { if (editingId) deleteHL(editingId); closeNoteModal(); });
  modalScrim.addEventListener("click", closeNoteModal);
  nmText.addEventListener("keydown", function (e) { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") $("#nm-save").click(); });

  /* drawer */
  var drawer = $("#notes-drawer"), drawerScrim = $("#drawer-scrim");
  function openDrawer() { drawer.classList.add("open"); drawerScrim.classList.add("show"); }
  function closeDrawer() { drawer.classList.remove("open"); drawerScrim.classList.remove("show"); }
  $("#notes-toggle").addEventListener("click", openDrawer);
  $("#close-drawer").addEventListener("click", closeDrawer);
  drawerScrim.addEventListener("click", closeDrawer);

  function refreshNotesUI() {
    var list = $("#notes-list"), empty = $("#notes-empty"), count = highlights.length, badge = $("#notes-count");
    badge.textContent = count; badge.classList.toggle("show", count > 0);
    list.innerHTML = "";
    if (!count) { empty.style.display = "block"; return; }
    empty.style.display = "none";
    var order = {}; getBlocks().forEach(function (b, i) { order[b.getAttribute("data-pid")] = i; });
    highlights.slice().sort(function (a, b) {
      var oa = order[a.pid] == null ? 999 : order[a.pid], ob = order[b.pid] == null ? 999 : order[b.pid];
      return oa - ob || a.start - b.start;
    }).forEach(function (h) {
      var item = document.createElement("div"); item.className = "note-item";
      var sw = '<span class="note-swatch" style="background:var(--hl-' + h.color + ')"></span>';
      var note = h.note ? '<p class="ni-note">' + escapeHtml(h.note) + '</p>' : '';
      var meta = '<div class="ni-meta">' + (h.note ? '✎ note' : '✦ highlight') + (h.ts ? ' · ' + escapeHtml(h.ts) : '') + '</div>';
      item.innerHTML = sw + '<p class="ni-quote">“' + escapeHtml(h.text) + '”</p>' + note + meta;
      item.addEventListener("click", function () {
        var mark = $('mark[data-hid="' + h.id + '"]');
        if (mark) { closeDrawer(); mark.scrollIntoView({ behavior: "smooth", block: "center" }); setTimeout(function () { openNoteModal(h.id); }, 400); }
        else openNoteModal(h.id);
      });
      list.appendChild(item);
    });
  }

  $("#export-notes").addEventListener("click", function () {
    if (!highlights.length) { toast("Nothing to export"); return; }
    var order = {}; getBlocks().forEach(function (b, i) { order[b.getAttribute("data-pid")] = i; });
    var md = "# Notes — The Agency Industrial Complex, 2035\n\n";
    highlights.slice().sort(function (a, b) { return (order[a.pid] || 0) - (order[b.pid] || 0) || a.start - b.start; }).forEach(function (h) {
      md += "> " + h.text + "\n"; if (h.note) md += "\n" + h.note + "\n"; md += "\n---\n\n";
    });
    copyText(md); toast("Notes copied as Markdown");
  });
  $("#clear-notes").addEventListener("click", function () {
    if (!highlights.length) return;
    if (!confirm("Delete all " + highlights.length + " highlights and notes? This can't be undone.")) return;
    highlights = []; saveHL(highlights); renderAllHighlights(); refreshNotesUI(); toast("Cleared");
  });

  /* ============================================================
     THEME / PROGRESS / READ TIME / SHARE
     ============================================================ */
  var THEME_KEY = "aic2035_theme";
  function applyTheme(t) { document.documentElement.setAttribute("data-theme", t); try { localStorage.setItem(THEME_KEY, t); } catch (e) {} }
  (function () { var s; try { s = localStorage.getItem(THEME_KEY); } catch (e) {} if (!s) s = "light"; /* FT salmon is the default; toggle for dark */ applyTheme(s); })();
  $("#theme-toggle").addEventListener("click", function () { applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark"); onScroll(); });

  var bar = $("#progress-bar"), starLayer = $("#stars");
  function _lerp(a, b, t) { return Math.round(a + (b - a) * t); }
  function _mix(a, b, t) { return "rgb(" + _lerp(a[0], b[0], t) + "," + _lerp(a[1], b[1], t) + "," + _lerp(a[2], b[2], t) + ")"; }
  function _smooth(a, b, p) { var t = Math.max(0, Math.min(1, (p - a) / (b - a))); return t * t * (3 - 2 * t); }
  function _multi(stops, pos, p) {
    var i = 0; while (i < pos.length - 2 && p > pos[i + 1]) i++;
    var s = (p - pos[i]) / (pos[i + 1] - pos[i]); s = Math.max(0, Math.min(1, s));
    s = s * s * (3 - 2 * s); // ease each segment so stops blend without seams
    return _mix(stops[i], stops[i + 1], s);
  }
  // sky background: sunny day -> golden -> amber -> sunset -> rose -> dusk -> indigo -> night
  var SKY_POS = [0, 0.12, 0.25, 0.38, 0.50, 0.62, 0.74, 0.87, 1.0];
  var SKY  = [[255,241,229],[255,236,210],[252,216,164],[244,184,132],[226,144,110],[182,114,106],[122,86,100],[56,48,80],[8,12,28]];
  var SKY2 = [[251,233,217],[250,228,200],[245,206,156],[236,176,126],[214,134,104],[168,104,98],[110,78,92],[48,42,70],[16,21,40]];
  // text / lines / accents: day -> night, switched within a narrow mid-scroll band so text is never mid-grey for long
  var DAY   = { ink:[26,24,23], inkSoft:[63,58,54], inkFaint:[107,99,92], line:[230,212,195], lineStrong:[216,195,174], claret:[153,15,61], teal:[13,118,128], creative:[153,15,61], media:[15,84,153] };
  var NIGHT = { ink:[242,244,251], inkSoft:[208,214,228], inkFaint:[156,164,188], line:[46,52,74], lineStrong:[64,72,96], claret:[246,112,154], teal:[86,202,210], creative:[246,112,154], media:[124,180,230] };
  var PAL_VARS = ["--paper","--paper-2","--ink","--ink-soft","--ink-faint","--line","--line-strong","--claret","--teal","--creative","--media","--chart-bar","--text-halo"];
  function applyScene(p) {
    var root = document.documentElement;
    bar.style.width = (p * 100) + "%";
    if (starLayer) starLayer.style.opacity = _smooth(0.58, 1.0, p).toFixed(3);
    if (root.getAttribute("data-theme") === "dark") { PAL_VARS.forEach(function (v) { root.style.removeProperty(v); }); return; }
    root.style.setProperty("--paper", _multi(SKY, SKY_POS, p));
    root.style.setProperty("--paper-2", _multi(SKY2, SKY_POS, p));
    var tf = _smooth(0.55, 0.68, p); // 0 = day text, 1 = night text
    function sv(n, k) { root.style.setProperty(n, _mix(DAY[k], NIGHT[k], tf)); }
    sv("--ink","ink"); sv("--ink-soft","inkSoft"); sv("--ink-faint","inkFaint");
    sv("--line","line"); sv("--line-strong","lineStrong");
    sv("--claret","claret"); sv("--teal","teal"); sv("--creative","creative"); sv("--media","media");
    root.style.setProperty("--chart-bar", _mix(DAY.media, NIGHT.media, tf));
    root.style.setProperty("--text-halo", "rgba(0,0,0," + (tf * 0.6).toFixed(2) + ")");
  }
  function onScroll() {
    var root = document.documentElement, max = root.scrollHeight - root.clientHeight;
    applyScene(max > 0 ? (root.scrollTop || document.body.scrollTop) / max : 0);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("hashchange", onScroll);
  onScroll();

  (function () { var words = ($("#article").innerText || "").trim().split(/\s+/).length; $("#read-time").textContent = Math.max(1, Math.round(words / 220)) + " min read"; })();

  $$(".tl-node").forEach(function (n) { n.addEventListener("click", function () { var t = document.getElementById(n.getAttribute("data-target")); if (t) t.scrollIntoView({ behavior: "smooth", block: "start" }); }); });

  var SHARE_URL = "https://agencycomplex2035.edtsue.com/";
  function shareArticle() {
    var data = { title: "The Agency Industrial Complex, 2035", text: "By 2035 my job won't exist — a Big Read on the collapse and re-split of the agency world.", url: SHARE_URL };
    if (navigator.share) { navigator.share(data).catch(function () {}); }
    else { copyText(SHARE_URL); toast("Link copied"); }
  }
  var shareTop = $("#share-top"); if (shareTop) shareTop.addEventListener("click", shareArticle);
  var shareBtn = $("#share-btn"); if (shareBtn) shareBtn.addEventListener("click", shareArticle);
  function copyText(txt) { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).catch(function () { fallbackCopy(txt); }); else fallbackCopy(txt); }
  function fallbackCopy(txt) { var ta = document.createElement("textarea"); ta.value = txt; ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (e) {} document.body.removeChild(ta); }

  var toastEl = $("#toast"), toastTimer = null;
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 1900); }

  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { hidePopover(); closeDrawer(); if (modal.classList.contains("show")) closeNoteModal(); } });

  /* ============================================================
     WHIMSY
     ============================================================ */
  // 0) build the starfield
  (function () {
    var sky = $("#stars");
    if (!sky) return;
    var n = 72, html = "";
    for (var i = 0; i < n; i++) {
      var x = (Math.random() * 100).toFixed(2);
      var y = (Math.random() * 100).toFixed(2);
      var s = (Math.random() * 1.8 + 1).toFixed(1);
      var tw = (Math.random() * 3 + 2).toFixed(1);
      var dl = (Math.random() * 4).toFixed(1);
      html += '<span class="star" style="left:' + x + '%;top:' + y + '%;width:' + s + 'px;height:' + s + 'px;--tw:' + tw + 's;animation-delay:' + dl + 's"></span>';
    }
    sky.innerHTML = html;
  })();

  // 1) closing-line answer cycler
  (function () {
    var gEl = $("#guess"), gTail = $("#guess-tail");
    if (!gEl || !gTail) return;
    var guesses = ["a prompt", "a spreadsheet", "a vibe", "an algorithm", "nobody", "what"];
    var gi = guesses.length - 1;
    function cycle() {
      gi = (gi + 1) % guesses.length;
      var w = guesses[gi];
      gEl.textContent = w;
      gTail.textContent = (w === "what") ? ", I'm unsure." : ".";
    }
    gEl.addEventListener("click", function (e) { e.stopPropagation(); cycle(); });
    gEl.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); cycle(); } });
  })();

  // 2) surfacing whale — on reaching the whale-oil section, or typing "whale"
  (function () {
    var whale = $("#whale");
    if (!whale) return;
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    function play() {
      if (reduce || whale.classList.contains("swim")) return;
      whale.classList.add("swim");
      setTimeout(function () { whale.classList.remove("swim"); }, 9200);
    }
    var era = $('[data-pid="c2"]');
    if (era && "IntersectionObserver" in window) {
      var fired = false;
      new IntersectionObserver(function (ents) {
        ents.forEach(function (en) { if (en.isIntersecting && !fired) { fired = true; play(); } });
      }, { threshold: 0.6 }).observe(era);
    }
    var seq = "";
    document.addEventListener("keydown", function (e) {
      if (e.key && e.key.length === 1) { seq = (seq + e.key).slice(-5).toLowerCase(); if (seq === "whale") play(); }
    });
  })();

  // 3) open collapsed Further Reading when navigating to it
  (function () {
    var fr = $("#further-reading");
    if (!fr) return;
    $$('a[href="#further-reading"]').forEach(function (a) { a.addEventListener("click", function () { fr.open = true; }); });
  })();

  /* ---------- init ---------- */
  renderCharts();
  buildSources();
  renderAllHighlights();
  refreshNotesUI();
})();
