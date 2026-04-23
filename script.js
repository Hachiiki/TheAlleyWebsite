// Feature Icons
function buildIcons() {
    const defs = {
        'icon-survival': ['#6b4423', '#4a9e4a', '#7a7a7a', '#6b4423'],
        'icon-rpg': ['#9b6ecc', '#c4b5fd', '#7c3aed', '#a78bfa'],
        'icon-lore': ['#2a5e2a', '#4a9e4a', '#3a7a3a', '#2a5e2a'],
        'icon-events': ['#c4b5fd', '#7c3aed', '#5b21b6', '#c4b5fd'],
    };
    Object.entries(defs).forEach(([id, cols]) => {
        const el = document.getElementById(id);
        if (!el) return;
        cols.forEach(c => {
            const d = document.createElement('div');
            d.style.cssText = `background:${c};box-shadow:0 0 10px ${c}99;border-radius:2px;`;
            el.appendChild(d);
        });
    });
}

// Scroll reveal effect
function initReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                if (!e.target.classList.contains('visible')) {
                    e.target.classList.add('visible');
                }
            }
        });
    }, { threshold: 0.14 });

    revealEls.forEach(el => io.observe(el));

    const fadeSections = document.querySelectorAll('.section-fade');
    const fadeIO = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                if (!e.target.classList.contains('visible')) {
                    e.target.classList.add('visible');
                }
            }
        });
    }, { threshold: 0.1 });

    fadeSections.forEach(el => fadeIO.observe(el));
}

// Image tilt (at the about section)
function initImageTilt() {
    const frame = document.querySelector('.image-frame');
    if (!frame) return;

    frame.addEventListener('mousemove', (e) => {
        const rect = frame.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        const rotateX = (mouseY / rect.height) * 15;
        const rotateY = (mouseX / rect.width) * -15;

        frame.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    frame.addEventListener('mouseleave', () => {
        frame.style.transform = 'rotateX(0) rotateY(0) scale(1)';
    });
}

// scroll to the top button
function initScrollTop() {
    const btn = document.getElementById('scrollTopBtn');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });
}

// int and pre loader
window.addEventListener('load', () => {
    initScrollTop();
    // Artificial delay to let the advanced loading animation play out
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('loaded');
            setTimeout(() => preloader.remove(), 800);
        }

        buildIcons();
        initReveal();
        initImageTilt();
    }, 1200);
});

// click to copy function
function copyIP(ipText, element) {
    navigator.clipboard.writeText(ipText).then(() => {
        element.classList.add('copied');

        // Find the hint text (supports both old and new layouts)
        const actionText = element.querySelector('.strip-hint') || element.querySelector('.row-action');
        const originalText = actionText ? actionText.innerText : '';
        if (actionText) actionText.innerText = "IP Copied!";

        setTimeout(() => {
            element.classList.remove('copied');
            if (actionText) actionText.innerText = originalText;
        }, 2500);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}
