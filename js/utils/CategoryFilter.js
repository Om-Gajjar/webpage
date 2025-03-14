/**
 * Category filtering utility for posts, articles, and other content items
 */

/**
 * Sets up category filtering with customizable animations
 * @param {Object} options - Configuration options
 * @param {string} options.containerSelector - Selector for the container element
 * @param {string} options.pillSelector - Selector for category buttons
 * @param {string} options.itemSelector - Selector for items to filter
 * @param {string} options.categorySelector - Selector for category text within items
 * @param {Object} options.animation - Animation configuration
 * @param {Function} options.onItemShown - Callback when item becomes visible
 */
export function setupCategoryFilter(options = {}) {
    const {
        containerSelector = 'body', // Default to document body if not specified
        pillSelector = '.category-pill',
        itemSelector = '.post-card',
        categorySelector = '.post-category',
        animation = {
            hide: { opacity: '0', transform: 'scale(0.95)' },
            show: { opacity: '1', transform: 'scale(1)' },
            duration: 300,
            stagger: 50
        },
        onItemShown = null,
        preserveAOS = true  // New option to preserve AOS animations
    } = options;
    
    // Find the container first, then find pills and items within that container
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    const categoryPills = container.querySelectorAll(pillSelector);
    if (!categoryPills.length) return;
    
    const items = container.querySelectorAll(itemSelector);
    if (!items.length) return;
    
    categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const category = pill.textContent.trim().toLowerCase();
            
            // Update active state only within this container
            categoryPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            // Filter items
            items.forEach((item, index) => {
                const itemCategory = item.querySelector(categorySelector)?.textContent.trim().toLowerCase();
                const shouldShow = category === 'all topics' || itemCategory === category;
                
                // Apply hide style immediately
                Object.entries(animation.hide).forEach(([prop, value]) => {
                    item.style[prop] = value;
                });

                // Toggle visibility after animation
                setTimeout(() => {
                    if (!shouldShow) {
                        // Don't use display:none if preserving AOS
                        if (preserveAOS) {
                            item.style.visibility = 'hidden';
                            item.style.position = 'absolute';
                            item.style.pointerEvents = 'none';
                        } else {
                            item.style.display = 'none';
                        }
                    } else {
                        // Restore visibility
                        if (preserveAOS) {
                            item.style.visibility = 'visible';
                            item.style.position = '';
                            item.style.pointerEvents = '';
                        } else {
                            item.style.display = '';
                        }
                        
                        // Apply show animation with staggered timing
                        setTimeout(() => {
                            Object.entries(animation.show).forEach(([prop, value]) => {
                                item.style[prop] = value;
                            });
                            
                            // Handle AOS animations for newly visible items
                            if (preserveAOS && typeof AOS !== 'undefined') {
                                // Remove any existing AOS animation classes
                                const aosClasses = Array.from(item.classList)
                                    .filter(c => c.startsWith('aos-'));
                                aosClasses.forEach(c => item.classList.remove(c));
                                
                                // Refresh AOS for this element
                                AOS.refresh();
                                
                                // Force animation if needed
                                setTimeout(() => {
                                    item.setAttribute('data-aos-animate', 'true');
                                    item.classList.add('aos-animate');
                                }, 50);
                            }
                            
                            // Call callback if provided
                            if (onItemShown && typeof onItemShown === 'function') {
                                onItemShown(item);
                            }
                        }, animation.stagger * index);
                    }
                }, animation.duration);
            });
        });
    });
}
