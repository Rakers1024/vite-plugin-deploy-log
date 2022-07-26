## 前言
在部署的测试环境中，总会被测试人员崔更新了哪些内容，所以做个vite插件，在测试环境上直接显示最近更新的内容和部署时间等信息

## 使用方式
```javascript
//vite.config.js
import createDeployLogPlugin from "vite-plugin-deploy-log";
...
export default defineConfig({
  plugins: [createDeployLogPlugin()],
  ...
})

//main.js
import showDeployLog from "vite-plugin-deploy-log/dist/data";
//测试环境下显示
import.meta.env.MODE == 'staging' && showDeployLog();

```

