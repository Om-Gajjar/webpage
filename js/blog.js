import { ImageLoader } from './utils/ImageLoader.js';
import { setupCategoryFilter } from './utils/CategoryFilter.js';

/**
 * Blog Functionality Module
 */

// Blog view switching
function setupBlogViewSwitcher() {
    const viewButtons = document.querySelectorAll('.view-switcher button');
    const blogGrid = document.querySelector('.blog-grid');

    viewButtons?.forEach((button) => {
        button.addEventListener('click', () => {
            const view = button.dataset.view;
            // Update active state
            viewButtons.forEach((btn) => btn.classList.remove('active'));
            button.classList.add('active');
            // Update grid view
            blogGrid.className = `blog-grid ${view}-view`;
            // Animate articles
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

// Blog sorting
function setupBlogSorting() {
    const sortSelect = document.querySelector('.modern-select');
    const blogGrid = document.querySelector('.blog-grid');

    sortSelect?.addEventListener('change', () => {
        const articles = Array.from(blogGrid.querySelectorAll('.article-card'));
        const sortBy = sortSelect.value.toLowerCase();

        articles.sort((a, b) => {
            switch (sortBy) {
                case 'most recent':
                    return getDate(b) - getDate(a);
                case 'most popular':
                    return getViews(b) - getViews(a);
                case 'trending':
                    return getLikes(b) - getLikes(a);
                default:
                    return 0;
            }
        });

        // Re-append sorted articles
        articles.forEach((article) => blogGrid.appendChild(article));
    });
}

// Helper functions
function getDate(article) {
    return new Date(article.querySelector('.article-info span').textContent);
}

function getViews(article) {
    const viewsText = article.querySelector('.article-meta span:last-child').textContent;
    return parseInt(viewsText.replace(/[^0-9]/g, ''));
}

function getLikes(article) {
    const likesText = article.querySelector('.stat-item:first-child').textContent;
    return parseInt(likesText.replace(/[^0-9]/g, ''));
}

// Initialize blog features
export function setupBlogFeatures() {
    setupBlogViewSwitcher();
    setupCategoryFilter({
        containerSelector: '.blog-section', // Specify the container
        pillSelector: '.category-pill',
        itemSelector: '.post-card, .article-card',
        animation: {
            hide: { 
                opacity: '0', 
                transform: 'translateY(20px)' 
            },
            show: { 
                opacity: '1', 
                transform: 'translateY(0)' 
            },
            duration: 300,
            stagger: 50
        }
    });
    setupBlogSorting();

    // Use existing ImageLoader instance
    ImageLoader.getInstance().observe();
}
