/**
 * navbar.js — Shared navigation logic for all MyRoommate public pages.
 * Injects the real logo, handles hamburger menu, and smart profile redirect.
 */
(function () {
    // ── Replace text logos with image logo (text version only) ───────────
    document.querySelectorAll('.logo').forEach(el => {
        el.innerHTML = `<a href="/" style="display:inline-flex;align-items:center;text-decoration:none;">
            <img src="/images/logo-with-text.png" alt="MyRoommate Nashik" style="height:40px;width:auto;object-fit:contain;">
        </a>`;
        el.style.cursor = 'default';
    });

    // ── Update nav links to real filtered pages ──────────────────────────
    document.querySelectorAll('.nav-links').forEach(nav => {
        const links = nav.querySelectorAll('a');
        const map = {
            'pg': '/listings.html?type=pg',
            'hostels': '/listings.html?type=hostel',
            'bachelors flats': '/listings.html?type=flat',
            'premium': '/listings.html?isPremium=true',
            'premium stays': '/listings.html?isPremium=true',
        };
        links.forEach(a => {
            const text = a.textContent.trim().toLowerCase();
            if (map[text]) a.href = map[text];
        });

        // Highlight active nav link
        const currentSearch = window.location.search;
        links.forEach(a => {
            const hrefSearch = (a.getAttribute('href') || '').split('?')[1] || '';
            if (hrefSearch && currentSearch.includes(hrefSearch.split('=')[0]) && currentSearch.includes(hrefSearch.split('=')[1])) {
                a.classList.add('active');
            }
        });
    });

    // ── Profile icon click → smart redirect ─────────────────────────────
    document.addEventListener('click', (e) => {
        if (e.target.classList?.contains('fa-user-circle') || e.target.closest?.('.fa-user-circle')) {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    window.location.href = payload.role === 'admin' ? '/admin.html' : '/dashboard.html';
                } catch {
                    window.location.href = '/login.html';
                }
            } else {
                window.location.href = '/login.html';
            }
        }
    });

    // ── Hamburger menu toggle ────────────────────────────────────────────
    document.addEventListener('click', (e) => {
        const menuIcon = e.target.classList?.contains('fa-bars') ? e.target : e.target.closest('[title="Menu"]');
        if (!menuIcon) return;

        const nav = document.querySelector('.nav-links');
        if (!nav) return;

        const isOpen = nav.classList.toggle('mobile-open');
        if (isOpen) {
            // Force all links in menu to be dark/readable
            nav.querySelectorAll('a').forEach(a => {
                a.style.color = '#1a1a1a';
                a.style.fontSize = '1.05rem';
                a.style.fontWeight = '600';
                a.style.padding = '8px 0';
                a.style.borderBottom = '1px solid #f0f0f0';
                a.style.display = 'block';
            });
            Object.assign(nav.style, {
                display: 'flex',
                flexDirection: 'column',
                position: 'absolute',
                top: '70px',
                left: '0',
                width: '100%',
                background: '#ffffff',
                padding: '12px 28px 20px',
                borderBottom: '2px solid #FCB426',
                zIndex: '9999',
                gap: '4px',
                boxShadow: '0 12px 30px rgba(0,0,0,0.12)'
            });
        } else {
            nav.querySelectorAll('a').forEach(a => {
                a.style.color = '';
                a.style.fontSize = '';
                a.style.fontWeight = '';
                a.style.padding = '';
                a.style.borderBottom = '';
                a.style.display = '';
            });
            Object.assign(nav.style, {
                display: '', position: '', flexDirection: '', top: '',
                left: '', width: '', background: '', padding: '',
                borderBottom: '', zIndex: '', gap: '', boxShadow: ''
            });
        }
    });

    // ── Close menu on outside click ──────────────────────────────────────
    document.addEventListener('click', (e) => {
        const nav = document.querySelector('.nav-links');
        if (!nav?.classList.contains('mobile-open')) return;
        const header = document.querySelector('header');
        if (header && !header.contains(e.target)) {
            nav.classList.remove('mobile-open');
            nav.querySelectorAll('a').forEach(a => {
                a.style.color = '';
                a.style.fontSize = '';
                a.style.fontWeight = '';
                a.style.padding = '';
                a.style.borderBottom = '';
                a.style.display = '';
            });
            Object.assign(nav.style, {
                display: '', position: '', flexDirection: '', top: '',
                left: '', width: '', background: '', padding: '',
                borderBottom: '', zIndex: '', gap: '', boxShadow: ''
            });
        }
    });
})();

