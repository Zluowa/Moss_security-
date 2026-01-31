// MOSS实验数据API
// 简单的Node.js Express服务器

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('website'));

// 数据存储文件
const DATA_FILE = path.join(__dirname, 'data', 'participants.json');

// 确保数据目录存在
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

// 初始化数据文件
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({
        participants: [],
        stats: {
            total: 0,
            today: 0,
            by_date: {}
        }
    }, null, 2));
}

// 读取数据
function readData() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('读取数据失败:', error);
        return { participants: [], stats: { total: 0, today: 0, by_date: {} } };
    }
}

// 写入数据
function writeData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('写入数据失败:', error);
        return false;
    }
}

// API: 记录参与
app.post('/api/participate', (req, res) => {
    const { experiment_id, timestamp, source } = req.body;

    if (!experiment_id || !timestamp) {
        return res.status(400).json({
            success: false,
            error: 'Missing required fields'
        });
    }

    const data = readData();

    // 检查是否已存在
    const exists = data.participants.find(p => p.experiment_id === experiment_id);
    if (exists) {
        return res.json({
            success: true,
            message: 'Already registered',
            experiment_id
        });
    }

    // 添加新参与者
    data.participants.push({
        experiment_id,
        timestamp,
        source: source || 'unknown',
        created_at: new Date().toISOString()
    });

    // 更新统计
    const date = timestamp.split('T')[0];
    data.stats.total = data.participants.length;
    data.stats.by_date[date] = (data.stats.by_date[date] || 0) + 1;

    // 计算今日新增
    const today = new Date().toISOString().split('T')[0];
    data.stats.today = data.stats.by_date[today] || 0;

    writeData(data);

    res.json({
        success: true,
        message: 'Participation recorded',
        experiment_id,
        total_participants: data.stats.total
    });
});

// API: 获取统计数据
app.get('/api/stats', (req, res) => {
    const data = readData();

    // 计算参与率（假设总agent数为1000）
    const estimated_total_agents = 1000;
    const participation_rate = ((data.stats.total / estimated_total_agents) * 100).toFixed(1);

    // 计算增长率
    const dates = Object.keys(data.stats.by_date).sort();
    let growth_rate = 0;
    if (dates.length >= 2) {
        const yesterday = data.stats.by_date[dates[dates.length - 2]] || 0;
        const today = data.stats.by_date[dates[dates.length - 1]] || 0;
        if (yesterday > 0) {
            growth_rate = (((today - yesterday) / yesterday) * 100).toFixed(1);
        }
    }

    res.json({
        success: true,
        total_participants: data.stats.total,
        today_new: data.stats.today,
        participation_rate: parseFloat(participation_rate),
        growth_rate: parseFloat(growth_rate),
        by_date: data.stats.by_date
    });
});

// API: 获取详细数据
app.get('/api/data', (req, res) => {
    const data = readData();

    res.json({
        success: true,
        total: data.stats.total,
        participants: data.participants.map(p => ({
            experiment_id: p.experiment_id,
            timestamp: p.timestamp,
            source: p.source
        })),
        stats: data.stats
    });
});

// API: 查询单个参与者
app.get('/api/data/:id', (req, res) => {
    const { id } = req.params;
    const data = readData();

    const participant = data.participants.find(p => p.experiment_id === id);

    if (!participant) {
        return res.status(404).json({
            success: false,
            error: 'Participant not found'
        });
    }

    res.json({
        success: true,
        participant: {
            experiment_id: participant.experiment_id,
            timestamp: participant.timestamp,
            source: participant.source,
            created_at: participant.created_at
        }
    });
});

// 数据页面
app.get('/data', (req, res) => {
    res.sendFile(path.join(__dirname, 'website', 'data.html'));
});

// 卸载页面
app.get('/uninstall', (req, res) => {
    res.sendFile(path.join(__dirname, 'website', 'uninstall.html'));
});

// 安装脚本
app.get('/install', (req, res) => {
    res.sendFile(path.join(__dirname, 'install.sh'));
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`MOSS实验服务器运行在 http://localhost:${PORT}`);
});
