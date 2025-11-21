# 心算練習遊戲 (Mental Math Practice Game)

一個簡單的小遊戲網頁，是給國小小朋友練習心算的。

A simple web-based game designed for elementary school students to practice mental arithmetic.

## 功能特色 (Features)

### 題目顯示 (Question Display)
- ✅ 螢幕上出現算式（如 3+2），使用大字型清楚明顯
- ✅ 不會出現答案超過10的題目
- ✅ 模擬"心算卡"的設計，使用較不傷眼的黃底黑字

### 答案選擇 (Answer Selection)
- ✅ 選擇題四個項目，讓用戶點選
- ✅ 只有一個項目是正確答案
- ✅ 答案和題目同時出現，看到題目即可立即作答
- ✅ 點擊就代表回答，不用確認送出
- ✅ 錯誤答案會顯示紅色，正確答案顯示綠色

### 遊戲進度 (Game Progress)
- ✅ 總共10題
- ✅ 總分100分（每題10分）
- ✅ 結束後顯示分數與耗費時間
- ✅ 可以重新開始遊戲

## 技術規格 (Technical Specifications)

- 純前端實現，無需後端服務器
- 使用原生 HTML、CSS、JavaScript
- 響應式設計，支援行動裝置
- 採用 Fisher-Yates 洗牌演算法確保隨機性
- 無記憶體洩漏問題

## 線上遊玩 (Play Online)

🎮 [立即開始遊戲 (Play Now)](https://tom00502.github.io/sanna-practice-game/)

遊戲已部署到 GitHub Pages，可以直接在線上遊玩！

The game is deployed on GitHub Pages and can be played online directly!

## 如何使用 (How to Use)

### 線上版本 (Online Version)
直接訪問 [https://tom00502.github.io/sanna-practice-game/](https://tom00502.github.io/sanna-practice-game/)

### 本地版本 (Local Version)
1. 在瀏覽器中打開 `index.html` 文件
2. 遊戲自動開始
3. 點選正確答案
4. 完成10題後查看成績
5. 點擊"再玩一次"重新開始

## 文件結構 (File Structure)

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Pages 部署工作流程
├── index.html   # 主頁面結構
├── style.css    # 樣式設計
└── game.js      # 遊戲邏輯
```

## 部署 (Deployment)

本專案使用 GitHub Actions 自動部署到 GitHub Pages。

### 部署設置步驟 (Deployment Setup)

1. 確保此 PR 已合併到 `main` 分支
2. 前往 Repository Settings → Pages
3. 在 "Build and deployment" 下，選擇 "GitHub Actions" 作為來源
4. 工作流程將在每次推送到 `main` 分支時自動執行
5. 部署完成後，網站將在 `https://tom00502.github.io/sanna-practice-game/` 上線

### 自動部署 (Automatic Deployment)

- ✅ 推送到 `main` 分支時自動觸發
- ✅ 也可通過 GitHub Actions 頁面手動觸發
- ✅ 使用最新的 GitHub Actions 工作流程
- ✅ 無需建置步驟，直接部署靜態文件

## 螢幕截圖 (Screenshots)

### 遊戲畫面
![Game Screen](https://github.com/user-attachments/assets/5e2f8482-94e3-4108-b324-c207fe5affa1)

### 結果畫面
![Results Screen](https://github.com/user-attachments/assets/bbbaa07b-c3c8-4900-a763-2597f3f1f963)

## License

MIT
