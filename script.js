// Helpers
const d = document;
const $ = (s) => d.querySelector(s);
const $$ = (s) => d.querySelectorAll(s);

// Smooth scrolling function
function scrollToSection(sectionId) {
    const element = d.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Scroll reveal animation
function handleScrollReveal() {
    const reveals = document.querySelectorAll('.scroll-reveal');
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        const elementVisible = 150;
        // نمایش فوری اگر کامپوننت در viewport هست یا نزدیک هست
        if (elementTop < windowHeight - elementVisible || elementTop < windowHeight) {
            reveal.classList.add('revealed');
        }
    });
}

// Parallax effect for hero section
function handleParallax() {
    const scrolled = window.pageYOffset;
    const parallax = $('.parallax-bg');
    if (parallax) parallax.style.transform = `translate3d(0, ${scrolled * 0.5}px, 0)`;
}

// Inject animations (sparkle + floatUp) once
(() => {
    const styleEl = d.createElement('style');
    styleEl.textContent = `
@keyframes sparkle { 0%,100%{transform:scale(1)} 50%{transform:scale(1.02);box-shadow:0 0 20px rgba(255,255,255,0.3)} }
@keyframes floatUp { 0%{transform:translateY(0) rotate(0deg);opacity:0} 10%,90%{opacity:1} 100%{transform:translateY(-100vh) rotate(360deg);opacity:0} }
`;
    d.head.appendChild(styleEl);
})();

// Vote button micro-interaction (visual only)
function vote(button) {
    d.querySelectorAll('.vote-btn').forEach(btn => btn.classList.remove('voted'));
    button.classList.add('voted');
    button.style.transform = 'scale(1.3)';
    setTimeout(() => { button.style.transform = 'scale(1.2)'; }, 150);
}

// Submit feedback (demo only – unchanged)
async function submitFeedback() {
    const nameInput = d.querySelector('input[placeholder="{اسم پیشنهادی}"]');
    const taglineInput = d.querySelector('input[placeholder="{معرفی در چند کلمه}"]');
    const feedbackTextarea = d.querySelector('textarea');
    const submitBtn = d.querySelector('.submit-btn');

    const name = nameInput.value.trim();
    const tagline = taglineInput.value.trim();
    const feedback = feedbackTextarea.value.trim();

    if (!name || !tagline || !feedback) {
        alert('لطفاً همه فیلدها رو پر کن');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'در حال ارسال...';

    try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        submitBtn.textContent = 'ارسال شد! ممنون از نظرت 🙏';
        submitBtn.style.background = '#10b981';
        nameInput.value = ''; taglineInput.value = ''; feedbackTextarea.value = '';
        setTimeout(() => { submitBtn.disabled = false; submitBtn.textContent = 'ارسال نظر و پیشنهاد'; submitBtn.style.background = ''; }, 3000);
    } catch {
        submitBtn.textContent = 'خطا! دوباره تلاش کن';
        submitBtn.style.background = '#ef4444';
        setTimeout(() => { submitBtn.disabled = false; submitBtn.textContent = 'ارسال نظر و پیشنهاد'; submitBtn.style.background = ''; }, 3000);
    }
}

// Tweakpane controls (quiet: no console noise)
function setupTweakpaneControls() {
    if (!window.Tweakpane) return; // دیگر هیچ لاگی نشان نمی‌دهد
    const PARAMS = { name_scale: 1.5, typing_blur: 8, typing_brightness: 0.9 };
    const pane = new Tweakpane.Pane({ title: 'تنظیمات انیمیشن', expanded: true });
    pane.addBinding(PARAMS, 'name_scale', { min:1, max:5, step:0.1, label:'بزرگی انیمیشن نام' })
        .on('change', (ev) => d.documentElement.style.setProperty('--name-dissolve-scale', ev.value));
    pane.addBinding(PARAMS, 'typing_blur', { min:0, max:20, step:1, label:'تاری حروف' })
        .on('change', (ev) => d.documentElement.style.setProperty('--typing-start-blur', `${ev.value}px`));
    pane.addBinding(PARAMS, 'typing_brightness', { min:0, max:1, step:0.05, label:'روشنایی حروف' })
        .on('change', (ev) => d.documentElement.style.setProperty('--typing-glow-color-1', `rgba(255,255,255,${ev.value})`));
}

// 313 Revelation Experience
document.addEventListener('DOMContentLoaded', () => {
    $('#ai-demo')?.classList.add('hidden');
    setupTweakpaneControls();

    const revelationForm = $('#revelationForm');
    const revelationContent = $('#revelationContent');
    const revelationResult = $('#revelationResult');
    const revelationSection = $('#revelation-313');

    const formSubtext = $('#formSubtext');
    if (formSubtext) setTimeout(() => { typeTextSlowly(formSubtext, 'زندگی روزمره امام زمانی رو تجربه کن!'); }, 1500);

    if (revelationForm) {
        revelationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userName = $('#userName313').value.trim();
            if (!userName) return;
            document.body.classList.add('revelation-active');
            revelationContent.style.opacity = '0';
            revelationContent.style.transform = 'translateY(-50px)';
            setTimeout(async () => {
                revelationContent.style.display = 'none';
                revelationResult.style.display = 'flex';
                await animateNameToParticles(userName);
                try {
                    const mysticalContent = await generateMysticalContent(userName);
                    await revealMysticalMessage(mysticalContent);
                } catch (error) {
                    console.error('Error generating mystical content:', error);
                    await revealMysticalMessage({ main_text: 'تعداد اسم ها زیاد بود خسته شدم', button_text: 'لطفا بعدا امتحان کن' });
                }
            }, 1000);
        });
    }

    if (revelationSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                revelationSection.classList.toggle('scrolling-past', !entry.isIntersecting && entry.boundingClientRect.bottom < 0);
            });
        }, { threshold: 0 });
        observer.observe(revelationSection);
    }

    // Initialize daily activities
    initDailyActivities();

    // نمایش فوری همه کامپوننت‌ها
    const allReveals = document.querySelectorAll('.scroll-reveal');
    allReveals.forEach(reveal => reveal.classList.add('revealed'));
    
    // اجرای مجدد برای اطمینان
    handleScrollReveal();
    setTimeout(handleScrollReveal, 100);
    
    const onScroll = () => { handleScrollReveal(); handleParallax(); };
    window.addEventListener('scroll', onScroll, { passive: true });

    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = d.querySelector(anchor.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
});

// ===== Voting System =====
const API_BASE = location.origin;
const API_VOTE = `${API_BASE}/api/vote`;
const API_OPTIONS = `${API_BASE}/api/options`;
const API_CONFIG = `${API_BASE}/api/config`;

window.APP = { allowAddOptions: true };

function uid() {
  let id = localStorage.getItem('userId');
  if (!id) { id = 'u_' + Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem('userId', id); }
  return id;
}
const faNum = s => String(s).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
const fromFaNum = s => Number(String(s).replace(/[۰-۹]/g, ch => {
  const idx = '۰۱۲۳۴۵۶۷۸۹'.indexOf(ch); return idx >= 0 ? String(idx) : ch;
}));

const VOTE_KEY = 'vote.selectedKey';
const getSelectedKey = () => localStorage.getItem(VOTE_KEY);
const setSelectedKey = k => localStorage.setItem(VOTE_KEY, k);

// Robust GET/POST (handles non-JSON error pages)
async function GET(url){
  const r = await fetch(url, { method:'GET' });
  const ct = r.headers.get('content-type') || '';
  const data = ct.includes('application/json') ? await r.json() : { html: await r.text() };
  if (!r.ok) throw new Error(data.message || data.error || `GET ${url} failed`);
  return data;
}
async function POST(url, body){
  const r = await fetch(url, { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(body) });
  const ct = r.headers.get('content-type') || '';
  const data = ct.includes('application/json') ? await r.json() : { success:false, html: await r.text() };
  if (!r.ok || data.success === false) throw new Error(data.message || data.error || `POST ${url} failed`);
  return data;
}

async function loadOptionsAndCounts(){
  const [{ options }, { counts }] = await Promise.all([ GET(API_OPTIONS), GET(API_VOTE) ]);
  return { options: options || [], counts: counts || {} };
}

function render({options, counts, error}){
  const voteListEl = d.getElementById('voteList');
  if(!voteListEl) return;
  voteListEl.innerHTML = '';

  if (error) {
    const errorDiv = d.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
      <div style="text-align:center;padding:2rem;color:#ff6b6b;background:rgba(255,107,107,.1);border-radius:12px;border:1px solid rgba(255,107,107,.3);">
        <h3 style="margin-bottom:1rem;font-size:1.2rem;">⚠️ خطا در اتصال به سرور</h3>
        <p style="margin-bottom:.5rem;font-size:.9rem;">نمی‌توانیم گزینه‌ها را از دیتابیس لود کنیم</p>
        <p style="font-size:.8rem;opacity:.8;">${error.message || 'API در دسترس نیست'}</p>
        <button onclick="location.reload()" style="margin-top:1rem;padding:.5rem 1rem;background:rgba(255,107,107,.2);border:1px solid rgba(255,107,107,.4);border-radius:8px;color:#ff6b6b;cursor:pointer;">تلاش مجدد</button>
      </div>
    `;
    voteListEl.appendChild(errorDiv);
    return;
  }

  options.forEach(o=>{
    const btn = d.createElement('button');
    btn.className = 'vote-item';
    btn.dataset.key = o.option;
    btn.innerHTML = `
      <div><div class="item-title">${o.option}</div><div class="item-subtitle">${o.description||''}</div></div>
      <span class="item-meta">
        <span class="count-badge" data-count>${faNum(counts[o.option]||0)}</span>
        <span class="icon-outline" aria-hidden>
          <svg width="20" height="20" viewBox="0 0 24 24"><path d="M12.1 8.64l-.1.1-.1-.1C10.14 6.82 7.1 7.5 6.5 9.88c-.38 1.53.44 3.07 1.69 4.32C9.68 15.7 12 17 12 17s2.32-1.3 3.81-2.8c1.25-1.25 2.07-2.79 1.69-4.32-.6-2.38-3.64-3.06-5.4-1.24z" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linejoin="round"/></svg>
        </span>
      </span>`;
    voteListEl.appendChild(btn);
  });

  if (window.APP.allowAddOptions) {
    const add = d.createElement('button');
    add.id='openAddOption'; add.className='vote-item add-new';
    add.innerHTML = `<div><div class="item-title">گزینه پیشنهادی جدید</div><div class="item-subtitle">نام و تگ‌لاین خودت رو ثبت کن</div></div>`;
    voteListEl.appendChild(add);
  }

  const sel = getSelectedKey();
  if (sel) {
    const btn = voteListEl.querySelector(`.vote-item[data-key="${CSS.escape(sel)}"]`);
    if (btn) btn.classList.add('selected');
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

function bindHandlers(){
  const voteListEl = d.getElementById('voteList');

  // Vote
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

  // Add option
  voteListEl.addEventListener('click', async (e)=>{
    const add = e.target.closest('#openAddOption');
    if(!add) return;

    // نمایش مودال
    const modal = d.getElementById('addOptionModal');
    if (modal) {
      modal.style.display = 'block';
      modal.setAttribute('aria-hidden', 'false');
      
      // بستن مودال با کلیک روی backdrop
      const backdrop = modal.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.addEventListener('click', () => {
          modal.style.display = 'none';
          modal.setAttribute('aria-hidden', 'true');
        });
      }
      
      // بستن مودال با کلیک روی دکمه انصراف
      const cancelBtn = modal.querySelector('[data-close]');
      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          modal.style.display = 'none';
          modal.setAttribute('aria-hidden', 'true');
        });
      }
      
      // ارسال فرم
      const submitBtn = modal.querySelector('#submitNewOption');
      if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
          const nameEl = d.querySelector('#platformName');
          const tagEl = d.querySelector('#platformTagline');
          const name = nameEl?.value?.trim();
          const description = tagEl?.value?.trim();
          
          if (!name) {
            alert('لطفاً نام پلتفرم را وارد کنید');
            return;
          }
          
          // اطلاعات شخصی از مودال
          const proposer = {
            full_name: d.querySelector('#submitterName')?.value || '',
            phone: d.querySelector('#submitterPhone')?.value || '',
            national_id: d.querySelector('#submitterNationalId')?.value || ''
          };

          try {
            const res = await POST(`${location.origin}/api/propose`, {
              name,
              description,
              full_name: proposer.full_name,
              phone: proposer.phone,
              national_id: proposer.national_id
            });
            
            if (res && res.success === false && res.code === 'disabled') { 
              alert('فعلاً افزودن گزینه جدید غیرفعال است.'); 
              return; 
            }

            // بستن مودال
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
            
            // پاک کردن فیلدها
            if (nameEl) nameEl.value = '';
            if (tagEl) tagEl.value = '';
            d.querySelector('#submitterName').value = '';
            d.querySelector('#submitterPhone').value = '';
            d.querySelector('#submitterNationalId').value = '';

            const data = await loadOptionsAndCounts();
            render(data);

            const nowBtn = d.getElementById('voteList').querySelector(`.vote-item[data-key="${CSS.escape(name)}"]`);
            if (nowBtn) nowBtn.classList.add('selected');

            try {
              await POST(API_VOTE, { userId: uid(), option: name });
              const { counts } = await GET(API_VOTE);
              liveUpdateCounts(counts);
            } catch (e) { console.warn('Auto-vote failed:', e); }
            
            alert('پیشنهاد شما با موفقیت ثبت شد!');
          } catch (error) {
            console.warn('Add option API error:', error);
            alert('ثبت گزینه جدید با مشکل مواجه شد.');
          }
        });
      }
    } else {
      // اگر مودال موجود نیست، از prompt استفاده کن
      const name = prompt('نام گزینه؟') || '';
      if (!name) return;
      const description = prompt('تگ‌لاین (اختیاری)') || '';
      
      try {
        const res = await POST(`${location.origin}/api/propose`, {
          name,
          description,
          full_name: '',
          phone: '',
          national_id: ''
        });
        
        if (res && res.success === false && res.code === 'disabled') { 
          alert('فعلاً افزودن گزینه جدید غیرفعال است.'); 
          return; 
        }

        const data = await loadOptionsAndCounts();
        render(data);

        const nowBtn = d.getElementById('voteList').querySelector(`.vote-item[data-key="${CSS.escape(name)}"]`);
        if (nowBtn) nowBtn.classList.add('selected');

        try {
          await POST(API_VOTE, { userId: uid(), option: name });
          const { counts } = await GET(API_VOTE);
          liveUpdateCounts(counts);
        } catch (e) { console.warn('Auto-vote failed:', e); }
      } catch (error) {
        console.warn('Add option API error:', error);
        alert('ثبت گزینه جدید با مشکل مواجه شد.');
      }
    }
  });
}

// Initialize voting system when DOM is ready
document.addEventListener('DOMContentLoaded', async function initVoting(){
  try {
    try {
      const cfg = await GET(API_CONFIG);
      if (cfg && typeof cfg.allowAddOptions === 'boolean') window.APP.allowAddOptions = cfg.allowAddOptions;
    } catch {}
    const data = await loadOptionsAndCounts();
    render(data);
    bindHandlers();
  } catch (err){
    console.error('vote init error', err);
    render({ error: err });
  }
});

// ===== Daily Activities Interactive Section =====
const activityMessages = {
  studying: "درس خوندنت رو بهانه‌ای کن برای یادگیری بیشتر درباره امام زمان. هر صفحه‌ای که می‌خونی، یه قدم نزدیک‌تر به شناخت امامت می‌ری رفیق.",
  family: "وقت گذروندن با خانواده‌ات رو بهانه‌ای کن برای یادآوری ارزش خانواده امام زمان. اون هم خانواده‌ای داره که منتظرشن.",
  waiting: "ایستادن توی صف رو بهانه‌ای کن برای صبر امام زمانی. امام زمان هم سال‌هاست که منتظر ظهورشه، تو هم صبر کن.",
  boredom: "بی‌حوصلگی‌ات رو بهونه‌ای کن برای یک سلام کوتاه به امام. گاهی قوت در همین سلام‌های خسته است رفیق.",
  work: "کار کردنت رو بهانه‌ای کن برای خدمت به جامعه امام زمانی. هر کاری که می‌کنی، برای آماده کردن دنیا برای ظهور باشه.",
  exercise: "ورزش کردنت رو بهانه‌ای کن برای قوی شدن جسم و روح. امام زمان به یاران قوی و آماده نیاز داره."
};

function initDailyActivities() {
  const activityOptions = document.querySelectorAll('.activity-option');
  const chatResponse = document.getElementById('chatResponse');
  const chatMessage = document.getElementById('chatMessage');
  const actionButtonContainer = document.getElementById('actionButtonContainer');
  
  let isTyping = false; // Flag to prevent multiple selections during typing
  
  activityOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Prevent clicking if typing is in progress
      if (isTyping) return;
      
      // Remove previous selection
      activityOptions.forEach(opt => opt.classList.remove('selected'));
      
      // Add selection to clicked option
      option.classList.add('selected');
      
      const activity = option.dataset.activity;
      const message = activityMessages[activity];
      
      // Set typing flag to true
      isTyping = true;
      
      // Disable all activity options during typing
      activityOptions.forEach(opt => {
        opt.style.pointerEvents = 'none';
        opt.style.opacity = '0.5';
        opt.classList.add('disabled');
      });
      
      // Show chat response with delay
      setTimeout(() => {
        chatResponse.style.display = 'flex';
        chatResponse.classList.add('visible');
        
        // Type the message slowly
        typeMessageSlowly(chatMessage, message).then(() => {
          // Re-enable activity options after typing is complete
          isTyping = false;
          activityOptions.forEach(opt => {
            opt.style.pointerEvents = 'auto';
            opt.style.opacity = '1';
            opt.classList.remove('disabled');
          });
          
          // Show action button after typing is complete
          setTimeout(() => {
            actionButtonContainer.style.display = 'flex';
            actionButtonContainer.classList.add('visible');
          }, 500); // Small delay after typing completes
        });
        
        // Remove the old setTimeout for action button
        
      }, 500);
    });
  });
}

async function typeMessageSlowly(element, text) {
  return new Promise(async (resolve) => {
    element.innerHTML = '';
    const wrapper = document.createElement('span');
    element.appendChild(wrapper);
    
    for (let i = 0; i < text.length; i++) {
      const typedText = text.substring(0, i);
      const nextChar = text.charAt(i);
      wrapper.innerHTML = `<span class="typed-chars">${typedText}</span><span class="next-char">${nextChar}</span>`;
      const nextCharSpan = wrapper.querySelector('.next-char');
      if (nextCharSpan) { 
        void nextCharSpan.offsetWidth; 
        nextCharSpan.classList.add('visible'); 
      }
      let typingSpeed = 40 + Math.random() * 20;
      if (['،', '؟', '.', '!'].includes(nextChar)) typingSpeed += 300;
      await new Promise(resolve => setTimeout(resolve, typingSpeed));
    }
    element.textContent = text;
    resolve(); // Resolve the promise when typing is complete
  });
}

// ====== Effects / AI (unchanged logic) ======
async function animateNameToParticles(userName) {
    nameParticles.textContent = userName;
    nameParticles.style.opacity = '1';
    nameParticles.style.transform = 'translate(-50%, -50%) scale(1)';
    setTimeout(() => { nameParticles.classList.add('dissolving'); }, 1000);
    setTimeout(() => {
        createNameParticles(userName.length * 5);
        nameParticles.style.display = 'none';
        const galaxySpiral = d.querySelector('.galaxy-spiral');
        if (galaxySpiral) {
            galaxySpiral.style.setProperty('--r', `${Math.random() * 360}deg`);
            galaxySpiral.classList.add('glow');
            setTimeout(() => { galaxySpiral.classList.remove('glow'); }, 1500);
        }
    }, 2000);
}
function createNameParticles(count) {
    const container = d.getElementById('revelationResult');
    for (let i = 0; i < count; i++) {
        const particle = d.createElement('div');
        particle.className = 'particle';
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 200;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        particle.style.left = `50%`;
        particle.style.top = `50%`;
        particle.style.setProperty('--x', `${x}px`);
        particle.style.setProperty('--y', `${y}px`);
        container.appendChild(particle);
        setTimeout(() => { particle.remove(); }, 3000);
    }
}

async function generateMysticalContent(userName) {
    const API_KEYS = [
        'AIzaSyC-QxOrjb9L_XS9a47لینک-کلید-اول',
        'AIzaSyDNYmQr_OnNMInzS69لینک-کلید-دوم',
        'AIzaSyBwgJ0edSD5DWFZoDaلینک-کلید-سوم',
        'AIzaSyC4uWHQuMWkyuLbgzrلینک-کلید-چهارم'
    ];
    const MODEL_NAME = "gemini-2.0-flash";
    const prompt = /* همان متن طولانی فعلی شما */ ``;

    const requestBody = { contents:[{ parts:[{ text: prompt }]}], generationConfig:{ responseMimeType:"application/json" } };
    for (const key of API_KEYS) {
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${key}`;
        try {
            const response = await fetch(API_URL, { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(requestBody) });
            if (!response.ok) { const t = await response.text(); console.error('API Error:', response.status, t); if (response.status>=400 && response.status<500) continue; continue; }
            const data = await response.json();
            if (data.candidates && data.candidates[0]?.content?.parts?.length) {
                const jsonText = data.candidates[0].content.parts[0].text;
                return JSON.parse(jsonText);
            } else { throw new Error("Invalid response structure from Gemini API"); }
        } catch (error) { console.error('Fetch failed:', error); }
    }
    throw new Error("All Gemini API keys failed.");
}

async function revealMysticalMessage(content) {
    setTimeout(async () => {
        const mysticalBubble = d.getElementById('mysticalBubble');
        const mysticalMessage = d.getElementById('mysticalMessage');
        const finalCta = d.getElementById('finalCta');
        const finalCtaSubtext = d.getElementById('finalCtaSubtext');

        mysticalBubble.classList.add('visible'); mysticalBubble.classList.add('glass-ui');
        mysticalMessage.innerHTML = '<span class="typing-indicator"><span></span><span></span><span></span></span>';
        await new Promise(resolve => setTimeout(resolve, 800));
        document.body.classList.remove('revelation-active');
        mysticalMessage.innerHTML = '';
        await typeTextSlowly(mysticalMessage, content.main_text);
        setTimeout(async () => {
            finalCta.classList.add('visible');
            await typeTextSlowly(finalCta, content.button_text);
            setTimeout(() => { finalCta.classList.add('start-border-animation'); }, 1000);
            if (finalCtaSubtext) {
                await new Promise(resolve => setTimeout(resolve, 300));
                finalCtaSubtext.style.opacity = '1';
                await typeTextSlowly(finalCtaSubtext, 'زندگی روزمره امام زمانی رو تجربه کن!');
            }
            finalCta.onclick = () => {
                const nextSection = d.getElementById('feedback');
                if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth' });
            };
        }, 500);
    }, 1000);
}

async function typeTextSlowly(element, text) {
    element.innerHTML = '';
    const wrapper = d.createElement('span');
    element.appendChild(wrapper);
    for (let i = 0; i < text.length; i++) {
        const typedText = text.substring(0, i);
        const nextChar = text.charAt(i);
        wrapper.innerHTML = `<span class="typed-chars">${typedText}</span><span class="next-char">${nextChar}</span>`;
        const nextCharSpan = wrapper.querySelector('.next-char');
        if (nextCharSpan) { void nextCharSpan.offsetWidth; nextCharSpan.classList.add('visible'); }
        let typingSpeed = 40 + Math.random() * 20;
        if (['،', '؟', '.'].includes(nextChar)) typingSpeed += 300;
        await new Promise(resolve => setTimeout(resolve, typingSpeed));
    }
    element.textContent = text;
}

// Floating particles
function createFloatingParticle() {
    const particle = d.createElement('div');
    particle.style.cssText = `position:fixed;width:4px;height:4px;background:radial-gradient(circle,#fbbf24 0%,#00d4aa 50%,transparent 100%);border-radius:50%;pointer-events:none;z-index:5;left:${Math.random()*100}vw;top:100vh;animation:floatUp 8s linear forwards;box-shadow:0 0 5px #fbbf24,0 0 10px #00d4aa;`;
    d.body.appendChild(particle);
    setTimeout(() => particle.remove(), 8000);
}
setInterval(createFloatingParticle, 3000);
