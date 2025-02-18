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
const ui = {
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
        const originalText = element.textContent;
        element.textContent = 'Loading...';
        return () => {
            element.disabled = false;
            element.textContent = originalText;
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
    setupImageLoading();
    setupParallaxEffects();
    setupHeaderInteractions();
    setupHeroAnimations();
    setupFeaturedPosts();
    setupLatestArticles();
    setupCreateSection();
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
const fallbackImages = {
    technology: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
    design: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',
    ai: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
    mobile: 'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg',
    developer: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg',
    workspace: 'https://images.pexels.com/photos/7974/pexels-photo.jpg',
    portrait: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
};

/**
 * Setup lazy loading for images.
 */
function setupImageLoading() {
    const images = document.querySelectorAll('.article-img, .post-card-image img, .author-avatar');

    const loadImage = img => {
        const src = img.getAttribute('data-src') || img.src;
        const tempImage = new Image();

        tempImage.onload = () => {
            img.src = src;
            img.classList.add('loaded');
            if (!img.classList.contains('author-avatar')) {
                const imageContainer = img.closest('.article-image, .post-card-image');
                if (imageContainer) {
                    imageContainer.classList.add('loaded');
                }
            }
        };

        tempImage.onerror = () => {
            const type = img.getAttribute('data-type') || 'technology';
            img.src = fallbackImages[type];
            img.classList.add('loaded');
            if (!img.classList.contains('author-avatar')) {
                const imageContainer = img.closest('.article-image, .post-card-image');
                if (imageContainer) {
                    imageContainer.classList.add('loaded');
                }
            }
        };

        tempImage.src = src;
    };

    images.forEach(img => {
        img.removeAttribute('loading');
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            loadImage(entry.target);
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { rootMargin: '50px', threshold: 0.1 }
            );
            observer.observe(img);
        } else {
            loadImage(img);
        }
    });
}

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
                        }, 50);
                    }
                }, 300);
            });
        });
    });

    const lazyImages = document.querySelectorAll('.post-card-image img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
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

/**
 * Setup create section interactivity.
 */
function setupCreateSection() {
    const editor = {
        tabs: document.querySelectorAll('.tab-btn'),
        types: document.querySelectorAll('.type-btn'),
        toolbarButtons: document.querySelectorAll('.editor-toolbar button'),
        floatingTools: document.querySelectorAll('.floating-tools button'),
        tagInput: document.querySelector('.tag-input'),
        tagSuggestions: document.querySelectorAll('.tag-chip'),
        selectedTags: document.querySelector('.selected-tags'),
        publishButton: document.querySelector('.publish-button')
    };

    // Tab switching
    editor.tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            editor.tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // Post type selection
    editor.types.forEach(type => {
        type.addEventListener('click', () => {
            editor.types.forEach(t => t.classList.remove('active'));
            type.classList.add('active');
        });
    });

    // Tag handling
    editor.tagSuggestions.forEach(tag => {
        tag.addEventListener('click', () => {
            const tagText = tag.textContent.trim();
            const tagIcon = tag.querySelector('i').className;

            if (!document.querySelector(`.selected-tag[data-tag="${tagText}"]`)) {
                const tagElement = document.createElement('span');
                tagElement.className = 'tag-chip selected-tag';
                tagElement.dataset.tag = tagText;
                tagElement.innerHTML = `
            <i class="${tagIcon}"></i>
            ${tagText}
            <i class="fas fa-times remove-tag"></i>
          `;
                editor.selectedTags.appendChild(tagElement);

                tagElement.querySelector('.remove-tag').addEventListener('click', () => {
                    tagElement.remove();
                });
            }
        });
    });

    // Keyboard shortcut for publishing (Cmd/Ctrl + Enter)
    document.addEventListener('keydown', e => {
        if (e.metaKey && e.key === 'Enter') {
            editor.publishButton.click();
        }
    });
}

// ==================================================
// Enhanced Features
// ==================================================

/**
 * Setup enhanced lazy loading for images.
 */
function setupEnhancedImageLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;
                    const tempImage = new Image();

                    tempImage.onload = () => {
                        img.src = src;
                        img.classList.add('loaded');
                        const container = img.closest('.post-card-image, .article-image');
                        if (container) {
                            container.classList.add('loaded');
                        }
                    };
                    tempImage.src = src;
                    observer.unobserve(img);
                }
            });
        },
        { rootMargin: '50px 0px', threshold: 0.1 }
    );

    images.forEach(img => imageObserver.observe(img));
}

/**
 * Setup video modal for the About section.
 */
function setupVideoModal() {
    const videoButton = document.querySelector('.outline-button');
    if (!videoButton) return;

    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
      <div class="video-modal-content">
        <button class="close-modal"><i class="fas fa-times"></i></button>
        <div class="video-container">
          <iframe width="560" height="315" src="" frameborder="0" allowfullscreen></iframe>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    videoButton.addEventListener('click', () => {
        modal.classList.add('show');
        const iframe = modal.querySelector('iframe');
        iframe.src = 'https://www.youtube.com/embed/your-video-id';
    });

    modal.addEventListener('click', e => {
        if (e.target === modal || e.target.closest('.close-modal')) {
            modal.classList.remove('show');
            const iframe = modal.querySelector('iframe');
            iframe.src = '';
        }
    });
}

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
 * Setup blog view switching functionality.
 */
function setupBlogViewSwitcher() {
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

/**
 * Setup authentication functionality.
 */
function setupAuth() {
    const mockUsers = JSON.parse(localStorage.getItem('users') || '[]');

    function showModal(modalId) {
        document.getElementById(modalId).classList.add('show');
    }

    function hideModal(modalId) {
        document.getElementById(modalId).classList.remove('show');
    }

    function updateAuthUI(user) {
        const authButtons = document.querySelector('.auth-buttons');
        const userMenu = document.querySelector('.user-menu');

        if (user) {
            authButtons.style.display = 'none';
            userMenu.style.display = 'flex';
            document.querySelector('.username').textContent = user.username;
        } else {
            authButtons.style.display = 'flex';
            userMenu.style.display = 'none';
        }
    }

    function validateForm(form) {
        const password = form.querySelector('input[type="password"]');
        const confirm = form.querySelector('#signup-password-confirm');
        return !confirm || password.value === confirm.value;
    }

    function checkPasswordStrength(password) {
        const minLength = 8;
        const hasNumber = /\d/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        return password.length >= minLength && hasNumber && hasUpperCase && hasLowerCase;
    }

    function safelyGetFromStorage(key, defaultValue = '[]') {
        try {
            return JSON.parse(localStorage.getItem(key) || defaultValue);
        } catch (error) {
            handleError(error, 'storage');
            return JSON.parse(defaultValue);
        }
    }

    function safelySetToStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            handleError(error, 'storage');
            return false;
        }
    }

    // Handle login
    document.getElementById('login-form').addEventListener('submit', e => {
        e.preventDefault();
        try {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const users = safelyGetFromStorage('users');

            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                const { password: _, ...userData } = user;
                if (safelySetToStorage('currentUser', userData)) {
                    updateAuthUI(userData);
                    hideModal('login-modal');
                    ui.showToast('Logged in successfully', 'success');
                    resetForm('login-form');
                    clearFormErrors('login-form');
                }
            } else {
                ui.showToast('Invalid credentials', 'error');
            }
        } catch (error) {
            handleError(error, 'login');
        }
    });

    // Handle signup
    document.getElementById('signup-form').addEventListener('submit', e => {
        e.preventDefault();
        try {
            const username = document.getElementById('signup-username').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            if (!checkPasswordStrength(password)) {
                ui.showToast('Password must be at least 8 characters with numbers and both cases', 'error');
                return;
            }

            const users = safelyGetFromStorage('users');
            if (users.some(u => u.email === email)) {
                ui.showToast('Email already registered', 'error');
                return;
            }

            const newUser = { username, email, password };
            users.push(newUser);

            if (safelySetToStorage('users', users)) {
                const { password: _, ...userData } = newUser;
                if (safelySetToStorage('currentUser', userData)) {
                    updateAuthUI(userData);
                    hideModal('signup-modal');
                    ui.showToast('Account created successfully', 'success');
                    resetForm('signup-form');
                    clearFormErrors('signup-form');
                }
            }
        } catch (error) {
            handleError(error, 'signup');
        }
    });

    // Handle logout
    document.querySelector('.logout-link').addEventListener('click', e => {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        updateAuthUI(null);
        ui.showToast('Logged out successfully', 'success');
    });

    // Check initial auth state
    try {
        const currentUser = safelyGetFromStorage('currentUser', 'null');
        if (currentUser) {
            updateAuthUI(currentUser);
        }
    } catch (error) {
        handleError(error, 'auth-state');
    }

    // Modal triggers
    document.querySelectorAll('[data-modal]').forEach(button => {
        button.addEventListener('click', () => {
            showModal(`${button.dataset.modal}-modal`);
        });
    });

    // Close modal on outside click
    document.querySelectorAll('.auth-modal').forEach(modal => {
        modal.addEventListener('click', e => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });

    // Close modals with close button
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.auth-modal');
            modal.classList.remove('show');
        });
    });

    // Handle form validation events
    document.querySelectorAll('.auth-form').forEach(form => {
        form.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => {
                input.setCustomValidity('');
                input.checkValidity();
            });
        });
    });

    // Handle auth form switching
    document.querySelectorAll('.switch-auth').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const currentModal = link.closest('.auth-modal');
            const targetModal = link.dataset.modal;
            currentModal.classList.remove('show');
            showModal(`${targetModal}-modal`);
        });
    });

    function handleError(error, context = 'general') {
        console.error(`Auth Error (${context}):`, error);
        let message = 'An error occurred. Please try again.';
        switch (context) {
            case 'login':
                message = 'Login failed. Please check your credentials.';
                break;
            case 'signup':
                message = 'Signup failed. Please try again.';
                break;
            case 'storage':
                message = 'Storage error. Please check your browser settings.';
                break;
        }
        ui.showToast(message, 'error');
    }

    function resetForm(formId) {
        document.getElementById(formId).reset();
    }

    function clearFormErrors(formId) {
        const form = document.getElementById(formId);
        form.querySelectorAll('input').forEach(input => {
            input.setCustomValidity('');
        });
    }

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.auth-modal.show').forEach(modal => {
                modal.classList.remove('show');
            });
        }
    });

    document.querySelectorAll('.auth-modal').forEach(modal => {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        modal.addEventListener('keydown', e => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        });
    });
}

// ==================================================
// Main Initialization
// ==================================================

document.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupEventListeners();
    setupEnhancedImageLoading();
    setupVideoModal();
    setupEnhancedSearch();
    setupCategoryFilter();
    setupBlogViewSwitcher();
    animateStats();
    setupAuth();
});
