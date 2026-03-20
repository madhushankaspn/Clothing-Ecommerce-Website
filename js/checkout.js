// ===== CHECKOUT PAGE FUNCTIONS =====
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('orderItems')) {
        loadOrderSummary();
    }
});

function loadOrderSummary() {
    const orderItems = document.getElementById('orderItems');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    
    if (!orderItems) return;
    
    let subtotal = 0;
    
    orderItems.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        return `
            <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                <span>${item.name} (${item.size}, ${item.color}) x${item.quantity}</span>
                <span>$${itemTotal.toFixed(2)}</span>
            </div>
        `;
    }).join('');
    
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    const total = subtotal + 10; // + shipping
    totalElement.textContent = `$${total.toFixed(2)}`;
}

function placeOrder() {
    // Validate form
    const form = document.getElementById('checkoutForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    // Get form data
    const orderData = {
        id: Date.now(),
        customer: {
            name: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            zipCode: document.getElementById('zipCode').value
        },
        items: [...cart],
        paymentMethod: document.getElementById('paymentMethod').value,
        subtotal: parseFloat(document.getElementById('subtotal').textContent.replace('$', '')),
        total: parseFloat(document.getElementById('total').textContent.replace('$', '')),
        status: 'pending',
        date: new Date().toISOString()
    };
    
    // Save order
    orders.push(orderData);
    saveOrders();
    
    // Clear cart
    clearCart();
    
    // Show success message
    showNotification('Order placed successfully!', 'success');
    
    // Redirect to home page after delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}