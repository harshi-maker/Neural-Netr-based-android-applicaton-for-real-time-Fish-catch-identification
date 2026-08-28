/**
 * PRODUCTION CLIENT: FORM HANDLER, THEME & NAVIGATION
 */

const ACCESS_KEY = '79ce2811-a00d-4a73-9014-44862bc3bf92';
const RECIPIENT_EMAIL = 'hkottapa@student.gitam.edu';

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Theme Management (Light / Dark Mode)
  // --------------------------------------------------------------------------
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;

  const savedTheme = localStorage.getItem('aura_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
  } else if (systemPrefersDark) {
    root.setAttribute('data-theme', 'dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', newTheme);
      localStorage.setItem('aura_theme', newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
    });
  }

  // --------------------------------------------------------------------------
  // 2. Mobile Navigation Toggle
  // --------------------------------------------------------------------------
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-item, .mobile-menu .btn');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      if (isOpen) {
        mobileMenu.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      } else {
        mobileMenu.classList.add('open');
        menuToggle.classList.add('open');
        menuToggle.setAttribute('aria-expanded', 'true');
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. Contact & Team Registration Form Submission
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('simpleContactForm');
  const submitBtn = document.getElementById('submitBtn');

  // RFC-5322 compliant regex
  const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const phoneInput = document.getElementById('phone');
      const messageInput = document.getElementById('message');

      const teamName = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      // --- Validation ---
      if (!teamName || teamName.length < 2) {
        showToast('Please enter a valid Team Name (at least 2 characters).', 'error');
        nameInput?.focus();
        return;
      }

      if (!email || !EMAIL_REGEX.test(email)) {
        showToast('Please enter a valid email address (e.g. hkottapa@student.gitam.edu).', 'error');
        emailInput?.focus();
        return;
      }

      if (phone && !PHONE_REGEX.test(phone)) {
        showToast('Please enter a valid phone number format.', 'error');
        phoneInput?.focus();
        return;
      }

      if (!message || message.length < 10) {
        showToast('Please enter a message with at least 10 characters.', 'error');
        messageInput?.focus();
        return;
      }

      // --- Loading State ---
      const btnSpan = submitBtn ? submitBtn.querySelector('span') : null;
      const originalText = btnSpan ? btnSpan.textContent : 'Send Message';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.setAttribute('aria-busy', 'true');
        if (btnSpan) {
          btnSpan.innerHTML = '<span class="btn-spinner"></span>Sending Message...';
        }
      }

      // --- Prepare FormData for Web3Forms API ---
      const formData = new FormData(contactForm);
      if (!formData.get('access_key')) {
        formData.append('access_key', ACCESS_KEY);
      }
      formData.set('name', teamName);
      formData.set('email', email);
      formData.set('phone', phone || 'Not provided');
      formData.set('message', message);
      formData.set('replyto', email);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok && data.success) {
          contactForm.reset();
          showToast('Thank you! Your message has been sent successfully to GITAM.', 'success');
        } else {
          const errMsg = data.message || 'Submission was not accepted by the email gateway.';
          console.warn('API Response Warning:', data);

          // If the Web3Forms access key requires email verification:
          if (errMsg.toLowerCase().includes('activate') || errMsg.toLowerCase().includes('check your email')) {
            showToast('Please check hkottapa@student.gitam.edu inbox to activate your Web3Forms key once.', 'info');
          } else {
            showToast(`Status: ${errMsg}`, 'error');
          }
        }
      } catch (networkError) {
        console.error('Network dispatch error:', networkError);
        
        // Fallback: If opened via file:/// where fetch CORS is restricted by browser security policies
        showToast('Direct network restricted. Opening your email client to send...', 'info');
        
        const mailtoUrl = `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent('New Team Inquiry: ' + teamName)}&body=${encodeURIComponent('Team Name: ' + teamName + '\nEmail: ' + email + '\nPhone: ' + (phone || 'N/A') + '\n\nMessage:\n' + message)}`;
        
        window.location.href = mailtoUrl;
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.removeAttribute('aria-busy');
          if (btnSpan) {
            btnSpan.textContent = originalText;
          }
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. Toast Notification
  // --------------------------------------------------------------------------
  let toastTimer = null;
  function showToast(message, variant = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    if (toastTimer) {
      clearTimeout(toastTimer);
    }

    toast.textContent = message;
    toast.className = `toast show ${variant}`;
    toast.setAttribute('aria-hidden', 'false');

    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
      toast.setAttribute('aria-hidden', 'true');
    }, 4500);
  }

  // --------------------------------------------------------------------------
  // 5. Update Current Year
  // --------------------------------------------------------------------------
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }
});
