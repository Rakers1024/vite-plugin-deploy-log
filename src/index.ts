import type { PluginOption } from "vite";
import fs from "fs";
import child_process from "child_process";

/**
 * 获取当前时间 格式：yyyy/MM/dd HH:MM:SS
 */
function getCurrentTime(): string {
  const date = new Date(); //当前时间
  const zeroFill = i => (i >= 0 && i <= 9 ? "0" + i : i);
  const month = zeroFill(date.getMonth() + 1); //月
  const day = zeroFill(date.getDate()); //日
  const hour = zeroFill(date.getHours()); //时
  const minute = zeroFill(date.getMinutes()); //分
  const second = zeroFill(date.getSeconds()); //秒
  return `${date.getFullYear()}/${month}/${day} ${hour}:${minute}:${second}`;
}

export interface DeployLogData {
  deployTime: string;
  gitMsgs: string[];
}
export interface DeployLogPlugin {
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

/**
 * 创建部署日志插件
 * @param option 配置
 * @returns {PluginOption[]}
 */
export function createDeployLogPlugin(options?: DeployLogPlugin): PluginOption[] {
  let outDir: string;
  const outData: DeployLogData = {} as DeployLogData;
  const outputPath = options?.outputPath || "deploy.log";
  const gitMsgCount = options?.gitMsgCount || 10;
  return [
    {
      name: "vite-plugin-deploy-log",

      enforce: "pre",

      apply: "build",

      config(config, { command }) {
        if (command === "build") {
          outDir = config.build?.outDir || "dist";
        }
      },

      closeBundle() {
        outData.deployTime = getCurrentTime();
        const exec = child_process.exec;
        exec(`git log --oneline -${gitMsgCount * 2}`, (err, stdout) => {
          if (err) {
            new Error("Error: " + err);
            return;
          }
          outData.gitMsgs = stdout
            .split("\n")
            .filter(
              msg =>
                msg != "" &&
                msg.indexOf("Merge branch") == -1 &&
                msg.indexOf("Merge pull request") == -1 &&
                msg.indexOf("Merge remote-tracking branch") == -1 &&
                msg.indexOf("Merge remote branch") == -1
            );

          if (outData.gitMsgs.length > gitMsgCount) outData.gitMsgs.length = gitMsgCount;
          outData.gitMsgs = outData.gitMsgs.map(msg => msg.replace(/^.*? /g, ""));

          fs.writeFileSync(`${outDir}/${outputPath}`, JSON.stringify(outData));
        });
      },
    },
  ];
}

/**
 * 获取数据
 * @param base 基础路径
 * @param path 数据文件路径
 * @returns {Promise<DeployLogData>}
 */
export function getDeployLogData(base?: string, path?: string): Promise<DeployLogData> {
  base = base || "/";
  path = path || "deploy.log";
  const url = base + path;

  return new Promise((resolve, reject) => {
    //@ts-ignore
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    xhr.onload = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(xhr.statusText);
        }
      }
    };
    xhr.onerror = function () {
      reject(xhr.statusText);
    };
    xhr.send(null);
  });
}

interface ShowDeployLogOptions {
  /**
   * 基础路径
   * @default "/"
   */
  base?: string;

  /**
   * 请求的路径
   * @default "deploy.log"
   */
  path?: string;

  /**
   * 显示的z-index等级
   * @default 9999
   */
  zIndex?: number;
}

/**
 * 在main.js插入dom元素,来显示日志
 * @param base 基础路径
 * @param path 数据文件地址
 */
export function showDeployLog(options?: ShowDeployLogOptions): void {
  const zIndex = options?.zIndex || 9999;
  getDeployLogData(options?.base, options?.path).then((outData: DeployLogData) => {
    //@ts-ignore
    const deployLog = document.createElement("div");
    deployLog.id = "deploy-log";
    deployLog.classList.add("hide");
    deployLog.onclick = event => {
      if (event?.target?.id == "minus") {
        deployLog.classList.remove("show");
        deployLog.classList.add("hide");
      }
      if (event?.target?.id == "plus") {
        deployLog.classList.remove("hide");
        deployLog.classList.add("show");
      }
    };

    deployLog.innerHTML = `
      <div>
        <div><h4>部署日志<a class="icon plus" id="plus"></a></h4></div>
        <div id="deploy-log_content">
          <a class="icon minus" id="minus"></a>
          <p>部署时间: ${outData.deployTime}</p>
          <p>Git提交信息:</p>
          <ul>
            ${outData.gitMsgs.map(msg => `<li>${msg}</li>`).join("")}
          </ul>
        </div>
      </div>
      <style>
      #deploy-log {width: 300px;background: teal;position: fixed;bottom: 0;left: 0;opacity: 0.9;z-index: ${zIndex};}
      #deploy-log_content { border-top: 1px dashed #fff;padding: 10px;}
      #deploy-log h4 {margin: 0;padding: 14px;color: #fff;}
      #deploy-log p {margin: 0 0 .5em;color: #fff;}
      #deploy-log li {margin: 0 0 .5em;color: #fff;}
      #deploy-log .icon {text-decoration:none;display:block ;height: 20px;width: 20px;border-radius: 20px;border: 2px solid #fff;text-align: center;line-height: 1.23em;position: absolute;right: 12px;top: 12px; color:#fff}
      #deploy-log .icon.minus:after {content: "-";c}
      #deploy-log .icon.plus:after {content: "+";}
      #deploy-log .btn {display:inline-block; padding:7px 12px; background:#fff;text-decoration:none;border-radius:3px;color:#666;border:2px solid #fff;}
      #deploy-log .btn:hover {color:teal;border:2px solid #333}
      #deploy-log .icon.plus {display:none;}
      #deploy-log.hide #deploy-log_content {display:none;}
      #deploy-log.hide .icon.minus {display:none;}
      #deploy-log.hide .icon.plus {display:block;}
      #deploy-log a {cursor: pointer;}
      @media only screen and (min-width: 0px) and (max-width: 768px) {
        #deploy-log {width:100%;right:0;}
        #deploy-log_content {display:none;}
        #deploy-log .icon.plus {display:block;}
        #deploy-log.show #deploy-log_content {display:block}
        #deploy-log.show .icon.plus {display:none;}
      }
      </style>
    `;
    //@ts-ignore
    document.body.appendChild(deployLog);
  });
}
