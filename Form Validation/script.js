document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signup-form');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const togglePasswordBtn = document.querySelector('.toggle-password');
    const successMessage = document.getElementById('success-message');
    const strengthSegments = document.querySelectorAll('.strength-segment');
  
    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', () => {
      const type = passwordInput.type === 'password' ? 'text' : 'password';
      passwordInput.type = type;
      confirmPasswordInput.type = type;
      
      // Update eye icon
      const svg = togglePasswordBtn.querySelector('svg');
      if (type === 'password') {
        svg.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
      } else {
        svg.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
      }
    });
  
    // Validate password strength
    function validatePassword(password) {
      let strength = 0;
      if (password.length >= 8) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/[0-9]/.test(password)) strength++;
      if (/[!@#$%^&*]/.test(password)) strength++;
      return strength;
    }
  
    // Update password strength meter
    function updateStrengthMeter(strength) {
      const colors = ['weak', 'medium', 'strong', 'very-strong'];
      strengthSegments.forEach((segment, index) => {
        segment.className = 'strength-segment';
        if (index < strength) {
          segment.classList.add(colors[strength - 1]);
        }
      });
    }
  
    // Show error message
    function showError(input, message) {
      const formGroup = input.closest('.form-group');
      const errorDiv = formGroup.querySelector('.error-message');
      input.classList.add('error');
      errorDiv.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="error-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
        ${message}
      `;
    }
  
    // Clear error message
    function clearError(input) {
      const formGroup = input.closest('.form-group');
      const errorDiv = formGroup.querySelector('.error-message');
      input.classList.remove('error');
      errorDiv.textContent = '';
    }
  
    // Validate form
    function validateForm() {
      let isValid = true;
      const username = document.getElementById('username');
      const email = document.getElementById('email');
      
      // Username validation
      if (username.value.length < 3) {
        showError(username, 'Username must be at least 3 characters');
        isValid = false;
      } else {
        clearError(username);
      }
  
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value)) {
        showError(email, 'Please enter a valid email');
        isValid = false;
      } else {
        clearError(email);
      }
  
      // Password validation
      if (passwordInput.value.length < 8) {
        showError(passwordInput, 'Password must be at least 8 characters');
        isValid = false;
      } else if (validatePassword(passwordInput.value) < 4) {
        showError(passwordInput, 'Password must include uppercase, numbers, and symbols');
        isValid = false;
      } else {
        clearError(passwordInput);
      }
  
      // Confirm password validation
      if (passwordInput.value !== confirmPasswordInput.value) {
        showError(confirmPasswordInput, 'Passwords do not match');
        isValid = false;
      } else {
        clearError(confirmPasswordInput);
      }
  
      return isValid;
    }
  
    // Real-time validation
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        clearError(input);
        if (input === passwordInput) {
          updateStrengthMeter(validatePassword(input.value));
        }
        if (input === confirmPasswordInput && passwordInput.value !== input.value) {
          showError(input, 'Passwords do not match');
        }
      });
    });
  
    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateForm()) {
        const formData = {
          username: form.username.value,
          email: form.email.value,
          password: form.password.value
        };
        console.log('Form submitted:', formData);
        form.style.display = 'none';
        successMessage.classList.remove('hidden');
      }
    });
  });
  
  // Reset form
  function resetForm() {
    const form = document.getElementById('signup-form');
    const successMessage = document.getElementById('success-message');
    form.reset();
    form.style.display = 'block';
    successMessage.classList.add('hidden');
    document.querySelectorAll('.strength-segment').forEach(segment => {
      segment.className = 'strength-segment';
    });
    document.querySelectorAll('.error-message').forEach(error => {
      error.textContent = '';
    });
    document.querySelectorAll('input').forEach(input => {
      input.classList.remove('error');
    });
  }