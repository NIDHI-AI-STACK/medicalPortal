// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const patientDashboard = document.getElementById('patientDashboard');
const doctorDashboard = document.getElementById('doctorDashboard');

// Navigation between forms
loginBtn.addEventListener('click', () => {
    showLoginForm();
});

signupBtn.addEventListener('click', () => {
    showSignupForm();
});

function showLoginForm() {
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
    patientDashboard.classList.remove('active');
    doctorDashboard.classList.remove('active');
    loginBtn.classList.add('active');
    signupBtn.classList.remove('active');
}

function showSignupForm() {
    signupForm.classList.add('active');
    loginForm.classList.remove('active');
    patientDashboard.classList.remove('active');
    doctorDashboard.classList.remove('active');
    signupBtn.classList.add('active');
    loginBtn.classList.remove('active');
}

// Signup Form Handler
document.getElementById('signupFormElement').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        userType: document.getElementById('userTypeSignup').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        addressLine1: document.getElementById('addressLine1').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        pincode: document.getElementById('pincode').value
    };
    
    // Handle profile picture
    const profilePictureFile = document.getElementById('profilePicture').files[0];
    if (profilePictureFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            formData.profilePicture = e.target.result;
            processSignup(formData);
        };
        reader.readAsDataURL(profilePictureFile);
    } else {
        formData.profilePicture = 'https://via.placeholder.com/100x100?text=No+Image';
        processSignup(formData);
    }
});

function processSignup(formData) {
    const errorDiv = document.getElementById('signupError');
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
        errorDiv.textContent = 'Passwords do not match!';
        return;
    }
    
    if (formData.password.length < 6) {
        errorDiv.textContent = 'Password must be at least 6 characters long!';
        return;
    }
    
    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = existingUsers.some(user => 
        user.email === formData.email || user.username === formData.username
    );
    
    if (userExists) {
        errorDiv.textContent = 'User with this email or username already exists!';
        return;
    }
    
    // Save user data
    const userData = {
        id: Date.now(),
        userType: formData.userType,
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        password: formData.password, // In real app, this should be hashed
        profilePicture: formData.profilePicture,
        address: {
            line1: formData.addressLine1,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode
        }
    };
    
    existingUsers.push(userData);
    localStorage.setItem('users', JSON.stringify(existingUsers));
    
    errorDiv.textContent = '';
    alert('Signup successful! Please login.');
    showLoginForm();
    document.getElementById('signupFormElement').reset();
}

// Login Form Handler
document.getElementById('loginFormElement').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const userType = document.getElementById('userType').value;
    const errorDiv = document.getElementById('loginError');
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => 
        u.email === email && 
        u.password === password && 
        u.userType === userType
    );
    
    if (user) {
        errorDiv.textContent = '';
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        if (user.userType === 'patient') {
            showPatientDashboard(user);
        } else {
            showDoctorDashboard(user);
        }
        
        document.getElementById('loginFormElement').reset();
    } else {
        errorDiv.textContent = 'Invalid credentials or user type!';
    }
});

// Dashboard Functions
function showPatientDashboard(user) {
    loginForm.classList.remove('active');
    signupForm.classList.remove('active');
    patientDashboard.classList.add('active');
    doctorDashboard.classList.remove('active');
    
    // Populate dashboard with user data
    document.getElementById('patientProfileImg').src = user.profilePicture;
    document.getElementById('patientName').textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById('patientEmail').textContent = user.email;
    document.getElementById('patientUsername').textContent = `@${user.username}`;
    document.getElementById('patientAddress').textContent = 
        `${user.address.line1}, ${user.address.city}, ${user.address.state} - ${user.address.pincode}`;
}

function showDoctorDashboard(user) {
    loginForm.classList.remove('active');
    signupForm.classList.remove('active');
    patientDashboard.classList.remove('active');
    doctorDashboard.classList.add('active');
    
    // Populate dashboard with user data
    document.getElementById('doctorProfileImg').src = user.profilePicture;
    document.getElementById('doctorName').textContent = `Dr. ${user.firstName} ${user.lastName}`;
    document.getElementById('doctorEmail').textContent = user.email;
    document.getElementById('doctorUsername').textContent = `@${user.username}`;
    document.getElementById('doctorAddress').textContent = 
        `${user.address.line1}, ${user.address.city}, ${user.address.state} - ${user.address.pincode}`;
}

// Logout handlers
document.getElementById('logoutPatient').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    showLoginForm();
});

document.getElementById('logoutDoctor').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    showLoginForm();
});

// Check if user is already logged in
window.addEventListener('load', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (currentUser) {
        if (currentUser.userType === 'patient') {
            showPatientDashboard(currentUser);
        } else {
            showDoctorDashboard(currentUser);
        }
    }
});

// Password confirmation validation
document.getElementById('confirmPassword').addEventListener('input', function() {
    const password = document.getElementById('password').value;
    const confirmPassword = this.value;
    
    if (password !== confirmPassword) {
        this.setCustomValidity('Passwords do not match');
    } else {
        this.setCustomValidity('');
    }
});
