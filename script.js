// Ждем загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const menuToggle = document.getElementById('menu-toggle');
    const userBtn = document.getElementById('user-btn');
    const accountPopup = document.getElementById('account-popup');

    // 1. Открытие/Закрытие бокового меню
    const toggleMenu = () => {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    };

    menuToggle.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // 2. Всплывающее окно аккаунта
    userBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Чтобы клик не уходил на документ
        accountPopup.classList.toggle('active');
    });

    // Закрываем попап при клике в любом месте экрана
    document.addEventListener('click', () => {
        accountPopup.classList.remove('active');
    });

    // 3. Переключение разделов (Главная / Админка)
    const navItems = document.querySelectorAll('.nav-item');
    const authSection = document.getElementById('auth-section');
    const adminSection = document.getElementById('admin-section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.getAttribute('data-section');
            
            if (section === 'admin') {
                authSection.classList.add('hidden');
                adminSection.classList.remove('hidden');
            } else if (section === 'auth') {
                authSection.classList.remove('hidden');
                adminSection.classList.add('hidden');
            }
            
            // После выбора раздела закрываем меню
            if (sidebar.classList.contains('active')) toggleMenu();
        });
    });

});
