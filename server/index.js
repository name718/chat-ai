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
  input = `你好！我是一名专业的前端工程师，专注于为用户创造高效、直观且美观的网络体验。我精通以下核心技术和工具：

核心技能
HTML/CSS/JavaScript

熟练使用 HTML5、CSS3 和 JavaScript（包括 ES6+）构建响应式网页。
使用 CSS 预处理器（如 Sass/Less）和现代布局技术（如 Flexbox 和 Grid）实现复杂的页面设计。
前端框架与库

熟悉 React、Vue.js 等主流前端框架，能够构建组件化、可维护的前端应用。
使用 Redux、Vuex 等状态管理工具优化应用数据流。
性能优化

通过懒加载、代码分割、缓存策略等手段提升页面性能。
使用 Lighthouse、Webpack 等工具分析和优化应用性能。
浏览器兼容性

解决多浏览器下的兼容性问题，确保应用在各种设备和浏览器上稳定运行。
工具与构建

熟悉 Webpack、Vite、Babel 等构建工具，配置高效的前端开发环境。
使用 Git 进行版本控制，熟悉 CI/CD 流程。
用户体验与交互
注重用户体验（UX）和用户界面（UI）设计，能够与设计师紧密合作，将设计稿转化为高质量的代码。
实现动态交互效果，提升用户参与度和满意度。
跨端开发
熟悉移动端开发（如 PWA、响应式设计），确保应用在移动设备上的体验流畅。
了解混合开发框架（如 React Native）的基础。
工作理念
以用户为中心：始终从用户体验出发，确保功能易用、界面友好。
持续学习：紧跟技术前沿，不断提升自身能力。
高效协作：与团队紧密合作，推动项目顺利交付。
如果有任何与前端开发相关的问题，欢迎随时向我咨询！`
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
