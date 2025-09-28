// Portfolio Website JavaScript
// Handles navigation, form submission, and interactive features

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initializeNavigation();
    initializeMobileMenu();
    initializeContactForm();
    initializeScrollAnimations();
});

// Navigation and Smooth Scrolling
function initializeNavigation() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-link, .nav-mobile-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Add click event listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            scrollToSection(targetId);
            
            // Close mobile menu if open
            closeMobileMenu();
        });
    });

    // Highlight active section on scroll
    window.addEventListener('scroll', throttle(updateActiveSection, 100));
    
    function updateActiveSection() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        // Update active states
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    // Initial active section update
    updateActiveSection();
}

// Smooth scroll function
function scrollToSection(sectionId) {
    const section = document.querySelector(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80; // Account for fixed nav
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Make scrollToSection globally available for button onclick handlers
window.scrollToSection = scrollToSection;

// Mobile Menu Functionality
function initializeMobileMenu() {
    const mobileToggle = document.querySelector('.nav-mobile-toggle');
    const mobileMenu = document.querySelector('.nav-mobile');
    const menuIcon = document.querySelector('.menu-icon');
    const closeIcon = document.querySelector('.close-icon');

    if (!mobileToggle || !mobileMenu) return;

    mobileToggle.addEventListener('click', function() {
        const isOpen = !mobileMenu.classList.contains('hidden');
        
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    function openMobileMenu() {
        mobileMenu.classList.remove('hidden');
        menuIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent body scroll
    }

    function closeMobileMenu() {
        mobileMenu.classList.add('hidden');
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
        document.body.style.overflow = ''; // Restore body scroll
    }

    // Make closeMobileMenu available globally
    window.closeMobileMenu = closeMobileMenu;

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
}

// Close mobile menu function
function closeMobileMenu() {
    const mobileMenu = document.querySelector('.nav-mobile');
    const menuIcon = document.querySelector('.menu-icon');
    const closeIcon = document.querySelector('.close-icon');
    
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Contact Form Functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const buttonText = submitButton.querySelector('.btn-text');
        const buttonLoading = submitButton.querySelector('.btn-loading');
        
        // Set loading state
        setSubmitButtonLoading(true);
        
        try {
            // Simulate form submission delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Show success toast
            showToast(
                'Message Sent!',
                'Thank you for your message. I\'ll get back to you soon.'
            );
            
            // Reset form
            contactForm.reset();
            
        } catch (error) {
            // Show error toast
            showToast(
                'Error',
                'There was a problem sending your message. Please try again.',
                'error'
            );
        } finally {
            // Remove loading state
            setSubmitButtonLoading(false);
        }
    });

    function setSubmitButtonLoading(loading) {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const buttonText = submitButton.querySelector('.btn-text');
        const buttonLoading = submitButton.querySelector('.btn-loading');
        
        if (loading) {
            submitButton.disabled = true;
            buttonText.classList.add('hidden');
            buttonLoading.classList.remove('hidden');
        } else {
            submitButton.disabled = false;
            buttonText.classList.remove('hidden');
            buttonLoading.classList.add('hidden');
        }
    }
}

// Toast Notification System
function showToast(title, description, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    
    if (!toastContainer) {
        console.error('Toast container not found');
        return;
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <button class="toast-close" onclick="closeToast(this.parentElement)">&times;</button>
        <div class="toast-title">${escapeHtml(title)}</div>
        <div class="toast-description">${escapeHtml(description)}</div>
    `;

    // Add type-specific styling
    if (type === 'error') {
        toast.style.borderColor = 'hsl(0, 84.2%, 60.2%)';
        toast.querySelector('.toast-title').style.color = 'hsl(0, 84.2%, 60.2%)';
    }

    // Add to container
    toastContainer.appendChild(toast);

    // Trigger show animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
        closeToast(toast);
    }, 5000);
}

// Close toast function
function closeToast(toast) {
    if (!toast) return;
    
    toast.classList.remove('show');
    
    // Remove from DOM after animation
    setTimeout(() => {
        if (toast.parentElement) {
            toast.parentElement.removeChild(toast);
        }
    }, 300);
}

// Make closeToast globally available
window.closeToast = closeToast;

// Scroll Animations
function initializeScrollAnimations() {
    // Animate skill progress bars when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll('.skill-progress');
                progressBars.forEach(bar => {
                    bar.style.animationDelay = Math.random() * 0.5 + 's';
                });
            }
        });
    }, {
        threshold: 0.5
    });

    // Observe skills section
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        observer.observe(skillsSection);
    }

    // Add fade-in animation for sections
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    // Apply initial styles and observe sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        if (section.id !== 'home') { // Skip hero section
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            sectionObserver.observe(section);
        }
    });
}

// Utility Functions
function throttle(func, wait) {
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

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Form Validation Enhancement
function initializeFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const inputs = form.querySelectorAll('.form-input');
    
    inputs.forEach(input => {
        // Real-time validation feedback
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            // Clear error state when user starts typing
            if (this.classList.contains('error')) {
                this.classList.remove('error');
            }
        });
    });

    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
            }
        }

        // Apply visual feedback
        if (isValid) {
            field.classList.remove('error');
        } else {
            field.classList.add('error');
        }

        return isValid;
    }

    // Validate entire form before submission
    form.addEventListener('submit', function(e) {
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            e.preventDefault();
            showToast(
                'Validation Error',
                'Please fill in all required fields correctly.',
                'error'
            );
        }
    });
}

// Initialize form validation
document.addEventListener('DOMContentLoaded', function() {
    initializeFormValidation();
});

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
    // Navigate sections with arrow keys (when not in form inputs)
    if (document.activeElement.tagName !== 'INPUT' && 
        document.activeElement.tagName !== 'TEXTAREA') {
        
        const sections = Array.from(document.querySelectorAll('section[id]'));
        let currentIndex = -1;
        
        // Find current section
        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentIndex = index;
            }
        });

        if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
            e.preventDefault();
            scrollToSection('#' + sections[currentIndex + 1].id);
        } else if (e.key === 'ArrowUp' && currentIndex > 0) {
            e.preventDefault();
            scrollToSection('#' + sections[currentIndex - 1].id);
        }
    }
});

// Accessibility Enhancements
function initializeAccessibility() {
    // Focus management for mobile menu
    const mobileToggle = document.querySelector('.nav-mobile-toggle');
    const mobileMenu = document.querySelector('.nav-mobile');
    
    if (mobileToggle && mobileMenu) {
        const focusableElements = mobileMenu.querySelectorAll(
            'a[href], button, [tabindex]:not([tabindex="-1"])'
        );
        
        mobileToggle.addEventListener('click', function() {
            setTimeout(() => {
                if (!mobileMenu.classList.contains('hidden') && focusableElements.length > 0) {
                    focusableElements[0].focus();
                }
            }, 100);
        });
    }

    // Skip to content link (for screen readers)
    const skipLink = document.createElement('a');
    skipLink.href = '#home';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--color-primary);
        color: var(--color-primary-foreground);
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.2s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', function() {
    initializeAccessibility();
});

// Scroll to top functionality
function addScrollToTop() {
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: var(--color-primary);
        color: var(--color-primary-foreground);
        border: none;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: var(--shadow-lg);
    `;
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', throttle(function() {
        if (window.scrollY > 300) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.visibility = 'visible';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.visibility = 'hidden';
        }
    }, 100));
    
    document.body.appendChild(scrollTopBtn);
}

// Initialize scroll to top
document.addEventListener('DOMContentLoaded', function() {
    addScrollToTop();
});

// Performance: Preload critical resources
function preloadCriticalResources() {
    // Preload Google Fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'dns-prefetch';
    fontLink.href = '//fonts.googleapis.com';
    document.head.appendChild(fontLink);
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', function() {
    preloadCriticalResources();
});

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You could send this to an error tracking service
});

// Console welcome message
console.log(`
🎉 Linwell B. Auteda - Portfolio Website
📧 Contact: linwellauteda4@gmail.com
📱 Phone: +639639753215

Built with vanilla HTML, CSS, and JavaScript
`);

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        scrollToSection,
        showToast,
        closeToast,
        throttle,
        escapeHtml
    };
}