export function commetnsFormValidation() {

	// src/scripts/form-validation.js
const ERROR_CLASS = "--error";

function validateField(field) {
  const value = field.value.trim();
  const isRequired = field.hasAttribute("data-required");

  let isValid = true;

  if (isRequired && value === "") {
    isValid = false;
  } else if (value !== "") {
    // type="email" / type="url" перевіряє сам браузер (typeMismatch).
    // Власні бабли вимкнені через novalidate, а сама перевірка працює.
    isValid = field.checkValidity();
  }

  setFieldState(field, isValid);
  return isValid;
}

function setFieldState(field, isValid) {
  const wrapper = field.parentElement;
  wrapper.classList.toggle(ERROR_CLASS, !isValid);

  if (isValid) {
    field.removeAttribute("aria-invalid");
  } else {
    field.setAttribute("aria-invalid", "true");
  }
}

function getFields(form) {
  return form.querySelectorAll("input, textarea");
}

function initFormValidation(form) {
  // Сабміт: перевіряємо все, фокусуємось на першому невалідному полі
  form.addEventListener("submit", (e) => {
    let firstInvalid = null;

    getFields(form).forEach((field) => {
      if (!validateField(field) && !firstInvalid) {
        firstInvalid = field;
      }
    });

    if (firstInvalid) {
      e.preventDefault();
      firstInvalid.focus();
    }
    // якщо все валідно — тут відправка (fetch або звичайний submit)
  });

  // Blur: показуємо помилку, коли користувач залишив поле
  form.addEventListener(
    "blur",
    (e) => {
      if (e.target.matches("input, textarea")) validateField(e.target);
    },
    true // blur не спливає, тому capture
  );

  // Input: помилку, що вже показана, прибираємо одразу під час друку
  form.addEventListener("input", (e) => {
    const field = e.target;
    if (field.matches("input, textarea") && field.parentElement.classList.contains(ERROR_CLASS)) {
      validateField(field);
    }
  });

  // Reset форми теж чистить стани
  form.addEventListener("reset", () => {
    getFields(form).forEach((field) => setFieldState(field, true));
  });
}

document.querySelectorAll("[data-validate-form]").forEach(initFormValidation);
}