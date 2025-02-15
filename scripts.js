document.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupEventListeners();
    setupImageLoading(); // Ensure this is called
    setupEnhancedImageLoading();
    setupVideoModal();
    setupEnhancedSearch();
    setupCategoryFilter();
    setupBlogViewSwitcher();
    animateStats();
});

// Core initialization
function initApp() {
    const app = {
        state: {
            isDark: localStorage.getItem('dark-mode') === 'true',
            user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
        },
        elements: {
            nav: document.querySelector('.top-nav'),
            themeToggle: document.getElementById('theme-toggle'),
            searchInput: document.getElementById('search-input'),
            userMenu: document.querySelector('.user-menu')
        }
    };

    // Initialize theme
    if (app.state.isDark) {
        document.body.classList.add('dark-mode');
        app.elements.themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    }

    // Initialize user state
    updateUserInterface(app.state.user);

    return app;
}

// Event listeners
function setupEventListeners() {
    // Navigation scroll
    handleNavScroll();

    // Theme toggle
    setupThemeToggle();

    // Search functionality
    setupSearch();

    // Post interactions
    setupPostInteractions();

    // Image loading
    setupImageLoading();

    // Parallax effects
    setupParallaxEffects();

    // Header interactions
    setupHeaderInteractions();

    // Hero animations
    setupHeroAnimations();

    // Featured posts
    setupFeaturedPosts();

    // Latest articles view switching
    setupLatestArticles();

    // Create section interactivity
    setupCreateSection();
}

// UI Helpers
const ui = {
    showToast: (message, type = 'info', duration = 3000) => {
        const toast = Object.assign(document.createElement('div'), {
            className: `toast toast-${type}`,
            innerHTML: `
                <div class="toast-content">
                    <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle"></i>
                    <span>${message}</span>
                </div>
            `
        });

        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    addLoading: (element) => {
        element.disabled = true;
        const originalText = element.textContent;
        element.textContent = 'Loading...';
        return () => {
            element.disabled = false;
            element.textContent = originalText;
        };
    }
};

// User interface updates
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

// Navigation handlers
function handleNavScroll() {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const nav = document.querySelector('.top-nav');
        
        nav.style.transform = currentScroll > lastScroll && currentScroll > 100
            ? 'translateY(-100%)'
            : 'translateY(0)';
        
        nav.classList.toggle('nav-scrolled', currentScroll > 100);
        lastScroll = currentScroll;
    });
}

// Theme handlers
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    
    // Check initial theme
    if (localStorage.getItem('dark-mode') === 'true') {
        document.body.classList.add('dark-mode');
        icon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('dark-mode', isDark);
        
        // Toggle icon
        icon.classList.toggle('fa-moon', !isDark);
        icon.classList.toggle('fa-sun', isDark);
    });
}

// Search handlers
function setupSearch() {
    const searchModal = document.querySelector('.search-modal');
    const searchInput = document.getElementById('search-modal-input');
    const searchResults = document.querySelector('.search-results');
    const filtersToggle = document.getElementById('search-filters-toggle');
    const filtersPanel = document.querySelector('.search-filters-panel');
    const searchHistory = document.querySelector('.history-items');

    // Search history
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    
    function updateHistory(query) {
        if (!query) return;
        const newHistory = [query, ...history.filter(h => h !== query)].slice(0, 5);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
        renderHistory(newHistory);
    }

    function renderHistory(items) {
        searchHistory.innerHTML = items.map(item => `
            <div class="history-item">
                <span><i class="fas fa-history"></i> ${item}</span>
                <button class="icon-button" onclick="removeFromHistory('${item}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    // Search suggestions
    function showSuggestions(query) {
        if (!query) {
            searchResults.innerHTML = '';
            return;
        }

        const suggestions = generateSuggestions(query);
        searchResults.innerHTML = suggestions.map(suggestion => `
            <div class="search-suggestion" role="button" tabindex="0">
                <div class="suggestion-icon">
                    <i class="fas ${suggestion.icon}"></i>
                </div>
                <div class="suggestion-content">
                    <div class="suggestion-title">${suggestion.title}</div>
                    <div class="suggestion-subtitle">${suggestion.subtitle}</div>
                </div>
            </div>
        `).join('');
    }

    // Filters toggle
    filtersToggle?.addEventListener('click', () => {
        filtersPanel.hidden = !filtersPanel.hidden;
        filtersToggle.setAttribute('aria-expanded', !filtersPanel.hidden);
    });

    // Search input handler
    let debounceTimer;
    searchInput?.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            showSuggestions(e.target.value);
        }, 300);
    });

    // Keyboard navigation
    searchInput?.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const firstSuggestion = searchResults.querySelector('.search-suggestion');
            firstSuggestion?.focus();
        }
    });

    // Initialize
    renderHistory(history);
}

// Helper function to generate search suggestions
function generateSuggestions(query) {
    // This would typically come from your backend
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

// Post interactions
function setupPostInteractions() {
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
}

// Form handling
async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const removeLoading = ui.addLoading(submitBtn);

    try {
        const formData = Object.fromEntries(new FormData(form));
        const response = await processForm(form.id, formData);
        ui.showToast(response.message, 'success');
        form.reset();
    } catch (error) {
        ui.showToast(error.message, 'error');
    } finally {
        removeLoading();
    }
}

// Data processing
function processForm(formId, data) {
    switch (formId) {
        case 'login-form':
            return loginUser(data);
        case 'signup-form':
            return signupUser(data);
        case 'post-form':
            return createPost(data);
        default:
            throw new Error('Unknown form type');
    }
}

// Auth functions
function loginUser({ username, password }) {
    // Simulate API call
    return new Promise(resolve => {
        setTimeout(() => {
            const user = { username, id: Date.now() };
            localStorage.setItem('user', JSON.stringify(user));
            updateUserInterface(user);
            resolve({ message: 'Logged in successfully' });
        }, 1000);
    });
}

// Image loading handler
const fallbackImages = {
    technology: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
    design: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',
    ai: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
    mobile: 'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg',
    developer: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg',
    workspace: 'https://images.pexels.com/photos/7974/pexels-photo.jpg',
    portrait: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
};

function setupImageLoading() {
    const images = document.querySelectorAll('.article-img, .post-card-image img, .author-avatar');
    
    const loadImage = (img) => {
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

// Add parallax effects
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

// Header interactions
function setupHeaderInteractions() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-button');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenuBtn?.addEventListener('click', () => {
        navLinks.classList.toggle('show');
        document.body.classList.toggle('menu-open');
    });

    // Search shortcut
    setupSearchShortcut();

    // User menu
    setupUserMenu();

    // Active link tracking
    setupActiveLinks();
}

function setupSearchShortcut() {
    const searchBtn = document.querySelector('.search-toggle');
    const searchInput = document.getElementById('search-input');
    const searchModal = document.querySelector('.search-modal');

    searchBtn?.addEventListener('click', () => {
        searchModal?.classList.add('show');
        searchInput?.focus();
    });

    // Close search on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchModal?.classList.remove('show');
        }
    });
}

function setupUserMenu() {
    const userMenu = document.querySelector('.user-menu');
    const dropdownMenu = userMenu?.querySelector('.dropdown-menu');

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
        if (!userMenu?.contains(e.target)) {
            dropdownMenu?.classList.remove('show');
        }
    });

    // Handle logout
    const logoutBtn = document.querySelector('.logout-link');
    logoutBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        handleLogout();
    });
}

function handleLogout() {
    localStorage.removeItem('user');
    updateUserInterface(null);
    ui.showToast('Logged out successfully', 'success');
    window.location.hash = '#home';
}

function setupActiveLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.hash || '#home';

    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === currentPath);
    });

    // Update active link on hash change
    window.addEventListener('hashchange', () => {
        const currentHash = window.location.hash || '#home';
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === currentHash);
        });
    });
}

function setupHeroAnimations() {
    // Animate stats numbers
    const statsNumbers = document.querySelectorAll('.stat-number[data-count]');
    
    const animateValue = (element, start, end, duration) => {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const updateNumber = () => {
            current += increment;
            if (current >= end) {
                element.textContent = end >= 1000 ? `${(end/1000).toFixed(0)}k+` : end;
                return;
            }
            element.textContent = Math.floor(current) >= 1000 ? 
                `${(Math.floor(current)/1000).toFixed(0)}k+` : 
                Math.floor(current);
            requestAnimationFrame(updateNumber);
        };
        
        updateNumber();
    };

    // Start animation when element is in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const endValue = parseInt(target.getAttribute('data-count'), 10);
                animateValue(target, 0, endValue, 2000);
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    statsNumbers.forEach(stat => observer.observe(stat));
}

function setupFeaturedPosts() {
    const categoryPills = document.querySelectorAll('.category-pill');
    const posts = document.querySelectorAll('.post-card:not(.featured-post)');

    // Category filter
    categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const category = pill.textContent.trim().toLowerCase();
            
            // Update active state
            categoryPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            // Filter posts
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

    // Lazy load images with blur-up effect
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

function setupLatestArticles() {
    const viewButtons = document.querySelectorAll('.view-switcher button');
    const blogGrid = document.querySelector('.blog-grid');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const view = button.dataset.view;
            
            // Update active state
            viewButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update view
            blogGrid.classList.remove('grid-view', 'list-view');
            blogGrid.classList.add(`${view}-view`);
            
            // Trigger layout animations
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

                // Add remove functionality
                tagElement.querySelector('.remove-tag').addEventListener('click', () => {
                    tagElement.remove();
                });
            }
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.metaKey && e.key === 'Enter') {
            editor.publishButton.click();
        }
    });
}

// Add Stats Counter Animation
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
            (entries) => {
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

// Enhanced Image Loading
function setupEnhancedImageLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
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
    }, {
        rootMargin: '50px 0px',
        threshold: 0.1
    });

    images.forEach(img => imageObserver.observe(img));
}

// About Section Video Modal
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

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.closest('.close-modal')) {
            modal.classList.remove('show');
            const iframe = modal.querySelector('iframe');
            iframe.src = '';
        }
    });
}

// Enhanced Search Functionality
function setupEnhancedSearch() {
    const searchInput = document.getElementById('search-modal-input');
    const searchModal = document.querySelector('.search-modal');
    const searchResults = document.querySelector('.search-results');
    
    // Search Modal Toggle
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            searchModal.classList.add('show');
            searchInput?.focus();
        }
        if (e.key === 'Escape') {
            searchModal.classList.remove('show');
        }
    });

    // Search Input Handler
    let searchTimeout;
    searchInput?.addEventListener('input', (e) => {
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

// Perform Search
function performSearch(query) {
    const searchResults = document.querySelector('.search-results');
    // Simulated search results
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

    searchResults.innerHTML = results.map(result => `
        <div class="search-result-item">
            <div class="result-icon">
                <i class="fas fa-${result.type === 'article' ? 'newspaper' : 'user'}"></i>
            </div>
            <div class="result-content">
                <h4>${result.type === 'article' ? result.title : result.name}</h4>
                <p>${result.type === 'article' ? result.excerpt : result.role}</p>
            </div>
        </div>
    `).join('');
}

// Category Filter Enhancement
function setupCategoryFilter() {
    const categoryPills = document.querySelectorAll('.category-pill');
    const posts = document.querySelectorAll('.post-card');

    categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const category = pill.textContent.trim().toLowerCase();
            
            categoryPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            posts.forEach(post => {
                const postCategory = post.querySelector('.post-category')
                    ?.textContent.trim().toLowerCase();
                
                post.style.opacity = '0';
                post.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    const shouldShow = category === 'all topics' || 
                                    postCategory === category;
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

// Blog View Switcher Enhancement
function setupBlogViewSwitcher() {
    const viewButtons = document.querySelectorAll('.view-switcher button');
    const blogGrid = document.querySelector('.blog-grid');

    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const view = button.dataset.view;
            
            viewButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            blogGrid.className = `blog-grid ${view}-view`;
            
            // Trigger re-layout animation
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

// Initialize everything
function initializeApp() {
    setupEventListeners();
    setupEnhancedImageLoading();
    setupVideoModal();
    setupEnhancedSearch();
    setupCategoryFilter();
    setupBlogViewSwitcher();
    animateStats();
}

// Call initialization when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);
