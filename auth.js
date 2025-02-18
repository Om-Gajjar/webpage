/**
 * Authentication module for handling user login, signup, and session management
 */

import { ui } from './scripts.js';

/**
 * Setup authentication functionality
 */
export function setupAuth() {
    const mockUsers = JSON.parse(localStorage.getItem('users') || '[]');

    function showModal(modalId) {
        document.getElementById(modalId).classList.add('show');
    }

    function hideModal(modalId) {
        document.getElementById(modalId).classList.remove('show');
    }

    function updateAuthUI(user) {
        const authButtons = document.querySelector('.auth-buttons');
        const userMenu = document.querySelector('.user-menu');

        if (user) {
            authButtons.style.display = 'none';
            userMenu.style.display = 'flex';
            document.querySelector('.username').textContent = user.username;
        } else {
            authButtons.style.display = 'flex';
            userMenu.style.display = 'none';
        }
    }

    // Add form validation
    function validateForm(form) {
        const password = form.querySelector('input[type="password"]');
        const confirm = form.querySelector('#signup-password-confirm');

        if (confirm && password.value !== confirm.value) {
            return false;
        }

        return true;
    }

    // Add password strength check
    function checkPasswordStrength(password) {
        const minLength = 8;
        const hasNumber = /\d/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);

        return password.length >= minLength && hasNumber && hasUpperCase && hasLowerCase;
    }

    // For localStorage operations
    function safelyGetFromStorage(key, defaultValue = '[]') {
        try {
            return JSON.parse(localStorage.getItem(key) || defaultValue);
        } catch (error) {
            handleError(error, 'storage');
            return JSON.parse(defaultValue);
        }
    }

    function safelySetToStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            handleError(error, 'storage');
            return false;
        }
    }

    // Handle login
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        try {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const users = safelyGetFromStorage('users');

            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                const { password: _, ...userData } = user;
                if (safelySetToStorage('currentUser', userData)) {
                    updateAuthUI(userData);
                    hideModal('login-modal');
                    ui.showToast('Logged in successfully', 'success');
                    resetForm('login-form');
                    clearFormErrors('login-form');
                }
            } else {
                ui.showToast('Invalid credentials', 'error');
            }
        } catch (error) {
            handleError(error, 'login');
        }
    });

    // Handle signup
    document.getElementById('signup-form').addEventListener('submit', (e) => {
        e.preventDefault();
        try {
            const username = document.getElementById('signup-username').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            if (!checkPasswordStrength(password)) {
                ui.showToast('Password must be at least 8 characters with numbers and both cases', 'error');
                return;
            }

            const users = safelyGetFromStorage('users');

            if (users.some(u => u.email === email)) {
                ui.showToast('Email already registered', 'error');
                return;
            }

            const newUser = { username, email, password };
            users.push(newUser);

            if (safelySetToStorage('users', users)) {
                const { password: _, ...userData } = newUser;
                if (safelySetToStorage('currentUser', userData)) {
                    updateAuthUI(userData);
                    hideModal('signup-modal');
                    ui.showToast('Account created successfully', 'success');
                    resetForm('signup-form');
                    clearFormErrors('signup-form');
                }
            }
        } catch (error) {
            handleError(error, 'signup');
        }
    });

    // Handle logout
    document.querySelector('.logout-link').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        updateAuthUI(null);
        ui.showToast('Logged out successfully', 'success');
    });

    // Check initial auth state
    try {
        const currentUser = safelyGetFromStorage('currentUser', 'null');
        if (currentUser) {
            updateAuthUI(currentUser);
        }
    } catch (error) {
        handleError(error, 'auth-state');
    }

    // Modal triggers
    document.querySelectorAll('[data-modal]').forEach(button => {
        button.addEventListener('click', () => {
            showModal(`${button.dataset.modal}-modal`);
        });
    });

    // Close modal on outside click
    document.querySelectorAll('.auth-modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });

    // Close modals with close button
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.auth-modal');
            modal.classList.remove('show');
        });
    });

    // Handle form validation
    document.querySelectorAll('.auth-form').forEach(form => {
        form.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => {
                input.setCustomValidity('');
                input.checkValidity();
            });
        });
    });

    // Handle auth form switching
    document.querySelectorAll('.switch-auth').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const currentModal = link.closest('.auth-modal');
            const targetModal = link.dataset.modal;

            currentModal.classList.remove('show');
            showModal(`${targetModal}-modal`);
        });
    });

    // Add error handling
    function handleError(error, context = 'general') {
        console.error(`Auth Error (${context}):`, error);
        let message = 'An error occurred. Please try again.';

        switch (context) {
            case 'login':
                message = 'Login failed. Please check your credentials.';
                break;
            case 'signup':
                message = 'Signup failed. Please try again.';
                break;
            case 'storage':
                message = 'Storage error. Please check your browser settings.';
                break;
        }

        ui.showToast(message, 'error');
    }

    // Reset form fields after submission
    function resetForm(formId) {
        document.getElementById(formId).reset();
    }

    // Clear form errors
    function clearFormErrors(formId) {
        const form = document.getElementById(formId);
        form.querySelectorAll('input').forEach(input => {
            input.setCustomValidity('');
        });
    }

    // Add keyboard event listeners for modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.auth-modal.show').forEach(modal => {
                modal.classList.remove('show');
            });
        }
    });

    // Add focus trap for modals
    document.querySelectorAll('.auth-modal').forEach(modal => {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        });
    });
}