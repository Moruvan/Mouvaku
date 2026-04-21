document.addEventListener('DOMContentLoaded', () => {
    
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const menuToggle = document.getElementById('menu-toggle');
    const userBtn = document.getElementById('user-btn');
    const accountPopup = document.getElementById('account-popup');

    // 1. Sidebar Toggle
    const toggleMenu = () => {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    };

    menuToggle.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // 2. Account Popup
    userBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        accountPopup.classList.toggle('active');
    });

    document.addEventListener('click', () => {
        accountPopup.classList.remove('active');
    });

    // 3. Admin Dropdown logic
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const navDropdown = document.querySelector('.nav-dropdown');

    dropdownToggle.addEventListener('click', () => {
        dropdownMenu.classList.toggle('active');
        navDropdown.classList.toggle('active');
    });

    // 4. Section Switching
    const navItems = document.querySelectorAll('.nav-item[data-section]');
    const sections = {
        'auth': document.getElementById('auth-section'),
        'role-creation': document.getElementById('role-creation-section'),
        'requests': document.getElementById('requests-section')
    };

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-section');
            
            // Скрываем все секции
            Object.values(sections).forEach(sec => sec.classList.add('hidden'));
            
            // Показываем нужную
            if (sections[targetId]) {
                sections[targetId].classList.remove('hidden');
            }
            
            // Закрываем меню после клика (если это не кнопка-заголовок дропдауна)
            if (!item.classList.contains('dropdown-toggle')) {
                if (sidebar.classList.contains('active')) toggleMenu();
            }
        });
    });
});
