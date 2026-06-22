/**
 * login.js - Complete OTP-based authentication flow
 * Handles: Email/Phone input → OTP sending → OTP verification → Token storage
 */

const API_URL = window.location.origin.includes('localhost') ? 'http://localhost:5000/api' : '/api';

// ========================================
// STATE MANAGEMENT
// ========================================
let currentRole = 'student'; // student or owner
let otpSentEmail = '';
let otpTimer = null;
let otpTimeRemaining = 600; // 10 minutes

// ========================================
// DOM ELEMENTS
// ========================================
const emailInput = document.getElementById('emailInput');
const phoneInput = document.getElementById('phoneInput');
const phoneForm = document.getElementById('phoneForm');
const sendOtpBtn = document.querySelector('button[onclick*="send"]') || 
                   Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Send OTP'));

// Role selector
const roleButtons = document.querySelectorAll('.role-btn');

// ========================================
// 1. ROLE SELECTION
// ========================================
roleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        roleButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentRole = btn.textContent.toLowerCase().includes('student') ? 'student' : 'owner';
    });
});

// ========================================
// 2. SEND OTP HANDLER
// ========================================
async function handleSendOtp(e) {
    if (e) e.preventDefault();
    
    const email = emailInput?.value?.trim();
    const phone = phoneInput?.value?.trim();
    
    // Validation
    if (!email || !phone) {
        showError('Please enter both email and phone number');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }
    
    if (phone.length !== 10 || !isValidPhone(phone)) {
        showError('Please enter a valid 10-digit phone number');
        return;
    }
    
    // Show loading state
    const btn = sendOtpBtn;
    const originalText = btn?.textContent;
    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Sending OTP...';
        btn.innerHTML = '<span style="display:flex;align-items:center;gap:8px;justify-content:center;"><i class="fas fa-spinner fa-spin"></i> Sending OTP...</span>';
    }
    
    try {
        const response = await fetch(`${API_URL}/auth/send-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                phone,
                role: currentRole
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to send OTP');
        }
        
        // Success - store email and show OTP screen
        otpSentEmail = email;
        showSuccessMessage(`OTP sent to ${email}. Check your inbox!`);
        
        // Switch UI to OTP verification
        setTimeout(() => {
            switchToOtpVerification(email);
            startOtpTimer();
        }, 1500);
        
    } catch (error) {
        console.error('Send OTP Error:', error);
        showError(error.message || 'Failed to send OTP. Please try again.');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.textContent = originalText || 'Send OTP';
        }
    }
}

// ========================================
// 3. SWITCH TO OTP VERIFICATION UI
// ========================================
function switchToOtpVerification(email) {
    // Hide phone form
    phoneForm.style.display = 'none';
    
    // Show OTP form (create if doesn't exist)
    let otpForm = document.getElementById('otpForm');
    if (!otpForm) {
        otpForm = createOtpForm(email);
        phoneForm.parentElement.insertBefore(otpForm, phoneForm);
    }
    
    otpForm.style.display = 'block';
    
    // Focus on first OTP input
    const firstOtpInput = otpForm.querySelector('.otp-input');
    if (firstOtpInput) firstOtpInput.focus();
}

// ========================================
// 4. CREATE OTP VERIFICATION FORM
// ========================================
function createOtpForm(email) {
    const form = document.createElement('form');
    form.id = 'otpForm';
    form.style.display = 'none';
    
    form.innerHTML = `
        <div style="margin-bottom: 1.5rem; text-align: center;">
            <h3 style="color: var(--text-main); font-size: 1.1rem; margin-bottom: 0.5rem;">Verify Your OTP</h3>
            <p style="color: var(--text-muted); font-size: 0.9rem;">Enter the 4-digit code sent to<br><strong>${escapeHtml(email)}</strong></p>
        </div>
        
        <div class="otp-container">
            <input type="text" class="otp-input" maxlength="1" inputmode="numeric" data-index="0">
            <input type="text" class="otp-input" maxlength="1" inputmode="numeric" data-index="1">
            <input type="text" class="otp-input" maxlength="1" inputmode="numeric" data-index="2">
            <input type="text" class="otp-input" maxlength="1" inputmode="numeric" data-index="3">
        </div>
        
        <button type="submit" class="btn-primary" style="width: 100%; margin-bottom: 1rem;">
            <i class="fas fa-check-circle"></i> Verify OTP
        </button>
        
        <div style="text-align: center; margin-bottom: 1rem;">
            <small style="color: var(--text-muted);">
                Didn't receive OTP? 
                <button type="button" id="resendOtpBtn" style="color: var(--primary); font-weight: 600; cursor: pointer; background: none; border: none; padding: 0;">
                    Resend (<span id="otpTimer">60</span>s)
                </button>
            </small>
        </div>
        
        <button type="button" style="width: 100%; color: var(--text-muted); text-align: center; background: none; border: none; cursor: pointer; font-size: 0.9rem;" onclick="switchBackToPhone()">
            ← Back to Phone
        </button>
    `;
    
    // Setup OTP input handlers
    setupOtpInputHandlers(form);
    
    // Form submission
    form.addEventListener('submit', (e) => handleVerifyOtp(e, email));
    
    // Resend button
    form.querySelector('#resendOtpBtn').addEventListener('click', (e) => {
        e.preventDefault();
        handleSendOtp();
    });
    
    return form;
}

// ========================================
// 5. OTP INPUT HANDLERS (Auto-focus between fields)
// ========================================
function setupOtpInputHandlers(form) {
    const inputs = form.querySelectorAll('.otp-input');
    
    inputs.forEach((input, index) => {
        // Only allow numbers
        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            
            // Auto-focus next input
            if (e.target.value && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
            
            // Auto-submit if all filled
            if (Array.from(inputs).every(i => i.value)) {
                form.dispatchEvent(new Event('submit'));
            }
        });
        
        // Handle backspace
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                inputs[index - 1].focus();
            }
        });
        
        // Handle paste (split into individual digits)
        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedData = (e.clipboardData || window.clipboardData).getData('text');
            const digits = pastedData.replace(/[^0-9]/g, '').split('');
            
            digits.forEach((digit, i) => {
                if (index + i < inputs.length) {
                    inputs[index + i].value = digit;
                }
            });
            
            if (digits.length === 4) {
                form.dispatchEvent(new Event('submit'));
            }
        });
    });
}

// ========================================
// 6. VERIFY OTP HANDLER
// ========================================
async function handleVerifyOtp(e, email) {
    e.preventDefault();
    
    const form = e.target;
    const otpInputs = form.querySelectorAll('.otp-input');
    const otp = Array.from(otpInputs).map(i => i.value).join('');
    
    if (otp.length !== 4) {
        showError('Please enter the complete OTP');
        return;
    }
    
    // Show loading
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
    
    try {
        const response = await fetch(`${API_URL}/auth/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Invalid OTP');
        }
        
        // Success - store token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        showSuccessMessage('Login successful! Redirecting...');
        
        // Redirect based on role
        setTimeout(() => {
            if (data.user.role === 'admin') {
                window.location.href = '/admin.html';
            } else {
                window.location.href = '/dashboard.html';
            }
        }, 1500);
        
    } catch (error) {
        console.error('Verify OTP Error:', error);
        showError(error.message || 'Failed to verify OTP');
        
        // Clear OTP inputs
        otpInputs.forEach(input => input.value = '');
        otpInputs[0].focus();
        
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// ========================================
// 7. SWITCH BACK TO PHONE
// ========================================
function switchBackToPhone() {
    const otpForm = document.getElementById('otpForm');
    if (otpForm) otpForm.style.display = 'none';
    phoneForm.style.display = 'block';
    phoneInput.focus();
    
    // Clear OTP inputs
    document.querySelectorAll('.otp-input').forEach(i => i.value = '');
    
    // Stop timer
    if (otpTimer) clearInterval(otpTimer);
}

// ========================================
// 8. OTP TIMER
// ========================================
function startOtpTimer() {
    otpTimeRemaining = 600; // 10 minutes
    const timerEl = document.getElementById('otpTimer');
    const resendBtn = document.getElementById('resendOtpBtn');
    
    if (otpTimer) clearInterval(otpTimer);
    
    otpTimer = setInterval(() => {
        otpTimeRemaining--;
        
        if (timerEl) {
            const mins = Math.floor(otpTimeRemaining / 60);
            const secs = otpTimeRemaining % 60;
            timerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        }
        
        if (otpTimeRemaining <= 0) {
            clearInterval(otpTimer);
            if (resendBtn) {
                resendBtn.textContent = 'Resend';
                resendBtn.disabled = false;
            }
        }
    }, 1000);
}

// ========================================
// 9. VALIDATION HELPERS
// ========================================
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function isValidPhone(phone) {
    const re = /^[0-9]{10}$/;
    return re.test(phone);
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ========================================
// 10. NOTIFICATION HELPERS
// ========================================
function showError(message) {
    console.error('Error:', message);
    
    // Create error notification
    let errorEl = document.getElementById('errorNotification');
    if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.id = 'errorNotification';
        errorEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fee2e2;
            border: 1px solid #fca5a5;
            color: #991b1b;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 500;
            z-index: 10000;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            animation: slideIn 0.3s ease-out;
        `;
        document.body.appendChild(errorEl);
    }
    
    errorEl.textContent = message;
    errorEl.style.display = 'block';
    
    setTimeout(() => {
        errorEl.style.display = 'none';
    }, 5000);
}

function showSuccessMessage(message) {
    let successEl = document.getElementById('successNotification');
    if (!successEl) {
        successEl = document.createElement('div');
        successEl.id = 'successNotification';
        successEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dcfce7;
            border: 1px solid #86efac;
            color: #166534;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 500;
            z-index: 10000;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            animation: slideIn 0.3s ease-out;
        `;
        document.body.appendChild(successEl);
    }
    
    successEl.textContent = message;
    successEl.style.display = 'block';
}

// ========================================
// 11. INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Attach send OTP handler
    const sendBtn = document.querySelector('button:has(i.fas)') || 
                    Array.from(document.querySelectorAll('button')).find(b => 
                        b.textContent.includes('Send OTP') || b.innerHTML.includes('Send OTP')
                    );
    
    if (sendBtn && phoneForm) {
        phoneForm.addEventListener('submit', handleSendOtp);
        sendBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleSendOtp();
        });
    }
    
    // Check if already logged in
    const token = localStorage.getItem('token');
    if (token) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.role === 'admin') {
            window.location.href = '/admin.html';
        } else {
            window.location.href = '/dashboard.html';
        }
    }
});

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeUp {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
