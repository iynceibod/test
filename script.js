// Инициализация Telegram WebApp
const tg = window.Telegram?.WebApp;

if (!tg) {
  console.warn('Telegram WebApp не найден');
} else {
  // Настройка WebApp
  tg.expand();
  tg.setHeaderColor('#ffffff');
  tg.setBackgroundColor('#ffffff');
  
  // Показываем главную кнопку
  tg.MainButton.setText('Отправить заявку');
  tg.MainButton.color = '#0088cc';
  tg.MainButton.show();
}

// Получение элементов формы
const form = document.getElementById('regForm');
const submitBtn = form.querySelector('.submit-btn');

// Валидация формы
function validateForm() {
  const nick = document.getElementById('nick').value.trim();
  const fa = document.getElementById('fa').value.trim();
  const discord_id = document.getElementById('discord_id').value.trim();
  const vozrast = document.getElementById('vozrast').value;
  const gorod = document.getElementById('gorod').value.trim();
  
  return nick && fa && discord_id && vozrast && gorod;
}

// Обновление состояния кнопки
function updateButtonState() {
  const isValid = validateForm();
  
  if (tg) {
    if (isValid) {
      tg.MainButton.enable();
    } else {
      tg.MainButton.disable();
    }
  }
  
  submitBtn.disabled = !isValid;
}

// Добавляем слушатели для валидации
form.addEventListener('input', updateButtonState);
form.addEventListener('change', updateButtonState);

// Функция отправки данных
function submitForm() {
  if (!validateForm()) {
    return;
  }
  
  // Показываем загрузку
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;
  
  if (tg) {
    tg.MainButton.showProgress();
  }
  
  // Собираем данные
  const data = {
    nick: document.getElementById('nick').value.trim(),
    fa: document.getElementById('fa').value.trim(),
    discord_id: document.getElementById('discord_id').value.trim(),
    vozrast: parseInt(document.getElementById('vozrast').value),
    gorod: document.getElementById('gorod').value.trim(),
    timestamp: new Date().toISOString()
  };
  
  // Имитация отправки
  setTimeout(() => {
    try {
      if (tg) {
        tg.sendData(JSON.stringify(data));
        tg.close();
      } else {
        // Для тестирования вне Telegram
        console.log('Данные формы:', data);
        showSuccessMessage();
      }
    } catch (err) {
      console.error('Ошибка отправки:', err);
      showError('Ошибка отправки данных');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      
      if (tg) {
        tg.MainButton.hideProgress();
      }
    }
  }, 1000);
}

// Показать сообщение об успехе
function showSuccessMessage() {
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.innerHTML = '✅ Заявка успешно отправлена!';
  form.parentNode.insertBefore(successDiv, form);
  
  submitBtn.textContent = '✅ Готово!';
  submitBtn.style.background = '#22c55e';
  
  // Скрываем форму через 2 секунды
  setTimeout(() => {
    form.style.display = 'none';
  }, 2000);
}

// Показать ошибку
function showError(message) {
  alert('❌ ' + message);
}

// Обработка отправки формы
form.addEventListener('submit', function(e) {
  e.preventDefault();
  submitForm();
});

// Обработка главной кнопки Telegram
if (tg) {
  tg.MainButton.onClick(submitForm);
}

// Инициализация состояния
updateButtonState();
