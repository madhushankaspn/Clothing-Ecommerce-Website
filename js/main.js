// ===== GLOBAL VARIABLES =====
let products = [];
let cart = [];
let users = [];
let orders = [];
let reviews = [];
let currentUser = null;
let currentSlide = 0;
let slideshowInterval = null;

/// ===== HERO BACKGROUND SLIDESHOW =====
let currentSlide = 0;
let slideshowInterval;

const heroImages = [
    'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
];

function changeHeroBackground() {
    const hero = document.querySelector('.hero');
    if (hero) {
        // Add fade out effect
        hero.style.transition = 'opacity 0.5s ease-in-out';
        hero.style.opacity = '0';
        
        setTimeout(() => {
            // Change background image
            hero.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('${heroImages[currentSlide]}')`;
            hero.style.backgroundSize = 'cover';
            hero.style.backgroundPosition = 'center';
            hero.style.backgroundRepeat = 'no-repeat';
            
            // Fade back in
            hero.style.opacity = '1';
            
            // Update slide index
            currentSlide = (currentSlide + 1) % heroImages.length;
        }, 250);
    }
}

function startSlideshow() {
    // Set initial background
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('${heroImages[0]}')`;
        hero.style.backgroundSize = 'cover';
        hero.style.backgroundPosition = 'center';
        hero.style.backgroundRepeat = 'no-repeat';
        hero.style.transition = 'opacity 0.5s ease-in-out';
    }
    
    // Start interval (change every 2 seconds)
    slideshowInterval = setInterval(changeHeroBackground, 2000);
}

// Initialize slideshow when page loads
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    
    // Start hero slideshow
    if (document.querySelector('.hero')) {
        startSlideshow();
    }
});

// Optional: Stop slideshow when user hovers over hero
function stopSlideshow() {
    clearInterval(slideshowInterval);
}

function restartSlideshow() {
    slideshowInterval = setInterval(changeHeroBackground, 2000);
}

// Add hover effects
if (document.querySelector('.hero')) {
    document.querySelector('.hero').addEventListener('mouseenter', stopSlideshow);
    document.querySelector('.hero').addEventListener('mouseleave', restartSlideshow);
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Hide loader after page loads
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('hidden');
        }
    }, 500);

    // Initialize data from localStorage
    loadData();
    
    // Update cart count
    updateCartCount();
    
    // Setup mobile menu
    setupMobileMenu();
    
    // Load featured products on home page
    if (document.getElementById('featuredProducts')) {
        loadFeaturedProducts();
    }
    
    // Update user display after loading data
    updateUserDisplay();
    
    // Set active nav link
    setActiveNavLink();
    
    // Start hero slideshow
    if (document.querySelector('.hero')) {
        startSlideshow();
    }
    
    // Add newsletter subscription if exists
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                showNotification('Subscribed successfully!', 'success');
                this.reset();
            }
        });
    }
});

// ===== DATA MANAGEMENT =====
function loadData() {
    // Load products
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        // Initialize with sample products
        products = [
            {
                id: 1,
                name: "Classic Black T-Shirt",
                price: 29.99,
                image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                category: "tshirts",
                sizes: ["S", "M", "L", "XL"],
                colors: ["Black", "White", "Gray"],
                description: "Premium cotton classic fit t-shirt. Comfortable and stylish."
            },
            {
                id: 2,
                name: "Slim Fit Jeans",
                price: 79.99,
                image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                category: "jeans",
                sizes: ["30", "32", "34", "36"],
                colors: ["Blue", "Black"],
                description: "Modern slim fit jeans with stretch comfort. Perfect for everyday wear."
            },
            {
                id: 3,
                name: "Leather Jacket",
                price: 199.99,
                image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                category: "jackets",
                sizes: ["S", "M", "L", "XL"],
                colors: ["Black", "Brown"],
                description: "Genuine leather jacket with quilted lining. Timeless style."
            },
            {
                id: 4,
                name: "Canvas Sneakers",
                price: 49.99,
                image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                category: "accessories",
                sizes: ["7", "8", "9", "10", "11"],
                colors: ["White", "Black", "Red"],
                description: "Classic canvas sneakers with cushioned insole. Perfect for casual wear."
            },
            {
                id: 5,
                name: "Hooded Sweatshirt",
                price: 59.99,
                image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                category: "tshirts",
                sizes: ["S", "M", "L", "XL"],
                colors: ["Gray", "Black", "Navy"],
                description: "Cozy hoodie with front pocket. Perfect for casual days."
            },
            {
                id: 6,
                name: "Denim Jacket",
                price: 89.99,
                image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                category: "jackets",
                sizes: ["S", "M", "L", "XL"],
                colors: ["Blue", "Black"],
                description: "Classic denim jacket. Timeless style that never goes out."
            }
        ];
        saveProducts();
    }
    
    // Load cart
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    
    // Load users
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    } else {
        // Create default admin
        users = [
            {
                id: 1,
                name: "Admin User",
                email: "admin@urbanstyle.com",
                password: "admin123",
                isAdmin: true
            }
        ];
        saveUsers();
    }
    
    // Load orders
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
    }
    
    // Load reviews
    const savedReviews = localStorage.getItem('reviews');
    if (savedReviews) {
        reviews = JSON.parse(savedReviews);
    }
    
    // Load current user
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
}

function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

function saveOrders() {
    localStorage.setItem('orders', JSON.stringify(orders));
}

function saveReviews() {
    localStorage.setItem('reviews', JSON.stringify(reviews));
}

function saveCurrentUser() {
    if (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
        localStorage.removeItem('currentUser');
    }
}

// ===== HERO BACKGROUND SLIDESHOW =====
function changeHeroBackground() {
    const hero = document.querySelector('.hero');
    if (hero && slideshowInterval) {
        // Add fade out effect
        hero.style.transition = 'opacity 0.5s ease-in-out';
        hero.style.opacity = '0';
        
        setTimeout(() => {
            // Change background image with gradient overlay
            hero.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('${heroImages[currentSlide]}')`;
            hero.style.backgroundSize = 'cover';
            hero.style.backgroundPosition = 'center';
            hero.style.backgroundRepeat = 'no-repeat';
            
            // Fade back in
            hero.style.opacity = '1';
            
            // Update slide index for next time
            currentSlide = (currentSlide + 1) % heroImages.length;
        }, 250);
    }
}

function startSlideshow() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    // Set initial background
    hero.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('${heroImages[0]}')`;
    hero.style.backgroundSize = 'cover';
    hero.style.backgroundPosition = 'center';
    hero.style.backgroundRepeat = 'no-repeat';
    hero.style.transition = 'opacity 0.5s ease-in-out';
    
    // Start with slide 1
    currentSlide = 1;
    
    // Clear any existing interval
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
    }
    
    // Start interval to change every 2 seconds
    slideshowInterval = setInterval(changeHeroBackground, 2000);
    
    // Add hover controls
    hero.addEventListener('mouseenter', function() {
        if (slideshowInterval) {
            clearInterval(slideshowInterval);
            slideshowInterval = null;
        }
    });
    
    hero.addEventListener('mouseleave', function() {
        if (!slideshowInterval) {
            slideshowInterval = setInterval(changeHeroBackground, 2000);
        }
    });
}

// ===== USER ACCOUNT DISPLAY =====
function updateUserDisplay() {
    const authNavItem = document.getElementById('authNavItem');
    const userAccountNav = document.getElementById('userAccountNav');
    const userNameSpan = document.getElementById('userName');
    const authLink = document.getElementById('authLink');
    
    if (currentUser) {
        // User is logged in - show account dropdown
        if (authNavItem) authNavItem.style.display = 'none';
        if (userAccountNav) {
            userAccountNav.style.display = 'block';
            // Display user's name (first name or email)
            const displayName = currentUser.name ? currentUser.name.split(' ')[0] : currentUser.email.split('@')[0];
            if (userNameSpan) userNameSpan.textContent = displayName;
            
            // Add user avatar
            const userAccount = document.querySelector('.user-account');
            if (userAccount && !userAccount.querySelector('.user-avatar')) {
                const avatar = document.createElement('div');
                avatar.className = 'user-avatar';
                avatar.textContent = displayName.charAt(0).toUpperCase();
                userAccount.insertBefore(avatar, userAccount.firstChild);
            }
        }
    } else {
        // User is logged out - show login button
        if (authNavItem) authNavItem.style.display = 'block';
        if (userAccountNav) userAccountNav.style.display = 'none';
    }
}

// Logout function
window.logout = function() {
    currentUser = null;
    saveCurrentUser();
    showNotification('Logged out successfully', 'success');
    
    // Update UI
    updateUserDisplay();
    updateCartCount();
    
    // Redirect to home if on protected page
    const currentPage = window.location.pathname;
    if (currentPage.includes('admin.html') || currentPage.includes('checkout.html')) {
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
};

// ===== ACTIVE PAGE HIGHLIGHTING =====
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Define page groups for highlighting
    const pageGroups = {
        'shop': ['shop.html', 'product.html'],
        'account': ['login.html', 'register.html'],
        'home': ['index.html', '']
    };
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        link.classList.remove('active');
        
        // Check if current page matches link
        if (linkHref === currentPage) {
            link.classList.add('active');
        }
        
        // Check page groups
        if (pageGroups.shop.includes(currentPage) && linkHref === 'shop.html') {
            link.classList.add('active');
        }
        
        if (pageGroups.account.includes(currentPage) && linkHref === 'login.html') {
            link.classList.add('active');
        }
        
        if ((currentPage === '' || currentPage === 'index.html') && linkHref === 'index.html') {
            link.classList.add('active');
        }
        
        // For product pages, highlight shop
        if (currentPage === 'product.html' && linkHref === 'shop.html') {
            link.classList.add('active');
        }
        
        // For cart page, highlight cart icon
        if (currentPage === 'cart.html' && link.parentElement && link.parentElement.classList.contains('cart-icon')) {
            link.parentElement.classList.add('active-cart');
        }
    });
    
    // Add special styling for cart icon active state
    const cartIcon = document.querySelector('.cart-icon');
    if (currentPage === 'cart.html' && cartIcon) {
        cartIcon.style.opacity = '1';
        cartIcon.style.transform = 'scale(1.05)';
    } else if (cartIcon) {
        cartIcon.style.opacity = '';
        cartIcon.style.transform = '';
    }
}

// ===== CART FUNCTIONS =====
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

function addToCart(productId, size, color, quantity = 1) {
    const product = products.find(p => p.id == productId);
    if (!product) return;
    
    const existingItem = cart.find(item => 
        item.productId == productId && item.size == size && item.color == color
    );
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            productId: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            size: size,
            color: color,
            quantity: quantity
        });
    }
    
    saveCart();
    showNotification('Product added to cart!', 'success');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    if (typeof loadCartPage === 'function') {
        loadCartPage();
    }
}

function updateCartQuantity(index, change) {
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        saveCart();
        if (typeof loadCartPage === 'function') {
            loadCartPage();
        }
    }
}

function clearCart() {
    cart = [];
    saveCart();
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? '#00ff88' : type === 'error' ? '#ff4444' : '#00f3ff';
    const textColor = '#000000';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${bgColor};
        color: ${textColor};
        border-radius: 5px;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ===== MOBILE MENU =====
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}

// ===== FEATURED PRODUCTS =====
function loadFeaturedProducts() {
    const featuredContainer = document.getElementById('featuredProducts');
    if (!featuredContainer) return;
    
    const featured = products.slice(0, 4);
    
    featuredContainer.innerHTML = featured.map(product => `
        <div class="product-card" onclick="viewProduct(${product.id})">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <div class="product-actions">
                    <button class="btn btn-secondary" onclick="event.stopPropagation(); quickAddToCart(${product.id})">Quick Add</button>
                    <button class="btn btn-primary" onclick="event.stopPropagation(); viewProduct(${product.id})">View</button>
                </div>
            </div>
        </div>
    `).join('');
}

function quickAddToCart(productId) {
    const product = products.find(p => p.id == productId);
    if (product) {
        addToCart(productId, product.sizes[0], product.colors[0], 1);
    }
}

function viewProduct(productId) {
    window.location.href = `product.html?id=${productId}`;
}

// ===== EXPORT FUNCTIONS FOR GLOBAL USE =====
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.clearCart = clearCart;
window.viewProduct = viewProduct;
window.quickAddToCart = quickAddToCart;
window.showNotification = showNotification;
window.logout = logout;

// Add CSS animations if not already present
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .user-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: var(--accent-neon);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--bg-primary);
        font-weight: bold;
        font-size: 1rem;
        transition: all 0.3s ease;
    }
    
    .user-account:hover .user-avatar {
        transform: scale(1.1);
        background: var(--bg-primary);
        color: var(--accent-neon);
    }
    
    .active-cart a {
        color: var(--accent-neon) !important;
    }
    
    .nav-links a.active {
        color: var(--accent-neon);
        position: relative;
    }
    
    .nav-links a.active::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 100%;
        height: 2px;
        background: var(--accent-neon);
        animation: glowPulse 1.5s ease-in-out infinite;
    }
    
    @keyframes glowPulse {
        0%, 100% {
            opacity: 0.5;
            box-shadow: 0 0 0px rgba(0, 243, 255, 0);
        }
        50% {
            opacity: 1;
            box-shadow: 0 0 8px rgba(0, 243, 255, 0.8);
        }
    }
`;
document.head.appendChild(styleSheet);