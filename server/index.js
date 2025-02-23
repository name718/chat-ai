const express = require("express");
const cors = require("cors");
const app = express();

// 中间件配置
app.use(express.json()).use(cors({ origin: "*" }));

// 流式接口核心逻辑
app.post("/chat/stream", (req, res) => {
  const { message } = req.body;
  console.log(`Received: ${message}`);

  // 初始化 SSE 协议头
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  // 定义响应数据流
  const responseStream = createStreamResponse();

  // 管道式推送数据
  const interval = setInterval(() => {
    const { done, value } = responseStream.next();

    if (!done) {
      res.write(`data: ${JSON.stringify(value)}\n\n`);
    } else {
      res.write("event: end\ndata: [DONE]\n\n");
      clearInterval(interval);
      res.end();
    }
  }, 100);

  // 客户端断开处理
  //   req.on("close", () => {
  //     clearInterval(interval);
  //     res.end();
  //   });
});

// 模拟流式生成器
function* createStreamResponse(
  input = `你好！我是一名专业的前端工程师，专注于为用户创造高效、直观且美观的网络体验。我精通以下核心技术和工具`
) {
  const segments = input.split("").map((c) => `${c}`);
  for (const segment of segments) {
    yield {
      content: segment,
      timestamp: Date.now(),
      status: "processing",
    };
  }
}

// 启动服务
app.listen(9527, () => {
  console.log("SSE 服务已在 9527 端口启动");
});
