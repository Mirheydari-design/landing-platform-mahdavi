// ========================== BASE UTILS ==========================
const d = document;
const $ = s => d.querySelector(s);
const $$ = s => d.querySelectorAll(s);

const API_BASE    = location.origin;
const API_VOTE    = `${API_BASE}/api/vote`;
const API_OPTIONS = `${API_BASE}/api/options`;

const faNum = s => String(s).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
const fromFaNum = s => Number(String(s).replace(/[۰-۹]/g, ch => {
  const i = '۰۱۲۳۴۵۶۷۸۹'.indexOf(ch); return i >= 0 ? i : ch;
}));

function uid(){
  if (!localStorage.uid) {
    if (crypto && crypto.randomUUID) localStorage.uid = crypto.randomUUID();
    else localStorage.uid = 'u_' + Math.random().toString(36).slice(2);
  }
  return localStorage.uid;
}

async function GET(url){
  const r = await fetch(url, { method:'GET' });
  const ct = r.headers.get('content-type') || '';
  const data = ct.includes('application/json') ? await r.json() : { html: await r.text() };
  if (!r.ok) throw new Error((data && (data.message || data.error)) || `GET ${url} failed`);
  return data;
}
async function POST(url, body){
  const r = await fetch(url, { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(body) });
  const ct = r.headers.get('content-type') || '';
  const data = ct.includes('application/json') ? await r.json() : { success:false, html: await r.text() };
  if (!r.ok || data.success === false) throw new Error(data.message || data.error || `POST ${url} failed`);
  return data;
}

// ========================== VOTE DATA ==========================
async function loadOptionsAndCounts(){
  const [{ options }, { counts }] = await Promise.all([ GET(API_OPTIONS), GET(API_VOTE) ]);
  return { options: options || [], counts: counts || {} };
}
const VOTE_KEY = 'vote.selectedKey';
const getSelectedKey = () => localStorage.getItem(VOTE_KEY) || '';
const setSelectedKey = k => localStorage.setItem(VOTE_KEY, k);

// ========================== RENDER ==========================
function render({options, counts, error}){
  const voteListEl = d.getElementById('voteList');
  if(!voteListEl) return;
  voteListEl.innerHTML = '';

  if (error) {
    const e = d.createElement('div');
    e.className = 'error-message';
    e.innerHTML = `<div style="text-align:center;padding:2rem;color:#ff6b6b;background:rgba(255,107,107,.1);border-radius:12px;border:1px solid rgba(255,107,107,.3);">
        <h3 style="margin-bottom:1rem;font-size:1.2rem;">⚠️ خطا در اتصال به سرور</h3>
        <p style="margin-bottom:.5rem;font-size:.9rem;">نمی‌توانیم گزینه‌ها را از دیتابیس لود کنیم</p>
        <button onclick="location.reload()" style="margin-top:1rem;padding:.5rem 1rem;background:rgba(255,107,107,.2);border:1px solid rgba(255,107,107,.4);border-radius:8px;color:#ff6b6b;cursor:pointer;">تلاش مجدد</button>
    </div>`;
    voteListEl.appendChild(e);
    return;
  }

  // آیتم‌های گزینه‌ها
  options.forEach(o=>{
    const btn = d.createElement('button');
    btn.className = 'vote-item';
    btn.dataset.key = o.option;
    btn.innerHTML = `
      <div>
        <div class="item-title">${o.option}</div>
        <div class="item-subtitle">${o.description||''}</div>
      </div>
      <span class="item-meta">
        <span class="count-badge" data-count>${faNum(counts[o.option]||0)}</span>
        <span class="icon-outline" aria-hidden>
          <svg width="20" height="20" viewBox="0 0 24 24"><path d="M12.1 8.64l-.1.1-.1-.1C10.14 6.82 7.1 7.5 6.5 9.88c-.38 1.53.44 3.07 1.69 4.32C9.68 15.7 12 17 12 17s2.32-1.3 3.81-2.8c1.25-1.25 2.07-2.79 1.69-4.32-.6-2.38-3.64-3.06-5.4-1.24z" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linejoin="round"/></svg>
        </span>
      </span>`;
    voteListEl.appendChild(btn);
  });

  // دکمه افزودن همیشه آخر لیست
    const add = d.createElement('button');
    add.id='openAddOption'; add.className='vote-item add-new';
    add.innerHTML = `<div><div class="item-title">گزینه پیشنهادی جدید</div><div class="item-subtitle">نام و تگ‌لاین خودت رو ثبت کن</div></div>`;
    voteListEl.appendChild(add);

  // انتخاب قبلی
  const sel = getSelectedKey();
  if (sel) {
    const b = voteListEl.querySelector(`.vote-item[data-key="${CSS.escape(sel)}"]`);
    if (b) b.classList.add('selected');
  }
}

function liveUpdateCounts(counts){
  const voteListEl = d.getElementById('voteList');
  voteListEl.querySelectorAll('.vote-item[data-key]').forEach(btn=>{
    const key = btn.dataset.key;
    const el = btn.querySelector('[data-count]');
    if(el) el.textContent = faNum(counts[key]||0);
  });
}

// ========================== MODAL (Add Option) ==========================
const modal = {
  el: null, name: null, tagline: null, fullName: null, phone: null, nid: null,
  open(){ this.el?.removeAttribute('hidden'); },
  close(){ this.el?.setAttribute('hidden',''); },
  values(){
    return {
      name: (this.name.value || '').trim(),
      description: (this.tagline.value || '').trim(),
      full_name: (this.fullName.value || '').trim(),
      phone: (this.phone.value || '').trim(),
      national_id: (this.nid.value || '').trim()
    };
  },
  reset(){
    this.name.value = ''; this.tagline.value = '';
    this.fullName.value = ''; this.phone.value = ''; this.nid.value = '';
  },
  init(){
    this.el       = d.getElementById('addOptionModal');
    this.name     = d.getElementById('newOptionName');
    this.tagline  = d.getElementById('newOptionTagline');
    this.fullName = d.getElementById('proposerFullName');
    this.phone    = d.getElementById('proposerPhone');
    this.nid      = d.getElementById('proposerNID');
    const closeBtn   = d.getElementById('modalClose');
    const cancelBtn  = d.getElementById('modalCancel');
    const submitBtn  = d.getElementById('modalSubmit');

    // بستن
    closeBtn?.addEventListener('click', ()=> this.close());
    cancelBtn?.addEventListener('click', ()=> this.close());
    this.el?.addEventListener('click', (e)=>{
      if (e.target === this.el) this.close();
    });

    // ارسال
    submitBtn?.addEventListener('click', async ()=>{
      const v = this.values();
      if (!v.name) { this.name.focus(); return; }

      try {
        // فقط name و description برای /api/options لازم است؛ بقیه‌ فیلدها اگر بخواهی می‌توانیم بعداً در proposals ذخیره کنیم.
        await POST(API_OPTIONS, { name: v.name, description: v.description });

        // تازه‌سازی لیست
        const data = await loadOptionsAndCounts();
        render(data);

        // رأی اتومات روی گزینه‌ی تازه (اختیاری ولی تجربهٔ بهتر)
        try {
          await POST(API_VOTE, { userId: uid(), option: v.name });
          const { counts } = await GET(API_VOTE);
          liveUpdateCounts(counts);
          setSelectedKey(v.name);
        } catch (e) {}

        this.reset();
        this.close();

        // اسکرول به انتهای لیست تا گزینه‌ی جدید دیده شود
        d.getElementById('voteList')?.lastElementChild?.scrollIntoView({ behavior:'smooth', block:'end' });
      } catch (err) {
        console.warn('Add option API error:', err);
        alert('ثبت گزینه جدید با مشکل مواجه شد.');
      }
    });
  }
};

// ========================== BINDINGS ==========================
function bindHandlers(){
  const voteListEl = d.getElementById('voteList');

  // رأی
  voteListEl.addEventListener('click', async (e)=>{
    const btn = e.target.closest('.vote-item[data-key]');
    if(!btn || btn.id === 'openAddOption') return;
    const key = btn.dataset.key;

    try {
      await POST(API_VOTE, { userId: uid(), option: key });
      setSelectedKey(key);
      voteListEl.querySelectorAll('.vote-item').forEach(b=>b.classList.remove('selected'));
      btn.classList.add('selected');
      const {counts} = await GET(API_VOTE);
      liveUpdateCounts(counts);
    } catch (error) {
      console.warn('Vote API error:', error);
      alert('ثبت رأی با مشکل مواجه شد.');
    }
  });

  // بازکردن پاپ‌آپ افزودن
  voteListEl.addEventListener('click', (e)=>{
    const add = e.target.closest('#openAddOption');
    if(!add) return;
    modal.open(); // ← دیگه prompt نداریم
  });
}

// ساکت کردن Tweakpane
function setupTweakpaneControls(){ if (!window.Tweakpane) return; }

// ========================== INIT ==========================
document.addEventListener('DOMContentLoaded', async function initVoting(){
  try {
    modal.init(); // ← پاپ‌آپ را آماده کن
    const data = await loadOptionsAndCounts();
    render(data);
    bindHandlers();
    setupTweakpaneControls();
  } catch (err){
    console.error('vote init error', err);
    render({ error: err, options: [], counts: {} });
  }
});
/* ======= ADD-ON: Wire existing pretty modal (no prompts) ======= */
/* Adjust these if your IDs differ */
const SELECTORS = {
  modal:        '#addOptionModal',
  closeBtn:     '#modalClose',
  cancelBtn:    '#modalCancel',
  submitBtn:    '#modalSubmit',
  name:         '#newOptionName',
  tagline:      '#newOptionTagline',
  fullName:     '#proposerFullName',
  phone:        '#proposerPhone',
  nid:          '#proposerNID',
  voteList:     '#voteList',
  openAddBtnId: 'openAddOption'
};

// Quiet Tweakpane noise (optional)
try { if (typeof window.setupTweakpaneControls === 'function') window.setupTweakpaneControls = function(){}; } catch(e){}

/* Helpers already exist in your file:
   - GET(url), POST(url)
   - uid(), loadOptionsAndCounts(), render(data), liveUpdateCounts(counts)
   - API_VOTE, API_OPTIONS
*/

(function wireExistingModal(){
  const $ = (s) => document.querySelector(s);
  const voteListEl = document.querySelector(SELECTORS.voteList);
  if (!voteListEl) return;

  const modalEl   = $(SELECTORS.modal);
  const nameEl    = $(SELECTORS.name);
  const tagEl     = $(SELECTORS.tagline);
  const fullEl    = $(SELECTORS.fullName);
  const phoneEl   = $(SELECTORS.phone);
  const nidEl     = $(SELECTORS.nid);
  const closeBtn  = $(SELECTORS.closeBtn);
  const cancelBtn = $(SELECTORS.cancelBtn);
  const submitBtn = $(SELECTORS.submitBtn);

  if (!modalEl || !nameEl || !submitBtn) {
    console.warn('[modal wiring] modal not found or missing fields'); 
    return;
  }

  function openModal(){ modalEl.removeAttribute('hidden'); nameEl.focus(); }
  function closeModal(){ modalEl.setAttribute('hidden',''); }

  // Close actions
  closeBtn?.addEventListener('click', closeModal);
  cancelBtn?.addEventListener('click', closeModal);
  modalEl.addEventListener('click', (e)=> { if (e.target === modalEl) closeModal(); });

  // Intercept the "add new option" click BEFORE any other listener (capture=true)
  voteListEl.addEventListener('click', (e)=>{
    const btn = e.target.closest(`#${CSS.escape(SELECTORS.openAddBtnId)}`);
    if (!btn) return;
    e.preventDefault();
    e.stopImmediatePropagation(); // prevent older prompt-based handler
    openModal();
  }, true); // ← capture phase

  // Submit modal
  submitBtn.addEventListener('click', async ()=>{
    const name = (nameEl.value || '').trim();
    const description = (tagEl?.value || '').trim();
    const proposer = {
      full_name:   (fullEl?.value  || '').trim(),
      phone:       (phoneEl?.value || '').trim(),
      national_id: (nidEl?.value   || '').trim()
    };
    if (!name) { nameEl.focus(); return; }

    submitBtn.disabled = true; submitBtn.textContent = 'در حال ثبت...';
    try {
      // فقط name/description برای /api/options لازم است. (سایر فیلدها اگر لازم شد بعداً به /api/propose می‌فرستیم)
      await POST(`${location.origin}/api/propose`, {
        name,
        description,
        full_name: proposer.full_name,
        phone: proposer.phone,
        national_id: proposer.national_id
      });

      // ری‌لود لیست از سرور (سرور rowid ASC → آیتم جدید انتهای لیست)
      const data = await loadOptionsAndCounts();
      render(data);

      // رأی اتومات روی گزینهٔ تازه (اختیاری؛ اگر نمی‌خواهی، این بلاک را حذف کن)
      try {
        await POST(`${location.origin}/api/vote`, { userId: uid(), option: name });
        const { counts } = await GET(`${location.origin}/api/vote`);
        liveUpdateCounts(counts);
      } catch (_) {}

      // خالی‌کردن فرم + بستن
      if (tagEl)  tagEl.value  = '';
      if (fullEl) fullEl.value = '';
      if (phoneEl) phoneEl.value = '';
      if (nidEl)   nidEl.value   = '';
      nameEl.value = '';
      closeModal();

      // اسکرول به انتهای لیست تا آیتم جدید دیده شود (و دکمهٔ "گزینه پیشنهادی جدید" هم آخر بماند)
      const list = document.querySelector(SELECTORS.voteList);
      list?.lastElementChild?.scrollIntoView({ behavior:'smooth', block:'end' });
    } catch (err) {
      console.warn('Add option API error:', err);
      alert('ثبت گزینه جدید با مشکل مواجه شد.');
    } finally {
      submitBtn.disabled = false; submitBtn.textContent = 'افزودن';
    }
  });
})();
