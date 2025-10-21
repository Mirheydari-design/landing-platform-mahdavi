// ========================== BASE UTILS ==========================
const d = document;
const $ = s => d.querySelector(s);
const $$ = s => d.querySelectorAll(s);

const API_BASE    = location.origin;
const API_VOTE    = `${API_BASE}/api/vote`;
const API_OPTIONS = `${API_BASE}/api/options`;
const API_PROPOSE = `${API_BASE}/api/propose`;

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

  // گزینه‌ها به همان ترتیبی که سرور می‌فرستد (rowid ASC) رندر می‌شوند
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

// ========================== MODAL (use existing pretty modal) ==========================
// کمک‌تابع: از بین چند id رایج، اولین موجود را برمی‌گرداند
function pick(...ids){ const sel = ids.map(id=>`#${id}`).join(','); return d.querySelector(sel); }

const modal = {
  el: null, name: null, tagline: null, fullName: null, phone: null, nid: null,
  open(){ if (this.el) this.el.style.display = 'grid'; },
  close(){ if (this.el) this.el.style.display = 'none'; },
  values(){
    return {
      name: (this.name?.value || '').trim(),
      description: (this.tagline?.value || '').trim(),
      full_name: (this.fullName?.value || '').trim(),
      phone: (this.phone?.value || '').trim(),
      national_id: (this.nid?.value || '').trim()
    };
  },
  reset(){
    if (this.name) this.name.value = '';
    if (this.tagline) this.tagline.value = '';
    if (this.fullName) this.fullName.value = '';
    if (this.phone) this.phone.value = '';
    if (this.nid) this.nid.value = '';
  },
  init(){
    // تلاش برای پیدا کردن idهای رایج بدون تغییر HTML شما
    this.el       = pick('addOptionModal','addOption','optionModal');
    this.name     = pick('newOptionName','platformName');
    this.tagline  = pick('newOptionTagline','platformTagline');
    this.fullName = pick('proposerFullName','submitterName');
    this.phone    = pick('proposerPhone','submitterPhone');
    this.nid      = pick('proposerNID','submitterNationalId');

    const closeBtn   = pick('modalClose','closeAddOption');
    const cancelBtn  = pick('modalCancel','cancelAddOption');
    const submitBtn  = pick('modalSubmit','submitNewOption');

    if (!this.el || !this.name || !submitBtn) {
      console.warn('[modal] عناصر کافی پیدا نشد. اگر idها فرق دارند مشکلی نیست؛ فقط idهای واقعی را بده.');
      return;
    }

    // بستن
    closeBtn?.addEventListener('click', ()=> this.close());
    cancelBtn?.addEventListener('click', ()=> this.close());
    // کلیک روی بک‌دراپ
    this.el.addEventListener('click', (e)=>{ if (e.target === this.el) this.close(); });
    // عناصر دارای data-close
    this.el.querySelectorAll('[data-close]').forEach(x=> x.addEventListener('click', ()=> this.close()));

    // ارسال
    submitBtn.addEventListener('click', async ()=>{
      const v = this.values();
      if (!v.name) { this.name.focus(); return; }

      submitBtn.disabled = true; const oldTxt = submitBtn.textContent; submitBtn.textContent = 'در حال ثبت...';
      try {
        // ذخیره‌ی امن اطلاعات شخصی در proposals و گزینه در options
        await POST(API_PROPOSE, v);

        // ری‌لود لیست از سرور (rowid ASC → آیتم جدید انتهای لیست)
        const data = await loadOptionsAndCounts();
        render(data);

        // رأی اتومات روی گزینهٔ تازه
        try {
          await POST(API_VOTE, { userId: uid(), option: v.name });
          const { counts } = await GET(API_VOTE);
          liveUpdateCounts(counts);
          setSelectedKey(v.name);
        } catch (_) {}

        this.reset();
        this.close();

        // اسکرول به آخر تا آیتم جدید دیده شود (و دکمهٔ «گزینه پیشنهادی جدید» آخر بماند)
        d.getElementById('voteList')?.lastElementChild?.scrollIntoView({ behavior:'smooth', block:'end' });
      } catch (err) {
        console.warn('Add option API error:', err);
        alert('ثبت گزینه جدید با مشکل مواجه شد.');
      } finally {
        submitBtn.disabled = false; submitBtn.textContent = oldTxt || 'افزودن';
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

  // بازکردن پاپ‌آپ افزودن (هیچ promptی در کار نیست)
  voteListEl.addEventListener('click', (e)=>{
    const add = e.target.closest('#openAddOption');
    if(!add) return;
    modal.open();
  }, true); // capture تا هندلرهای قدیمی احتمالی اصلاً اجرا نشوند
}

// ساکت کردن Tweakpane
function setupTweakpaneControls(){ if (!window.Tweakpane) return; }

// ========================== INIT ==========================
document.addEventListener('DOMContentLoaded', async function initVoting(){
  try {
    modal.init();
    const data = await loadOptionsAndCounts();
    render(data);
    bindHandlers();
    setupTweakpaneControls();
  } catch (err){
    console.error('vote init error', err);
    render({ error: err, options: [], counts: {} });
  }
});
