# WikiBlog ✨ Modern Knowledge Sharing Platform

<div align="center">

![WikiBlog Banner](Banner.png)

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS](https://img.shields.io/badge/CSS-Custom_Properties-264de4?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![AOS](https://img.shields.io/badge/AOS-Animations-69D2F5?style=flat-square)](https://michalsnik.github.io/aos/)
[![CKEditor](https://img.shields.io/badge/CKEditor-5-00BFFF?style=flat-square&logo=ckeditor&logoColor=white)](https://ckeditor.com/ckeditor-5/)
[![Live Demo](https://img.shields.io/badge/View%20Demo-FF4081?style=flat-square&logo=web&logoColor=white)](https://om-gajjar.github.io/webpage/)

**A modern web platform for knowledge sharing with an elegant UI, smooth animations, and intuitive content creation tools.**

✨ Features • 
🚀 Demo • 
🛠️ Installation • 
📋 Usage Guide • 
📱 Responsive Design

</div>

## 📋 Table of Contents

- Features
- Live Demo
- Installation
- Usage Guide
- Technology Stack
- Project Structure
- Responsive Design
- Performance Optimizations
- Roadmap
- Contributing
- License

## ✨ Features

<details open>
<summary><b>💫 Modern User Interface</b></summary>
<br>

- **Elegant Design System** with glass-morphism effects and smooth transitions
- **Dark/Light Theme** with system preference detection and manual toggle
- **Animated Elements** powered by AOS (Animate On Scroll) library
- **Custom Components** including category pills, cards, and modals
- **Interactive Statistics** with animated counters in the hero section

</details>

<details>
<summary><b>📝 Content Creation</b></summary>
<br>

- **Rich Text Editor** built with CKEditor 5
- **Real-time Preview** to see content as it will appear
- **Cover Image Selection** with built-in options and custom upload
- **Tag Management** for content categorization
- **Draft Auto-saving** to prevent content loss

</details>

<details>
<summary><b>🔍 Discovery & Navigation</b></summary>
<br>

- **Category Filtering** for posts and articles
- **Grid/List View** switching for content browsing
- **Enhanced Search** with filters and search history
- **Featured Stories** section highlighting top content
- **Latest Articles** with sorting options

</details>

<details>
<summary><b>⚡ Performance Features</b></summary>
<br>

- **Lazy Image Loading** using Intersection Observer API
- **Optimized Animations** with throttling and batching
- **LocalStorage Caching** for user preferences and data
- **Efficient DOM Updates** to prevent layout thrashing

</details>

## 🚀 Live Demo

Experience WikiBlog in action: [View Live Demo](https://om-gajjar.github.io/webpage/)

![WikiBlog Demo](https://i.ibb.co/LvS9jBm/wikiblog-demo.gif)

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/Om-Gajjar/webpage.git
cd webpage

# Open with your preferred server
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```

## 📋 Usage Guide

### 🎮 Key Features

| Feature | Description |
|---------|-------------|
| **Theme Toggle** | Click the moon/sun icon in the navbar to switch between dark and light mode |
| **Search** | Press `/` or click the search icon to access the enhanced search |
| **Content Filtering** | Use category pills to filter posts by topic |
| **View Switching** | Toggle between grid and list views in the articles section |
| **Article Creation** | Navigate to the Create section to write and publish articles |

### 📝 Creating Content

1. Click the "Start Writing" button in the hero section or navigate to the Create tab
2. Select your content type (Article, Tutorial, Wiki)
3. Enter a title and write your content using the rich text editor
4. Add tags and select a cover image
5. Preview your content before publishing
6. Click "Publish" to share your article

### ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `/` | Open search |
| `Esc` | Close modals |
| `Ctrl/⌘ + Enter` | Publish content (when in editor) |

## 🔧 Technology Stack

- **Frontend Core**
  - Vanilla JavaScript (ES6+)
  - Custom CSS with variables and modern features
  - HTML5 Semantic Elements

- **Browser APIs**
  - Intersection Observer API
  - LocalStorage API
  - Web Animation API

- **Libraries**
  - [AOS](https://michalsnik.github.io/aos/) for scroll animations
  - [CKEditor 5](https://ckeditor.com/ckeditor-5/) for rich text editing
  - [Font Awesome](https://fontawesome.com/) for icons

## 📁 Project Structure

```
webpage/
│
├── index.html              # Main HTML structure
├── styles.css              # Global styles and theme variables
├── scripts.js              # Core functionality and initialization
│
├── js/                     # JavaScript modules
│   ├── auth.js             # Authentication functionality
│   ├── blog.js             # Blog-specific features
│   ├── create.js           # Content creation functionality
│   │
│   └── utils/              # Utility modules
│       ├── ImageLoader.js  # Lazy-loading images
│       └── CategoryFilter.js # Category filtering functionality
│
└── README.md               # This file
```

## 📱 Responsive Design

WikiBlog is built with a mobile-first approach, ensuring a great experience across all devices:

<div align="center">

| Mobile View | Tablet View | Desktop View |
|:-----------:|:----------:|:------------:|
| <img src="https://i.ibb.co/cCjzMgB/wikiblog-mobile.png" width="200"> | <img src="https://i.ibb.co/26kQ5YX/wikiblog-tablet.png" width="300"> | <img src="preview.jpeg" width="400"> |

</div>

The layout adapts through carefully crafted media queries:

```css
/* Mobile (default) */
.container { padding: 0 1rem; }

/* Tablet */
@media (min-width: 768px) {
  .container { padding: 0 2rem; }
}

/* Desktop */
@media (min-width: 1024px) {
  .container { padding: 0 4rem; max-width: 1200px; margin: 0 auto; }
}
```

## ⚡ Performance Optimizations

- **Lazy Loading Images**: Images only load when they enter the viewport
- **Conditional Animations**: Animations are disabled on low-end devices
- **Efficient DOM Updates**: Batching DOM operations to reduce reflows
- **Intersection Observer**: Used for optimized scroll-based functionality
- **Animation Throttling**: Controls animation frequency for smoother performance

## 🗺️ Roadmap

- [ ] **Single Article View** - Dedicated page for each article with comments
- [ ] **Backend Integration** - Replace mock data with real API endpoints
- [ ] **User Profiles** - Detailed profiles with activity history
- [ ] **Social Features** - Sharing, following authors, and notifications
- [ ] **Mobile App** - Native mobile experience using web technologies
- [ ] **Analytics Dashboard** - For authors to track content performance

## 🤝 Contributing

We welcome contributions to WikiBlog! Please see our contributing guidelines for details.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to your branch: `git push origin feature/amazing-feature`
5. Open a pull request

---

<div align="center">
  
Made with ❤️ by [Om Gajjar](https://github.com/Om-Gajjar)

⬆ Back to Top

</div>