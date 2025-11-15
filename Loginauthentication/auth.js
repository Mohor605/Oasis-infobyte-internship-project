// User database (stored in memory - in production, use a real database)
let users = [];
let currentUser = null;

// DOM Elements
const loginCard = document.getElementById('loginCard');
const registerCard = document.getElementById('registerCard');
const securedPage = document.getElementById('securedPage');

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');
const logoutBtn = document.getElementById('logoutBtn');

const loginError = document.getElementById('loginError');
const registerError = document.getElementById('registerError');
const registerSuccess = document.getElementById('registerSuccess');

// Initialize - Check if user is already logged in
document.addEventListener('DOMContentLoaded', function() {
    checkSession();
    
    // Add a demo user for testing
    addDemoUser();
});

// Add demo user
function addDemoUser() {
    if (users.length === 0) {
        users.push({
            name: 'Demo User',
            email: 'demo@example.com',
            password: 'demo123',
            createdAt: new Date().toLocaleDateString()
        });
        console.log('Demo user added: demo@example.com / demo123');
    }
}

// Check if user session exists
function checkSession() {
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showSecuredPage();
    }
}

// Show/Hide forms
showRegisterLink.addEventListener('click', function(e) {
    e.preventDefault();
    loginCard.classList.add('hidden');
    registerCard.classList.remove('hidden');
    clearMessages();
});

showLoginLink.addEventListener('click', function(e) {
    e.preventDefault();
    registerCard.classList.add('hidden');
    loginCard.classList.remove('hidden');
    clearMessages();
});

// Register form submission
registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    // Clear previous messages
    clearMessages();
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
        showError(registerError, 'All fields are required!');
        return;
    }
    
    if (password.length < 6) {
        showError(registerError, 'Password must be at least 6 characters long!');
        return;
    }
    
    if (password !== confirmPassword) {
        showError(registerError, 'Passwords do not match!');
        return;
    }
    
    // Check if user already exists
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
        showError(registerError, 'An account with this email already exists!');
        return;
    }
    
    // Create new user
    const newUser = {
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toLocaleDateString()
    };
    
    users.push(newUser);
    
    // Show success message
    showSuccess(registerSuccess, 'Registration successful! You can now login.');
    
    // Clear form
    registerForm.reset();
    
    // Auto-switch to login after 2 seconds
    setTimeout(() => {
        registerCard.classList.add('hidden');
        loginCard.classList.remove('hidden');
        clearMessages();
    }, 2000);
});

// Login form submission
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Clear previous messages
    clearMessages();
    
    // Validation
    if (!email || !password) {
        showError(loginError, 'Please enter both email and password!');
        return;
    }
    
    // Find user
    const user = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password
    );
    
    if (!user) {
        showError(loginError, 'Invalid email or password!');
        return;
    }
    
    // Login successful
    currentUser = user;
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Clear form
    loginForm.reset();
    
    // Show secured page
    showSecuredPage();
});

// Logout
logoutBtn.addEventListener('click', function() {
    currentUser = null;
    sessionStorage.removeItem('currentUser');
    
    securedPage.classList.add('hidden');
    loginCard.classList.remove('hidden');
    
    loginForm.reset();
    clearMessages();
});

// Show secured page
function showSecuredPage() {
    loginCard.classList.add('hidden');
    registerCard.classList.add('hidden');
    securedPage.classList.remove('hidden');
    
    // Display user information
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userNameDisplay').textContent = currentUser.name;
    document.getElementById('userEmailDisplay').textContent = currentUser.email;
    document.getElementById('userDateDisplay').textContent = currentUser.createdAt;
}

// Helper functions
function showError(element, message) {
    element.textContent = message;
    element.classList.add('show');
}

function showSuccess(element, message) {
    element.textContent = message;
    element.classList.add('show');
}

function clearMessages() {
    loginError.classList.remove('show');
    registerError.classList.remove('show');
    registerSuccess.classList.remove('show');
}

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Password strength checker (optional enhancement)
function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[$@#&!]+/)) strength++;
    
    return strength;
}

// Clear form on page load
window.addEventListener('load', function() {
    loginForm.reset();
    registerForm.reset();
});

// Prevent back button after logout
window.addEventListener('popstate', function() {
    if (!currentUser) {
        securedPage.classList.add('hidden');
        loginCard.classList.remove('hidden');
    }
});

console.log('Authentication system loaded successfully!');
console.log('Demo credentials - Email: demo@example.com, Password: demo123');