## 前言
在部署的测试环境中，总会被测试人员崔更新了哪些内容，所以做个vite插件，在测试环境上直接显示最近更新的内容和部署时间等信息

## 快速开始

```sh
npm i vite-plugin-deploy-log -D
```


```javascript
//vite.config.js
import { createDeployLogPlugin } from "vite-plugin-deploy-log";
...
export default defineConfig({
  plugins: [createDeployLogPlugin()],
  ...
})

//main.js
if (import.meta.env.MODE == "staging") { //仅测试环境下显示
  import("vite-plugin-deploy-log").then(({ showDeployLog }) => {
    showDeployLog();
  });
}


```

## 附件功能
```javascript
//插件可选参数
interface DeployLogPlugin {
    /**
     * 输出的数据文件路径
     * @default "deploy.log"
     */
    outputPath?: string;
    /**
     * git消息输出条目数量
     * @default 10
     */
    gitMsgCount?: number;
}

//调用部署日志数据接口
import { getDeployLogData } from "vite-plugin-deploy-log";
getDeployLogData().then(res=>console.log(res));

```

## 效果演示
![](https://github.com/Rakers1024/vite-plugin-deploy-log/raw/main/gif.gif)
