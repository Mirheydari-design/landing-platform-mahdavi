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

    // Voting logic
    const initialOptions = [
        { key: 'نور هدایت', tagline: 'راهی روشن برای دل‌ها', votes: 0 },
        { key: 'راه انتظار', tagline: 'صبر فعال برای فردای بهتر', votes: 0 },
        { key: 'همراه مهدی', tagline: 'گامی کنار یاران خوبی', votes: 0 },
        { key: 'نسیم ظهور', tagline: 'طراوت امید در زندگی', votes: 0 },
    ];

    const voteListEl = $('#voteList');
    const STATE = new Map(initialOptions.map(o => [o.key, o.votes]));

    function toPersianDigits(str) {
        const map = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
        return String(str).replace(/\d/g, d => map[Number(d)]);
    }

    function renderVotes() {
        if (!voteListEl) return;
        // Sync counts in DOM
        $$('#voteList .vote-item').forEach(btn => {
            const key = btn.getAttribute('data-key');
            const countEl = btn.querySelector('[data-count]');
            if (countEl && STATE.has(key)) countEl.textContent = toPersianDigits(STATE.get(key));
        });
    }

    // Handle voting
    // One vote per user (switch allowed)
    const VOTE_KEY = 'vote.selectedKey';
    function getSelectedKey() { return localStorage.getItem(VOTE_KEY); }
    function setSelectedKey(k) { localStorage.setItem(VOTE_KEY, k); }

    voteListEl?.addEventListener('click', (e) => {
        const target = e.target.closest('.vote-item');
        if (!target) return;
        const key = target.getAttribute('data-key');
        if (!key) return;
        const prev = getSelectedKey();
        if (prev === key) return; // already voted here
        if (prev && STATE.has(prev)) STATE.set(prev, Math.max(0, (STATE.get(prev) || 1) - 1));
        STATE.set(key, (STATE.get(key) || 0) + 1);
        setSelectedKey(key);
        renderVotes();
        // Micro feedback + ensure selected class toggled only one
        target.style.transform = 'translateY(-3px) scale(1.02)';
        setTimeout(() => { target.style.transform = ''; }, 160);
        $$('#voteList .vote-item').forEach(b => b.classList.remove('selected'));
        target.classList.add('selected');
    });

    // Modal controls
    const modal = $('#addOptionModal');
    const openBtn = $('#openAddOption');
    const submitBtn = $('#submitNewOption');
    const nameInput = $('#newOptionName');
    const taglineInput = $('#newOptionTagline');

    function openModal() {
        if (!modal) return;
        modal.style.display = 'block';
        modal.setAttribute('aria-hidden', 'false');
        nameInput?.focus();
    }
    function closeModal() {
        if (!modal) return;
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        nameInput.value = '';
        taglineInput.value = '';
    }

    openBtn?.addEventListener('click', openModal);
    modal?.addEventListener('click', (e) => {
        if (e.target.hasAttribute('data-close')) closeModal();
    });
    d.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    submitBtn?.addEventListener('click', () => {
        const name = nameInput?.value.trim();
        let tagline = taglineInput?.value.trim();
        if (!name) { nameInput.focus(); return; }
        // Limit tagline to 5 words
        if (tagline) {
            const parts = tagline.split(/\s+/).slice(0, 5);
            tagline = parts.join(' ');
        }
        // Add new option to DOM at end
        if (!STATE.has(name)) STATE.set(name, 0);
        const btn = d.createElement('button');
        btn.className = 'vote-item';
        btn.setAttribute('data-key', name);
        btn.innerHTML = `
            <div>
                <div class="item-title">${name}</div>
                <div class="item-subtitle">${tagline || ''}</div>
            </div>
            <span class="item-meta">
                <span class="count-badge" data-count>۰</span>
                <span class="icon-outline" aria-hidden>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.1 8.64l-.1.1-.1-.1C10.14 6.82 7.1 7.5 6.5 9.88c-.38 1.53.44 3.07 1.69 4.32C9.68 15.7 12 17 12 17s2.32-1.3 3.81-2.8c1.25-1.25 2.07-2.79 1.69-4.32-.6-2.38-3.64-3.06-5.4-1.24z" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linejoin="round"/></svg>
                </span>
            </span>`;
        voteListEl?.appendChild(btn);
        renderVotes();
        closeModal();
    });

    // Initialize counts and selected state
    renderVotes();
    const selected = getSelectedKey();
    if (selected) {
        const selBtn = $(`#voteList .vote-item[data-key="${CSS.escape(selected)}"]`);
        if (selBtn) selBtn.classList.add('selected');
    }
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