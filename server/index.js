const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

// 中间件：解析 JSON 请求体
app.use(express.json()).use(cors());

// 流式响应 API 接口
app.post("/api/chat", (req, res) => {
  const userMessage = req.body.message;
  console.log(`User message: ${userMessage}`);

  // 设置响应头为流式传输
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Transfer-Encoding", "chunked");

  // 模拟逐字返回响应
  const response = "Hello! I am ChatGPT, how can I assist you today?";
  let index = 0;

  const interval = setInterval(() => {
    if (index < response.length) {
      res.write(response[index++]); // 逐字发送
    } else {
      interval;
      res.eclearIntervalnd(); // 结束流
    }
  }, 50); // 每 50 毫秒发送一个字
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
