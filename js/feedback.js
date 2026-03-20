// ===== FEEDBACK PAGE FUNCTIONS =====
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('reviewsList')) {
        loadAllReviews();
        loadProductOptions();
    }
});

function loadProductOptions() {
    const productSelect = document.getElementById('reviewProduct');
    if (!productSelect) return;
    
    productSelect.innerHTML = '<option value="">Select a product</option>' + 
        products.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
}

function submitReview(event) {
    event.preventDefault();
    
    const name = document.getElementById('reviewName').value;
    const email = document.getElementById('reviewEmail').value;
    const productId = document.getElementById('reviewProduct').value;
    const rating = document.querySelector('input[name="rating"]:checked')?.value;
    const title = document.getElementById('reviewTitle').value;
    const content = document.getElementById('reviewContent').value;
    
    if (!productId || !rating) {
        showNotification('Please select a product and rating', 'error');
        return;
    }
    
    const newReview = {
        id: reviews.length + 1,
        name: name,
        email: email,
        productId: productId,
        rating: parseInt(rating),
        title: title,
        content: content,
        date: new Date().toISOString()
    };
    
    reviews.push(newReview);
    saveReviews();
    
    // Clear form
    event.target.reset();
    
    showNotification('Review submitted successfully!', 'success');
    loadAllReviews();
}

function loadAllReviews() {
    const reviewsContainer = document.getElementById('reviewsList');
    if (!reviewsContainer) return;
    
    if (reviews.length === 0) {
        reviewsContainer.innerHTML = '<p class="text-center">No reviews yet. Be the first to review!</p>';
        return;
    }
    
    // Sort by date (newest first)
    const sortedReviews = [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    reviewsContainer.innerHTML = sortedReviews.map(review => {
        const product = products.find(p => p.id == review.productId);
        
        return `
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
                <p><em>Product: ${product ? product.name : 'Unknown'}</em></p>
                <p>${review.content}</p>
            </div>
        `;
    }).join('');
}