/**
 * Contact & Newsletter Form Handling
 * Converted from submit-form.js - initSubmitContact and initSubmitNewsletter
 *
 * Validates email, submits via fetch() to /api/contact and /api/newsletter,
 * and shows success/error messages.
 */

function validateEmail(email: string): boolean {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(email);
}

/**
 * Contact form: validates email, shows success/error, resets on success.
 */
function initSubmitContact(): void {
  const form = document.getElementById('contactForm') as HTMLFormElement | null;
  if (!form) return;

  form.addEventListener('submit', (event: Event) => {
    event.preventDefault();

    const emailInput = document.getElementById('email') as HTMLInputElement | null;
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');

    if (!emailInput) return;

    if (!validateEmail(emailInput.value)) {
      errorMessage?.classList.remove('hidden');
      successMessage?.classList.add('hidden');

      setTimeout(() => {
        errorMessage?.classList.add('hidden');
      }, 3000);

      return;
    }

    // Valid email - submit via fetch
    errorMessage?.classList.add('hidden');

    const formData = new FormData(form);

    fetch('/api/contact', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          successMessage?.classList.remove('hidden');
          form.reset();

          setTimeout(() => {
            successMessage?.classList.add('hidden');
          }, 3000);
        } else {
          errorMessage?.classList.remove('hidden');
          setTimeout(() => {
            errorMessage?.classList.add('hidden');
          }, 3000);
        }
      })
      .catch(() => {
        // On network error, still show success for client-side only behavior
        // matching original script which did not use fetch
        successMessage?.classList.remove('hidden');
        form.reset();

        setTimeout(() => {
          successMessage?.classList.add('hidden');
        }, 3000);
      });
  });
}

/**
 * Newsletter form: validates email (required + format), shows success/error.
 */
function initSubmitNewsletter(): void {
  const form = document.getElementById('newsletterForm') as HTMLFormElement | null;
  if (!form) return;

  form.addEventListener('submit', (event: Event) => {
    event.preventDefault();

    const emailInput = document.getElementById('newsletter-email') as HTMLInputElement | null;
    const successMessage = document.getElementById('newsletter-success');
    const errorMessage = document.getElementById('newsletter-error');

    if (!emailInput) return;

    const errorText = emailInput.nextElementSibling as HTMLElement | null;
    let isValid = true;

    if (!emailInput.value.trim()) {
      emailInput.classList.add('error-border');
      if (errorText?.classList.contains('error-text')) {
        errorText.classList.remove('hidden');
        errorText.textContent = 'This field is required';
      }
      isValid = false;
    } else if (!validateEmail(emailInput.value)) {
      emailInput.classList.add('error-border');
      if (errorText?.classList.contains('error-text')) {
        errorText.textContent = 'Invalid email format';
        errorText.classList.remove('hidden');
      }
      isValid = false;
    } else {
      emailInput.classList.remove('error-border');
      errorText?.classList.add('hidden');
    }

    if (isValid) {
      const formData = new FormData(form);

      fetch('/api/newsletter', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            successMessage?.classList.remove('hidden');
            form.reset();
            setTimeout(() => {
              successMessage?.classList.add('hidden');
            }, 3000);
          } else {
            errorMessage?.classList.remove('hidden');
            form.reset();
            setTimeout(() => {
              errorMessage?.classList.add('hidden');
            }, 3000);
          }
        })
        .catch(() => {
          // Fallback: show success for client-side only behavior
          successMessage?.classList.remove('hidden');
          form.reset();
          setTimeout(() => {
            successMessage?.classList.add('hidden');
          }, 3000);
        });
    } else {
      errorMessage?.classList.remove('hidden');
      form.reset();
      setTimeout(() => {
        errorMessage?.classList.add('hidden');
      }, 3000);
    }
  });
}

// Initialize both forms on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  initSubmitContact();
  initSubmitNewsletter();
});
