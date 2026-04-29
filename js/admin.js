document.addEventListener('DOMContentLoaded', () => {
    // 1. При загрузке страницы подтягиваем сохраненные настройки (если они есть)
    loadSettings();

    // 2. Обновление текста HEX-кодов при выборе цвета
    document.getElementById('color-accent').addEventListener('input', (e) => {
        document.getElementById('hex-accent').textContent = e.target.value;
    });
    document.getElementById('color-text').addEventListener('input', (e) => {
        document.getElementById('hex-text').textContent = e.target.value;
    });
    document.getElementById('color-bg').addEventListener('input', (e) => {
        document.getElementById('hex-bg').textContent = e.target.value;
    });

    // 3. Динамическое обновление цифр у ползунков
    document.getElementById('card-opacity').addEventListener('input', (e) => {
        document.getElementById('opacity-val').textContent = e.target.value;
    });
    document.getElementById('card-blur').addEventListener('input', (e) => {
        document.getElementById('blur-val').textContent = e.target.value;
    });
});

// Функция: собрать все данные со страницы и сохранить в память браузера
function saveAllSettings() {
    const config = {
        bgUrl: document.getElementById('bg-url').value,
        audioUrl: document.getElementById('audio-url').value,
        avatarUrl: document.getElementById('avatar-url').value,
        bio: document.getElementById('bio-text').value,
        location: document.getElementById('location-text').value,
        opacity: document.getElementById('card-opacity').value,
        blur: document.getElementById('card-blur').value,
        colorAccent: document.getElementById('color-accent').value,
        colorText: document.getElementById('color-text').value,
        colorBg: document.getElementById('color-bg').value,
        monoIcons: document.getElementById('toggle-mono').checked,
        animTitle: document.getElementById('toggle-anim').checked,
        volumeControl: document.getElementById('toggle-volume').checked
    };

    // Сохраняем в localStorage (локальную базу данных браузера)
    localStorage.setItem('sotoriko_config', JSON.stringify(config));

    // Анимация кнопки для обратной связи
    const btn = document.querySelector('.btn-save');
    const originalText = btn.textContent;
    btn.textContent = 'Сохранено! ✔️';
    btn.style.background = 'var(--accent)';
    btn.style.color = '#000';
    btn.style.boxShadow = 'var(--neon-glow)';
    
    // Возвращаем кнопку в исходное состояние через 2 секунды
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = 'transparent';
        btn.style.color = 'var(--accent)';
        btn.style.boxShadow = 'none';
    }, 2000);
}

// Функция: загрузить данные при входе в админку
function loadSettings() {
    const saved = localStorage.getItem('sotoriko_config');
    if (!saved) return; // Если ничего не сохраняли, выходим

    const config = JSON.parse(saved);

    // Заполняем инпуты
    document.getElementById('bg-url').value = config.bgUrl || '';
    document.getElementById('audio-url').value = config.audioUrl || '';
    document.getElementById('avatar-url').value = config.avatarUrl || '';
    document.getElementById('bio-text').value = config.bio || '';
    document.getElementById('location-text').value = config.location || '';
    
    // Заполняем ползунки
    document.getElementById('card-opacity').value = config.opacity || 50;
    document.getElementById('opacity-val').textContent = config.opacity || 50;
    
    document.getElementById('card-blur').value = config.blur || 20;
    document.getElementById('blur-val').textContent = config.blur || 20;

    // Заполняем цвета
    if (config.colorAccent) {
        document.getElementById('color-accent').value = config.colorAccent;
        document.getElementById('hex-accent').textContent = config.colorAccent;
    }
    if (config.colorText) {
        document.getElementById('color-text').value = config.colorText;
        document.getElementById('hex-text').textContent = config.colorText;
    }
    if (config.colorBg) {
        document.getElementById('color-bg').value = config.colorBg;
        document.getElementById('hex-bg').textContent = config.colorBg;
    }

    // Заполняем тумблеры
    document.getElementById('toggle-mono').checked = config.monoIcons || false;
    document.getElementById('toggle-anim').checked = config.animTitle !== false;
    document.getElementById('toggle-volume').checked = config.volumeControl !== false;
}
