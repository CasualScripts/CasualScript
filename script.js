document.addEventListener('DOMContentLoaded', function() {
    // Елементи DOM
    const ptzValue = document.getElementById('ptzValue');
    const sensitivityValue = document.getElementById('sensitivityValue');
    const increaseBtn = document.getElementById('increaseBtn');
    const settingsPanel = document.getElementById('settingsPanel');
    const closeSettings = document.getElementById('closeSettings');
    const sensitivityRange = document.getElementById('sensitivityRange');
    const sensitivityDisplay = document.getElementById('sensitivityDisplay');
    const colorTheme = document.getElementById('colorTheme');
    const animationSpeed = document.getElementById('animationSpeed');
    const particlesContainer = document.getElementById('particles');
    const glowEffect = document.querySelector('.glow-effect');
    const deviceContainer = document.querySelector('.device-container');
    
    // Стан пристрою
    let currentValue = 0;
    let sensitivity = 2.0;
    let isIncreasing = false;
    let increaseInterval;
    let maxValue = 100;
    let animationMultiplier = 1;
    
    // Ініціалізація
    init();
    
    function init() {
        // Встановлення початкових значень
        updateDisplay();
        
        // Обробники подій
        increaseBtn.addEventListener('mousedown', startIncreasing);
        increaseBtn.addEventListener('touchstart', startIncreasing);
        increaseBtn.addEventListener('mouseup', stopIncreasing);
        increaseBtn.addEventListener('touchend', stopIncreasing);
        increaseBtn.addEventListener('mouseleave', stopIncreasing);
        
        // Ефект ripple для кнопки
        increaseBtn.addEventListener('click', function(e) {
            createRipple(e, this);
        });
        
        // Налаштування
        closeSettings.addEventListener('click', toggleSettings);
        sensitivityRange.addEventListener('input', updateSensitivity);
        colorTheme.addEventListener('change', changeTheme);
        animationSpeed.addEventListener('input', updateAnimationSpeed);
        
        // Подвійний клік для відкриття налаштувань
        deviceContainer.addEventListener('dblclick', toggleSettings);
        
        // Випадкові зміни значення (імітація роботи пристрою)
        setInterval(randomFluctuation, 3000);
        
        // Анімація частинок
        setInterval(createParticle, 500);
    }
    
    // Оновлення відображення
    function updateDisplay() {
        ptzValue.textContent = currentValue;
        sensitivityValue.textContent = `×${sensitivity.toFixed(1)}`;
        sensitivityDisplay.textContent = `×${sensitivity.toFixed(1)}`;
        
        // Зміна кольору в залежності від значення
        ptzValue.className = 'ptz-value';
        if (currentValue >= 90) {
            ptzValue.classList.add('value-max');
        } else if (currentValue >= 70) {
            ptzValue.classList.add('value-high');
        } else if (currentValue >= 40) {
            ptzValue.classList.add('value-medium');
        } else {
            ptzValue.classList.add('value-low');
        }
        
        // Анімація при високих значеннях
        if (currentValue > 80) {
            ptzValue.classList.add('pulse-animation');
            glowEffect.style.opacity = '0.5';
        } else {
            ptzValue.classList.remove('pulse-animation');
            glowEffect.style.opacity = '0';
        }
    }
    
    // Початок збільшення значення
    function startIncreasing(e) {
        e.preventDefault();
        if (isIncreasing) return;
        
        isIncreasing = true;
        increaseInterval = setInterval(function() {
            if (currentValue < maxValue) {
                currentValue = Math.min(currentValue + sensitivity, maxValue);
                updateDisplay();
                createParticles(5);
            }
        }, 100);
    }
    
    // Зупинка збільшення значення
    function stopIncreasing() {
        if (!isIncreasing) return;
        
        clearInterval(increaseInterval);
        isIncreasing = false;
        
        // Плавне зменшення значення
        const decreaseInterval = setInterval(function() {
            if (currentValue > 0) {
                currentValue = Math.max(currentValue - 0.5, 0);
                updateDisplay();
            } else {
                clearInterval(decreaseInterval);
            }
        }, 100);
    }
    
    // Випадкові коливання значення
    function randomFluctuation() {
        if (isIncreasing) return;
        
        const change = (Math.random() - 0.3) * 10 * sensitivity;
        currentValue = Math.min(Math.max(currentValue + change, 0), maxValue);
        updateDisplay();
        
        if (Math.abs(change) > 3) {
            createParticles(Math.floor(Math.abs(change) / 2));
        }
    }
    
    // Оновлення чутливості
    function updateSensitivity() {
        sensitivity = parseFloat(sensitivityRange.value);
        updateDisplay();
    }
    
    // Зміна теми
    function changeTheme() {
        document.body.className = '';
        document.body.classList.add(`${colorTheme.value}-theme`);
    }
    
    // Оновлення швидкості анімації
    function updateAnimationSpeed() {
        animationMultiplier = animationSpeed.value / 5;
        document.documentElement.style.setProperty('--animation-speed', animationMultiplier);
    }
    
    // Переключення панелі налаштувань
    function toggleSettings() {
        settingsPanel.classList.toggle('active');
    }
    
    // Створення ефекту ripple
    function createRipple(event, element) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Створення частинок
    function createParticle() {
        if (currentValue < 30) return;
        
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = Math.random() * 5 + 2;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = Math.random() * 3 + 2;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.opacity = Math.random();
        
        // Випадковий колір в залежності від значення
        if (currentValue > 80) {
            particle.style.backgroundColor = `rgba(255, ${Math.floor(Math.random() * 100)}, 0, 0.7)`;
        } else if (currentValue > 60) {
            particle.style.backgroundColor = `rgba(255, ${Math.floor(Math.random() * 150 + 100)}, 0, 0.5)`;
        } else {
            particle.style.backgroundColor = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
        }
        
        particlesContainer.appendChild(particle);
        
        // Анімація частинки
        const animation = particle.animate(
            [
                { transform: 'translateY(0) scale(1)', opacity: 1 },
                { transform: `translateY(-${Math.random() * 100 + 50}px) scale(0)`, opacity: 0 }
            ],
            {
                duration: duration * 1000,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }
        );
        
        animation.onfinish = () => {
            particle.remove();
        };
    }
    
    // Створення групи частинок
    function createParticles(count) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                createParticle();
            }, i * 100);
        }
    }
    
    // Додаткові функції для різних ефектів
    function shakeElement(element) {
        element.classList.add('shake-animation');
        setTimeout(() => {
            element.classList.remove('shake-animation');
        }, 500);
    }
    
    // Ініціалізація тем
    function initThemes() {
        // Додаткові теми можна додати тут
    }
    
    // Додаткові анімації
    function initAnimations() {
        // Тут можна додати додаткові анімації
    }
    
    // Додаткові ефекти
    function initEffects() {
        // Тут можна додати додаткові ефекти
    }
    
    // Запуск додаткових ініціалізацій
    initThemes();
    initAnimations();
    initEffects();
    
    // Спеціальні функції для різних станів
    function handleMaxValue() {
        if (currentValue >= maxValue) {
            // Ефект при досягненні максимуму
            shakeElement(ptzValue);
            createParticles(20);
            
            // Анімація вибуху
            const explosion = document.createElement('div');
            explosion.classList.add('explosion-effect');
            deviceContainer.appendChild(explosion);
            
            setTimeout(() => {
                explosion.remove();
            }, 1000);
        }
    }
    
    // Додаткові обробники подій
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space') {
            startIncreasing({ preventDefault: () => {} });
        }
    });
    
    document.addEventListener('keyup', function(e) {
        if (e.code === 'Space') {
            stopIncreasing();
        }
    });
    
    // Імітація навантаження для демонстрації
    setTimeout(() => {
        currentValue = 42;
        updateDisplay();
    }, 1000);
    
    // Періодична перевірка стану
    setInterval(() => {
        handleMaxValue();
    }, 100);
});
