export function initFormValidation() {
  const form = document.querySelector('[data-validate-form]');
  if (!form) return;

  const fields = Array.from(form.querySelectorAll('[data-rule]'));
  const status = form.querySelector('[data-form-status]');

  const validateField = (field) => {
    const rule = field.dataset.rule || '';
    const value = field.value.trim();
    let message = '';

    if (rule === 'required' && !value) message = 'This field is required.';
    if (rule === 'email' && !/^\S+@\S+\.\S+$/.test(value)) message = 'Enter a valid email address.';
    if (rule.startsWith('min:')) {
      const min = Number(rule.split(':')[1] || 0);
      if (value.length < min) message = `Please enter at least ${min} characters.`;
    }

    field.classList.toggle('input-error', Boolean(message));
    field.setAttribute('aria-invalid', String(Boolean(message)));
    return message;
  };

  fields.forEach((field) => {
    ['input', 'blur', 'change'].forEach((eventName) => {
      field.addEventListener(eventName, () => {
        validateField(field);
        if (status) {
          status.textContent = '';
          status.classList.remove('is-success', 'is-error');
        }
      });
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const errors = fields.map(validateField).filter(Boolean);
    if (!status) return;
    if (errors.length) {
      status.textContent = errors[0];
      status.classList.add('is-error');
      status.classList.remove('is-success');
      return;
    }
    status.textContent = 'Validated successfully. This demo form is ready to be connected to your backend.';
    status.classList.add('is-success');
    status.classList.remove('is-error');
  });
}
