# 考试 / DDL 倒计时小项目

一个无需服务器、可直接部署到 **GitHub Pages** 的纯前端项目。

## 功能

- 内置常见考试日期
- 支持自定义 DDL（保存在浏览器 `localStorage`）
- 支持搜索、分类、状态筛选、排序
- 支持深色模式
- 无构建工具，仓库即开即用

## 直接部署到 GitHub Pages

### 方案 1：最省事

1. 新建 GitHub 仓库，例如 `countdown-app`
2. 上传这 4 个文件到仓库根目录：
   - `index.html`
   - `styles.css`
   - `app.js`
   - `README.md`
3. 打开仓库的 **Settings -> Pages**
4. 在 **Build and deployment** 里选择：
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` / `/root`
5. 保存后等待 GitHub Pages 发布
6. 你的网页会出现在：
   - `https://你的用户名.github.io/仓库名/`

### 方案 2：命令行上传

```bash
git init
git add .
git commit -m "init countdown project"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

然后按上面的 Pages 步骤开启即可。

## 内置考试时间来源

项目里默认写入了几项公开、可核验的考试时间：

- **2026 上半年 CET**：口试 2026-05-23 至 2026-05-24，笔试 2026-06-13。来源：中国教育考试网 CET 首页/报名通知。 citeturn292042view1
- **2026 年 3 月 NCRE**：2026-03-28 至 2026-03-30。来源：中国教育考试网 NCRE 首页报名通知。 citeturn292042view2
- **2026 上半年 NTCE**：面试 2026-05-16 至 2026-05-17。来源：中国教育考试网 NTCE 日程安排。 citeturn292042view3
- **2026 考研初试**：2025-12-20 至 2025-12-21。来源：学信网/中国研究生招生信息网发布的《2026年全国硕士研究生招生工作管理规定》解读。 citeturn292042view4

## 以后怎么改日期

直接改 `app.js` 里的 `officialEvents` 数组即可：

```js
const officialEvents = [
  {
    id: 'exam-cet-2026-1',
    title: 'CET 2026 上半年笔试',
    note: '全国大学英语四、六级笔试',
    datetime: '2026-06-13T09:00:00+08:00',
    category: 'exam',
    source: 'official',
  },
];
```

## 适合继续扩展的方向

- 接入 JSON 文件，单独维护考试数据
- 增加导出 / 导入本地 DDL
- 增加按月视图和日历视图
- 增加 PWA 离线支持
