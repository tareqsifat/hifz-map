// ---------- app ----------
const {
  createApp,
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  nextTick
} = Vue;
createApp({
  setup() {
    let stored = null;
    try {
      stored = JSON.parse(localStorage.getItem(KEY) || 'null');
    } catch (e) {}
    let bits = stored ? decode(stored.bits || '') : exampleBits();
    const ver = ref(0);
    const isExample = ref(!stored);
    const name = ref(stored ?.name || '');
    const q = ref(''),
      filter = ref('all'),
      confirmReset = ref(false);
    const tip = ref(null),
      modal = ref(null),
      cardEl = ref(null);
    const saving = ref(false);
    let dl = null;

    const doneBy = computed(() => {
      ver.value;
      return SURAHS.map(s => {
        let c = 0;
        const o = OFFSET[s.i];
        for (let a = 0; a < s.n; a++) c += bits[o + a];
        return c;
      });
    });
    const totalDone = computed(() => doneBy.value.reduce((a, b) => a + b, 0));
    const fullCount = computed(() => doneBy.value.filter((d, i) => d === SURAHS[i].n).length);

    const filters = computed(() => {
      const d = doneBy.value;
      const full = d.filter((v, i) => v === SURAHS[i].n).length,
        none = d.filter(v => v === 0).length;
      return [{
          k: 'all',
          label: 'সব',
          count: 114
        },
        {
          k: 'part',
          label: 'চলমান',
          count: 114 - full - none
        },
        {
          k: 'full',
          label: 'সম্পূর্ণ',
          count: full
        },
        {
          k: 'none',
          label: 'শুরু হয়নি',
          count: none
        },
      ];
    });
    const shownSurahs = computed(() => {
      const d = doneBy.value;
      const t = q.value.trim().toLowerCase();
      const tn = t.replace(/[০-৯]/g, c => BN.indexOf(c));
      return SURAHS.filter(s => {
        const v = d[s.i];
        if (filter.value === 'full' && v !== s.n) return false;
        if (filter.value === 'none' && v !== 0) return false;
        if (filter.value === 'part' && (v === 0 || v === s.n)) return false;
        if (!t) return true;
        return String(s.i + 1) === tn || s.bn.toLowerCase().includes(t) || s.en.toLowerCase().includes(
          t) || s.ar.includes(t);
      });
    });

    function persist() {
      if (isExample.value) return;
      try {
        localStorage.setItem(KEY, JSON.stringify({
          bits: encode(bits),
          name: name.value
        }));
      } catch (e) {}
    }

    function touch() {
      ver.value++;
      persist();
    }

    function keepExample() {
      isExample.value = false;
      persist();
    }

    function resetAll() {
      bits = new Uint8Array(TOTAL);
      isExample.value = false;
      confirmReset.value = false;
      touch();
    }

    // drawing
    function redraw() {
      const c = cardEl.value;
      if (!c) return;
      const w = c.clientWidth || 1000;
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      const pw = Math.round(w * dpr),
        ph = Math.round(w * 1.2 * dpr);
      if (c.width !== pw || c.height !== ph) {
        c.width = pw;
        c.height = ph;
      }
      const ctx = c.getContext('2d');
      ctx.setTransform(pw / 1000, 0, 0, pw / 1000, 0, 0);
      drawCard(ctx, bits, {
        name: name.value.trim(),
        doneBy: doneBy.value,
        totalDone: totalDone.value,
        fullCount: fullCount.value
      });
    }
    watch([ver, name], () => {
      nextTick(redraw);
    });
    watch(name, persist);

    function locate(e) {
      const c = cardEl.value;
      const r = c.getBoundingClientRect();
      const lx = (e.clientX - r.left) / r.width * 1000,
        ly = (e.clientY - r.top) / r.height * 1200;
      const ux = (lx - MAP.x) / MAP.s,
        uy = (ly - MAP.y) / MAP.s;
      if (ux < 0 || uy < 0 || ux >= 1 || uy >= 1) return null;
      for (let si = 0; si < 114; si++) {
        const g = REG[si];
        if (ux >= g.x && ux < g.x + g.w && uy >= g.y && uy < g.y + g.h) {
          const cells = CELLS[si];
          let a = 0;
          for (let k = 0; k < cells.length; k++) {
            const c2 = cells[k];
            if (ux >= c2.x && ux < c2.x + c2.w && uy >= c2.y && uy < c2.y + c2.h) {
              a = k;
              break;
            }
          }
          return {
            si,
            a,
            px: e.clientX - r.left,
            py: e.clientY - r.top
          };
        }
      }
      return null;
    }

    function onHover(e) {
      if (e.pointerType === 'touch') return;
      const h = locate(e);
      if (!h) {
        tip.value = null;
        return;
      }
      const s = SURAHS[h.si];
      const m = bits[OFFSET[h.si] + h.a];
      tip.value = {
        x: h.px,
        y: h.py,
        text: bn(h.si + 1) + '. ' + s.bn + ' · আয়াত ' + bn(h.a + 1) + (m ? ' · মুখস্থ' : '')
      };
    }

    function onMapClick(e) {
      const h = locate(e);
      if (h) openSurah(h.si);
    }

    // modal
    const cur = computed(() => modal.value ? SURAHS[modal.value.s] : SURAHS[0]);
    const draftCount = computed(() => modal.value ? modal.value.draft.filter(Boolean).length : 0);

    function openSurah(si) {
      const s = SURAHS[si];
      const draft = [];
      for (let a = 0; a < s.n; a++) draft.push(!!bits[OFFSET[si] + a]);
      modal.value = {
        s: si,
        step: 'choose',
        draft,
        mode: 'single',
        anchor: null,
        from: 1,
        to: s.n
      };
      tip.value = null;
    }

    function closeModal() {
      modal.value = null;
    }

    function markWhole() {
      const s = cur.value;
      for (let a = 0; a < s.n; a++) bits[OFFSET[s.i] + a] = 1;
      touch();
      closeModal();
    }

    function clearSurah() {
      const s = cur.value;
      for (let a = 0; a < s.n; a++) bits[OFFSET[s.i] + a] = 0;
      touch();
      closeModal();
    }

    function setMode(m) {
      modal.value.mode = m;
      modal.value.anchor = null;
    }

    function fillDraft(v) {
      modal.value.draft = modal.value.draft.map(() => v);
      modal.value.anchor = null;
    }

    function setRange(a, b, v) {
      const lo = Math.min(a, b),
        hi = Math.max(a, b);
      for (let k = lo; k <= hi; k++) modal.value.draft[k] = v;
    }
    let lastTap = null;

    function tapTile(k, e) {
      const m = modal.value;
      if (m.mode === 'range') {
        if (m.anchor == null) {
          m.anchor = k;
          return;
        }
        setRange(m.anchor, k, true);
        m.anchor = null;
        return;
      }
      if (e.shiftKey && lastTap != null) {
        setRange(lastTap, k, m.draft[lastTap]);
      } else m.draft[k] = !m.draft[k];
      lastTap = k;
    }

    function applyRange(v) {
      const m = modal.value;
      const n = cur.value.n;
      const a = Math.min(n, Math.max(1, m.from | 0)),
        b = Math.min(n, Math.max(1, m.to | 0));
      setRange(a - 1, b - 1, v);
    }

    function saveDraft() {
      const s = cur.value;
      modal.value.draft.forEach((v, a) => {
        bits[OFFSET[s.i] + a] = v ? 1 : 0;
      });
      touch();
      closeModal();
    }
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.value) closeModal();
    });

    // download + share
    const shareOpen = ref(false),
      shareMsg = ref(''),
      canNativeShare = ref(false);
    const siteUrl = () => location.origin + location.pathname.replace(/index\.html$/, '');
    const shareText = () => 'আমার হিফজ মানচিত্র: ' + bnPct(totalDone.value / TOTAL) + ' কুরআন মুখস্থ (' + bnInt(totalDone.value) + '/' + bnInt(TOTAL) + ' আয়াত)';

    async function renderBlob() {
      const c = document.createElement('canvas');
      c.width = 2000;
      c.height = 2400;
      const ctx = c.getContext('2d');
      ctx.scale(2, 2);
      drawCard(ctx, bits, {
        name: name.value.trim(),
        doneBy: doneBy.value,
        totalDone: totalDone.value,
        fullCount: fullCount.value
      });
      return new Promise(r => c.toBlob(r, 'image/png'));
    }

    async function saveBlob(blob) {
      if (dl) {
        try {
          const res = await dl.save({ filename: 'hifz-map.png', data: blob });
          return res.status === 'saved';
        } catch (err) {
          if (err && err.code === 'declined') return false;
          if (!['unavailable', 'not_granted', 'capability_disabled', 'capability_removed'].includes(err && err.code)) throw err;
        }
      }
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'hifz-map.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 10000);
      return true;
    }

    async function downloadPng() {
      saving.value = true;
      shareMsg.value = '';
      try {
        if (await saveBlob(await renderBlob())) shareMsg.value = 'ছবি সেভ হয়েছে।';
      } catch (err) {
        shareMsg.value = 'ছবি সেভ করা গেল না। আবার চেষ্টা করুন।';
      } finally {
        saving.value = false;
      }
    }

    function openShare() {
      shareMsg.value = '';
      shareOpen.value = true;
    }

    // device share sheet: image file + text + site link together
    async function nativeShare() {
      saving.value = true;
      shareMsg.value = '';
      try {
        const blob = await renderBlob();
        const file = new File([blob], 'hifz-map.png', { type: 'image/png' });
        const data = { title: 'হিফজ মানচিত্র', text: shareText(), url: siteUrl() };
        if (navigator.canShare && navigator.canShare({ files: [file] })) data.files = [file];
        await navigator.share(data);
      } catch (err) {
        if (!err || err.name !== 'AbortError') shareMsg.value = 'শেয়ার করা গেল না।';
      } finally {
        saving.value = false;
      }
    }

    // web share links can only carry text + link, so the image is downloaded for the user to attach
    const platforms = [
      { k: 'facebook', label: 'Facebook', color: '#1877f2', url: (u, t) => 'https://www.facebook.com/sharer/sharer.php?u=' + u + '&quote=' + t },
      { k: 'whatsapp', label: 'WhatsApp', color: '#25d366', url: (u, t) => 'https://wa.me/?text=' + t + '%20' + u },
      { k: 'messenger', label: 'Messenger', color: '#0084ff', url: (u) => 'https://www.facebook.com/dialog/send?link=' + u + '&app_id=966242223397117&redirect_uri=' + u },
      { k: 'telegram', label: 'Telegram', color: '#26a5e4', url: (u, t) => 'https://t.me/share/url?url=' + u + '&text=' + t },
      { k: 'x', label: 'X (Twitter)', color: '#000', url: (u, t) => 'https://twitter.com/intent/tweet?url=' + u + '&text=' + t },
      { k: 'linkedin', label: 'LinkedIn', color: '#0a66c2', url: (u) => 'https://www.linkedin.com/sharing/share-offsite/?url=' + u },
      { k: 'reddit', label: 'Reddit', color: '#ff4500', url: (u, t) => 'https://www.reddit.com/submit?url=' + u + '&title=' + t },
      { k: 'email', label: 'Email', color: '#6b7a72', url: (u, t) => 'mailto:?subject=' + t + '&body=' + t + '%0A' + u }
    ];

    async function shareTo(p) {
      const u = encodeURIComponent(siteUrl()),
        t = encodeURIComponent(shareText());
      window.open(p.url(u, t), '_blank', 'noopener,noreferrer');
      shareMsg.value = 'ছবিটি ডাউনলোড করে পোস্টে যুক্ত করুন — লিংক ইতিমধ্যে সাথে আছে।';
    }

    async function copyLink() {
      const txt = shareText() + '\n' + siteUrl();
      try {
        await navigator.clipboard.writeText(txt);
        shareMsg.value = 'লিংক কপি হয়েছে।';
      } catch (e) {
        shareMsg.value = siteUrl();
      }
    }

    onMounted(async () => {
      redraw();
      if (!BG_IMG.complete) BG_IMG.onload = () => redraw();
      try {
        await Promise.all([
          document.fonts.load('700 42px "Noto Serif Bengali"'), document.fonts.load(
            '600 20px "Hind Siliguri"'),
          document.fonts.load('500 20px "Hind Siliguri"'), document.fonts.load('400 20px "Amiri"')
        ]);
      } catch (e) {}
      redraw();
      if (document.fonts) document.fonts.ready.then(redraw);
      new ResizeObserver(() => redraw()).observe(cardEl.value);
      try {
        dl = window.claude && window.claude.use ? await window.claude.use('downloads') : null;
      } catch (e) {
        dl = null;
      }
      canNativeShare.value = !!navigator.share;
    });

    return {
      TOTAL,
      bn,
      bnPct,
      doneBy,
      totalDone,
      filters,
      filter,
      q,
      shownSurahs,
      isExample,
      keepExample,
      resetAll,
      confirmReset,
      name,
      tip,
      onHover,
      onMapClick,
      cardEl,
      modal,
      cur,
      draftCount,
      openSurah,
      closeModal,
      markWhole,
      clearSurah,
      setMode,
      fillDraft,
      tapTile,
      applyRange,
      saveDraft,
      saving,
      downloadPng,
      shareOpen,
      shareMsg,
      canNativeShare,
      platforms,
      openShare,
      nativeShare,
      shareTo,
      copyLink
    };
  }
}).mount('#app');
