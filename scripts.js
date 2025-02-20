// ==================================================
// Global Utilities and UI Helpers
// ==================================================

/**
 * Remove a query from search history and update the UI.
 */
function removeFromHistory(query) {
    let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    history = history.filter(item => item !== query);
    localStorage.setItem('searchHistory', JSON.stringify(history));

    const searchHistory = document.querySelector('.history-items');
    if (searchHistory) {
        searchHistory.innerHTML = history
            .map(
                item => `
          <div class="history-item">
            <span><i class="fas fa-history"></i> ${item}</span>
            <button class="icon-button" onclick="removeFromHistory('${item}')">
              <i class="fas fa-times"></i>
            </button>
          </div>
        `
            )
            .join('');
    }
}

/**
 * UI helper object.
 */
export const ui = {
    showToast: (message, type = 'info', duration = 3000) => {
        // Remove existing toasts of the same type
        document.querySelectorAll(`.toast.toast-${type}`).forEach(toast => {
            toast.remove();
        });

        const toast = Object.assign(document.createElement('div'), {
            className: `toast toast-${type}`,
            innerHTML: `
          <div class="toast-content">
            <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle"></i>
            <span>${message}</span>
          </div>
        `
        });

        // Position the toast based on existing ones
        const existingToasts = document.querySelectorAll('.toast');
        const offset = existingToasts.length * 60; // 60px spacing
        toast.style.bottom = `${20 + offset}px`;

        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));

        // Remove toast after duration
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
                document.querySelectorAll('.toast').forEach((t, index) => {
                    t.style.bottom = `${20 + index * 60}px`;
                });
            }, 300);
        }, duration);
    },

    addLoading: element => {
        element.disabled = true;
        const originalHTML = element.innerHTML;
        element.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        return () => {
            element.disabled = false;
            element.innerHTML = originalHTML;
        };
    }
};

/**
 * Update user interface based on authentication state.
 */
function updateUserInterface(user) {
    const userMenu = document.querySelector('.user-menu');
    if (user) {
        userMenu.querySelector('.username').textContent = user.username;
        userMenu.classList.add('logged-in');
    } else {
        userMenu.querySelector('.username').textContent = 'Guest';
        userMenu.classList.remove('logged-in');
    }
}

// ==================================================
// Core Initialization and Event Listeners
// ==================================================

/**
 * Initialize app state and basic UI elements.
 */
function initApp() {
    const app = {
        state: {
            isDark: localStorage.getItem('dark-mode') === 'true',
            user: localStorage.getItem('user')
                ? JSON.parse(localStorage.getItem('user'))
                : null
        },
        elements: {
            nav: document.querySelector('.top-nav'),
            themeToggle: document.getElementById('theme-toggle'),
            searchInput: document.getElementById('search-input'),
            userMenu: document.querySelector('.user-menu')
        }
    };

    // Initialize theme based on saved preference
    if (app.state.isDark) {
        document.body.classList.add('dark-mode');
        app.elements.themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    }

    // Initialize user interface
    updateUserInterface(app.state.user);

    return app;
}

/**
 * Set up primary event listeners.
 */
function setupEventListeners() {
    handleNavScroll();
    setupThemeToggle();
    setupSearch();
    setupParallaxEffects();
    setupHeaderInteractions();
    setupHeroAnimations();
    setupFeaturedPosts();
    setupLatestArticles();
}

// ==================================================
// Navigation and Theme Handlers
// ==================================================

/**
 * Handle navigation bar visibility on scroll.
 */
function handleNavScroll() {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const nav = document.querySelector('.top-nav');

        nav.style.transform =
            currentScroll > lastScroll && currentScroll > 100 ? 'translateY(-100%)' : 'translateY(0)';
        nav.classList.toggle('nav-scrolled', currentScroll > 100);
        lastScroll = currentScroll;
    });
}

/**
 * Setup dark/light theme toggle.
 */
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');

    if (localStorage.getItem('dark-mode') === 'true') {
        document.body.classList.add('dark-mode');
        icon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('dark-mode', isDark);

        icon.classList.toggle('fa-moon', !isDark);
        icon.classList.toggle('fa-sun', isDark);
    });
}

// ==================================================
// Search and Suggestions
// ==================================================

/**
 * Setup search functionality with suggestions and history.
 */
function setupSearch() {
    const searchModal = document.querySelector('.search-modal');
    const searchInput = document.getElementById('search-modal-input');
    const searchResults = document.querySelector('.search-results');
    const filtersToggle = document.getElementById('search-filters-toggle');
    const filtersPanel = document.querySelector('.search-filters-panel');
    const searchHistory = document.querySelector('.history-items');

    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');

    function updateHistory(query) {
        if (!query) return;
        const newHistory = [query, ...history.filter(h => h !== query)].slice(0, 5);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
        renderHistory(newHistory);
    }

    function renderHistory(items) {
        searchHistory.innerHTML = items
            .map(
                item => `
          <div class="history-item">
            <span><i class="fas fa-history"></i> ${item}</span>
            <button class="icon-button" onclick="removeFromHistory('${item}')">
              <i class="fas fa-times"></i>
            </button>
          </div>
        `
            )
            .join('');
    }

    function showSuggestions(query) {
        if (!query) {
            searchResults.innerHTML = '';
            return;
        }
        const suggestions = generateSuggestions(query);
        searchResults.innerHTML = suggestions
            .map(
                suggestion => `
          <div class="search-suggestion" role="button" tabindex="0">
            <div class="suggestion-icon">
              <i class="fas ${suggestion.icon}"></i>
            </div>
            <div class="suggestion-content">
              <div class="suggestion-title">${suggestion.title}</div>
              <div class="suggestion-subtitle">${suggestion.subtitle}</div>
            </div>
          </div>
        `
            )
            .join('');
    }

    if (filtersToggle) {
        filtersToggle.addEventListener('click', () => {
            filtersPanel.hidden = !filtersPanel.hidden;
            filtersToggle.setAttribute('aria-expanded', !filtersPanel.hidden);
        });
    }

    let debounceTimer;
    if (searchInput) {
        searchInput.addEventListener('input', e => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                showSuggestions(e.target.value);
            }, 300);
        });

        searchInput.addEventListener('keydown', e => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const firstSuggestion = searchResults.querySelector('.search-suggestion');
                firstSuggestion?.focus();
            }
        });
    }

    renderHistory(history);
}

/**
 * Generate simulated search suggestions.
 */
function generateSuggestions(query) {
    return [
        {
            icon: 'fa-newspaper',
            title: `Articles matching "${query}"`,
            subtitle: 'Search in all articles'
        },
        {
            icon: 'fa-users',
            title: `Authors matching "${query}"`,
            subtitle: 'Search for content creators'
        },
        {
            icon: 'fa-tags',
            title: `Topics matching "${query}"`,
            subtitle: 'Browse related topics'
        }
    ];
}

// ==================================================
// Image Loading and Parallax Effects
// ==================================================

/**
 * Fallback images for different content types.
 */
export const fallbackImages = {
    technology: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
    design: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',
    ai: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
    mobile: 'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg',
    developer: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg',
    workspace: 'https://images.pexels.com/photos/7974/pexels-photo.jpg',
    portrait: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
};

/**
 * Setup parallax scrolling effects.
 */
function setupParallaxEffects() {
    const parallaxSections = document.querySelectorAll('.parallax');
    window.addEventListener('scroll', () => {
        parallaxSections.forEach(section => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            section.style.backgroundPosition = `center ${rate}px`;
        });
    });
}

// ==================================================
// Header and Navigation Interactions
// ==================================================

/**
 * Setup header interactions including mobile menu, search shortcut, and user menu.
 */
function setupHeaderInteractions() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-button');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn?.addEventListener('click', () => {
        navLinks.classList.toggle('show');
        document.body.classList.toggle('menu-open');
    });

    setupSearchShortcut();
    setupUserMenu();
    setupActiveLinks();
}

/**
 * Setup search shortcut functionality.
 */
function setupSearchShortcut() {
    const searchBtn = document.querySelector('.search-toggle');
    const searchInput = document.getElementById('search-input');
    const searchModal = document.querySelector('.search-modal');

    searchBtn?.addEventListener('click', () => {
        searchModal?.classList.add('show');
        searchInput?.focus();
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            searchModal?.classList.remove('show');
        }
    });
}

/**
 * Setup user menu and logout functionality.
 */
function setupUserMenu() {
    const userMenu = document.querySelector('.user-menu');
    const dropdownMenu = userMenu?.querySelector('.dropdown-menu');

    document.addEventListener('click', e => {
        if (!userMenu?.contains(e.target)) {
            dropdownMenu?.classList.remove('show');
        }
    });

    const logoutBtn = document.querySelector('.logout-link');
    logoutBtn?.addEventListener('click', e => {
        e.preventDefault();
        handleLogout();
    });
}

/**
 * Handle user logout.
 */
function handleLogout() {
    localStorage.removeItem('user');
    updateUserInterface(null);
    ui.showToast('Logged out successfully', 'success');
    window.location.hash = '#home';
}

/**
 * Setup active navigation link highlighting.
 */
function setupActiveLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.hash || '#home';

    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === currentPath);
    });

    window.addEventListener('hashchange', () => {
        const currentHash = window.location.hash || '#home';
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === currentHash);
        });
    });
}

// ==================================================
// Animations and Featured Posts
// ==================================================

/**
 * Setup hero animations for stat numbers.
 */
function setupHeroAnimations() {
    const statsNumbers = document.querySelectorAll('.stat-number[data-count]');

    const animateValue = (element, start, end, duration) => {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const updateNumber = () => {
            current += increment;
            if (current >= end) {
                element.textContent = end >= 1000 ? `${(end / 1000).toFixed(0)}k+` : end;
                return;
            }
            element.textContent =
                Math.floor(current) >= 1000
                    ? `${(Math.floor(current) / 1000).toFixed(0)}k+`
                    : Math.floor(current);
            requestAnimationFrame(updateNumber);
        };

        updateNumber();
    };

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const endValue = parseInt(target.getAttribute('data-count'), 10);
                    animateValue(target, 0, endValue, 2000);
                    observer.unobserve(target);
                }
            });
        },
        { threshold: 0.5 }
    );

    statsNumbers.forEach(stat => observer.observe(stat));
}

/**
 * Setup featured posts filtering and lazy load images.
 */
function setupFeaturedPosts() {
    const categoryPills = document.querySelectorAll('.category-pill');
    const posts = document.querySelectorAll('.post-card:not(.featured-post)');

    categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const category = pill.textContent.trim().toLowerCase();
            categoryPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            posts.forEach(post => {
                const postCategory = post.querySelector('.post-category').textContent.trim().toLowerCase();
                const shouldShow = category === 'all topics' || postCategory === category;

                post.style.opacity = '0';
                post.style.transform = 'scale(0.95)';

                setTimeout(() => {
                    post.style.display = shouldShow ? 'block' : 'none';
                    if (shouldShow) {
                        setTimeout(() => {
                            post.style.opacity = '1';
                            post.style.transform = 'scale(1)';
                            // Trigger image loading for newly visible posts
                            ImageLoader.getInstance().observe();
                        }, 50);
                    }
                }, 300);
            });
        });
    });
}

/**
 * Setup view switching for latest articles.
 */
function setupLatestArticles() {
    const viewButtons = document.querySelectorAll('.view-switcher button');
    const blogGrid = document.querySelector('.blog-grid');

    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const view = button.dataset.view;

            viewButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            blogGrid.className = `blog-grid ${view}-view`;

            const articles = blogGrid.querySelectorAll('.article-card');
            articles.forEach((article, index) => {
                article.style.opacity = '0';
                article.style.transform = 'scale(0.95)';

                setTimeout(() => {
                    article.style.opacity = '1';
                    article.style.transform = 'scale(1)';
                }, 50 * index);
            });
        });
    });
}

// ==================================================
// Enhanced Features
// ==================================================

/**
 * Setup enhanced search functionality.
 */
function setupEnhancedSearch() {
    const searchInput = document.getElementById('search-modal-input');
    const searchModal = document.querySelector('.search-modal');
    const searchResults = document.querySelector('.search-results');

    document.addEventListener('keydown', e => {
        if (e.key === '/' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            searchModal.classList.add('show');
            searchInput?.focus();
        }
        if (e.key === 'Escape') {
            searchModal.classList.remove('show');
        }
    });

    let searchTimeout;
    searchInput?.addEventListener('input', e => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = e.target.value.trim();
            if (query.length >= 2) {
                performSearch(query);
            } else {
                searchResults.innerHTML = '';
            }
        }, 300);
    });
}

// ==================================================
// Additional Features (Second Code Snippet)
// ==================================================

/**
 * Simulated search operation for results.
 */
function performSearch(query) {
    const searchResults = document.querySelector('.search-results');
    const results = [
        {
            type: 'article',
            title: `Matching article for "${query}"`,
            excerpt: 'Article excerpt...',
            author: 'John Doe',
            date: '2 days ago'
        },
        {
            type: 'user',
            name: `User matching "${query}"`,
            role: 'Content Creator'
        }
    ];

    searchResults.innerHTML = results
        .map(
            result => `
        <div class="search-result-item">
          <div class="result-icon">
            <i class="fas fa-${result.type === 'article' ? 'newspaper' : 'user'}"></i>
          </div>
          <div class="result-content">
            <h4>${result.type === 'article' ? result.title : result.name}</h4>
            <p>${result.type === 'article' ? result.excerpt : result.role}</p>
          </div>
        </div>
      `
        )
        .join('');
}

/**
 * Enhance category filtering for blog posts.
 */
function setupCategoryFilter() {
    const categoryPills = document.querySelectorAll('.category-pill');
    const posts = document.querySelectorAll('.post-card');

    categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const category = pill.textContent.trim().toLowerCase();

            categoryPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            posts.forEach(post => {
                const postCategory = post.querySelector('.post-category')?.textContent.trim().toLowerCase();

                post.style.opacity = '0';
                post.style.transform = 'translateY(20px)';

                setTimeout(() => {
                    const shouldShow = category === 'all topics' || postCategory === category;
                    post.style.display = shouldShow ? 'block' : 'none';

                    if (shouldShow) {
                        setTimeout(() => {
                            post.style.opacity = '1';
                            post.style.transform = 'translateY(0)';
                        }, 50);
                    }
                }, 300);
            });
        });
    });
}

/**
 * Animate stats counters.
 */
function animateStats() {
    const stats = document.querySelectorAll('.stat-value[data-count]');

    stats.forEach(stat => {
        const target = parseInt(stat.dataset.count, 10);
        const duration = 2000;
        const startTime = performance.now();
        const startValue = 0;

        function updateCount(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentValue = Math.floor(startValue + (target - startValue) * progress);
            stat.textContent = `${currentValue}k+`;

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            }
        }

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    requestAnimationFrame(updateCount);
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(stat);
    });
}

// ==================================================
// Main Initialization
// ==================================================

// Import modules
import { setupAuth } from './js/auth.js';
import { setupBlogFeatures } from './js/blog.js';
import { BlogManager, Editor } from './js/create.js';
import { ImageLoader } from './js/utils/ImageLoader.js';

// Add this new function:
export function setupImageLoading(options = {}) {
    const imageLoader = ImageLoader.getInstance(options);
    imageLoader.observe();
    return imageLoader;
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize core features
    initApp();
    setupEventListeners();
    setupAuth();

    // Initialize blog features with single image loader instance
    const imageLoader = setupImageLoading({
        selectors: [
            '.article-img',
            '.author-avatar',
            '#cover-preview',
            'img[data-src]',
            '.post-card-image img'
        ]
    });

    const blogManager = new BlogManager();
    const editor = new Editor(blogManager);
    editor.init();

    setupBlogFeatures();
    setupEnhancedSearch();
    setupCategoryFilter();
    animateStats();
});
