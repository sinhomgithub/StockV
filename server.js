const express = require('express');
const path = require('path');
const app = express();

// 【重要】Render 位於代理伺服器後面，必須開啟此設定才能正確取得客戶端真實 IP
app.set('trust proxy', true);

// 設定 Port（Render 會透過 process.env.PORT 動態指定埠號）
const PORT = process.env.PORT || 3000;

// 託管 public 資料夾，讓 index.html 可以直接被瀏覽器訪問
app.use(express.static(path.join(__dirname, 'public')));

// 建立一個 API 路由，供前端呼叫
app.get('/api/info', (req, res) => {
    // 取得呼叫端 IP
    const clientIp = req.headers['x-forwarded-for'] || req.ip;
    
    // 取得伺服器目前時間（轉換為台灣時間格式）
    const serverTime = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });

    // 印在 Render 的主機 Console 上
    console.log(`[請求紀錄] 收到來自 IP: ${clientIp} 的請求，時間: ${serverTime}`);

    // 回傳 JSON 給前端
    res.json({
        ip: clientIp,
        time: serverTime
    });
});

app.listen(PORT, () => {
    console.log(`伺服器已啟動，正在聆聽連接埠 ${PORT}`);
});