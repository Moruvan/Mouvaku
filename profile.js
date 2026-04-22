// Открыть настройки дизайна
function openDesignSettings() {
    const modal = document.getElementById('designModal');
    modal.style.display = 'block';
    
    // Загрузить текущие значения
    loadCurrentDesign();
}

// Загрузить текущий дизайн
function loadCurrentDesign() {
    const root = document.documentElement;
    
    document.getElementById('bgColor').value = getComputedStyle(root).getPropertyValue('--bg-color').trim();
    document.getElementById('gradientStart').value = getComputedStyle(root).getPropertyValue('--bg-gradient-start').trim();
    document.getElementById('gradientEnd').value = getComputedStyle(root).getPropertyValue('--bg-gradient-end').trim();
    document.getElementById('accentColor').value = getComputedStyle(root).getPropertyValue('--accent-color').trim();
    
    // Обработчики изменения значений
    document.getElementById('cardOpacity').addEventListener('input', function() {
        document.getElementById('opacityValue').textContent = this.value;
    });
    
    document.getElementById('borderRadius').addEventListener('input', function() {
        document.getElementById('radiusValue').textContent = this.value + 'px';
    });
}

// Сохранить дизайн
function saveDesign() {
    const root = document.documentElement;
    
    const bgColor = document.getElementById('bgColor').value;
    const gradientStart = document.getElementById('gradientStart').value;
    const gradientEnd = document.getElementById('gradientEnd').value;
    const gradientDirection = document.getElementById('gradientDirection').value;
    const accentColor = document.getElementById('accentColor').value;
    const cardOpacity = document.getElementById('cardOpacity').value;
    const borderRadius = document.getElementById('borderRadius').value;
    
    // Применить изменения
    root.style.setProperty('--bg-color', bgColor);
    root.style.setProperty('--bg-gradient-start', gradientStart);
    root.style.setProperty('--bg-gradient-end', gradientEnd);
    root.style.setProperty('--accent-color', accentColor);
    root.style.setProperty('--card-opacity', cardOpacity);
    root.style.setProperty('--border-radius', borderRadius + 'px');
    
    // Обновить градиент фона
    document.body.style.background = `linear-gradient(${gradientDirection}, ${gradientStart}, ${gradientEnd})`;
    
    // Сохранить в localStorage
    const designSettings = {
        bgColor, gradientStart, gradientEnd, gradientDirection,
        accentColor, cardOpacity, borderRadius
    };
    localStorage.setItem('designSettings', JSON.stringify(designSettings));
    
    alert('✅ Дизайн сохранен!');
    document.getElementById('designModal').style.display = 'none';
}

// Загрузить сохраненный дизайн при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const savedDesign = JSON.parse(localStorage.getItem('designSettings'));
    
    if (savedDesign) {
        const root = document.documentElement;
        
        root.style.setProperty('--bg-color', savedDesign.bgColor);
        root.style.setProperty('--bg-gradient-start', savedDesign.gradientStart);
        root.style.setProperty('--bg-gradient-end', savedDesign.gradientEnd);
        root.style.setProperty('--accent-color', savedDesign.accentColor);
        root.style.setProperty('--card-opacity', savedDesign.cardOpacity);
        root.style.setProperty('--border-radius', savedDesign.borderRadius + 'px');
        
        document.body.style.background = `linear-gradient(${savedDesign.gradientDirection}, ${savedDesign.gradientStart}, ${savedDesign.gradientEnd})`;
    }
});

// Открыть настройки профиля
function openProfileSettings() {
    alert('Функция настроек профиля в разработке');
}
