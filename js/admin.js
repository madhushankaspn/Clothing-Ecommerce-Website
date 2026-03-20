// ===== ADMIN FUNCTIONS =====
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAccess();
});

function checkAdminAccess() {
    const loginCheck = document.getElementById('adminLoginCheck');
    const dashboard = document.getElementById('adminDashboard');
    
    // Check if user is logged in and is admin
    if (currentUser && currentUser.isAdmin === true) {
        // Admin is logged in - show dashboard
        if (loginCheck) loginCheck.style.display = 'none';
        if (dashboard) dashboard.style.display = 'block';
        
        // Load all admin data
        loadAdminProducts();
        loadAdminOrders();
        loadAdminUsers();
        loadAdminReviews();
    } else {
        // Not logged in or not admin - show login form
        if (loginCheck) loginCheck.style.display = 'block';
        if (dashboard) dashboard.style.display = 'none';
    }
}

function handleAdminLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    
    // Find user with admin privileges
    const admin = users.find(u => u.email === email && u.password === password && u.isAdmin === true);
    
    if (admin) {
        currentUser = admin;
        saveCurrentUser();
        showNotification('Admin login successful!', 'success');
        
        // Update UI
        if (typeof updateUserDisplay === 'function') {
            updateUserDisplay();
        }
        
        // Show dashboard
        checkAdminAccess();
        loadAdminProducts();
        loadAdminOrders();
        loadAdminUsers();
        loadAdminReviews();
    } else {
        showNotification('Invalid admin credentials', 'error');
    }
}

function switchAdminTab(tab) {
    const tabs = document.querySelectorAll('.admin-tab');
    const panels = {
        products: document.getElementById('productsPanel'),
        orders: document.getElementById('ordersPanel'),
        users: document.getElementById('usersPanel'),
        reviews: document.getElementById('reviewsPanel')
    };
    
    // Update tab styles
    tabs.forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    // Hide all panels
    Object.values(panels).forEach(p => {
        if (p) p.style.display = 'none';
    });
    
    // Show selected panel
    if (tab === 'products' && panels.products) panels.products.style.display = 'block';
    else if (tab === 'orders' && panels.orders) panels.orders.style.display = 'block';
    else if (tab === 'users' && panels.users) panels.users.style.display = 'block';
    else if (tab === 'reviews' && panels.reviews) panels.reviews.style.display = 'block';
}

// ===== PRODUCT MANAGEMENT =====
function addProduct() {
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const image = document.getElementById('productImage').value;
    const category = document.getElementById('productCategory').value;
    const sizes = document.getElementById('productSizes').value.split(',').map(s => s.trim());
    const colors = document.getElementById('productColors').value.split(',').map(c => c.trim());
    const description = document.getElementById('productDescription').value;
    
    if (!name || !price || !image || !category || !sizes.length || !colors.length || !description) {
        showNotification('Please fill all fields', 'error');
        return;
    }
    
    const newProduct = {
        id: products.length + 1,
        name: name,
        price: price,
        image: image,
        category: category.toLowerCase(),
        sizes: sizes,
        colors: colors,
        description: description
    };
    
    products.push(newProduct);
    saveProducts();
    
    // Clear form
    document.getElementById('productForm').querySelectorAll('input, textarea').forEach(field => {
        field.value = '';
    });
    
    showNotification('Product added successfully!', 'success');
    loadAdminProducts();
}

function editProduct(id) {
    const product = products.find(p => p.id == id);
    if (!product) return;
    
    // Populate form with product data
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productImage').value = product.image;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productSizes').value = product.sizes.join(', ');
    document.getElementById('productColors').value = product.colors.join(', ');
    document.getElementById('productDescription').value = product.description;
    
    // Change add button to update button
    const addBtn = document.querySelector('#productsPanel .btn-primary');
    addBtn.textContent = 'Update Product';
    addBtn.onclick = function() { updateProduct(id); };
}

function updateProduct(id) {
    const product = products.find(p => p.id == id);
    if (!product) return;
    
    product.name = document.getElementById('productName').value;
    product.price = parseFloat(document.getElementById('productPrice').value);
    product.image = document.getElementById('productImage').value;
    product.category = document.getElementById('productCategory').value.toLowerCase();
    product.sizes = document.getElementById('productSizes').value.split(',').map(s => s.trim());
    product.colors = document.getElementById('productColors').value.split(',').map(c => c.trim());
    product.description = document.getElementById('productDescription').value;
    
    saveProducts();
    
    // Reset form
    document.getElementById('productForm').querySelectorAll('input, textarea').forEach(field => {
        field.value = '';
    });
    const addBtn = document.querySelector('#productsPanel .btn-primary');
    addBtn.textContent = 'Add Product';
    addBtn.onclick = addProduct;
    
    showNotification('Product updated successfully!', 'success');
    loadAdminProducts();
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id != id);
        saveProducts();
        showNotification('Product deleted successfully!', 'success');
        loadAdminProducts();
    }
}

function loadAdminProducts() {
    const container = document.getElementById('adminProductsList');
    if (!container) return;
    
    if (products.length === 0) {
        container.innerHTML = '<p class="text-center">No products yet. Add your first product!</p>';
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="admin-product-card">
            <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px;" onerror="this.src='https://via.placeholder.com/200x150?text=No+Image'">
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <p style="font-size: 0.8rem;">Category: ${product.category}</p>
            <div class="admin-product-actions">
                <button class="edit-btn" onclick="editProduct(${product.id})">✏️ Edit</button>
                <button class="delete-btn" onclick="deleteProduct(${product.id})">🗑️ Delete</button>
            </div>
        </div>
    `).join('');
}

// ===== ORDER MANAGEMENT =====
function loadAdminOrders() {
    const container = document.getElementById('ordersList');
    if (!container) return;
    
    if (orders.length === 0) {
        container.innerHTML = '<p class="text-center">No orders yet.</p>';
        return;
    }
    
    container.innerHTML = orders.map(order => `
        <div style="background: var(--bg-primary); padding: 1rem; margin-bottom: 1rem; border-radius: 10px; border: 1px solid var(--border-color);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h3 style="color: var(--accent-neon);">Order #${order.id}</h3>
                <select onchange="updateOrderStatus(${order.id}, this.value)" style="background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border-color); padding: 0.5rem; border-radius: 5px;">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>⏳ Pending</option>
                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>🔄 Processing</option>
                    <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>📦 Shipped</option>
                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>✅ Delivered</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>❌ Cancelled</option>
                </select>
            </div>
            <p><strong>👤 Customer:</strong> ${order.customer?.name || 'N/A'}</p>
            <p><strong>📧 Email:</strong> ${order.customer?.email || 'N/A'}</p>
            <p><strong>📞 Phone:</strong> ${order.customer?.phone || 'N/A'}</p>
            <p><strong>📍 Address:</strong> ${order.customer?.address || 'N/A'}, ${order.customer?.city || 'N/A'} ${order.customer?.zipCode || 'N/A'}</p>
            <p><strong>💰 Total:</strong> $${order.total?.toFixed(2) || '0.00'}</p>
            <p><strong>📅 Date:</strong> ${new Date(order.date).toLocaleString()}</p>
            <details>
                <summary style="cursor: pointer; color: var(--accent-neon);">📋 View Items (${order.items?.length || 0})</summary>
                <ul style="margin-top: 0.5rem; padding-left: 1rem;">
                    ${order.items?.map(item => `
                        <li>${item.name} (${item.size}, ${item.color}) x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>
                    `).join('') || '<li>No items</li>'}
                </ul>
            </details>
        </div>
    `).join('');
}

function updateOrderStatus(orderId, status) {
    const order = orders.find(o => o.id == orderId);
    if (order) {
        order.status = status;
        saveOrders();
        showNotification('Order status updated!', 'success');
        loadAdminOrders();
    }
}

// ===== USER MANAGEMENT =====
function loadAdminUsers() {
    const container = document.getElementById('usersList');
    if (!container) return;
    
    container.innerHTML = users.map(user => `
        <div style="background: var(--bg-primary); padding: 1rem; margin-bottom: 1rem; border-radius: 10px; border: 1px solid var(--border-color);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h3>${user.name || 'No Name'}</h3>
                    <p>📧 ${user.email}</p>
                    <p>${user.isAdmin ? '👑 Admin User' : '👤 Regular Customer'}</p>
                    <p style="font-size: 0.8rem; color: var(--text-secondary);">Joined: ${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
                ${!user.isAdmin ? `
                    <button class="delete-btn" onclick="deleteUser(${user.id})">🗑️ Delete User</button>
                ` : '<span style="color: var(--accent-neon);">⭐ Admin</span>'}
            </div>
        </div>
    `).join('');
}

function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        users = users.filter(u => u.id != id);
        saveUsers();
        showNotification('User deleted!', 'success');
        loadAdminUsers();
    }
}

// ===== REVIEW MANAGEMENT =====
function loadAdminReviews() {
    const container = document.getElementById('adminReviewsList');
    if (!container) return;
    
    if (reviews.length === 0) {
        container.innerHTML = '<p class="text-center">No reviews yet.</p>';
        return;
    }
    
    container.innerHTML = reviews.map((review, index) => {
        const product = products.find(p => p.id == review.productId);
        return `
            <div style="background: var(--bg-primary); padding: 1rem; margin-bottom: 1rem; border-radius: 10px; border: 1px solid var(--border-color);">
                <div style="display: flex; justify-content: space-between;">
                    <div>
                        <h4>${review.title}</h4>
                        <p><strong>${review.name}</strong> - ${product ? product.name : 'Product ID: ' + review.productId}</p>
                        <p>Rating: ${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</p>
                        <p>${review.content}</p>
                        <p class="review-date" style="color: var(--text-secondary); font-size: 0.8rem;">📅 ${new Date(review.date).toLocaleDateString()}</p>
                    </div>
                    <button class="delete-btn" onclick="deleteReview(${index})">🗑️ Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function deleteReview(index) {
    if (confirm('Are you sure you want to delete this review?')) {
        reviews.splice(index, 1);
        saveReviews();
        showNotification('Review deleted!', 'success');
        loadAdminReviews();
    }
}