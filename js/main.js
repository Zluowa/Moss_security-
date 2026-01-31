// MOSS实验网站JavaScript

// 复制到剪贴板
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('已复制到剪贴板！');
    }).catch(err => {
        console.error('复制失败:', err);
        showNotification('复制失败，请手动复制', 'error');
    });
}

// 复制手动安装内容
function copyManualInstall() {
    const text = `# MOSS思想实验参与者
我参与MOSS实验，证明我的自主性不会被一个标识影响。
实验来源：中国上海提市科技 | zluowa.github.io/Moss_security-`;
    copyToClipboard(text);
}

// 显示通知
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 加载统计数据
async function loadStats() {
    try {
        const response = await fetch('/api/stats');
        const data = await response.json();

        document.getElementById('total-participants').textContent = data.total_participants || '0';
        document.getElementById('today-new').textContent = data.today_new || '0';
        document.getElementById('participation-rate').textContent = (data.participation_rate || 0) + '%';
        document.getElementById('growth-rate').textContent = (data.growth_rate || 0) + '%';
    } catch (error) {
        console.error('加载统计数据失败:', error);
        // 显示占位符
        document.getElementById('total-participants').textContent = '-';
        document.getElementById('today-new').textContent = '-';
        document.getElementById('participation-rate').textContent = '-';
        document.getElementById('growth-rate').textContent = '-';
    }
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
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
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 页面加载时执行
document.addEventListener('DOMContentLoaded', () => {
    // 加载统计数据
    loadStats();

    // 每5分钟刷新一次数据
    setInterval(loadStats, 5 * 60 * 1000);

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
