// Система уведомлений
class NotificationSystem {
    constructor() {
        this.container = null;
        this.init();
    }
    
    init() {
        // Создать контейнер для уведомлений
        this.container = document.createElement('div');
        this.container.id = 'notificationContainer';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(this.container);
    }
    
    show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        
        const colors = {
            success: '#00ff88',
            error: '#ff3232',
            warning: '#ffaa00',
            info: '#00d4ff'
        };
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        notification.style.cssText = `
            background: rgba(10, 22, 40, 0.98);
            border: 2px solid ${colors[type]};
            border-radius: 12px;
            padding: 15px 20px;
            color: white;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
            min-width: 300px;
            max-width: 400px;
            animation: slideIn 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        notification.innerHTML = `
            <span style="font-size: 24px;">${icons[type]}</span>
            <span style="flex: 1;">${message}</span>
            <button onclick="this.parentElement.remove()" style="
                background: none;
                border: none;
                color: ${colors[type]};
                cursor: pointer;
                font-size: 20px;
            ">×</button>
        `;
        
        this.container.appendChild(notification);
        
        // Автоматическое удаление
        if (duration > 0) {
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, duration);
        }
    }
    
    success(message, duration) {
        this.show(message, 'success', duration);
    }
    
    error(message, duration) {
        this.show(message, 'error', duration);
    }
    
    warning(message, duration) {
        this.show(message, 'warning', duration);
    }
    
    info(message, duration) {
        this.show(message, 'info', duration);
    }
}

// Создать глобальный объект уведомлений
const notify = new NotificationSystem();

// Добавить анимации в CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
