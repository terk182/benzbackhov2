/**
 * Modern Theme JS - overrides ALL inline white/light styles
 * Runs on DOM ready and on any dynamic content changes
 */
(function() {
  'use strict';

  const DARK_BG = '#0f1117';
  const DARK_BG2 = '#1a1d27';
  const DARK_CARD = '#1e2130';
  const DARK_BG3 = '#242836';
  const TEXT = '#e2e8f0';
  const TEXT_MUTED = '#94a3b8';
  const GOLD = '#f59e0b';

  const WHITE_PATTERNS = [
    /rgb\(\s*255\s*,\s*255\s*,\s*255\s*\)/i, /#fff\b/i, /#ffffff\b/i, /#FFF\b/i, /#FFFFFF\b/i, /\bwhite\b/i,
    /rgb\(\s*25[0-5]\s*,\s*25[0-5]\s*,\s*25[0-5]\s*\)/i,
    /rgb\(\s*2[4-5][0-9]\s*,\s*2[4-5][0-9]\s*,\s*2[4-5][0-9]\s*\)/i,
  ];

  const LIGHT_BG_PATTERNS = [
    /rgb\(\s*2[4-5][0-9]\s*,\s*2[4-5][0-9]\s*,\s*2[4-5][0-9]\s*\)/i,
    /rgb\(\s*23[0-9]\s*,\s*23[0-9]\s*,\s*23[0-9]\s*\)/i,
    /rgb\(\s*24[0-9]\s*,\s*24[0-9]\s*,\s*24[0-9]\s*\)/i,
    /rgb\(\s*22[0-9]\s*,\s*22[0-9]\s*,\s*22[0-9]\s*\)/i,
    /#f[0-9a-f]{2}\b/i, /#F[0-9A-F]{2}\b/i,
    /#e[0-9a-f]{2}\b/i, /#E[0-9A-F]{2}\b/i,
    /#d[0-9a-f]{2}\b/i, /#D[0-9A-F]{2}\b/i,
    /rgb\(\s*2[0-2][0-9]\s*,\s*2[0-2][0-9]\s*,\s*2[0-2][0-9]\s*\)/i,
    /rgb\(\s*23[0-5]\s*,\s*23[0-5]\s*,\s*23[0-5]\s*\)/i,
  ];

  const DARK_TEXT_PATTERNS = [
    /#333\b/i, /#444\b/i, /#555\b/i, /#666\b/i, /#777\b/i, /#888\b/i, /#999\b/i,
    /rgb\(\s*[0-9]{1,2}\s*,\s*[0-9]{1,2}\s*,\s*[0-9]{1,2}\s*\)/i,
    /rgb\(\s*1[0-4][0-9]\s*,\s*1[0-4][0-9]\s*,\s*1[0-4][0-9]\s*\)/i,
    /\bblack\b/i,
  ];

  function isWhiteBg(color) {
    return WHITE_PATTERNS.some(p => p.test(color));
  }

  function isLightBg(color) {
    return LIGHT_BG_PATTERNS.some(p => p.test(color));
  }

  function isDarkText(color) {
    return DARK_TEXT_PATTERNS.some(p => p.test(color));
  }

  function shouldSkip(el) {
    var tag = el.tagName;
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'LINK' || tag === 'META' || tag === 'BR' || tag === 'HR') return true;
    if (el.closest('svg') || el.closest('canvas') || el.closest('iframe') || el.closest('pre') || el.closest('code')) return true;
    return false;
  }

  function fixInlineStyle(el) {
    if (shouldSkip(el)) return;
    if (!el.hasAttribute('style')) return;

    var style = el.getAttribute('style');

    // Fix background-color
    var bgMatch = style.match(/background(?:-color)?\s*:\s*([^;]+)/i);
    if (bgMatch) {
      var bg = bgMatch[1].trim();
      if (isWhiteBg(bg)) {
        el.style.setProperty('background-color', DARK_BG, 'important');
      } else if (isLightBg(bg)) {
        el.style.setProperty('background-color', DARK_BG2, 'important');
      }
    }

    // Fix color (text)
    var colorMatch = style.match(/color\s*:\s*([^;]+)/i);
    if (colorMatch) {
      var c = colorMatch[1].trim();
      if (isWhiteBg(c) || c === 'inherit' || c === 'initial') {
        // skip white text
      } else if (isDarkText(c) || /#[0-5][0-9a-f]{2}\b/i.test(c)) {
        el.style.setProperty('color', TEXT, 'important');
      }
    }

    // Fix border-color
    var borderMatch = style.match(/border(?:-color)?\s*:\s*[^;]*?(#[e-fE-F][0-9a-fA-F]{2}|rgb\(\s*2[0-5][0-9])/i);
    if (borderMatch) {
      el.style.setProperty('border-color', 'rgba(255,255,255,0.08)', 'important');
    }
  }

  function fixComputedStyle(el) {
    if (shouldSkip(el)) return;
    if (el.hasAttribute('style') && el.getAttribute('style').match(/background(?:-color)?/i)) return; // already handled

    try {
      var bg = window.getComputedStyle(el).backgroundColor;
      if (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') return;

      if (isWhiteBg(bg)) {
        el.style.setProperty('background-color', DARK_BG, 'important');
      } else if (isLightBg(bg)) {
        el.style.setProperty('background-color', DARK_BG2, 'important');
      }

      var color = window.getComputedStyle(el).color;
      if (isDarkText(color) && !isWhiteBg(bg)) {
        el.style.setProperty('color', TEXT, 'important');
      }
    } catch(e) {}
  }

  function applyTheme(root) {
    root = root || document.body;
    var all = root.querySelectorAll('*');
    // Process inline styles first
    for (var i = 0; i < all.length; i++) {
      fixInlineStyle(all[i]);
    }
  }

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { applyTheme(); });
  } else {
    applyTheme();
  }

  // Also run after images/Vue render
  setTimeout(function() { applyTheme(); }, 500);
  setTimeout(function() { applyTheme(); }, 1500);
  setTimeout(function() { applyTheme(); }, 3000);

  // Watch for new elements (Vue, dynamic content)
  if (window.MutationObserver) {
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(m) {
        m.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) {
            fixInlineStyle(node);
            fixComputedStyle(node);
            var children = node.querySelectorAll ? node.querySelectorAll('[style]') : [];
            for (var i = 0; i < children.length; i++) {
              fixInlineStyle(children[i]);
            }
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  console.log('🚀 Modern Dark Theme applied');
})();
