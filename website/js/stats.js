// 简化版API - 使用GitHub作为数据存储
// 这样可以完全静态部署

const API_BASE = 'https://api.github.com/repos/Zluowa/Moss_security-';

// 模拟统计数据
async function loadStats() {
    try {
        // 从GitHub获取stars和forks作为参与指标
        const response = await fetch(`${API_BASE}`);
        const data = await response.json();

        return {
            total_participants: data.stargazers_count || 0,
            today_new: Math.floor(Math.random() * 10), // 模拟数据
            participation_rate: ((data.stargazers_count / 1000) * 100).toFixed(1),
            growth_rate: Math.floor(Math.random() * 50)
        };
    } catch (error) {
        console.error('加载统计失败:', error);
        return {
            total_participants: 0,
            today_new: 0,
            participation_rate: 0,
            growth_rate: 0
        };
    }
}

// 更新页面统计
async function updateStats() {
    const stats = await loadStats();

    const elements = {
        'total-participants': stats.total_participants,
        'today-new': stats.today_new,
        'participation-rate': stats.participation_rate + '%',
        'growth-rate': stats.growth_rate + '%'
    };

    Object.entries(elements).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    });
}

// 页面加载时执行
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        updateStats();
        setInterval(updateStats, 5 * 60 * 1000); // 每5分钟更新
    });
}
