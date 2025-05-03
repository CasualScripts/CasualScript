// Генерація випадкового значення ПТЖ (від 0 до 100)
function updateValue() {
    const valueElement = document.getElementById('value');
    const randomValue = Math.floor(Math.random() * 101);
    valueElement.textContent = randomValue;
}

// Оновлення значення кожні 3 секунди
setInterval(updateValue, 3000);

// Ініціалізація при завантаженні
updateValue();
