// ===== SHOP PAGE FUNCTIONS =====
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('productsGrid')) {
        loadShopProducts();
        setupFilters();
    }
});

function loadShopProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = products.map(product => `
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

function setupFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const sizeFilter = document.getElementById('sizeFilter');
    const colorFilter = document.getElementById('colorFilter');
    const priceFilter = document.getElementById('priceFilter');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    if (sizeFilter) {
        sizeFilter.addEventListener('change', applyFilters);
    }
    if (colorFilter) {
        colorFilter.addEventListener('change', applyFilters);
    }
    if (priceFilter) {
        priceFilter.addEventListener('change', applyFilters);
    }
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', applyFilters);
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                applyFilters();
            }
        });
    }
    
    // Check for category from URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    if (category && categoryFilter) {
        categoryFilter.value = category;
        applyFilters();
    }
}

function applyFilters() {
    const category = document.getElementById('categoryFilter')?.value || 'all';
    const size = document.getElementById('sizeFilter')?.value || 'all';
    const color = document.getElementById('colorFilter')?.value || 'all';
    const price = document.getElementById('priceFilter')?.value || 'all';
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    
    let filteredProducts = [...products];
    
    // Apply category filter
    if (category !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    
    // Apply size filter
    if (size !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.sizes.includes(size.toUpperCase()));
    }
    
    // Apply color filter
    if (color !== 'all') {
        filteredProducts = filteredProducts.filter(p => 
            p.colors.some(c => c.toLowerCase() === color.toLowerCase())
        );
    }
    
    // Apply price filter
    if (price !== 'all') {
        const [min, max] = price.split('-').map(Number);
        if (price === '200+') {
            filteredProducts = filteredProducts.filter(p => p.price >= 200);
        } else {
            filteredProducts = filteredProducts.filter(p => p.price >= min && p.price <= max);
        }
    }
    
    // Apply search
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchTerm) || 
            p.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Display filtered products
    const productsGrid = document.getElementById('productsGrid');
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<div class="text-center" style="grid-column: 1/-1; padding: 3rem;"><h3>No products found</h3></div>';
    } else {
        productsGrid.innerHTML = filteredProducts.map(product => `
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
}