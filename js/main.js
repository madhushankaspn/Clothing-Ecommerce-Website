// ===== GLOBAL VARIABLES =====
let products = [];
let cart = [];
let users = [];
let orders = [];
let reviews = [];
let currentUser = null;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Hide loader after page loads
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
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
                image: "https://via.placeholder.com/300x400",
                category: "tshirts",
                sizes: ["S", "M", "L", "XL"],
                colors: ["Black", "White", "Gray"],
                description: "Premium cotton classic fit t-shirt. Comfortable and stylish."
            },
            {
                id: 2,
                name: "Slim Fit Jeans",
                price: 79.99,
                image: "https://via.placeholder.com/300x400",
                category: "jeans",
                sizes: ["30", "32", "34", "36"],
                colors: ["Blue", "Black"],
                description: "Modern slim fit jeans with stretch comfort. Perfect for everyday wear."
            },
            {
                id: 3,
                name: "Leather Jacket",
                price: 199.99,
                image: "https://via.placeholder.com/300x400",
                category: "jackets",
                sizes: ["S", "M", "L", "XL"],
                colors: ["Black", "Brown"],
                description: "Genuine leather jacket with quilted lining. Timeless style."
            },
            {
                id: 4,
                name: "Canvas Sneakers",
                price: 49.99,
                image: "https://via.placeholder.com/300x400",
                category: "accessories",
                sizes: ["7", "8", "9", "10", "11"],
                colors: ["White", "Black", "Red"],
                description: "Classic canvas sneakers with cushioned insole. Perfect for casual wear."
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
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--error-color)' : 'var(--accent-neon)'};
        color: var(--bg-primary);
        border-radius: 5px;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
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