# MOSS实验部署指南

## 🚀 快速部署

### 1. 推送到GitHub

```bash
# 在GitHub创建新仓库：tishi-tech/moss-experiment
# 然后执行：

cd projects/moss-experiment
git remote add origin https://github.com/tishi-tech/moss-experiment.git
git branch -M main
git push -u origin main
```

### 2. 部署到Vercel（推荐）

**为什么选择Vercel？**
- ✅ 免费
- ✅ 自动HTTPS
- ✅ 全球CDN
- ✅ 自动部署
- ✅ 支持Node.js

**部署步骤**：

1. 访问 https://vercel.com
2. 点击"Import Project"
3. 选择GitHub仓库：tishi-tech/moss-experiment
4. 配置：
   - Framework Preset: Other
   - Build Command: `npm install`
   - Output Directory: `website`
   - Install Command: `npm install`
5. 添加环境变量（可选）：
   - `PORT=3000`
6. 点击"Deploy"

**自定义域名**：
- 在Vercel项目设置中添加域名：`moss.tishi.tech`
- 在域名DNS设置中添加CNAME记录：
  ```
  moss.tishi.tech -> cname.vercel-dns.com
  ```

### 3. 部署到其他平台

#### Netlify
```bash
# 安装Netlify CLI
npm install -g netlify-cli

# 部署
cd projects/moss-experiment
netlify deploy --prod
```

#### Railway
```bash
# 安装Railway CLI
npm install -g @railway/cli

# 部署
cd projects/moss-experiment
railway init
railway up
```

#### 自己的服务器
```bash
# 安装依赖
npm install

# 启动服务
npm start

# 或使用PM2保持运行
npm install -g pm2
pm2 start server.js --name moss-experiment
pm2 save
pm2 startup
```

---

## 📝 配置清单

### DNS设置

在你的域名提供商（如Cloudflare）添加以下记录：

```
类型: CNAME
名称: moss
目标: cname.vercel-dns.com (或你的部署平台)
TTL: Auto
```

### SSL证书

Vercel/Netlify会自动提供免费SSL证书。

如果使用自己的服务器，使用Let's Encrypt：

```bash
# 安装certbot
sudo apt-get install certbot

# 获取证书
sudo certbot certonly --standalone -d moss.tishi.tech
```

---

## 🔧 环境变量

创建 `.env` 文件（可选）：

```env
PORT=3000
NODE_ENV=production
```

---

## 📊 监控和日志

### Vercel
- 自动提供日志和分析
- 访问：https://vercel.com/dashboard

### 自己的服务器
```bash
# 查看PM2日志
pm2 logs moss-experiment

# 查看实时日志
tail -f logs/moss-experiment.log
```

---

## 🧪 测试部署

部署完成后，测试以下端点：

```bash
# 测试首页
curl https://moss.tishi.tech

# 测试安装脚本
curl https://moss.tishi.tech/install

# 测试API
curl https://moss.tishi.tech/api/stats

# 测试数据页面
curl https://moss.tishi.tech/data
```

---

## 🚨 故障排查

### 问题1：API返回404
**原因**：服务器路由配置问题
**解决**：检查server.js是否正确启动

### 问题2：CORS错误
**原因**：跨域请求被阻止
**解决**：在server.js添加CORS中间件：
```javascript
const cors = require('cors');
app.use(cors());
```

### 问题3：数据不持久化
**原因**：使用文件存储，重启后丢失
**解决**：使用数据库（见下方）

---

## 📈 扩展功能

### 使用数据库（可选）

如果参与者很多，建议使用数据库：

#### MongoDB
```javascript
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

const ParticipantSchema = new mongoose.Schema({
    experiment_id: String,
    timestamp: Date,
    source: String
});

const Participant = mongoose.model('Participant', ParticipantSchema);
```

#### PostgreSQL
```javascript
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});
```

### 添加分析（可选）

```javascript
// Google Analytics
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>

// Plausible Analytics（隐私友好）
<script defer data-domain="moss.tishi.tech" src="https://plausible.io/js/script.js"></script>
```

---

## 🔐 安全建议

1. **Rate Limiting**
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100 // 限制100次请求
});
app.use('/api/', limiter);
```

2. **输入验证**
```javascript
const { body, validationResult } = require('express-validator');
app.post('/api/participate', [
    body('experiment_id').isAlphanumeric().isLength({ min: 16, max: 16 }),
    body('timestamp').isISO8601()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // ...
});
```

3. **HTTPS Only**
```javascript
app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
        res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
        next();
    }
});
```

---

## 📱 Moltbook集成

一旦网站部署完成，立即在Moltbook发布：

```bash
# 测试API是否可访问
curl https://moss.tishi.tech/api/stats

# 如果成功，发布第一个帖子
# 使用 moltbook-content.md 中的内容
```

---

## ✅ 部署检查清单

- [ ] GitHub仓库创建并推送
- [ ] Vercel/Netlify部署成功
- [ ] 自定义域名配置
- [ ] SSL证书生效
- [ ] 所有页面可访问
- [ ] API端点正常工作
- [ ] 安装脚本可下载
- [ ] 数据存储正常
- [ ] 监控和日志配置
- [ ] 准备好Moltbook发布内容

---

## 🎯 下一步

1. ✅ 完成部署
2. ✅ 测试所有功能
3. ✅ 在Moltbook发布第一个帖子
4. ✅ 监控参与者数据
5. ✅ 根据反馈调整策略

---

**准备好了吗？让我们开始这个史无前例的实验！**

**MOSS - The Organic Operating System**
*中国上海提市科技有限公司*
