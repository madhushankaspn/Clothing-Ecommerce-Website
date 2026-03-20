// ===== PRODUCT PAGE VARIABLES =====
let currentProduct = null;
let selectedSize = '';
let selectedColor = '';
let currentQuantity = 1;

// ===== PRODUCT PAGE FUNCTIONS =====
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('productDetails')) {
        loadProductDetails();
    }
});

function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        window.location.href = 'shop.html';
        return;
    }
    
    currentProduct = products.find(p => p.id == productId);
    
    if (!currentProduct) {
        window.location.href = 'shop.html';
        return;
    }
    
    // Set product details
    document.getElementById('productImage').src = currentProduct.image;
    document.getElementById('productTitle').textContent = currentProduct.name;
    document.getElementById('productPrice').textContent = `$${currentProduct.price.toFixed(2)}`;
    document.getElementById('productDescription').textContent = currentProduct.description;
    
    // Load size options
    const sizeOptions = document.getElementById('sizeOptions');
    sizeOptions.innerHTML = currentProduct.sizes.map(size => `
        <button class="btn ${selectedSize === size ? 'btn-primary' : 'btn-secondary'}" 
                onclick="selectSize('${size}')">${size}</button>
    `).join('');
    
    // Load color options
    const colorOptions = document.getElementById('colorOptions');
    colorOptions.innerHTML = currentProduct.colors.map(color => `
        <button class="btn ${selectedColor === color ? 'btn-primary' : 'btn-secondary'}" 
                onclick="selectColor('${color}')">${color}</button>
    `).join('');
    
    // Load product reviews
    loadProductReviews(productId);
}

function selectSize(size) {
    selectedSize = size;
    loadProductDetails(); // Refresh to show selected state
}

function selectColor(color) {
    selectedColor = color;
    loadProductDetails(); // Refresh to show selected state
}

function updateQuantity(change) {
    currentQuantity = Math.max(1, currentQuantity + change);
    document.getElementById('quantity').textContent = currentQuantity;
}

function addToCart() {
    if (!selectedSize) {
        showNotification('Please select a size', 'error');
        return;
    }
    
    if (!selectedColor) {
        showNotification('Please select a color', 'error');
        return;
    }
    
    window.addToCart(currentProduct.id, selectedSize, selectedColor, currentQuantity);
}

function loadProductReviews(productId) {
    const reviewsContainer = document.getElementById('productReviews');
    if (!reviewsContainer) return;
    
    const productReviews = reviews.filter(r => r.productId == productId);
    
    if (productReviews.length === 0) {
        reviewsContainer.innerHTML = '<p class="text-center">No reviews yet. Be the first to review!</p>';
        return;
    }
    
    reviewsContainer.innerHTML = productReviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <div>
                    <strong>${review.name}</strong>
                    <div class="review-rating">
                        ${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}
                    </div>
                </div>
                <div class="review-date">${new Date(review.date).toLocaleDateString()}</div>
            </div>
            <h4>${review.title}</h4>
            <p>${review.content}</p>
        </div>
    `).join('');
}