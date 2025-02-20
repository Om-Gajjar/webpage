export class ImageLoader {
    static instance = null;
    
    static getInstance(options = {}) {
        if (!ImageLoader.instance) {
            ImageLoader.instance = new ImageLoader(options);
        }
        return ImageLoader.instance;
    }

    constructor(options = {}) {
        this.options = {
            rootMargin: '50px 0px',
            threshold: 0.1,
            selectors: [
                '.article-img',
                '.author-avatar',
                '#cover-preview',
                'img[data-src]',
                '.post-card-image img'
            ],
            onLoad: (img) => {
                img.classList.add('loaded');
                const container = img.closest('.post-card-image, .article-image');
                if (container) {
                    container.classList.add('loaded');
                }
            },
            fallbackImages: {
                technology: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
                design: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',
                ai: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
                mobile: 'https://images.pexels.com/photos/1440727/pexels-photo-1440727.jpeg',
                developer: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg',
                workspace: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg'
            },
            ...options
        };
        
        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            {
                rootMargin: this.options.rootMargin,
                threshold: this.options.threshold
            }
        );
    }

    observe() {
        this.options.selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(img => {
                if (!img.dataset.observing) {
                    this.observer.observe(img);
                    img.dataset.observing = 'true';
                }
            });
        });
    }

    disconnect() {
        this.observer.disconnect();
        ImageLoader.instance = null;
    }

    handleIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadImage(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }

    loadImage(img) {
        const src = img.dataset.src;
        if (!src) {
            console.warn('No data-src attribute found:', img);
            return;
        }

        const tempImage = new Image();
        
        tempImage.onload = () => {
            try {
                img.src = src;
                this.options.onLoad(img);
            } catch (error) {
                console.error('Error loading image:', error);
                this.handleImageError(img);
            }
        };

        tempImage.onerror = () => this.handleImageError(img);
        tempImage.src = src;
    }

    handleImageError(img) {
        const type = img.dataset.type || 'technology';
        const fallbackSrc = this.options.fallbackImages[type];
        if (fallbackSrc) {
            img.src = fallbackSrc;
            this.options.onLoad(img);
            console.warn(`Using fallback image for: ${img.alt || 'unnamed image'}`);
        } else {
            console.error(`No fallback image found for type: ${type}`);
            img.classList.add('image-load-error');
        }
    }
}