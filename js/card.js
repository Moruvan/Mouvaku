document.addEventListener('DOMContentLoaded', () => {
    // Достаем настройки
    const saved = localStorage.getItem('sotoriko_config');
    if (!saved) return; // Если админку еще не трогали, загрузится дефолт из CSS

    const config = JSON.parse(saved);
    const rootStyle = document.documentElement.style;

    // 1. Цвета и прозрачность
    rootStyle.setProperty('--accent', config.colorAccent || '#00d2ff');
    rootStyle.setProperty('--text-color', config.colorText || '#ffffff');
    rootStyle.setProperty('--blur-val', `${config.blur || 20}px`);

    // Хитрый трюк: переводим HEX цвет фона в RGBA, чтобы работала прозрачность
    const hexToRgba = (hex, alpha) => {
        let r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
    
    if (config.colorBg) {
        const opacity = (config.opacity !== undefined) ? config.opacity / 100 : 0.5;
        rootStyle.setProperty('--card-bg', hexToRgba(config.colorBg, opacity));
    }

    // 2. Медиа (Фон, Аватар, Аудио)
    if (config.bgUrl) {
        document.getElementById('bg-wrapper').style.backgroundImage = `url('${config.bgUrl}')`;
    }

    if (config.avatarUrl) {
        const img = document.getElementById('avatar-img');
        img.src = config.avatarUrl;
        img.style.display = 'block';
        document.getElementById('avatar-fallback').style.display = 'none';
    }

    if (config.audioUrl) {
        document.getElementById('audio-container').style.display = 'block';
        document.getElementById('audio-source').src = config.audioUrl;
        document.getElementById('audio-player').load(); // Перезагружаем плеер с новой ссылкой
    }

    // 3. Текст
    document.getElementById('bio').textContent = config.bio || '';
    
    const locBox = document.getElementById('location-box');
    if (config.location) {
        document.getElementById('location-text').textContent = config.location;
        locBox.style.display = 'block';
    } else {
        locBox.style.display = 'none';
    }

    // 4. Тумблеры
    // Анимация заголовка
    if (config.animTitle) {
        document.getElementById('username').classList.add('anim-glow');
    }
    
    // Монохромные кнопки
    if (config.monoIcons) {
        document.querySelectorAll('.social-btn').forEach(btn => btn.classList.add('mono'));
    }

    // Управление громкостью
    if (config.volumeControl === false) {
        document.getElementById('audio-player').classList.add('no-volume');
    }
});
