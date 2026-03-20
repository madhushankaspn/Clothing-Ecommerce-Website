// ===== CONTACT PAGE FUNCTIONS =====
function handleContactSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;
    
    // Here you would typically send this to a server
    // For now, we'll just show a success message
    
    showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
    
    // Clear form
    event.target.reset();
}