# Modern Wiki & Blog Platform 🚀

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![JavaScript](https://img.shields.io/badge/javascript-ES6+-yellow.svg)](https://www.ecma-international.org/ecma-262/)
[![CSS](https://img.shields.io/badge/css-custom_properties-orange.svg)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
[![Responsive](https://img.shields.io/badge/responsive-mobile_first-green.svg)](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)

A modern, responsive web platform for knowledge sharing and blogging with rich features, smooth animations, and an intuitive user interface.

![Platform Preview](preview.jpeg)

## ✨ Features

### 💻 User Interface
- Responsive design with mobile-first approach
- Dark/Light theme with system preference detection
- Glass morphism effects and smooth transitions
- Custom scrollbar styling
- Loading states and placeholders
- Interactive hover effects

### 📝 Content Creation
- Rich text editor with markdown support
- Real-time preview
- Image and video embedding
- Code syntax highlighting
- Tag management system
- Draft auto-saving
- Keyboard shortcuts
- File drag & drop

### 🔍 Search & Discovery
- Advanced search with filters
- Category-based browsing
- Grid/List view switching
- Infinite scroll loading
- Search history tracking
- Related content suggestions
- Trending topics

### 🎯 Performance
- Lazy loading images
- Intersection Observer usage
- Optimized animations
- Debounced search
- Local storage caching
- Minified assets
- Progressive loading

## 🛠️ Technical Stack

### Frontend
- Vanilla JavaScript (ES6+)
- Custom CSS with variables
- CSS Grid & Flexbox
- IntersectionObserver API
- LocalStorage API
- Fetch API

### Libraries
- Font Awesome (icons)
- AOS (animations)
- Inter font (typography)

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/Om-Gajjar/modern-wiki-blog.git
cd modern-wiki-blog
```

2. Open with live server or directly in browser:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

## 🎮 Usage Guide

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `/` | Open search |
| `Esc` | Close modals |
| `⌘ + Enter` | Publish content |
| `⌘ + S` | Save draft |
| `⌘ + D` | Toggle dark mode |

### Content Creation
1. Click "Start Writing" or press `N`
2. Choose content type:
   - Article
   - Tutorial
   - Wiki
3. Add title and content
4. Use toolbar for formatting
5. Add tags for categorization
6. Preview and publish

### Theme Customization
Modify CSS variables in `styles.css`:
```css
:root {
  --primary: #2563eb;
  --secondary: #8b5cf6;
  --accent: #f59e0b;
  /* ...other variables */
}
```

## 🎨 Components

### Layout Components
- Navigation bar with user menu
- Search modal with filters
- Content editor with toolbar
- Featured posts grid
- Blog post cards
- About section
- Footer with sections

### Interactive Elements
- Category pills
- View switcher
- Tag chips
- Loading states
- Toast notifications
- Dropdown menus
- Modal windows

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 768px) { }

/* Tablet */
@media (max-width: 1024px) { }

/* Desktop */
@media (min-width: 1025px) { }
```

## 🔧 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 📊 Performance Optimizations

- Image lazy loading
- CSS containment
- Efficient animations
- Debounced search
- Asset optimization
- Memory management
- Virtual scroll for large lists

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/name`)
3. Commit changes (`git commit -am 'Add feature'`)
4. Push to branch (`git push origin feature/name`)
5. Open pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Credits

- Icons: [Font Awesome](https://fontawesome.com)
- Images: [Pexels](https://www.pexels.com)
- Animations: [AOS Library](https://michalsnik.github.io/aos/)
- Fonts: [Google Fonts](https://fonts.google.com)

## 📞 Support

- GitHub Issues: [Report Bug](https://github.com/Om-Gajjar/modern-wiki-blog/issues)
- Email: support@example.com
- Documentation: [Wiki](https://github.com/Om-Gajjar/modern-wiki-blog/wiki)

## 🗺️ Roadmap

- [ ] Authentication system
- [ ] Comment system
- [ ] Real-time collaboration
- [ ] Advanced analytics
- [ ] API documentation
- [ ] Mobile app version
- [ ] Offline support
- [ ] Multi-language support

## 🌟 Contributors

<a href="https://github.com/yourusername/modern-wiki-blog/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=yourusername/modern-wiki-blog" />
</a>

---

Made with ❤️ by [Om Gajjar](https://github.com/Om-Gajjar)
