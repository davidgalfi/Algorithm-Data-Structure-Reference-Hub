document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize theme
    initializeTheme();
    
    // Add smooth scrolling
    addSmoothScrolling();
    
    // Initialize search functionality
    initializeSearch();
    
    // Add loading states to buttons
    addLoadingStates();
    
    // Initialize code copy functionality
    initializeCodeCopy();
});

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('dsa-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('dsa-theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Add transition effect
    document.body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('theme-icon');
    if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Smooth Scrolling
function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Enhanced Search Functionality
function initializeSearch() {
    const searchInputs = document.querySelectorAll('input[type="text"][placeholder*="Search"]');
    
    searchInputs.forEach(input => {
        let debounceTimer;
        input.addEventListener('input', function() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                highlightSearchResults(this.value);
            }, 300);
        });
    });
}

function highlightSearchResults(searchTerm) {
    if (!searchTerm) {
        removeHighlights();
        return;
    }
    
    const cards = document.querySelectorAll('.card-title, .card-text');
    cards.forEach(element => {
        const text = element.textContent;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        const highlightedText = text.replace(regex, '<span class="search-highlight">$1</span>');
        
        if (text !== highlightedText) {
            element.innerHTML = highlightedText;
        }
    });
}

function removeHighlights() {
    const highlighted = document.querySelectorAll('.search-highlight');
    highlighted.forEach(element => {
        const parent = element.parentNode;
        parent.replaceChild(document.createTextNode(element.textContent), element);
        parent.normalize();
    });
}

// Loading States for Buttons
function addLoadingStates() {
    const buttons = document.querySelectorAll('.btn[type="submit"]');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.type === 'submit') {
                this.innerHTML = '<span class="loading"></span> Processing...';
                this.disabled = true;
            }
        });
    });
}

// Code Copy Functionality
function initializeCodeCopy() {
    // Add copy buttons to all code blocks
    document.querySelectorAll('pre code').forEach(codeBlock => {
        if (!codeBlock.parentNode.querySelector('.copy-btn')) {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'btn btn-sm btn-outline-secondary copy-btn';
            copyBtn.innerHTML = '<i class="fas fa-copy me-1"></i>Copy';
            copyBtn.style.position = 'absolute';
            copyBtn.style.top = '10px';
            copyBtn.style.right = '10px';
            
            codeBlock.parentNode.style.position = 'relative';
            codeBlock.parentNode.appendChild(copyBtn);
            
            copyBtn.addEventListener('click', () => copyCodeToClipboard(codeBlock));
        }
    });
}

function copyCode(elementId) {
    const codeElement = document.querySelector(`#${elementId} code`);
    copyCodeToClipboard(codeElement);
}

function copyCodeToClipboard(codeElement) {
    const text = codeElement.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        showCopySuccess();
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showCopySuccess();
    });
}

function showCopySuccess() {
    // Create temporary success message
    const message = document.createElement('div');
    message.className = 'alert alert-success position-fixed';
    message.style.top = '20px';
    message.style.right = '20px';
    message.style.zIndex = '9999';
    message.innerHTML = '<i class="fas fa-check me-2"></i>Code copied to clipboard!';
    
    document.body.appendChild(message);
    
    // Animate in
    setTimeout(() => message.classList.add('fade-in'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        message.style.opacity = '0';
        setTimeout(() => document.body.removeChild(message), 300);
    }, 3000);
}

// Complexity Badge Coloring
function updateComplexityBadges() {
    document.querySelectorAll('.badge').forEach(badge => {
        const text = badge.textContent.toLowerCase();
        
        if (text.includes('o(1)')) {
            badge.classList.add('complexity-o1');
        } else if (text.includes('o(log n)')) {
            badge.classList.add('complexity-ologn');
        } else if (text.includes('o(n)') && !text.includes('o(n²)')) {
            badge.classList.add('complexity-on');
        } else if (text.includes('o(n²)')) {
            badge.classList.add('complexity-on2');
        } else if (text.includes('o(2^n)') || text.includes('exponential')) {
            badge.classList.add('complexity-exponential');
        }
    });
}

// Initialize complexity badges when page loads
document.addEventListener('DOMContentLoaded', updateComplexityBadges);

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 150);
        }
    }, 5000);
}

// Add animation classes to elements as they come into view
function addScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    });
    
    document.querySelectorAll('.card').forEach(card => {
        observer.observe(card);
    });
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', addScrollAnimations);

// Enhanced copy code functionality
function copyCode(elementId) {
    const codeElement = document.querySelector(`#${elementId} code`);
    if (!codeElement) {
        console.error('Code element not found:', elementId);
        return;
    }
    
    const text = codeElement.textContent;
    
    // Use modern clipboard API with fallback
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showCopySuccess();
        }).catch(() => {
            fallbackCopyText(text);
        });
    } else {
        fallbackCopyText(text);
    }
}

function fallbackCopyText(text) {
    // Fallback for older browsers or non-HTTPS
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopySuccess();
    } catch (err) {
        console.error('Fallback copy failed:', err);
        showNotification('Copy failed. Please select and copy manually.', 'error');
    }
    
    document.body.removeChild(textArea);
}

function showCopySuccess() {
    // Create and show success notification
    const notification = document.createElement('div');
    notification.className = 'alert alert-success position-fixed';
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 250px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    notification.innerHTML = `
        <i class="fas fa-check me-2"></i>Code copied to clipboard!
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Enhanced search functionality with real-time filtering
function initializeAdvancedSearch() {
    const searchInput = document.getElementById('search');
    const categoryFilter = document.getElementById('category-filter');
    
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch();
            }, 300);
        });
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', performSearch);
    }
}

function performSearch() {
    const searchTerm = document.getElementById('search')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('category-filter')?.value || 'all';
    
    // Filter data structures
    const structureCards = document.querySelectorAll('.structure-card');
    structureCards.forEach(card => {
        const name = card.dataset.name || '';
        const category = card.dataset.category || '';
        
        const matchesSearch = name.includes(searchTerm) || 
                            card.textContent.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryFilter === 'all' || category === categoryFilter;
        
        if (matchesSearch && matchesCategory) {
            card.style.display = 'block';
            card.classList.add('fade-in');
        } else {
            card.style.display = 'none';
        }
    });
    
    // Filter algorithms
    const algorithmCards = document.querySelectorAll('.algorithm-card');
    algorithmCards.forEach(card => {
        const name = card.dataset.name || '';
        const category = card.dataset.category || '';
        
        const matchesSearch = name.includes(searchTerm) || 
                            card.textContent.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryFilter === 'all' || category === categoryFilter;
        
        if (matchesSearch && matchesCategory) {
            card.style.display = 'block';
            card.classList.add('fade-in');
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show/hide no results message
    updateNoResultsMessage();
}

function updateNoResultsMessage() {
    const visibleCards = document.querySelectorAll('.structure-card:not([style*="display: none"]), .algorithm-card:not([style*="display: none"])');
    const container = document.getElementById('structures-container') || document.getElementById('algorithms-container');
    
    if (container && visibleCards.length === 0) {
        let noResultsMsg = container.querySelector('.no-results-message');
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'col-12 no-results-message';
            noResultsMsg.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-search fa-4x text-muted mb-3"></i>
                    <h4 class="text-muted">No results found</h4>
                    <p class="text-muted">Try adjusting your search terms or filters</p>
                </div>
            `;
            container.appendChild(noResultsMsg);
        }
        noResultsMsg.style.display = 'block';
    } else {
        const noResultsMsg = container?.querySelector('.no-results-message');
        if (noResultsMsg) {
            noResultsMsg.style.display = 'none';
        }
    }
}

// Keyboard shortcuts
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('search');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }
        
        // Escape to clear search
        if (e.key === 'Escape') {
            const searchInput = document.getElementById('search');
            if (searchInput && searchInput === document.activeElement) {
                searchInput.value = '';
                performSearch();
                searchInput.blur();
            }
        }
    });
}

// Performance monitoring
function initializePerformanceMonitoring() {
    // Monitor page load time
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
        
        // Show performance warning if page loads slowly
        if (loadTime > 3000) {
            showNotification('Page loaded slowly. Consider clearing your browser cache.', 'warning');
        }
    });
}

// Initialize all enhanced features
document.addEventListener('DOMContentLoaded', function() {
    // Existing initialization
    initializeTheme();
    addSmoothScrolling();
    initializeSearch();
    addLoadingStates();
    initializeCodeCopy();
    updateComplexityBadges();
    addScrollAnimations();
    
    // New enhanced features
    initializeAdvancedSearch();
    initializeKeyboardShortcuts();
    initializePerformanceMonitoring();
    
    // Add search shortcut hint
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.placeholder += ' (Ctrl+K)';
    }
});

// Export functions for global access
window.DSAApp = {
    copyCode,
    showNotification,
    performSearch,
    toggleTheme
};

