// ===== PROGRESS BAR =====
window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
});

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) { navbar.classList.add('opacity-100'); }
    else { navbar.classList.remove('opacity-100'); }
});

// ===== MOBILE MENU =====
function toggleMobileMenu() {
    const overlay = document.getElementById('mobileMenuOverlay');
    const menu = document.getElementById('mobileMenu');
    const bg = document.getElementById('mobileMenuBg');
    const hamburger = document.getElementById('hamburger');
    const isActive = menu.classList.contains('active');

    if (isActive) {
        menu.classList.remove('active');
        bg.classList.remove('opacity-100');
        hamburger.classList.remove('active');
        setTimeout(() => { overlay.classList.add('hidden'); }, 300);
        document.body.style.overflow = '';
    } else {
        overlay.classList.remove('hidden');
        void overlay.offsetWidth;
        menu.classList.add('active');
        bg.classList.add('opacity-100');
        hamburger.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// ===== SCROLL REVEAL =====
// Untuk elemen dengan class .reveal-animated (yang butuh animasi)
const animatedObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

// Observasi elemen dengan class .reveal-animated, .reveal-fade-left, .title-fade-left
document.querySelectorAll('.reveal-animated, .reveal-fade-left, .title-fade-left').forEach(el => {
    animatedObserver.observe(el);
});

// Untuk .reveal (card) - langsung terlihat, tidak perlu observer
// Tapi kita tetap tambahkan efek hover dll dari CSS
// ===== MODAL =====
function openModal(id) {
    document.getElementById(id).classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeModal(id) {
    document.getElementById(id).classList.remove('active');
    document.body.style.overflow = '';
}
function openContactModal() { openModal('contactModal'); }

// ===== KEYBOARD =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeModal('contactModal'); }
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        // Skip empty hash or just '#'
        if (!href || href === '#' || href.length < 2) return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
});

// ===== TOUCH SWIPE =====
let touchStartX = 0;
let touchEndX = 0;
const brosurScroll = document.querySelector('.snap-x');
if (brosurScroll) {
    brosurScroll.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, {passive: true});
    brosurScroll.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) { /* swiped left */ }
        if (touchEndX - touchStartX > 50) { /* swiped right */ }
    }, {passive: true});
}

// ===== PONDOK READ MORE =====
function togglePondokReadMore(contentId, extraId, btn) {
    const content = document.getElementById(contentId);
    const extra = document.getElementById(extraId);
    const span = btn.querySelector('span');
    const wrap = content.closest('.pondok-read-more-wrap');
    const fade = wrap ? wrap.querySelector('.pondok-read-more-fade') : null;

    if (content.classList.contains('expanded')) {
        content.classList.remove('expanded');
        btn.classList.remove('expanded');
        span.textContent = 'Baca Selengkapnya';
        if (extra) {
            extra.classList.remove('show');
            setTimeout(() => { extra.style.display = 'none'; }, 400);
        }
        if (fade) fade.style.opacity = '1';
        setTimeout(() => {
            btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    } else {
        content.classList.add('expanded');
        btn.classList.add('expanded');
        span.textContent = 'Sembunyikan';
        if (extra) {
            extra.style.display = 'block';
            void extra.offsetWidth;
            extra.classList.add('show');
        }
        if (fade) fade.style.opacity = '0';
    }
}

// ===== BACK TO TOP =====
const backToTopBtn = document.getElementById('backToTop');

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});


// ===== IMAGE LOADING HANDLER =====
(function() {
    function handleImageLoad(img) {
        const parent = img.closest('.img-reveal') || img.closest('.brosur-img-wrap') || img.closest('.logo-container');
        if (parent) {
            parent.classList.add('loaded');
            img.classList.add('loaded');
        }
        const spinner = parent ? parent.querySelector('.img-spinner, .logo-spinner') : null;
        if (spinner) {
            // Delay hiding spinner so it overlaps with image fade-in
            setTimeout(function() {
                spinner.style.opacity = '0';
                spinner.style.transform = 'scale(0.5)';
                spinner.style.pointerEvents = 'none';
            }, 250);
        }
    }

    function observeImages() {
        const images = document.querySelectorAll('.lazy-img');
        
        images.forEach(img => {
            if (img.complete && img.naturalWidth > 0) {
                handleImageLoad(img);
                return;
            }
            
            img.addEventListener('load', function() {
                handleImageLoad(this);
            });
            
            img.addEventListener('error', function() {
                const parent = this.closest('.img-reveal') || this.closest('.brosur-img-wrap') || this.closest('.logo-container');
                if (parent) {
                    parent.classList.add('loaded');
                    this.classList.add('loaded');
                }
                const spinner = parent ? parent.querySelector('.img-spinner, .logo-spinner') : null;
                if (spinner) {
                    setTimeout(function() {
                        spinner.style.opacity = '0';
                        spinner.style.transform = 'scale(0.5)';
                        spinner.style.pointerEvents = 'none';
                    }, 250);
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observeImages);
    } else {
        observeImages();
    }

    const logoImg = document.getElementById('navbarLogo');
    if (logoImg) {
        if (logoImg.complete && logoImg.naturalWidth > 0) {
            const container = logoImg.closest('.logo-container');
            if (container) {
                container.classList.add('loaded');
            }
            logoImg.classList.add('loaded');
        } else {
            logoImg.addEventListener('load', function() {
                const container = this.closest('.logo-container');
                if (container) {
                    container.classList.add('loaded');
                }
                this.classList.add('loaded');
                // Delay hiding logo spinner
                const spinner = container ? container.querySelector('.logo-spinner') : null;
                if (spinner) {
                    setTimeout(function() {
                        spinner.style.opacity = '0';
                        spinner.style.transform = 'scale(0.5)';
                        spinner.style.pointerEvents = 'none';
                    }, 250);
                }
            });
        }
    }

    // ===== CARD IMAGE LOADING (like logo) =====
    ['cardImg1', 'cardImg2', 'cardImg3', 'cardImg4'].forEach(id => {
        const img = document.getElementById(id);
        if (img) {
            if (img.complete && img.naturalWidth > 0) {
                const container = img.closest('.img-reveal');
                if (container) container.classList.add('loaded');
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', function() {
                    const container = this.closest('.img-reveal');
                    if (container) container.classList.add('loaded');
                    this.classList.add('loaded');
                    const spinner = container ? container.querySelector('.img-spinner') : null;
                    if (spinner) {
                        setTimeout(function() {
                            spinner.style.opacity = '0';
                            spinner.style.transform = 'scale(0.5)';
                            spinner.style.pointerEvents = 'none';
                        }, 250);
                    }
                });
            }
        }
    });

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        const imgs = node.querySelectorAll ? node.querySelectorAll('.lazy-img') : [];
                        imgs.forEach(img => {
                            if (img.complete && img.naturalWidth > 0) {
                                handleImageLoad(img);
                            } else {
                                img.addEventListener('load', function() {
                                    handleImageLoad(this);
                                });
                            }
                        });
                    }
                });
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();


// ===== BROSUR DOWNLOAD FIX =====
// Fix for base target="_blank" interfering with download attribute
document.querySelectorAll('a[download]').forEach(function(link) {
    link.addEventListener('click', function(e) {
        // Remove target to ensure download works properly
        var originalTarget = this.target;
        this.target = '_self';
        // Restore after click
        setTimeout(function() {
            link.target = originalTarget;
        }, 100);
    });
});

// ===== AUTO UPDATE COPYRIGHT YEAR =====
(function() {
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
})();