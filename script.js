// ========================================
// PROJECT: Store.it
// DESCRIPTION: Secure local storage for user data and passwords.
// ========================================
// ========================================
// STORAGE MANAGER - LocalStorage (Persistent)
// ========================================
const StorageManager = {
    setItem: function(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.error("Error saving to localStorage", e);
        }
    },
    
    getItem: function(key) {
        return localStorage.getItem(key);
    },
    
    removeItem: function(key) {
        localStorage.removeItem(key);
    },
    
    clear: function() {
        localStorage.clear();
    }
};

// ========================================
// AUTH MANAGER
// ========================================
const AuthManager = {
    USERS_KEY: 'registeredUsers',
    CURRENT_USER_KEY: 'currentUser',   //user.data == user.email  
    
    // Register new user
    registerUser: function(userData) {
        const users = this.getAllUsers();
        
        // Check if email already exists
        if (users.find(user => user.email === userData.email)) {
            return { success: false, message: 'Email already registered!' };
        }
        
        users.push(userData);
        StorageManager.setItem(this.USERS_KEY, JSON.stringify(users));
        return { success: true, message: 'Account created successfully!' };
    },
    
    // Login user
    loginUser: function(email, password) {
        const users = this.getAllUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            StorageManager.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
            return { success: true, user: user };
        } // const data user == user.data + user.email  
        
        return { success: false, message: 'Invalid email or password!' };
    },
    
    // Get current logged-in user
    getCurrentUser: function() {
        const userData = StorageManager.getItem(this.CURRENT_USER_KEY);
        return userData ? JSON.parse(userData) : null;
    },
    
    // Logout user
    logoutUser: function() {
        StorageManager.removeItem(this.CURRENT_USER_KEY);
    },
    
    // Get all registered users
    getAllUsers: function() {
        const usersData = StorageManager.getItem(this.USERS_KEY);
        return usersData ? JSON.parse(usersData) : [];
    },
    
    // Update user data
    updateUserData: function(updatedUser) {
        const users = this.getAllUsers();
        const index = users.findIndex(u => u.email === updatedUser.email);
        
        if (index !== -1) {
            users[index] = updatedUser;
            StorageManager.setItem(this.USERS_KEY, JSON.stringify(users));
            StorageManager.setItem(this.CURRENT_USER_KEY, JSON.stringify(updatedUser));
            return true;
        }
        return false;
    }
};

// ========================================
// VALIDATION UTILITIES
// ========================================
const Validator = {
    validateName: function(name) {
        const nameRegex = /^[a-zA-Z\s]{2,}$/;
        return nameRegex.test(name.trim());
    },
    
    validateEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    },
    
    validatePassword: function(password) {
        return password.length >= 6;
    },
    
    validatePhone: function(phone) {   // 
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone.trim());
    }
};

// ========================================
// UI CONTROLLER
// ========================================
const UIController = {
    showMessage: function(elementId, message, type = 'success') {
        const messageEl = document.getElementById(elementId);
        messageEl.textContent = message;
        messageEl.className = `message ${type} show`;
        
        setTimeout(() => {
            messageEl.classList.remove('show');
        }, 3000);
    },
    
    showFieldError: function(fieldId, errorId) {
        document.getElementById(fieldId).classList.add('error');
        document.getElementById(errorId).classList.add('show');
    },
    
    clearFieldError: function(fieldId, errorId) {
        document.getElementById(fieldId).classList.remove('error');
        document.getElementById(errorId).classList.remove('show');
    },
    
    clearAllErrors: function(errorFields) {
        errorFields.forEach(field => {
            this.clearFieldError(field.field, field.error);
        });
    }
};

// ========================================
// SCREEN NAVIGATION
// ========================================
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show requested screen
    document.getElementById(screenId).classList.add('active');
}

// ========================================
// PASSWORD TOGGLE
// ========================================
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    input.type = input.type === 'password' ? 'text' : 'password';
}

// ========================================
// LOGIN HANDLER
// ========================================
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!Validator.validateEmail(email)) {
        UIController.showFieldError('loginEmail', 'loginEmailError');
        return;
    }
    
    const result = AuthManager.loginUser(email, password);
    
    if (result.success) {
        UIController.showMessage('loginMessage', '✅ Login successful!', 'success');
        setTimeout(() => {
            loadDashboard();
            showScreen('dashboardScreen');
        }, 1000);
    } else {
        UIController.showMessage('loginMessage', '❌ ' + result.message, 'error');
    }
});

// ========================================
// SIGNUP HANDLER
// ========================================
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const securityQuestion = document.getElementById('signupSecurityQuestion').value;
    const securityAnswer = document.getElementById('signupSecurityAnswer').value.trim();
    
    // Validate
    let isValid = true;
    
    if (!Validator.validateName(name)) {
        UIController.showFieldError('signupName', 'signupNameError');
        isValid = false;
    }
    
    if (!Validator.validateEmail(email)) {
        UIController.showFieldError('signupEmail', 'signupEmailError');
        isValid = false;
    }
    
    if (!Validator.validatePassword(password)) {
        UIController.showFieldError('signupPassword', 'signupPasswordError');
        isValid = false;
    }
    
    if (password !== confirmPassword) {
        UIController.showFieldError('signupConfirmPassword', 'signupConfirmPasswordError');
        isValid = false;
    }
    
    if (!securityQuestion) {
        UIController.showFieldError('signupSecurityQuestion', 'signupSecurityQuestionError');
        isValid = false;
    }

    if (!securityAnswer) {
        UIController.showFieldError('signupSecurityAnswer', 'signupSecurityAnswerError');
        isValid = false;
    }
    
    if (!isValid) return;
    
    const userData = {
        name: name,
        email: email,
        password: password,
        securityQuestion: securityQuestion,
        securityAnswer: securityAnswer,
        phone: '',
        vault: [] // Initialize password vault
    };
    
    const result = AuthManager.registerUser(userData);
    
    if (result.success) {
        UIController.showMessage('signupMessage', '✅ ' + result.message, 'success');
        document.getElementById('signupForm').reset();
        setTimeout(() => {
            showScreen('loginScreen');
        }, 1500);
    } else {
        UIController.showMessage('signupMessage', '❌ ' + result.message, 'error');
    }
});

// ========================================
// REGISTRATION FORM HANDLER
// ========================================
document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const currentUser = AuthManager.getCurrentUser();
    if (!currentUser) return;
    
    const name = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const secQuestion = document.getElementById('updateSecurityQuestion').value;
    const secAnswer = document.getElementById('updateSecurityAnswer').value.trim();
    const newPass = document.getElementById('updatePassword').value;
    const confirmPass = document.getElementById('updateConfirmPassword').value;
    
    let isValid = true;
    
    if (!Validator.validateName(name)) {
        UIController.showFieldError('fullName', 'nameError');
        isValid = false;
    }
    
    if (!Validator.validatePhone(phone)) {
        UIController.showFieldError('phone', 'phoneError');
        isValid = false;
    }
    
    // Validate Password Change (if attempted)
    if (newPass) {
        if (!Validator.validatePassword(newPass)) {
            UIController.showFieldError('updatePassword', 'updatePasswordError');
            document.getElementById('updatePasswordError').textContent = "Password must be at least 6 characters";
            isValid = false;
        } else if (newPass !== confirmPass) {
            UIController.showFieldError('updateConfirmPassword', 'updatePasswordError');
            document.getElementById('updatePasswordError').textContent = "Passwords do not match";
            isValid = false;
        }
    }
    
    if (!isValid) return;
    
    currentUser.name = name;
    currentUser.phone = phone;
    currentUser.securityQuestion = secQuestion;
    currentUser.securityAnswer = secAnswer;
    
    if (newPass) currentUser.password = newPass;
    
    AuthManager.updateUserData(currentUser);
    UIController.showMessage('registrationMessage', '✅ Profile updated successfully!', 'success');
    
    setTimeout(() => {
        loadDashboard();
        showScreen('dashboardScreen');
    }, 1500);
});

// ========================================
// VAULT MANAGER (Store.it Feature)
// ========================================
const VaultManager = {
    init: function(user) {
        const container = document.getElementById('vaultContainer') || document.getElementById('dashboardScreen');
        let vaultSection = document.getElementById('vaultSection');
        
        // Create Vault UI if it doesn't exist
        if (!vaultSection) {
            vaultSection = document.createElement('div');
            vaultSection.id = 'vaultSection';
            vaultSection.style.marginTop = '0';
            vaultSection.style.padding = '20px';
            vaultSection.style.backgroundColor = '#fff';
            vaultSection.style.borderRadius = '8px';
            vaultSection.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
            vaultSection.style.borderTop = '4px solid #4caf50';
            
            vaultSection.innerHTML = `
                <h2 style="color: #333; margin-bottom: 20px;">
                    🔐 Store.it Vault
                </h2>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 10px; margin-bottom: 20px; background: #f9f9f9; padding: 15px; border-radius: 6px;">
                    <input type="text" id="vSite" placeholder="App / Website Name" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    <input type="text" id="vUser" placeholder="Username / Email" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    <input type="password" id="vPass" placeholder="Password" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    <button onclick="VaultManager.add()" style="background: #4caf50; color: white; border: none; padding: 0 20px; border-radius: 4px; cursor: pointer; font-weight: bold;">Save</button>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <input type="text" id="vSearch" placeholder="🔍 Search passwords..." oninput="VaultManager.filter()" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                </div>
                
                <div id="vaultList"></div>
            `;
            
            container.appendChild(vaultSection);
        }
        
        this.renderList(user);
    },
    
    add: function() {
        const site = document.getElementById('vSite').value.trim();
        const username = document.getElementById('vUser').value.trim();
        const password = document.getElementById('vPass').value;
        
        if (!site || !password) {
            alert('Please enter at least a Site Name and Password.');
            return;
        }
        
        const user = AuthManager.getCurrentUser();
        if (!user.vault) user.vault = [];
        
        user.vault.push({
            id: Date.now(),
            site,
            username,
            password
        });
        
        AuthManager.updateUserData(user);
        
        // Clear inputs
        document.getElementById('vSite').value = '';
        document.getElementById('vUser').value = '';
        document.getElementById('vPass').value = '';
        
        this.renderList(user);
        UIController.showMessage('registrationMessage', 'Password saved to Vault!', 'success');
    },
    
    delete: function(id) {
        if(!confirm('Delete this password?')) return;
        
        const user = AuthManager.getCurrentUser();
        if (!user.vault) return;
        
        user.vault = user.vault.filter(item => item.id !== id);
        AuthManager.updateUserData(user);
        this.renderList(user);
    },
    
    copy: function(id) {
        const user = AuthManager.getCurrentUser();
        const item = user.vault.find(i => i.id === id);
        if (item) {
            navigator.clipboard.writeText(item.password).then(() => {
                UIController.showMessage('dashboardMessage', '📋 Password copied to clipboard!', 'success');
            });
        }
    },
    
    toggleVisibility: function(btn) {
        const row = btn.closest('tr');
        const passSpan = row.querySelector('.pass-text');
        const maskSpan = row.querySelector('.pass-mask');
        
        if (passSpan.style.display === 'none') {
            passSpan.style.display = 'inline';
            maskSpan.style.display = 'none';
            btn.textContent = '🙈';
        } else {
            passSpan.style.display = 'none';
            maskSpan.style.display = 'inline';
            btn.textContent = '👁️';
        }
    },
    
    filter: function() {
        const user = AuthManager.getCurrentUser();
        this.renderList(user);
    },
    
    renderList: function(user) {
        const listContainer = document.getElementById('vaultList');
        if (!user.vault || user.vault.length === 0) {
            listContainer.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">No passwords stored yet.</p>';
            return;
        }
        
        const searchInput = document.getElementById('vSearch');
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

        const filteredVault = user.vault.filter(item => 
            item.site.toLowerCase().includes(searchTerm) || 
            item.username.toLowerCase().includes(searchTerm)
        );

        if (filteredVault.length === 0) {
            listContainer.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">No matching passwords found.</p>';
            return;
        }
        
        let html = `
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #eee; color: #333;">
                        <th style="padding: 10px; text-align: left;">App / Site</th>
                        <th style="padding: 10px; text-align: left;">Username</th>
                        <th style="padding: 10px; text-align: left;">Password</th>
                        <th style="padding: 10px; text-align: center;">Action</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        filteredVault.forEach(item => {
            html += `
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 10px;"><strong>${item.site}</strong></td>
                    <td style="padding: 10px; color: #555;">${item.username}</td>
                    <td style="padding: 10px;">
                        <span class="pass-mask">••••••••</span>
                        <span class="pass-text" style="display:none; font-family: monospace; background: #eee; padding: 2px 5px; border-radius: 3px;">${item.password}</span>
                        <button onclick="VaultManager.toggleVisibility(this)" style="border: none; background: none; cursor: pointer; margin-left: 5px;">👁️</button>
                        <button onclick="VaultManager.copy(${item.id})" style="border: none; background: none; cursor: pointer; margin-left: 5px;" title="Copy Password">📋</button>
                    </td>
                    <td style="padding: 10px; text-align: center;">
                        <button onclick="VaultManager.delete(${item.id})" style="color: #ff4d4d; border: none; background: none; cursor: pointer; font-size: 16px;">🗑️</button>
                    </td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        listContainer.innerHTML = html;
    }
};

// Expose VaultManager to window for inline onclick events
window.VaultManager = VaultManager;

// ========================================
// DASHBOARD FUNCTIONS
// ========================================
function loadDashboard() {
    const user = AuthManager.getCurrentUser();
    if (!user) return;
    
    document.getElementById('dashboardUserName').textContent = user.name;
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profilePhone').textContent = user.phone || 'Not provided';
    
    // Initialize Store.it Vault
    VaultManager.init(user);
    
    // Initialize Dashboard Actions
    setupDashboardActions();
}

function backToDashboard() {
    loadDashboard();
    showScreen('dashboardScreen');
}

function setupDashboardActions() {
    const dashboard = document.getElementById('dashboardScreen');
    let actionSection = document.getElementById('dashboardActions');
    
    if (!actionSection) {
        actionSection = document.createElement('div');
        actionSection.id = 'dashboardActions';
        actionSection.style.marginTop = '20px';
        actionSection.style.textAlign = 'center';
        actionSection.style.paddingBottom = '30px';
        
        actionSection.innerHTML = `
            <button onclick="showScreen('registrationScreen'); loadRegistrationForm()" style="background: #2196F3; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-right: 10px; font-size: 14px;">Update Profile</button>
            <button onclick="handleLogout()" style="background: #f44336; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 14px;">Logout</button>
        `;
    }
    
    // Append to ensure it is at the bottom (below Vault)
    dashboard.appendChild(actionSection);
}

function clearForm() {
    // 1. Clear inputs
    document.getElementById('phone').value = '';
    document.getElementById('updateSecurityQuestion').value = '';
    document.getElementById('updateSecurityAnswer').value = '';
    document.getElementById('updatePassword').value = '';
    document.getElementById('updateConfirmPassword').value = '';

    // 2. Update Local Storage (Current User)
    const currentUser = AuthManager.getCurrentUser();
    if (currentUser) {
        currentUser.phone = '';
        AuthManager.updateUserData(currentUser);
    }

    // 3. Show message
    UIController.showMessage('registrationMessage', '🗑️ Data cleared successfully!', 'info');
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        AuthManager.logoutUser();
        UIController.showMessage('loginMessage', '👋 Logged out successfully!', 'info');
        document.getElementById('loginForm').reset();
        showScreen('loginScreen');
    }
}

// ========================================
// FORGOT PASSWORD HANDLER
// ========================================
function handleForgotPassword() {
    const email = prompt("Please enter your registered email address:");
    if (!email) return;

    const users = AuthManager.getAllUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
        alert("❌ Email not found!");
        return;
    }

    if (!user.securityQuestion || !user.securityAnswer) {
        alert("❌ Security question not set for this account. Cannot reset password.");
        return;
    }

    // Prompt with the specific question the user selected
    const answer = prompt(`Security Question:\n${user.securityQuestion}\n\nEnter your answer:`);
    if (!answer) return;

    if (answer.trim() === user.securityAnswer.trim()) {
        const newPass = prompt("✅ Answer Correct!\n\nEnter your new password (min 6 chars):");
        if (newPass && newPass.length >= 6) {
            user.password = newPass;
            AuthManager.updateUserData(user);
            alert("✅ Password reset successfully! Please login with your new password.");
        } else if (newPass) {
            alert("❌ Password must be at least 6 characters.");
        }
    } else {
        alert("❌ Incorrect answer.");
    }
}

// ========================================
// PASSWORD STRENGTH & MATCH ANIMATION
// ========================================
function setupPasswordFeatures() {
    const passwordInput = document.getElementById('signupPassword');
    const confirmInput = document.getElementById('signupConfirmPassword');
    
    if (!passwordInput || !confirmInput) return;

    // --- Create Checklist UI ---
    const checklistContainer = document.createElement('div');
    checklistContainer.style.fontSize = '12px';
    checklistContainer.style.color = '#666';
    checklistContainer.style.marginTop = '8px';
    checklistContainer.style.display = 'grid';
    checklistContainer.style.gridTemplateColumns = '1fr 1fr';
    checklistContainer.style.gap = '4px';

    const requirements = {
        length: { text: 'At least 6 characters' },
        uppercase: { text: 'One uppercase letter' },
        number: { text: 'One number' },
        special: { text: 'One special character' }
    };

    for (const key in requirements) {
        const item = document.createElement('div');
        item.id = `req-${key}`;
        item.innerHTML = `<span>&bull;</span> ${requirements[key].text}`;
        checklistContainer.appendChild(item);
    }
    passwordInput.parentNode.insertBefore(checklistContainer, passwordInput.nextSibling);

    // --- Create Strength Meter UI ---
    const strengthContainer = document.createElement('div');
    strengthContainer.style.marginTop = '10px';
    strengthContainer.style.marginBottom = '15px';
    
    const strengthBarBg = document.createElement('div');
    strengthBarBg.style.width = '100%';
    strengthBarBg.style.height = '4px';
    strengthBarBg.style.backgroundColor = '#e0e0e0';
    strengthBarBg.style.borderRadius = '2px';
    strengthBarBg.style.overflow = 'hidden';

    const strengthBarFill = document.createElement('div');
    strengthBarFill.style.width = '0%';
    strengthBarFill.style.height = '100%';
    strengthBarFill.style.backgroundColor = '#ff4d4d';
    strengthBarFill.style.transition = 'width 0.3s ease, background-color 0.3s ease';
    
    const strengthText = document.createElement('div');
    strengthText.style.textAlign = 'right';
    strengthText.style.fontSize = '12px';
    strengthText.style.marginTop = '4px';
    strengthText.style.color = '#666';
    strengthText.innerText = 'Strength: 0%';

    strengthBarBg.appendChild(strengthBarFill);
    strengthContainer.appendChild(strengthBarBg);
    strengthContainer.appendChild(strengthText);
    
    // Insert after the checklist
    checklistContainer.parentNode.insertBefore(strengthContainer, checklistContainer.nextSibling);

    // --- Create Match Indicator UI ---
    const matchText = document.createElement('div');
    matchText.style.fontSize = '12px';
    matchText.style.marginTop = '5px';
    matchText.style.textAlign = 'right';
    matchText.style.transition = 'color 0.3s ease';
    matchText.style.height = '18px'; 
    
    // Insert after confirm input
    confirmInput.parentNode.insertBefore(matchText, confirmInput.nextSibling);

    // --- Logic ---
    passwordInput.addEventListener('input', function() {
        const val = passwordInput.value;
        let strength = 0;
        
        // --- Define checks ---
        const checks = {
            length: val.length >= 6,
            uppercase: /[A-Z]/.test(val),
            number: /[0-9]/.test(val),
            special: /[^A-Za-z0-9]/.test(val),
        };

        // --- Update checklist UI ---
        for (const key in requirements) {
            const itemEl = document.getElementById(`req-${key}`);
            if (checks[key]) {
                itemEl.style.color = '#4caf50'; // Green
                itemEl.innerHTML = `<span>✅</span> ${requirements[key].text}`;
            } else {
                itemEl.style.color = '#666'; // Default gray
                itemEl.innerHTML = `<span>&bull;</span> ${requirements[key].text}`;
            }
        }

        // --- Calculate strength score ---
        if (val.length > 0) {
            if (checks.length) strength += 20;
            if (val.length >= 10) strength += 20; // Bonus for length
            if (checks.uppercase) strength += 20;
            if (checks.number) strength += 20;
            if (checks.special) strength += 20;
        }

        // --- Update Strength Bar UI ---
        strengthBarFill.style.width = strength + '%';
        strengthText.innerText = `Strength: ${strength}%`;

        if (strength <= 40) {
            strengthBarFill.style.backgroundColor = '#ff4d4d'; // Red
            strengthText.style.color = '#ff4d4d';
        } else if (strength <= 80) {
            strengthBarFill.style.backgroundColor = '#ffa500'; // Orange
            strengthText.style.color = '#ffa500';
        } else {
            strengthBarFill.style.backgroundColor = '#4caf50'; // Green
            strengthText.style.color = '#4caf50';
        }
        
        checkMatch();
    });

    confirmInput.addEventListener('input', checkMatch);

    function checkMatch() {
        const pass = passwordInput.value;
        const confirm = confirmInput.value;
        
        if (!confirm) {
            matchText.innerText = '';
            return;
        }

        if (pass === confirm) {
            matchText.innerText = '✅ Passwords Match';
            matchText.style.color = '#4caf50';
        } else {
            matchText.innerText = '❌ Passwords Do Not Match';
            matchText.style.color = '#ff4d4d';
        }
    }
}

// ========================================
// LOAD REGISTRATION FORM
// ========================================
function loadRegistrationForm() {
    const user = AuthManager.getCurrentUser();
    if (user) {
        document.getElementById('fullName').value = user.name;
        document.getElementById('email').value = user.email;
        document.getElementById('phone').value = user.phone || '';
        document.getElementById('updateSecurityQuestion').value = user.securityQuestion || '';
        document.getElementById('updateSecurityAnswer').value = user.securityAnswer || '';
        document.getElementById('updatePassword').value = '';
        document.getElementById('updateConfirmPassword').value = '';
    }
}

// Watch for registration screen to populate form
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.target.id === 'registrationScreen' && 
            mutation.target.classList.contains('active')) {
            loadRegistrationForm();
        }
    });
});

// ========================================

// 3D BACKGROUND (VANTA.JS)
// ========================================
function init3DBackground() {
    // 1. Inject CSS for background layers and content visibility
    const style = document.createElement('style');
    style.textContent = `
        #vanta-waves { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -3; }
        #vanta-net { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -2; pointer-events: none; }
        #vanta-birds { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; pointer-events: none; }
        .screen { background: rgba(255, 255, 255, 0.95); border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
        body { background-color: #000; }
    `;
    document.head.appendChild(style);

    // 2. Create container elements
    const wavesDiv = document.createElement('div');
    wavesDiv.id = 'vanta-waves';
    const netDiv = document.createElement('div');
    netDiv.id = 'vanta-net';
    const birdsDiv = document.createElement('div');
    birdsDiv.id = 'vanta-birds';
    document.body.prepend(birdsDiv);
    document.body.prepend(netDiv);
    document.body.prepend(wavesDiv);

    // 3. Helper to load scripts dynamically
    const loadScript = (src) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    };

    // 4. Load Three.js first, then Vanta effects
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js')
        .then(() => Promise.all([
            loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.waves.min.js'),
            loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js'),
            loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.birds.min.js')
        ]))
        .then(() => {
            if (window.VANTA) {
                // Initialize Waves (Bottom Layer)
                window.VANTA.WAVES({
                    el: "#vanta-waves",
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    scale: 1.00,
                    scaleMobile: 1.00,
                    color: 0x111111,
                    shininess: 35.00,
                    waveHeight: 20.00,
                    waveSpeed: 0.75,
                    zoom: 0.65
                });
                // Initialize Net (Middle Layer)
                window.VANTA.NET({
                    el: "#vanta-net",
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    scale: 1.00,
                    scaleMobile: 1.00,
                    color: 0x3fe8ff,
                    backgroundColor: 0x000000,
                    backgroundAlpha: 0.0, // Transparent
                    points: 10.00,
                    maxDistance: 20.00,
                    spacing: 15.00
                });
                // Initialize Birds (Top Layer)
                window.VANTA.BIRDS({
                    el: "#vanta-birds",
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    scale: 1.00,
                    scaleMobile: 1.00,
                    backgroundColor: 0x000000,
                    backgroundAlpha: 0.0, // Transparent
                    color1: 0xff0000,
                    color2: 0xffffff,
                    birdSize: 1.50,
                    wingSpan: 30.00,
                    speedLimit: 5.00,
                    separation: 20.00,
                    alignment: 20.00,
                    cohesion: 20.00,
                    quantity: 3.00
                });
            }
        })
        .catch(e => console.error("3D Background failed to load", e));
}

// ========================================
// INITIALIZE APPLICATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Set Project Name
    document.title = "Store.it - Password Manager";
    
    // Initialize 3D Background
    init3DBackground();
    
    // Check if user is already logged in
    const currentUser = AuthManager.getCurrentUser();
    if (currentUser) {
        loadDashboard();
        showScreen('dashboardScreen');
    } else {
        showScreen('loginScreen');
    }
    
    // Initialize password strength features
    setupPasswordFeatures();
    
    // Start observing registration screen
    const regScreen = document.getElementById('registrationScreen');
    observer.observe(regScreen, { attributes: true, attributeFilter: ['class'] });
});
