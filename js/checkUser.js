document.addEventListener("DOMContentLoaded", function () {
    // Check if userData exists in localStorage
    const userData = localStorage.getItem('userData');
    
    if (userData) {
        const user = JSON.parse(userData);
        const loginBtn = document.getElementById('loginBtn');
        
        // Update login button text with username
        loginBtn.textContent = user.username;
        loginBtn.href = "#"; // Optional: Change href if necessary
    }
});
