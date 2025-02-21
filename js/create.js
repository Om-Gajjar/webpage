import { ui } from '../scripts.js';
import { ImageLoader } from './utils/ImageLoader.js';

/**
 * Content Editor Configuration
 */
const EDITOR_CONFIG = {
    toolbar: [
        'heading', '|',
        'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
        'indent', 'outdent', '|',
        'imageUpload', 'blockQuote', 'insertTable', 'mediaEmbed',
        'undo', 'redo'
    ],
    heading: {
        options: [
            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
            { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
        ]
    },
    image: {
        toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side']
    }
};

/**
 * Blog Manager: Handles retrieval, storage, and display of blog articles.
 */
export class BlogManager {
    constructor() {
        this.blogGrid = document.querySelector('.blog-grid');
        this.articles =
            JSON.parse(localStorage.getItem('published-articles')) || this.getDefaultArticles();
        // Get ImageLoader instance
        this.imageLoader = ImageLoader.getInstance();
        this.displayArticles();
    }

    getDefaultArticles() {
        return [
            {
                id: 1,
                title: "Advanced TypeScript Patterns for Enterprise Applications",
                excerpt:
                    "Explore advanced TypeScript patterns and best practices for building scalable enterprise applications...",
                type: "developer",
                tags: [{ name: "Technology", icon: "fas fa-laptop-code" }],
                readingTime: 5,
                views: 1200,
                likes: 248,
                comments: 42,
                publishedAt: "2024-03-15",
                author: {
                    name: "Alex Mitchell",
                    role: "Tech Lead",
                    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
                },
                coverImage: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg"
            },
            {
                id: 2,
                title: "Modern Web Development Best Practices",
                excerpt:
                    "Learn the latest techniques and patterns for building modern web applications...",
                type: "technology",
                tags: [{ name: "Development", icon: "fas fa-code" }],
                readingTime: 7,
                views: 956,
                likes: 300,
                comments: 34,
                publishedAt: "2024-03-14",
                author: {
                    name: "Mark Wilson",
                    role: "Senior Developer",
                    avatar: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg"
                },
                coverImage: "https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg"
            },
            {
                id: 3,
                title: "UI Design Trends for 2024",
                excerpt:
                    "Explore the latest trends in user interface design and how to implement them...",
                type: "design",
                tags: [{ name: "Design", icon: "fas fa-paint-brush" }],
                readingTime: 4,
                views: 784,
                likes: 167,
                comments: 28,
                publishedAt: "2024-03-13",
                author: {
                    name: "Sarah Chen",
                    role: "UX Designer",
                    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
                },
                coverImage: "https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg"
            }
        ];
    }

    addArticle(articleData) {
        const newArticle = {
            id: Date.now(),
            ...articleData,
            views: 0,
            likes: 0,
            comments: 0
        };

        // Add new article to the beginning of the array
        this.articles.unshift(newArticle);
        localStorage.setItem('published-articles', JSON.stringify(this.articles));
        this.displayArticles();
    }

    createArticleCard(article) {
        const fallbackImages = this.imageLoader.options.fallbackImages;
        return `
      <article class="article-card" data-id="${article.id}">
        <div class="article-image">
          <img class="article-img"
            data-src="${article.coverImage || fallbackImages[article.type]}"
            data-type="${article.type}"
            loading="lazy"
            alt="${article.title}">
          <span class="article-category">
            <i class="${article.tags[0]?.icon || 'fas fa-newspaper'}"></i>
            ${article.tags[0]?.name || article.type}
          </span>
          <div class="article-meta">
            <span><i class="far fa-clock"></i> ${article.readingTime} min read</span>
            <span><i class="far fa-eye"></i> ${article.views} views</span>
          </div>
        </div>
        <div class="article-content">
          <div class="article-info">
            <span>${new Date(article.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}</span>
            <span><i class="far fa-bookmark"></i> Save</span>
          </div>
          <h3 class="article-title">${article.title}</h3>
          <p class="article-excerpt">${article.excerpt}</p>
          <div class="article-footer">
            <div class="article-author">
              <img data-src="${article.author?.avatar ||
            fallbackImages.portrait ||
            fallbackImages.technology
            }"
                data-type="portrait"
                loading="lazy"
                alt="Author avatar"
                class="author-avatar">
              <div>
                <div class="author-name">${article.author?.name || 'Anonymous'}</div>
                <div class="author-role">${article.author?.role || 'Contributor'}</div>
              </div>
            </div>
            <div class="article-stats">
              <span class="stat-item">
                <i class="far fa-heart"></i> ${article.likes}
              </span>
              <span class="stat-item">
                <i class="far fa-comment"></i> ${article.comments}
              </span>
            </div>
          </div>
        </div>
      </article>
    `;
    }

    displayArticles() {
        if (!this.blogGrid) return;
        this.blogGrid.innerHTML = this.articles
            .map((article) => this.createArticleCard(article))
            .join('');
        ImageLoader.getInstance().observe();
    }
}

/**
 * Editor: Provides content editing functionality including draft saving,
 * cover image handling, tag management, and publishing.
 */
export class Editor {
    constructor(blogManager) {
        this.tabs = document.querySelectorAll('.tab-btn');
        this.types = document.querySelectorAll('.type-btn');
        this.tagInput = document.querySelector('.tag-input');
        this.tagSuggestions = document.querySelectorAll('.tag-chip');
        this.selectedTags = document.querySelector('.selected-tags');
        this.publishButton = document.querySelector('.publish-button');
        this.editorContent = document.querySelector('.editor-content');
        this.contentEditor = null;
        this.saveDraftButton = document.querySelector('.outline-button');
        this.titleInput = document.querySelector('.title-input');
        this.blogManager = blogManager;
        this.authorInfo = JSON.parse(localStorage.getItem('author-info') || 'null');
        this.coverPreview = document.querySelector('#cover-preview');
        this.defaultCoverSelect = document.querySelector('#default-cover-select');
        this.uploadImageBtn = document.querySelector('.upload-image-btn');
        this.selectedCoverImage = null;
        this.imageLoader = ImageLoader.getInstance({
            selectors: [
                '.article-img',
                '.author-avatar',
                '#cover-preview',
                'img[data-src]'
            ]
        });

        // Initialize image-related elements
        this.coverPreview = document.getElementById('cover-preview');
        this.imagePreviewContainer = document.querySelector('.image-preview');
        this.uploadImageBtn = document.querySelector('.upload-image-btn');
        this.defaultCoverSelect = document.getElementById('default-cover-select');

        this.setupImageHandling();
        this.defaultType = 'technology';
        this.currentType = this.defaultType;
    }

    init() {
        this.initializeEditor();
        if (!document.querySelector('.type-btn.active')) {
            const defaultType = this.types[0];
            if (defaultType) defaultType.classList.add('active');
        }
        this.setupEventListeners();
        this.imageLoader.observe();
    }

    async initializeEditor() {
        try {
            this.contentEditor = await ClassicEditor.create(
                document.querySelector('#content-editor'),
                EDITOR_CONFIG
            );

            const savedDraft = localStorage.getItem('draft-content');
            if (savedDraft) {
                try {
                    const draftData = JSON.parse(savedDraft);
                    this.contentEditor.setData(draftData.content || '');
                    if (this.titleInput && draftData.title) {
                        this.titleInput.value = draftData.title;
                    }
                    if (draftData.tags && this.selectedTags) {
                        this.selectedTags.innerHTML = '';
                        draftData.tags.forEach((tag) => {
                            const tagElement = this.createTagElement(tag.name, tag.icon);
                            this.selectedTags.appendChild(tagElement);
                        });
                    }
                    if (draftData.coverImage && this.coverPreview) {
                        if (draftData.coverImage.src) {
                            this.setCoverImage(draftData.coverImage.src);
                            if (draftData.coverImage.isDefault && this.defaultCoverSelect) {
                                this.defaultCoverSelect.value = draftData.coverImage.type;
                            }
                        }
                    }
                } catch (e) {
                    console.error('Error loading draft:', e);
                }
            }
        } catch (error) {
            console.error('Editor initialization failed:', error);
            ui.showToast('Editor initialization failed', 'error');
        }
    }

    setupEventListeners() {
        this.setupTabSwitching();
        this.setupPostTypeSelection();
        this.setupTagHandling();
        this.setupDraftSaving();
        this.setupKeyboardShortcuts();
        this.setupPublishing();
        this.setupImageHandling();
    }

    setupImageHandling() {
        this.defaultCoverSelect?.addEventListener('change', (e) => {
            const type = e.target.value;
            if (type) {
                const fallbackSrc = this.imageLoader.options.fallbackImages[type];
                if (fallbackSrc) {
                    this.setCoverImage(fallbackSrc);
                }
            }
        });

        this.uploadImageBtn?.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';

            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    if (file.size > 5 * 1024 * 1024) {
                        ui.showToast('Image size should be less than 5MB', 'error');
                        return;
                    }
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.setCoverImage(e.target.result);
                    };
                    reader.readAsDataURL(file);
                }
            };

            input.click();
        });
    }

    setCoverImage(src) {
        if (!src) return;
        this.selectedCoverImage = src;
        if (this.coverPreview) {
            const currentType = this.getSelectedType();
            this.coverPreview.setAttribute('data-src', src);
            this.coverPreview.setAttribute('data-type', currentType);
            this.coverPreview.src = src;
            this.coverPreview.style.display = 'block';
            const previewContainer = this.coverPreview.closest('.image-preview');
            if (previewContainer) {
                previewContainer.classList.add('has-image');
            }
        }
    }

    setupTabSwitching() {
        this.tabs.forEach((tab) => {
            tab.addEventListener('click', async () => {
                if (tab.classList.contains('active')) return;
                this.tabs.forEach((t) => t.classList.remove('active'));
                tab.classList.add('active');
                const tabType = tab.getAttribute('data-tab');
                try {
                    if (tabType === 'preview') {
                        await this.showPreview();
                    } else if (tabType === 'write') {
                        await this.showEditor();
                    }
                } catch (error) {
                    console.error('Tab switching failed:', error);
                    ui.showToast('Failed to switch tabs');
                }
            });
        });
    }

    setupPostTypeSelection() {
        if (!document.querySelector('.type-btn.active')) {
            const defaultType = this.types[0];
            if (defaultType) {
                defaultType.classList.add('active');
                this.currentType = defaultType.getAttribute('data-type') || this.defaultType;
            }
        }
        this.types.forEach((type) => {
            type.addEventListener('click', () => {
                this.types.forEach((t) => t.classList.remove('active'));
                type.classList.add('active');
                this.currentType = type.getAttribute('data-type');
                if (this.coverPreview && this.coverPreview.getAttribute('data-src')) {
                    this.coverPreview.setAttribute('data-type', this.currentType);
                }
            });
        });
    }

    getSelectedType() {
        const activeTypeBtn = document.querySelector('.type-btn.active');
        return activeTypeBtn?.getAttribute('data-type') || this.currentType || this.defaultType;
    }

    setupTagHandling() {
        this.tagSuggestions.forEach((tag) => {
            tag.addEventListener('click', () => this.handleTagSelection(tag));
        });
    }

    handleTagSelection(tag) {
        const tagText = tag.textContent.trim();
        const tagIcon = tag.querySelector('i').className;
        if (!document.querySelector(`.tag-chip.selected[data-tag="${tagText}"]`)) {
            const tagElement = this.createTagElement(tagText, tagIcon);
            tagElement.setAttribute('data-tag', tagText);
            this.selectedTags.appendChild(tagElement);
        }
    }

    createTagElement(text, iconClass) {
        const tag = document.createElement('span');
        tag.className = 'tag-chip selected';
        tag.setAttribute('data-tag', text);
        if (iconClass) {
            const icon = document.createElement('i');
            icon.className = iconClass;
            tag.appendChild(icon);
        }
        tag.appendChild(document.createTextNode(text));
        const removeBtn = document.createElement('i');
        removeBtn.className = 'fas fa-times remove-tag';
        removeBtn.onclick = () => tag.remove();
        tag.appendChild(removeBtn);
        return tag;
    }

    async showPreview() {
        try {
            if (!this.contentEditor) {
                throw new Error('Editor not initialized');
            }
            const content = this.contentEditor.getData();
            localStorage.setItem('temp-content', content);
            this.editorContent.innerHTML = `
        <div class="preview-content">
          ${content || '<p class="empty-content">No content to preview</p>'}
        </div>
      `;
        } catch (error) {
            console.error('Preview failed:', error);
            ui.showToast('Failed to show preview', 'error');
        }
    }

    async showEditor() {
        const removeLoading = ui.addLoading(document.querySelector('.tab-btn[data-tab="write"]'));
        try {
            const currentContent = this.contentEditor ? this.contentEditor.getData() : '';
            const coverImageData = {
                src: this.coverPreview?.getAttribute('data-src') || '',
                type: this.coverPreview?.getAttribute('data-type') || '',
                hasImage: this.imagePreviewContainer?.classList.contains('has-image') || false,
                selectedValue: this.defaultCoverSelect?.value || ''
            };
            this.editorContent.innerHTML = `
        <div class="editor-main">
          <input type="text" class="title-input" placeholder="Enter your title..." value="${this.titleInput?.value || ''
                }">
          <div class="tag-wrapper">
            <div class="tag-input-container">
              <input type="text" class="tag-input" placeholder="Add tags...">
              <div class="tag-suggestions">
                <span class="tag-chip" data-tag="technology">
                  <i class="fas fa-microchip"></i> Technology
                </span>
                <span class="tag-chip" data-tag="design">
                  <i class="fas fa-palette"></i> Design
                </span>
                <span class="tag-chip" data-tag="tutorial">
                  <i class="fas fa-chalkboard-teacher"></i> Tutorial
                </span>
                <span class="tag-chip" data-tag="development">
                  <i class="fas fa-code"></i> Development
                </span>
                <span class="tag-chip" data-tag="ai">
                  <i class="fas fa-brain"></i> AI & ML
                </span>
              </div>
            </div>
            <div class="selected-tags">${this.selectedTags?.innerHTML || ''}</div>
          </div>
          ${this.getEditorMainHTML(currentContent, coverImageData)}
        </div>
      `;

            this.coverPreview = document.getElementById('cover-preview');
            this.imagePreviewContainer = document.querySelector('.image-preview');
            this.uploadImageBtn = document.querySelector('.upload-image-btn');
            this.defaultCoverSelect = document.getElementById('default-cover-select');
            this.titleInput = document.querySelector('.title-input');
            this.selectedTags = document.querySelector('.selected-tags');
            this.tagInput = document.querySelector('.tag-input');
            this.tagSuggestions = document.querySelectorAll('.tag-chip');

            if (coverImageData.src && this.coverPreview) {
                this.coverPreview.setAttribute('data-src', coverImageData.src);
                this.coverPreview.setAttribute('data-type', coverImageData.type);
                if (coverImageData.hasImage) {
                    this.imagePreviewContainer.classList.add('has-image');
                    this.coverPreview.src = coverImageData.src;
                    this.coverPreview.style.display = 'block';
                }
                if (coverImageData.selectedValue) {
                    this.defaultCoverSelect.value = coverImageData.selectedValue;
                }
            }

            if (this.contentEditor) {
                await this.contentEditor.destroy();
            }
            this.contentEditor = await ClassicEditor.create(
                document.querySelector('#content-editor'),
                EDITOR_CONFIG
            );

            this.setupImageHandling();
            this.setupTagHandling();

            const activeType = document.querySelector('.type-btn.active');
            if (!activeType && this.currentType) {
                const typeBtn = document.querySelector(`.type-btn[data-type="${this.currentType}"]`);
                if (typeBtn) {
                    typeBtn.classList.add('active');
                }
            }
        } catch (error) {
            console.error('Editor initialization failed:', error);
            ui.showToast('Failed to initialize editor', 'error');
        } finally {
            removeLoading();
        }
    }

    getEditorMainHTML(currentContent, coverImageData) {
        return `
      <div class="cover-image-wrapper">
        <h4>Cover Image</h4>
        <div class="image-preview">
          <img id="cover-preview" 
            data-src="${coverImageData.src}" 
            data-type="${coverImageData.type}" 
            alt="Cover preview"
            ${coverImageData.hasImage ? `src="${coverImageData.src}"` : ''}>
          <div class="image-placeholder">
            <i class="fas fa-image"></i>
            <span>Select a cover image</span>
          </div>
        </div>
        <div class="image-options">
          <button class="upload-image-btn">
            <i class="fas fa-upload"></i> Upload Image
          </button>
          <select class="modern-select" id="default-cover-select">
            <option value="">Choose from defaults...</option>
            <option value="technology">Technology</option>
            <option value="design">Design</option>
            <option value="developer">Development</option>
            <option value="ai">AI & ML</option>
            <option value="mobile">Mobile</option>
            <option value="workspace">Workspace</option>
          </select>
        </div>
      </div>
      <div class="content-area">
        <textarea id="content-editor">${currentContent}</textarea>
      </div>
    `;
    }

    setupDraftSaving() {
        if (!this.saveDraftButton) {
            console.error('Save draft button not found');
            return;
        }

        this.saveDraftButton.addEventListener('click', async () => {
            if (!this.contentEditor) {
                ui.showToast('Editor not initialized', 'error');
                return;
            }

            const removeLoading = ui.addLoading(this.saveDraftButton);
            try {
                const content = this.contentEditor.getData();
                const title = this.titleInput?.value || '';
                const selectedTags = Array.from(this.selectedTags.children).map((tag) => ({
                    name: tag.textContent.trim(),
                    icon: tag.querySelector('i')?.className || ''
                }));
                const coverImageData = {
                    src: this.coverPreview?.src || '',
                    type: this.coverPreview?.dataset.type || '',
                    isDefault: !!this.defaultCoverSelect?.value
                };

                const draftData = {
                    content,
                    title,
                    tags: selectedTags,
                    coverImage: coverImageData,
                    lastSaved: new Date().toISOString()
                };

                localStorage.setItem('draft-content', JSON.stringify(draftData));
                ui.showToast('Draft saved successfully!', 'success');
            } catch (error) {
                console.error('Failed to save draft:', error);
                ui.showToast('Failed to save draft', 'error');
            } finally {
                removeLoading();
            }
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                this.publishButton.click();
            }
        });
    }

    setupPublishing() {
        this.publishButton.addEventListener('click', () => this.handlePublish());
    }

    async handlePublish() {
        const removeLoading = ui.addLoading(this.publishButton);
        try {
            if (!this.authorInfo) {
                const authorInfo = await this.promptAuthorInfo();
                if (!authorInfo) {
                    ui.showToast('Author information is required', 'error');
                    return;
                }
                this.authorInfo = authorInfo;
                localStorage.setItem('author-info', JSON.stringify(authorInfo));
            }

            const validationError = this.validateForm();
            if (validationError) {
                ui.showToast(validationError, 'error');
                return;
            }

            const postData = this.gatherPostData();
            if (!(await this.confirmPublish())) return;
            postData.author = this.authorInfo;
            this.blogManager.addArticle(postData);
            ui.showToast('Post published successfully!', 'success');
            setTimeout(() => this.resetForm(), 1500);
        } catch (error) {
            console.error('Publishing failed:', error);
            ui.showToast(error.message || 'Failed to publish post', 'error');
        } finally {
            removeLoading();
        }
    }

    async promptAuthorInfo() {
        return new Promise((resolve) => {
            const dialog = Object.assign(document.createElement('div'), {
                className: 'publish-dialog',
                innerHTML: `
          <div class="publish-dialog-content glass-card">
            <h3><i class="fas fa-user"></i> Author Information</h3>
            <div class="author-form">
              <div class="form-group">
                <label>Name</label>
                <input type="text" id="author-name" required>
              </div>
              <div class="form-group">
                <label>Role</label>
                <input type="text" id="author-role" required>
              </div>
              <div class="form-group">
                <label>Avatar URL (optional)</label>
                <input type="url" id="author-avatar">
              </div>
            </div>
            <div class="dialog-buttons">
              <button class="outline-button cancel-btn">Cancel</button>
              <button class="publish-button save-btn">Save</button>
            </div>
          </div>
        `
            });

            document.body.appendChild(dialog);
            requestAnimationFrame(() => dialog.classList.add('show'));

            const handleSave = () => {
                const name = document.getElementById('author-name').value.trim();
                const role = document.getElementById('author-role').value.trim();
                const avatar = document.getElementById('author-avatar').value.trim();
                if (!name || !role) {
                    ui.showToast('Please fill in required fields', 'error');
                    return;
                }
                dialog.remove();
                resolve({ name, role, avatar });
            };

            const handleCancel = () => {
                dialog.remove();
                resolve(null);
            };

            dialog.querySelector('.save-btn').addEventListener('click', handleSave);
            dialog.querySelector('.cancel-btn').addEventListener('click', handleCancel);
        });
    }

    gatherPostData() {
        const fallbackImages = this.imageLoader.options.fallbackImages;
        const data = {
            ...this.getExistingGatherPostData(),
            coverImage: this.selectedCoverImage || fallbackImages[this.getSelectedType()]
        };
        return data;
    }

    getExistingGatherPostData() {
        const title = this.titleInput.value.trim();
        const content = this.contentEditor.getData().trim();
        const type = this.getSelectedType();
        const tags = Array.from(document.querySelectorAll('.tag-chip.selected')).map((tag) => ({
            name: tag.textContent.trim().replace(/×$/, '').trim(),
            icon: tag.querySelector('i')?.className || ''
        }));
        return {
            title,
            content,
            type,
            tags,
            excerpt: this.generateExcerpt(content),
            readingTime: this.calculateReadingTime(content),
            publishedAt: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };
    }

    generateExcerpt(content) {
        const plainText = content.replace(/<[^>]+>/g, '');
        return plainText.slice(0, 160) + (plainText.length > 160 ? '...' : '');
    }

    calculateReadingTime(content) {
        const wordsPerMinute = 200;
        const plainText = content.replace(/<[^>]+>/g, '');
        const words = plainText.trim().split(/\s+/).length;
        return Math.ceil(words / wordsPerMinute);
    }

    validateForm() {
        if (!this.titleInput.value.trim()) {
            return 'Please enter a title';
        }
        if (!this.contentEditor.getData().trim()) {
            return 'Please add some content';
        }
        const selectedTags = document.querySelectorAll('.tag-chip.selected');
        if (selectedTags.length === 0) {
            return 'Please add at least one tag';
        }
        return null;
    }

    async publishPost(postData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: 'Post published successfully',
                    data: { id: Date.now(), ...postData }
                });
            }, 1500);
        });
    }

    resetForm() {
        this.titleInput.value = '';
        this.contentEditor.setData('');
        if (this.selectedTags) {
            this.selectedTags.innerHTML = '';
        }
        if (this.coverPreview) {
            this.coverPreview.src = '';
            this.coverPreview.classList.remove('has-image');
            this.coverPreview.closest('.image-preview')?.classList.remove('has-image');
            if (this.defaultCoverSelect) {
                this.defaultCoverSelect.value = '';
            }
        }
        localStorage.removeItem('draft-content');
    }

    async confirmPublish() {
        return new Promise((resolve) => {
            const dialog = Object.assign(document.createElement('div'), {
                className: 'publish-dialog',
                innerHTML: `
          <div class="publish-dialog-content glass-card">
            <h3><i class="fas fa-paper-plane"></i> Publish Post</h3>
            <p>Are you sure you want to publish this post?</p>
            <p class="dialog-info">This will make your post visible to all users.</p>
            <div class="dialog-buttons">
              <button class="outline-button cancel-btn">
                <i class="fas fa-times"></i> Cancel
              </button>
              <button class="publish-button confirm-btn">
                <i class="fas fa-check"></i> Publish
              </button>
            </div>
          </div>
        `
            });

            document.body.appendChild(dialog);
            requestAnimationFrame(() => dialog.classList.add('show'));

            const handleConfirm = () => {
                dialog.classList.remove('show');
                setTimeout(() => {
                    dialog.remove();
                    resolve(true);
                }, 300);
            };

            const handleCancel = () => {
                dialog.classList.remove('show');
                setTimeout(() => {
                    dialog.remove();
                    resolve(false);
                }, 300);
            };

            const handleOutsideClick = (e) => {
                if (e.target === dialog) {
                    handleCancel();
                }
            };

            dialog.querySelector('.confirm-btn').addEventListener('click', handleConfirm);
            dialog.querySelector('.cancel-btn').addEventListener('click', handleCancel);
            dialog.addEventListener('click', handleOutsideClick);
        });
    }
}
