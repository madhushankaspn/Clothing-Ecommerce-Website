// ===== CART PAGE FUNCTIONS =====
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('cartItems')) {
        loadCartPage();
    }
});

function loadCartPage() {
    const cartContainer = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<div class="text-center" style="padding: 3rem;"><h3>Your cart is empty</h3><p class="mt-1">Browse our shop to add items</p><a href="shop.html" class="btn btn-primary mt-2">Shop Now</a></div>';
        if (cartSummary) cartSummary.innerHTML = '';
        if (checkoutBtn) checkoutBtn.style.display = 'none';
        return;
    }
    
    if (checkoutBtn) checkoutBtn.style.display = 'inline-block';
    
    let subtotal = 0;
    
    cartContainer.innerHTML = cart.map((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h3>${item.name}</h3>
                    <p>Size: ${item.size} | Color: ${item.color}</p>
                    <p>$${item.price.toFixed(2)} each</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateCartQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartQuantity(${index}, 1)">+</button>
                </div>
                <div>
                    <strong>$${itemTotal.toFixed(2)}</strong>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;
    }).join('');
    
    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 0 ? 10 : 0;
    const total = subtotal + tax + shipping;
    
    cartSummary.innerHTML = `
        <h3>Order Summary</h3>
        <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
            <span>Subtotal:</span>
            <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
            <span>Tax (10%):</span>
            <span>$${tax.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
            <span>Shipping:</span>
            <span>$${shipping.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 1.3rem; color: var(--accent-neon);">
            <span>Total:</span>
            <span>$${total.toFixed(2)}</span>
        </div>
    `;
}