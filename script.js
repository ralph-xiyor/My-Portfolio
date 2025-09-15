// Enhanced Portfolio JavaScript with Interactive Features

// Global Variables
let isEditMode = false;
let originalContent = {};
let isLoading = true;

// DOM Elements
const body = document.body;
const themeToggle = document.getElementById('theme-toggle');
const editToggle = document.getElementById('edit-toggle');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notification-text');
const loadingScreen = document.getElementById('loading-screen');
const contactForm = document.getElementById('contact-form');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// App Initialization
function initializeApp() {
    // Simulate loading time
    setTimeout(() => {
        hideLoadingScreen();
        initializeFeatures();
        animateOnScroll();
        initializeSkillBars();
    }, 1500);
}

function hideLoadingScreen() {
    loadingScreen.classList.add('fade-out');
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        isLoading = false;
    }, 500);
}

function initializeFeatures() {
    // Theme Toggle
    initializeThemeToggle();
    
    // Edit Mode
    initializeEditMode();
    
    // Smooth Scrolling
    initializeSmoothScrolling();
    
    // Portfolio Filter
    initializePortfolioFilter();
    
    // Contact Form
    initializeContactForm();
    
    // Floating Elements
    initializeFloatingElements();
    
    // Social Media Links
    initializeSocialLinks();
    
    // Load saved theme
    loadSavedTheme();
    
    // Scroll to Top
    initializeScrollToTop();
}

// ===================
// THEME TOGGLE SYSTEM
// ===================

function initializeThemeToggle() {
    themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    body.classList.toggle('dark-mode');
    
    const isDarkMode = body.classList.contains('dark-mode');
    const themeIcon = document.getElementById('theme-icon');
    
    // Update icon
    if (isDarkMode) {
        themeIcon.className = 'bx bx-moon';
        showNotification('Dark mode activated! 🌙', 'success');
    } else {
        themeIcon.className = 'bx bx-sun';
        showNotification('Light mode activated! ☀️', 'success');
    }
    
    // Save theme preference
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Add smooth transition effect
    themeToggle.style.transform = 'scale(0.9)';
    setTimeout(() => {
        themeToggle.style.transform = 'scale(1)';
    }, 150);
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        document.getElementById('theme-icon').className = 'bx bx-moon';
    }
}

// ================
// EDIT MODE SYSTEM
// ================

function initializeEditMode() {
    editToggle.addEventListener('click', toggleEditMode);
    
    // Initialize section edit buttons
    const editSectionBtns = document.querySelectorAll('.edit-section-btn');
    editSectionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => toggleSectionEdit(e.target));
    });
    
    // Store original content
    storeOriginalContent();
}

function toggleEditMode() {
    isEditMode = !isEditMode;
    body.classList.toggle('edit-mode');
    editToggle.classList.toggle('active');
    
    if (isEditMode) {
        enableEditMode();
        showNotification('Edit mode enabled! Click on text to edit. ✏️', 'success');
    } else {
        disableEditMode();
        showNotification('Edit mode disabled! 👍', 'success');
    }
}

function enableEditMode() {
    const editableElements = document.querySelectorAll('.editable');
    
    editableElements.forEach(element => {
        element.setAttribute('contenteditable', 'true');
        element.addEventListener('blur', saveEditableContent);
        element.addEventListener('keydown', handleEditKeydown);
        
        // Add edit indicator
        element.style.position = 'relative';
    });
}

function disableEditMode() {
    const editableElements = document.querySelectorAll('.editable');
    
    editableElements.forEach(element => {
        element.setAttribute('contenteditable', 'false');
        element.removeEventListener('blur', saveEditableContent);
        element.removeEventListener('keydown', handleEditKeydown);
    });
    
    // Hide all save buttons
    const saveBtns = document.querySelectorAll('.save-section-btn');
    saveBtns.forEach(btn => {
        btn.classList.remove('show');
    });
}

function handleEditKeydown(e) {
    // Save on Enter (except for textareas)
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        e.target.blur();
    }
    
    // Cancel on Escape
    if (e.key === 'Escape') {
        const field = e.target.dataset.field;
        if (originalContent[field]) {
            e.target.textContent = originalContent[field];
        }
        e.target.blur();
    }
}

function saveEditableContent(e) {
    const field = e.target.dataset.field;
    const newContent = e.target.textContent.trim();
    
    if (originalContent[field] !== newContent) {
        // Save to localStorage
        const savedContent = JSON.parse(localStorage.getItem('portfolioContent') || '{}');
        savedContent[field] = newContent;
        localStorage.setItem('portfolioContent', JSON.stringify(savedContent));
        
        showNotification('Content saved! 💾', 'success');
        
        // Update original content
        originalContent[field] = newContent;
    }
}

function storeOriginalContent() {
    const editableElements = document.querySelectorAll('.editable');
    const savedContent = JSON.parse(localStorage.getItem('portfolioContent') || '{}');
    
    editableElements.forEach(element => {
        const field = element.dataset.field;
        const originalText = element.textContent.trim();
        
        // Use saved content if available, otherwise use original
        if (savedContent[field]) {
            element.textContent = savedContent[field];
            originalContent[field] = savedContent[field];
        } else {
            originalContent[field] = originalText;
        }
    });
}

function toggleSectionEdit(btn) {
    const targetSection = btn.dataset.target;
    const section = document.getElementById(targetSection);
    const saveBtn = document.querySelector(`.save-section-btn[data-target="${targetSection}"]`);
    
    if (section) {
        const editables = section.querySelectorAll('.editable');
        const isEditing = saveBtn.classList.contains('show');
        
        if (!isEditing) {
            // Enable editing for this section
            editables.forEach(el => {
                el.style.background = 'rgba(255, 193, 7, 0.1)';
                el.style.border = '2px dashed var(--warning-color)';
                el.style.borderRadius = '5px';
                el.style.padding = '5px';
            });
            
            saveBtn.classList.add('show');
            showNotification(`Editing ${targetSection} section...`, 'success');
        } else {
            // Save and disable editing
            editables.forEach(el => {
                el.style.background = '';
                el.style.border = '';
                el.style.borderRadius = '';
                el.style.padding = '';
                
                // Trigger save
                const field = el.dataset.field;
                if (field) {
                    saveEditableContent({target: el});
                }
            });
            
            saveBtn.classList.remove('show');
            showNotification(`${targetSection} section saved!`, 'success');
        }
    }
}

// ==================
// NOTIFICATION SYSTEM
// ==================

function showNotification(message, type = 'success') {
    notificationText.textContent = message;
    notification.className = `notification show ${type}`;
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// ===================
// SMOOTH SCROLLING
// ===================

function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.navbar a[data-section]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.dataset.section;
            const targetElement = document.getElementById(targetSection);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active nav link
                updateActiveNavLink(link);
            }
        });
    });
}

function updateActiveNavLink(activeLink) {
    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// =================
// PORTFOLIO FILTER
// =================

function initializePortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioBoxes = document.querySelectorAll('.portfolio-box');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter portfolio items
            portfolioBoxes.forEach(box => {
                const category = box.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    box.classList.remove('hidden');
                    setTimeout(() => {
                        box.style.transform = 'scale(1)';
                        box.style.opacity = '1';
                    }, 100);
                } else {
                    box.classList.add('hidden');
                }
            });
            
            showNotification(`Showing ${filter === 'all' ? 'all' : filter} projects`, 'success');
        });
    });
}

// ===============
// CONTACT FORM
// ===============

function initializeContactForm() {
    contactForm.addEventListener('submit', handleContactSubmit);
}

async function handleContactSubmit(e) {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnIcon = submitBtn.querySelector('.btn-icon');
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate form submission
    try {
        await simulateFormSubmission();
        
        // Success
        showNotification('Message sent successfully! 📧', 'success');
        contactForm.reset();
        
        // Add success animation
        submitBtn.style.background = 'var(--success-color)';
        btnIcon.className = 'bx bx-check';
        
        setTimeout(() => {
            submitBtn.style.background = '';
            btnIcon.className = 'bx bx-send';
        }, 2000);
        
    } catch (error) {
        showNotification('Failed to send message. Please try again.', 'error');
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

function simulateFormSubmission() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // 90% success rate simulation
            if (Math.random() > 0.1) {
                resolve();
            } else {
                reject(new Error('Submission failed'));
            }
        }, 2000);
    });
}

// =================
// SCROLL ANIMATIONS
// =================

function animateOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('section');
    animateElements.forEach((el, index) => {
        // Add appropriate animation class
        if (index % 2 === 0) {
            el.classList.add('fade-in');
        } else {
            el.classList.add('slide-in-left');
        }
        observer.observe(el);
    });
}

// =============
// SKILL BARS
// =============

function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillLevel = entry.target.dataset.skill;
                entry.target.style.width = skillLevel + '%';
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// ==================
// FLOATING ELEMENTS
// ==================

function initializeFloatingElements() {
    const floatingElements = document.querySelectorAll('.float-element');
    
    floatingElements.forEach((element, index) => {
        // Random initial position
        const randomX = Math.random() * 80 + 10;
        const randomY = Math.random() * 80 + 10;
        
        element.style.left = randomX + '%';
        element.style.top = randomY + '%';
        
        // Different animation speeds
        const speed = element.dataset.speed || 1;
        element.style.animationDuration = `${6 * speed}s`;
        element.style.animationDelay = `${index * 0.5}s`;
    });
    
    // Add mouse interaction
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        floatingElements.forEach((element, index) => {
            const speed = (index + 1) * 0.5;
            const x = mouseX * speed;
            const y = mouseY * speed;
            
            element.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

// ================
// SOCIAL MEDIA LINKS
// ================

function initializeSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = link.dataset.platform;
            
            // Add click animation
            link.style.transform = 'scale(0.9)';
            setTimeout(() => {
                link.style.transform = '';
            }, 150);
            
            // Show notification instead of opening link (since these are placeholder links)
            showNotification(`Opening ${platform} profile...`, 'success');
            
            // In a real implementation, you would redirect to actual social media profiles
            // window.open(`https://${platform}.com/your-profile`, '_blank');
        });
        
        // Add hover effect with emoji
        const platformEmojis = {
            'facebook': '👍',
            'instagram': '📸',
            'twitter': '🐦',
            'youtube': '🎥'
        };
        
        link.addEventListener('mouseenter', () => {
            const platform = link.dataset.platform;
            const emoji = platformEmojis[platform];
            if (emoji) {
                showNotification(`${emoji} ${platform.charAt(0).toUpperCase() + platform.slice(1)}`, 'success');
                setTimeout(() => {
                    notification.classList.remove('show');
                }, 1000);
            }
        });
    });
}

// =================
// SCROLL TO TOP
// =================

function initializeScrollToTop() {
    const scrollTopBtn = document.querySelector('.scroll-top');
    
    // Show/hide scroll top button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.transform = 'scale(1)';
        } else {
            scrollTopBtn.style.opacity = '0.7';
            scrollTopBtn.style.transform = 'scale(0.8)';
        }
    });
    
    scrollTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Smooth scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Add click animation
        scrollTopBtn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            scrollTopBtn.style.transform = 'scale(1)';
        }, 200);
        
        showNotification('Back to top! 🚀', 'success');
    });
}

// ==================
// ADVANCED FEATURES
// ==================

// Typing Animation for Hero Text
function initializeTypingAnimation() {
    const textElement = document.querySelector('.home-text h3 span');
    const texts = ['Software Developer', 'Full Stack Engineer', 'Problem Solver', 'Code Enthusiast'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeText() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            textElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            textElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; // Wait before deleting
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500; // Wait before typing next text
        }
        
        setTimeout(typeText, typeSpeed);
    }
    
    // Start typing animation after loading
    setTimeout(typeText, 2000);
}

// Parallax Effect for Background
function initializeParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        document.body.style.backgroundPositionY = rate + 'px';
    });
}

// Dynamic Progress Bars for Skills
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const targetWidth = bar.dataset.skill;
        let currentWidth = 0;
        
        const interval = setInterval(() => {
            if (currentWidth >= targetWidth) {
                clearInterval(interval);
                return;
            }
            
            currentWidth += 2;
            bar.style.width = currentWidth + '%';
        }, 50);
    });
}

// Interactive Cursor Effect
function initializeCustomCursor() {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);
    
    // Add CSS for custom cursor
    const style = document.createElement('style');
    style.textContent = `
        .custom-cursor {
            width: 20px;
            height: 20px;
            background: var(--text-color);
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: difference;
            transition: transform 0.1s ease;
        }
        
        .custom-cursor.hover {
            transform: scale(2);
        }
    `;
    document.head.appendChild(style);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    // Add hover effects
    const hoverElements = document.querySelectorAll('a, button, .btn');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

// Easter Egg - Konami Code
function initializeEasterEgg() {
    const konamiCode = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];
    let userInput = [];
    
    document.addEventListener('keydown', (e) => {
        userInput.push(e.code);
        
        if (userInput.length > konamiCode.length) {
            userInput.shift();
        }
        
        if (userInput.join('') === konamiCode.join('')) {
            activateEasterEgg();
            userInput = [];
        }
    });
    
    function activateEasterEgg() {
        showNotification('🎉 Easter egg activated! You found the secret! 🎉', 'success');
        
        // Add special effects
        document.body.style.animation = 'rainbow 2s linear infinite';
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
}

// Performance Optimization - Lazy Loading
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        img.classList.add('lazy');
        imageObserver.observe(img);
    });
}

// Local Storage Management
function savePortfolioState() {
    const state = {
        theme: body.classList.contains('dark-mode') ? 'dark' : 'light',
        editedContent: originalContent,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('portfolioState', JSON.stringify(state));
}

function loadPortfolioState() {
    const saved = localStorage.getItem('portfolioState');
    if (saved) {
        const state = JSON.parse(saved);
        
        // Load theme
        if (state.theme === 'dark') {
            body.classList.add('dark-mode');
            document.getElementById('theme-icon').className = 'bx bx-moon';
        }
        
        // Load edited content
        if (state.editedContent) {
            Object.keys(state.editedContent).forEach(field => {
                const element = document.querySelector(`[data-field="${field}"]`);
                if (element) {
                    element.textContent = state.editedContent[field];
                }
            });
        }
    }
}

// Initialize all advanced features
function initializeAdvancedFeatures() {
    initializeTypingAnimation();
    initializeParallaxEffect();
    initializeCustomCursor();
    initializeEasterEgg();
    initializeLazyLoading();
    loadPortfolioState();
    
    // Save state before page unload
    window.addEventListener('beforeunload', savePortfolioState);
}

// Initialize advanced features after main features
setTimeout(initializeAdvancedFeatures, 2000);

// =================
// UTILITY FUNCTIONS
// =================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Random utility function
function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

// Color utility functions
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Console Easter Egg
console.log(`
    🚀 Welcome to Ralph's Interactive Portfolio!
    
    Try these cool features:
    • Toggle between light/dark themes
    • Enable edit mode to modify content
    • Filter portfolio projects
    • Try the Konami code for a surprise!
    
    Built with ❤️ and JavaScript
`);

// Export functions for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        toggleTheme,
        toggleEditMode,
        showNotification
    };
}