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

export type DeployLogData = {
  deployTime: string;
  gitMsgs: string[];
  log: string;
};

/**
 * 创建部署日志插件
 * @returns {PluginOption[]}
 */
export default function createDeployLogPlugin(): PluginOption[] {
  let outDir: string;
  const outData: DeployLogData = {} as DeployLogData;
  const gitMsgCount = 10;
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

          fs.writeFileSync(`${outDir}/deploy-log.json`, JSON.stringify(outData));
        });
      },
    },
  ];
}
