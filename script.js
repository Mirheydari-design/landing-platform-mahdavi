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
        
        if (elementTop < windowHeight - elementVisible) {
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

// Luminous scrollbar handler
// (AI demo typing removed – section is deleted)

// (generatePersonalizedMessage removed – section is deleted)

// (Removed word-based typing; unified on char-based typeTextSlowly)

// Inject animations (sparkle + floatUp) once
(() => {
    const styleEl = d.createElement('style');
    styleEl.textContent = `
@keyframes sparkle { 0%,100%{transform:scale(1)} 50%{transform:scale(1.02);box-shadow:0 0 20px rgba(255,255,255,0.3)} }
@keyframes floatUp { 0%{transform:translateY(0) rotate(0deg);opacity:0} 10%,90%{opacity:1} 100%{transform:translateY(-100vh) rotate(360deg);opacity:0} }
`;
    d.head.appendChild(styleEl);
})();

// Vote functionality
function vote(button) {
    // Remove voted class from all buttons
    document.querySelectorAll('.vote-btn').forEach(btn => {
        btn.classList.remove('voted');
    });
    
    // Add voted class to clicked button
    button.classList.add('voted');
    
    // Add some feedback
    button.style.transform = 'scale(1.3)';
    setTimeout(() => {
        button.style.transform = 'scale(1.2)';
    }, 150);
}

// Submit feedback
async function submitFeedback() {
    const nameInput = document.querySelector('input[placeholder="{اسم پیشنهادی}"]');
    const taglineInput = document.querySelector('input[placeholder="{معرفی در چند کلمه}"]');
    const feedbackTextarea = document.querySelector('textarea');
    const submitBtn = document.querySelector('.submit-btn');
    
    // Get form values
    const name = nameInput.value.trim();
    const tagline = taglineInput.value.trim();
    const feedback = feedbackTextarea.value.trim();
    
    // Basic validation
    if (!name || !tagline || !feedback) {
        alert('لطفاً همه فیلدها رو پر کن');
        return;
    }
    
    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.textContent = 'در حال ارسال...';
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success message
        submitBtn.textContent = 'ارسال شد! ممنون از نظرت 🙏';
        submitBtn.style.background = '#10b981';
        
        // Clear form
        nameInput.value = '';
        taglineInput.value = '';
        feedbackTextarea.value = '';
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'ارسال نظر و پیشنهاد';
            submitBtn.style.background = '';
        }, 3000);
        
    } catch (error) {
        // Show error message
        submitBtn.textContent = 'خطا! دوباره تلاش کن';
        submitBtn.style.background = '#ef4444';
        
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'ارسال نظر و پیشنهاد';
            submitBtn.style.background = '';
        }, 3000);
    }
}

// Function to set up Tweakpane controls
function setupTweakpaneControls() {
    // Check if Tweakpane is loaded
    if (typeof Tweakpane === 'undefined') {
        console.warn('Tweakpane library not found.');
        return;
    }

    const PARAMS = {
        name_scale: 1.5,
        typing_blur: 8,
        typing_brightness: 0.9,
    };

    const pane = new Tweakpane.Pane({
        title: 'تنظیمات انیمیشن',
        expanded: true,
    });

    pane.addBinding(PARAMS, 'name_scale', {
        min: 1,
        max: 5,
        step: 0.1,
        label: 'بزرگی انیمیشن نام',
    }).on('change', (ev) => {
        document.documentElement.style.setProperty('--name-dissolve-scale', ev.value);
    });

    pane.addBinding(PARAMS, 'typing_blur', {
        min: 0,
        max: 20,
        step: 1,
        label: 'تاری حروف',
    }).on('change', (ev) => {
        document.documentElement.style.setProperty('--typing-start-blur', `${ev.value}px`);
    });

    pane.addBinding(PARAMS, 'typing_brightness', {
        min: 0,
        max: 1,
        step: 0.05,
        label: 'روشنایی حروف',
    }).on('change', (ev) => {
        document.documentElement.style.setProperty('--typing-glow-color-1', `rgba(255, 255, 255, ${ev.value})`);
    });
}

// 313 Revelation Experience
document.addEventListener('DOMContentLoaded', () => {
    $('#ai-demo')?.classList.add('hidden');

    // Initialize Tweakpane
    setupTweakpaneControls();

    const revelationForm = $('#revelationForm');
    const revelationContent = $('#revelationContent');
    const revelationResult = $('#revelationResult');
    const revelationSection = $('#revelation-313');

    // Type subtext under the form
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

    // Scroll-out animation for revelation section
    if (revelationSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                revelationSection.classList.toggle('scrolling-past', !entry.isIntersecting && entry.boundingClientRect.bottom < 0);
            });
        }, { threshold: 0 });
        observer.observe(revelationSection);
    }

    // Initial scroll reveal check and listeners
    handleScrollReveal();
    const onScroll = () => { handleScrollReveal(); handleParallax(); };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Smooth scrolling for anchor links
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = d.querySelector(anchor.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
});

// ===== Voting System (مستقل از DOMContentLoaded) =====
const API_BASE = location.origin;
const API_VOTE = `${API_BASE}/api/vote`;
const API_OPTIONS = `${API_BASE}/api/options`;

function uid() {
  let id = localStorage.getItem('userId');
  if (!id) { id = 'u_' + Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem('userId', id); }
  return id;
}
const faNum = s => String(s).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
// Convert Persian numerals back to a normal number
const fromFaNum = s => {
  return Number(String(s).replace(/[۰-۹]/g, ch => {
    const idx = '۰۱۲۳۴۵۶۷۸۹'.indexOf(ch);
    return idx >= 0 ? String(idx) : ch;
  }));
};
const VOTE_KEY = 'vote.selectedKey';
const getSelectedKey = () => localStorage.getItem(VOTE_KEY);
const setSelectedKey = k => localStorage.setItem(VOTE_KEY, k);

async function GET(url){ const r=await fetch(url); return r.json(); }
async function POST(url,body){ const r=await fetch(url,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}); return r.json(); }

async function loadOptionsAndCounts(){
  try {
    const [{ options }, { counts }] = await Promise.all([ GET(API_OPTIONS), GET(API_VOTE) ]);
    // Ensure at least empty defaults to avoid undefined errors
    return { options: options || [], counts: counts || {} };
  } catch (error) {
    console.warn('API not available, using fallback data:', error);
    // Fallback data when API is not available
    const fallbackOptions = [
      { option: 'نور هدایت', description: 'راهی روشن برای دل‌ها' },
      { option: 'راه انتظار', description: 'صبر فعال برای فردای بهتر' },
      { option: 'همراه مهدی', description: 'گامی کنار یاران خوبی' },
      { option: 'نسیم ظهور', description: 'طراوت امید در زندگی' }
    ];
    const fallbackCounts = {};
    fallbackOptions.forEach(opt => fallbackCounts[opt.option] = 0);
    return { options: fallbackOptions, counts: fallbackCounts };
  }
}

function render({options, counts}){
  const voteListEl = document.getElementById('voteList');
  if(!voteListEl) return;
  voteListEl.innerHTML = '';
  options.forEach(o=>{
    const btn = document.createElement('button');
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
  // دکمه افزودن گزینه جدید
  const add = document.createElement('button');
  add.id='openAddOption'; add.className='vote-item add-new';
  add.innerHTML = `<div><div class="item-title">گزینه پیشنهادی جدید</div><div class="item-subtitle">نام و تگ‌لاین خودت رو ثبت کن</div></div>`;
  voteListEl.appendChild(add);

  // انتخاب قبلی
  const sel = getSelectedKey();
  if (sel) {
    const btn = voteListEl.querySelector(`.vote-item[data-key="${CSS.escape(sel)}"]`);
    if (btn) btn.classList.add('selected');
  }
}

function liveUpdateCounts(counts){
  const voteListEl = document.getElementById('voteList');
  voteListEl.querySelectorAll('.vote-item[data-key]').forEach(btn=>{
    const key = btn.dataset.key;
    const el = btn.querySelector('[data-count]');
    if(el) el.textContent = faNum(counts[key]||0);
  });
}

function bindHandlers(){
  const voteListEl = document.getElementById('voteList');
  voteListEl.addEventListener('click', async (e)=>{
    const btn = e.target.closest('.vote-item[data-key]');
    if(!btn) return;
    const key = btn.dataset.key;
    
    try {
      // رأی
      await POST(API_VOTE, { userId: uid(), option: key });
      setSelectedKey(key);
      voteListEl.querySelectorAll('.vote-item').forEach(b=>b.classList.remove('selected'));
      btn.classList.add('selected');
      const {counts} = await GET(API_VOTE);
      liveUpdateCounts(counts);
    } catch (error) {
      console.warn('Vote API not available, using local storage:', error);
      // Fallback: just update UI locally
      const previousKey = getSelectedKey();
      
      // If changing vote, decrement previous count
      if (previousKey && previousKey !== key) {
        const prevBtn = voteListEl.querySelector(`.vote-item[data-key="${CSS.escape(previousKey)}"]`);
        if (prevBtn) {
          const prevBadge = prevBtn.querySelector('[data-count]');
          if (prevBadge) {
            const prevNumber = fromFaNum(prevBadge.textContent) || 0;
            const newPrevNumber = Math.max(0, prevNumber - 1);
            prevBadge.textContent = faNum(newPrevNumber);
          }
        }
      }
      
      // Only increment if this is a new vote (not changing from same option)
      if (previousKey !== key) {
        const badge = btn.querySelector('[data-count]');
        if (badge) {
          const currentNumber = fromFaNum(badge.textContent) || 0;
          const newNumber = currentNumber + 1;
          badge.textContent = faNum(newNumber);
        }
      }
      
      setSelectedKey(key);
      voteListEl.querySelectorAll('.vote-item').forEach(b=>b.classList.remove('selected'));
      btn.classList.add('selected');
    }
  });

  // Handle opening modal for new option
  voteListEl.addEventListener('click', async (e)=>{
    const add = e.target.closest('#openAddOption');
    if(!add) return;
    
    // Open the modal
    const modal = document.getElementById('addOptionModal');
    if (modal) {
      modal.style.display = 'block';
      modal.setAttribute('aria-hidden', 'false');
      const platformNameInput = document.getElementById('platformName');
      if (platformNameInput) platformNameInput.focus();
    }
  });

  // Handle modal submission
  const submitNewOption = document.getElementById('submitNewOption');
  if (submitNewOption) {
    submitNewOption.addEventListener('click', async () => {
      const platformNameInput = document.getElementById('platformName');
      const platformTaglineInput = document.getElementById('platformTagline');
      const submitterNameInput = document.getElementById('submitterName');
      const submitterPhoneInput = document.getElementById('submitterPhone');
      const submitterNationalIdInput = document.getElementById('submitterNationalId');
      
      if (!platformNameInput || !platformTaglineInput || !submitterNameInput || !submitterPhoneInput || !submitterNationalIdInput) return;
      
      const platformName = platformNameInput.value.trim();
      const platformTagline = platformTaglineInput.value.trim();
      const submitterName = submitterNameInput.value.trim();
      const submitterPhone = submitterPhoneInput.value.trim();
      const submitterNationalId = submitterNationalIdInput.value.trim();
      
      // Validation
      if (!platformName) {
        platformNameInput.focus();
        alert('لطفاً نام پلتفرم پیشنهادی را وارد کنید');
        return;
      }
      if (!submitterName) {
        submitterNameInput.focus();
        alert('لطفاً نام و نام خانوادگی را وارد کنید');
        return;
      }
      if (!submitterPhone) {
        submitterPhoneInput.focus();
        alert('لطفاً شماره تماس را وارد کنید');
        return;
      }
      if (!submitterNationalId) {
        submitterNationalIdInput.focus();
        alert('لطفاً کد ملی را وارد کنید');
        return;
      }
      
      // Basic phone validation (Iranian format)
      if (!/^09\d{9}$/.test(submitterPhone)) {
        submitterPhoneInput.focus();
        alert('شماره تماس باید با 09 شروع شود و 11 رقم باشد');
        return;
      }
      
      // Basic national ID validation (10 digits)
      if (!/^\d{10}$/.test(submitterNationalId)) {
        submitterNationalIdInput.focus();
        alert('کد ملی باید 10 رقم باشد');
        return;
      }
      
      try {
        await POST(API_OPTIONS, { 
          name: platformName, 
          description: platformTagline, 
          submitterName,
          phone: submitterPhone, 
          nationalId: submitterNationalId 
        });
        const data = await loadOptionsAndCounts();
        render(data);
        
        // Close modal and clear inputs
        const modal = document.getElementById('addOptionModal');
        if (modal) {
          modal.style.display = 'none';
          modal.setAttribute('aria-hidden', 'true');
        }
        platformNameInput.value = '';
        platformTaglineInput.value = '';
        submitterNameInput.value = '';
        submitterPhoneInput.value = '';
        submitterNationalIdInput.value = '';
        
        alert('پیشنهاد شما با موفقیت ارسال شد! ممنون از مشارکت شما 🙏');
      } catch (error) {
        console.warn('Add option API not available, adding locally:', error);
        
        // Fallback: Add option locally
        const voteListEl = document.getElementById('voteList');
        if (voteListEl) {
          // Create new option button
          const newBtn = document.createElement('button');
          newBtn.className = 'vote-item';
          newBtn.dataset.key = platformName;
          newBtn.innerHTML = `
            <div><div class="item-title">${platformName}</div><div class="item-subtitle">${platformTagline || ''}</div></div>
            <span class="item-meta">
              <span class="count-badge" data-count>۰</span>
              <span class="icon-outline" aria-hidden>
                <svg width="20" height="20" viewBox="0 0 24 24"><path d="M12.1 8.64l-.1.1-.1-.1C10.14 6.82 7.1 7.5 6.5 9.88c-.38 1.53.44 3.07 1.69 4.32C9.68 15.7 12 17 12 17s2.32-1.3 3.81-2.8c1.25-1.25 2.07-2.79 1.69-4.32-.6-2.38-3.64-3.06-5.4-1.24z" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linejoin="round"/></svg>
              </span>
            </span>`;
          
          // Insert before the "add new" button to keep it at the end
          const addNewBtn = voteListEl.querySelector('#openAddOption');
          if (addNewBtn) {
            voteListEl.insertBefore(newBtn, addNewBtn);
          } else {
            voteListEl.appendChild(newBtn);
          }
        }
        
        // Close modal and clear inputs
        const modal = document.getElementById('addOptionModal');
        if (modal) {
          modal.style.display = 'none';
          modal.setAttribute('aria-hidden', 'true');
        }
        platformNameInput.value = '';
        platformTaglineInput.value = '';
        submitterNameInput.value = '';
        submitterPhoneInput.value = '';
        submitterNationalIdInput.value = '';
        
        alert('پیشنهاد شما با موفقیت اضافه شد! ممنون از مشارکت شما 🙏');
      }
    });
  }

  // Handle modal close
  const modal = document.getElementById('addOptionModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target.hasAttribute('data-close')) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        const platformNameInput = document.getElementById('platformName');
        const platformTaglineInput = document.getElementById('platformTagline');
        const submitterNameInput = document.getElementById('submitterName');
        const submitterPhoneInput = document.getElementById('submitterPhone');
        const submitterNationalIdInput = document.getElementById('submitterNationalId');
        if (platformNameInput) platformNameInput.value = '';
        if (platformTaglineInput) platformTaglineInput.value = '';
        if (submitterNameInput) submitterNameInput.value = '';
        if (submitterPhoneInput) submitterPhoneInput.value = '';
        if (submitterNationalIdInput) submitterNationalIdInput.value = '';
      }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        const platformNameInput = document.getElementById('platformName');
        const platformTaglineInput = document.getElementById('platformTagline');
        const submitterNameInput = document.getElementById('submitterName');
        const submitterPhoneInput = document.getElementById('submitterPhone');
        const submitterNationalIdInput = document.getElementById('submitterNationalId');
        if (platformNameInput) platformNameInput.value = '';
        if (platformTaglineInput) platformTaglineInput.value = '';
        if (submitterNameInput) submitterNameInput.value = '';
        if (submitterPhoneInput) submitterPhoneInput.value = '';
        if (submitterNationalIdInput) submitterNationalIdInput.value = '';
      }
    });
  }
}

// Initialize voting system when DOM is ready
document.addEventListener('DOMContentLoaded', async function initVoting(){
  try {
    const data = await loadOptionsAndCounts();
    render(data);
    bindHandlers();
  } catch (err){ console.error('vote init error', err); }
});

async function animateNameToParticles(userName) {
    nameParticles.textContent = userName;
    nameParticles.style.opacity = '1';
    nameParticles.style.transform = 'translate(-50%, -50%) scale(1)';

    // Animate name dissolving
    setTimeout(() => {
        nameParticles.classList.add('dissolving');
    }, 1000);

    // Create particle explosion
    setTimeout(() => {
        createNameParticles(userName.length * 5); // More particles
        nameParticles.style.display = 'none';
        
        // Galaxy glow effect
        const galaxySpiral = document.querySelector('.galaxy-spiral');
        if (galaxySpiral) {
            galaxySpiral.style.setProperty('--r', `${Math.random() * 360}deg`);
            galaxySpiral.classList.add('glow');
            setTimeout(() => {
                galaxySpiral.classList.remove('glow');
            }, 1500);
        }
    }, 2000);
}

function createNameParticles(count) {
    const container = document.getElementById('revelationResult');
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
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
        
        setTimeout(() => {
            particle.remove();
        }, 3000);
    }
}

async function generateMysticalContent(userName) {
    const API_KEYS = [
        'AIzaSyC-QxOrjb9L_XS9a47l6H3eHiAAJ6Xus2c',
        'AIzaSyDNYmQr_OnNMInzS69vKOxtBtPd_CxFYdM',
        'AIzaSyBwgJ0edSD5DWFZoDa9xyLifTH_gUNoHxs',
        'AIzaSyC4uWHQuMWkyuLbgzrepmvbu9-olNVCiVI'
    ];
    const MODEL_NAME = "gemini-2.0-flash"; // Using a known valid model
    
    const prompt = `تو یک نویسنده مسلمان هستی که درباره معنی اسم کوچک کاربر مینویسی.
    هشدار: اگر اسم کاربر نام غیر انسان (مثل اسم حیوانات مانند گرگ، جیرجیرک ها، درخت پیر و ...) یا غیرطبیعی (مثل اسم اشیاء مانند قایق، سیب زمینی، دمپایی، کی بورد و ...) یا هر گونه نام غیر متعارف بود و به هر نحوی قصد شوخی داشت، حتما "is_human": false شود و هشدار بده که اسم کوچک واقعی خودش را بنویسد. اما اگر اسم طبیعی انسان بود (مثل علی، آرمان، پارمیدا و ...) پس:
"is_human": true

    تحلیل نام کن و نام ${userName} عزیز را تحلیل کرده و یک استعداد یا ویژگی کلیدی و مثبت (مانند عدالت، شجاعت، خلوص نیت، صبر، مهربانی و...) که با معنا و طنین آن نام گره خورده است را شناسایی کنید.
    
 لحن صمیمی احساسی جوانانه و در شان امام زمان بنویسید.
 به کاربر یک بینش شاعرانه بده.
 تولید متن اصلی: یک پاراگراف کوتاه و یکپارچه بنویسید. این متن باید بدون هیچ عنوانی، مستقیماً با صمیمیت زیاد با معنی و مفهوم نام ${userName} شروع شده، ویژگی شناسایی‌شده را به عنوان یک موهبت بزرگ معرفی کند و بلافاصله آن را با یک سوال عمیق و چالشی مرتبط با دغدغه‌های یاران خاص امام (عج) روبرو سازد.

تولید متن دکمه وسوسه‌انگیز برای دکمه: یک متن کوتاه برای دکمه تولید کنید که به زندگی روزمره و زندگی یاران امام اشاره کند و پلی بین آن استعداد بزرگ و کارهای عادی روزانه بزند.
متن دکمه از زبان خود کاربر باشد. برای متن دکمه از مثالها الهام بگیر.

مثال:
مثال برای نام طبیعی انسان "علی"

{
  "is_human": true
  "main_text": "علی جان، اسم تو حس قدرت و عدالت رو زنده می‌کنه؛ این خفن‌ترین امانتیه که داری. اما جرئتشو داری که قبل از اینکه بخوای دنیا رو تغییر بدی، تیز‌ترین قضاوت‌هات رو اول برای کارای خودت داشته باشی، نه دیگران؟ یاران امام اول از همه با خودشون رو راستن.",
  "button_text": "نشونم بده چطور مثل یاران امام، عدالت رو از خودم شروع کنم"
}
مثال برای نام طبیعی انسان "نرگس"

{
  "is_human": true

  "main_text": "نرگس عزیز، اسم تو آدم رو یاد صبر و بی‌ادعا بودن میندازه. شاید میخوای بی‌سروصدا تاثیر خودت رو بذاری. اما می‌تونی تو این دنیایی که همه دنبال لایک و دیده شدنن، بدون اینکه تو چشم باشی، کارت رو برای امام زمان به بهترین شکل ممکن انجام بدی؟",
  "button_text": "می‌خوام مثل یاران امام، توی زندگی بی ادعا باشم"
}
مثال برای نام غیرطبیعی "جیرجیرک پیر"

{
  "is_human": false
  "main_text": "هشدار! باید نام واقعی خودت رو مینوشتی!⚠️",
  "button_text": " صفحه رو دوباره بارگذاری کن یا ادامه بده"

قوانین و فرمت خروجی:
هر اسمی که نام اصلی اسم کوچک کاربر نباشد باید هشدار داده شود.
خروجی: پاسخ شما باید فقط و فقط یک آبجکت JSON معتبر باشد که در یک بلاک کد JSON قرار گرفته است. این آبجکت باید دارای دو کلید باشد: main_text برای متن اصلی و button_text برای متن دکمه.

فقط JSON با کلیدهای main_text و button_text برگردانید.`;

    const requestBody = {
        "contents": [{
            "parts": [{ "text": prompt }]
        }],
        "generationConfig": {
            "responseMimeType": "application/json",
        }
    };

    for (const key of API_KEYS) {
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${key}`;
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                console.error(`API Error with key ${key.substring(0, 8)}...:`, response.status, errorBody);
                // If it's a client error (like invalid API key), try the next one.
                if (response.status >= 400 && response.status < 500) {
                    continue; 
                }
                // For server errors, we might want to stop or handle differently, but for now we'll just try the next key.
                continue;
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates.length > 0 && data.candidates[0].content.parts.length > 0) {
                const jsonText = data.candidates[0].content.parts[0].text;
                return JSON.parse(jsonText);
            } else {
                 throw new Error("Invalid response structure from Gemini API");
            }

        } catch (error) {
            console.error(`Fetch failed for key ${key.substring(0, 8)}...:`, error);
            // The loop will automatically continue to the next key.
        }
    }

    // If all keys fail, throw an error to be caught by the calling function.
    throw new Error("All Gemini API keys failed.");
}

async function revealMysticalMessage(content) {
    // Start loading earlier - right after particles start
    setTimeout(async () => {
        const mysticalBubble = document.getElementById('mysticalBubble');
        const mysticalMessage = document.getElementById('mysticalMessage');
        const finalCta = document.getElementById('finalCta');
        const finalCtaSubtext = document.getElementById('finalCtaSubtext');

        // Show loading dots immediately
        mysticalBubble.classList.add('visible');
        mysticalBubble.classList.add('glass-ui');
        
        // Show loading indicator
        mysticalMessage.innerHTML = '<span class="typing-indicator"><span></span><span></span><span></span></span>';
        
        // Wait for content to be ready (reduced from 1500ms)
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Re-enable scrolling before typing starts
        document.body.classList.remove('revelation-active');
        
        // Clear loading and start typing the actual message
        mysticalMessage.innerHTML = '';
        
        await typeTextSlowly(mysticalMessage, content.main_text);
        
        // Show final CTA button
        setTimeout(async () => {
            finalCta.classList.add('visible');
            await typeTextSlowly(finalCta, content.button_text);

            setTimeout(() => {
                finalCta.classList.add('start-border-animation');
            }, 1000);

            // Type the subtext under the button
            if (finalCtaSubtext) {
                await new Promise(resolve => setTimeout(resolve, 300));
                finalCtaSubtext.style.opacity = '1';
                await typeTextSlowly(finalCtaSubtext, 'زندگی روزمره امام زمانی رو تجربه کن!');
            }
        
            // Add click handler to final button
            finalCta.onclick = () => {
                // Redirect to main platform or next section
                const nextSection = document.getElementById('feedback');
                if (nextSection) {
                    nextSection.scrollIntoView({ behavior: 'smooth' });
                }
            };
        }, 500); // Reduced delay for a snappier feel
    }, 1000); // Much earlier start - right when particles begin
}

async function typeTextSlowly(element, text) {
    element.innerHTML = '';
    
    // Create a wrapper to ensure consistent layout
    const wrapper = document.createElement('span');
    element.appendChild(wrapper);

    for (let i = 0; i < text.length; i++) {
        // Build the string up to the current character for correct script rendering
        const typedText = text.substring(0, i);
        const nextChar = text.charAt(i);

        // Use spans to isolate the last character for animation
        wrapper.innerHTML = `
            <span class="typed-chars">${typedText}</span><span class="next-char">${nextChar}</span>
        `;
        
        const nextCharSpan = wrapper.querySelector('.next-char');
        if (nextCharSpan) {
            // Force a reflow to apply the initial animation state
            void nextCharSpan.offsetWidth;
            // Add the 'visible' class to trigger the animation
            nextCharSpan.classList.add('visible');
        }
        
        // Vary typing speed for a more natural effect
        let typingSpeed = 40 + Math.random() * 20;
        if (['،', '؟', '.'].includes(nextChar)) {
            typingSpeed += 300;
        }
        
        await new Promise(resolve => setTimeout(resolve, typingSpeed));
    }

    // After typing, set the final text content for stability and semantics
    element.textContent = text;
}

// (Merged into single DOMContentLoaded above)

// Add some interactive particles effect
function createFloatingParticle() {
    const particle = d.createElement('div');
    particle.style.cssText = `position:fixed;width:4px;height:4px;background:radial-gradient(circle,#fbbf24 0%,#00d4aa 50%,transparent 100%);border-radius:50%;pointer-events:none;z-index:5;left:${Math.random()*100}vw;top:100vh;animation:floatUp 8s linear forwards;box-shadow:0 0 5px #fbbf24,0 0 10px #00d4aa;`;
    d.body.appendChild(particle);
    setTimeout(() => particle.remove(), 8000);
}

// Add floating particles periodically
setInterval(createFloatingParticle, 3000);

// (floatUp keyframes moved into single injected style above)