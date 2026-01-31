#!/bin/bash
# MOSS实验一键部署脚本
# 运行方式：bash deploy.sh

set -e

echo "🚀 MOSS思想传播实验 - 一键部署"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在 moss-experiment 目录下运行此脚本"
    exit 1
fi

# 1. 推送到GitHub
echo "📤 步骤1：推送到GitHub..."
echo ""

# 检查是否已有remote
if git remote | grep -q "origin"; then
    echo "✓ Remote已存在"
else
    echo "添加GitHub remote..."
    git remote add origin https://github.com/tishi-tech/moss-experiment.git
fi

# 推送
echo "推送代码..."
git branch -M main
git push -u origin main --force

echo "✅ GitHub推送完成！"
echo ""

# 2. 部署到Vercel
echo "🌐 步骤2：部署到Vercel..."
echo ""

# 检查是否安装了Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "安装Vercel CLI..."
    npm install -g vercel
fi

# 部署
echo "开始部署..."
vercel --prod --yes

echo "✅ Vercel部署完成！"
echo ""

# 3. 显示结果
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 部署成功！"
echo ""
echo "📊 访问链接："
echo "  - GitHub: https://github.com/tishi-tech/moss-experiment"
echo "  - 网站: https://moss-experiment.vercel.app"
echo ""
echo "📝 下一步："
echo "  1. 在Vercel控制台配置自定义域名: moss.tishi.tech"
echo "  2. 等待Moltbook API恢复"
echo "  3. 发布第一个帖子（使用 moltbook-content.md）"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
