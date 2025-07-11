const tg = window.Telegram?.WebApp;
if (!tg) {
  console.warn('Telegram WebApp не найден');
} else {
  tg.expand();
  tg.setHeaderColor('#2d5016');
}

const form = document.getElementById('regForm');
const submitBtn = form.querySelector('.submit-btn');

const fieldTouched = {
  nick: false,
  fa: false,
  discord_id: false,
  vozrast: false,
  gorod: false
};

function validateNick(nick) {
  const errorElement = document.getElementById('nick-error');
  
  if (!fieldTouched.nick) return true;
  
  if (!nick) {
    showError(errorElement, 'Введите ник');
    return false;
  }
  
  if (!nick.includes('_')) {
    showError(errorElement, 'Ник должен быть в формате Nick_Name');
    return false;
  }
  
  hideError(errorElement);
  return true;
}

function validateForumAccount(url) {
  const errorElement = document.getElementById('fa-error');
  
  if (!fieldTouched.fa) return true;
  
  if (!url) {
    showError(errorElement, 'Введите ссылку на форумный аккаунт');
    return false;
  }
  
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    showError(errorElement, 'Введите корректную ссылку');
    return false;
  }
  
  hideError(errorElement);
  return true;
}

function validateDiscordId(id) {
  const errorElement = document.getElementById('discord-error');
  
  if (!fieldTouched.discord_id) return true;
  
  if (!id) {
    showError(errorElement, 'Введите Discord ID');
    return false;
  }
  
  if (!/^\d+$/.test(id)) {
    showError(errorElement, 'Discord ID должен состоять только из цифр');
    return false;
  }
  
  hideError(errorElement);
  return true;
}

function validateAge(age) {
  const errorElement = document.getElementById('age-error');
  
  if (!fieldTouched.vozrast) return true;
  
  if (!age) {
    showError(errorElement, 'Введите возраст');
    return false;
  }
  
  
  hideError(errorElement);
  return true;
}

function validateLocation(location) {
  const errorElement = document.getElementById('location-error');
  
  if (!fieldTouched.gorod) return true;
  
  if (!location) {
    showError(errorElement, 'Введите место проживания');
    return false;
  }
  
  hideError(errorElement);
  return true;
}

function showError(element, message) {
  element.textContent = message;
  element.style.display = 'block';
}

function hideError(element) {
  element.textContent = '';
  element.style.display = 'none';
}

function validateForm() {
  const nick = document.getElementById('nick').value.trim();
  const fa = document.getElementById('fa').value.trim();
  const discord_id = document.getElementById('discord_id').value.trim();
  const vozrast = document.getElementById('vozrast').value;
  const gorod = document.getElementById('gorod').value.trim();
  
  const isNickValid = validateNick(nick);
  const isFaValid = validateForumAccount(fa);
  const isDiscordValid = validateDiscordId(discord_id);
  const isAgeValid = validateAge(vozrast);
  const isLocationValid = validateLocation(gorod);
  
  const isValid = isNickValid && isFaValid && isDiscordValid && isAgeValid && isLocationValid;
  submitBtn.disabled = !isValid;
  
  return isValid;
}

const inputs = form.querySelectorAll('input');
inputs.forEach(input => {
  input.addEventListener('input', function() {
    fieldTouched[this.id] = true;
    validateForm();
    if (this.classList.contains('invalid')) {
      this.classList.remove('invalid');
    }
  });
  
  input.addEventListener('blur', function() {
    fieldTouched[this.id] = true;
    const value = this.value.trim();
    
    switch(this.id) {
      case 'nick':
        validateNick(value);
        if (!validateNick(value)) this.classList.add('invalid');
        break;
      case 'fa':
        validateForumAccount(value);
        if (!validateForumAccount(value)) this.classList.add('invalid');
        break;
      case 'discord_id':
        validateDiscordId(value);
        if (!validateDiscordId(value)) this.classList.add('invalid');
        break;
      case 'vozrast':
        validateAge(value);
        if (!validateAge(value)) this.classList.add('invalid');
        break;
      case 'gorod':
        validateLocation(value);
        if (!validateLocation(value)) this.classList.add('invalid');
        break;
    }
  });
});

function submitForm() {
  if (!validateForm()) {
    return;
  }
  
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;
  
  // Собираем данные
  const data = {
    nick: document.getElementById('nick').value.trim(),
    fa: document.getElementById('fa').value.trim(),
    discord_id: document.getElementById('discord_id').value.trim(),
    vozrast: parseInt(document.getElementById('vozrast').value),
    gorod: document.getElementById('gorod').value.trim(),
    timestamp: new Date().toISOString()
  };
  
  setTimeout(() => {
    try {
      if (tg) {
        tg.sendData(JSON.stringify(data));
      } else {
        console.log('Данные формы:', data);
        showSuccessMessage();
      }
    } catch (err) {
      console.error('Ошибка отправки:', err);
      alert('Ошибка отправки данных');
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  }, 800);
}

function showSuccessMessage() {
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.innerHTML = `
    <div class="success-icon"></div>
    <div>Заявка успешно отправлена!</div>
  `;
  form.parentNode.insertBefore(successDiv, form);
  
  submitBtn.textContent = 'Готово!';
  submitBtn.classList.remove('loading');
  submitBtn.style.background = '#22c55e';
  
  setTimeout(() => {
    form.reset();
    submitBtn.style.background = '';
    submitBtn.textContent = 'Отправить заявку';
    successDiv.remove();
    validateForm();
    
    for (const key in fieldTouched) {
      fieldTouched[key] = false;
    }
  }, 3000);
}

form.addEventListener('submit', function(e) {
  e.preventDefault();
  submitForm();
});

// Инициализация валидации
validateForm();

class InactiveForm {
    constructor() {
        this.selectedDays = null;
        this.init();
    }

    init() {
        this.setupDaySelectors();
        this.setupFormSubmission();
        this.setupMainButton();
    }

    setupDaySelectors() {
        const dayOptions = document.querySelectorAll('.day-option');
        
        dayOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                // Убираем выделение с других опций
                dayOptions.forEach(opt => opt.classList.remove('selected'));
                
                // Выделяем выбранную опцию
                e.target.classList.add('selected');
                this.selectedDays = parseInt(e.target.dataset.days);
                
                // Скрываем ошибку
                this.hideError('daysError');
                
                // Обновляем состояние главной кнопки
                this.updateMainButton();
            });
        });
    }

    setupFormSubmission() {
        const form = document.getElementById('inactiveForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitForm();
        });
    }

    setupMainButton() {
        if (!window.Telegram?.WebApp) return;

        const tg = window.Telegram.WebApp;
        
        tg.MainButton.text = "Подать заявку";
        tg.MainButton.show();
        
        tg.MainButton.onClick(() => {
            this.submitForm();
        });

        // Слушаем изменения в текстовом поле
        const reasonTextarea = document.getElementById('reason');
        if (reasonTextarea) {
            reasonTextarea.addEventListener('input', () => {
                this.updateMainButton();
            });
        }

        // Первоначальная настройка кнопки
        this.updateMainButton();
    }

    updateMainButton() {
        if (!window.Telegram?.WebApp) return;

        const tg = window.Telegram.WebApp;
        const reason = document.getElementById('reason')?.value.trim();
        
        if (this.selectedDays && reason) {
            tg.MainButton.enable();
        } else {
            tg.MainButton.disable();
        }
    }

    validateForm() {
        let isValid = true;
        
        // Проверка выбора дней
        if (!this.selectedDays) {
            this.showError('daysError', 'Выберите количество дней');
            isValid = false;
        }

        // Проверка причины
        const reason = document.getElementById('reason')?.value.trim();
        if (!reason) {
            this.showError('reasonError', 'Укажите причину неактива');
            isValid = false;
        }

        return isValid;
    }

    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
            errorElement.style.display = 'block';
        }
    }

    hideError(elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.classList.remove('show');
            errorElement.style.display = 'none';
        }
    }

    hideAllErrors() {
        const errors = document.querySelectorAll('.error-message');
        errors.forEach(error => {
            error.classList.remove('show');
            error.style.display = 'none';
        });
    }

    submitForm() {
        // Скрываем все ошибки
        this.hideAllErrors();

        // Валидация
        if (!this.validateForm()) {
            return;
        }

        const reason = document.getElementById('reason').value.trim();

        // Подготовка данных для отправки
        const formData = {
            type: 'inactive_request',
            vacation_days: this.selectedDays,
            reason: reason
        };

        // Отправка данных в Telegram
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.sendData(JSON.stringify(formData));
        } else {
            console.log('Данные для отправки:', formData);
            alert('Данные подготовлены для отправки');
        }
    }
}

// Функция для инициализации формы неактива
function initInactiveForm() {
    // Проверяем, есть ли форма неактива на странице
    if (document.getElementById('inactiveForm')) {
        new InactiveForm();
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initInactiveForm();
});

// Также инициализируем при инициализации Telegram WebApp
if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
    
    // Дополнительная инициализация после готовности WebApp
    setTimeout(() => {
        initInactiveForm();
    }, 100);
}
