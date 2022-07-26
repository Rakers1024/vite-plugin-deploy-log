import { DeployLogData } from ".";
import "./style.css";

/**
 * 获取数据
 * @returns {Promise<DeployLogData>}
 */
export function getDeployLogData(url = "/deploy-log.json"): Promise<DeployLogData> {
  return new Promise((resolve, reject) => {
    //@ts-ignore
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
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

/**
 * 在main.js插入dom元素,来显示日志
 */
export default function showDeployLog(): void {
  getDeployLogData().then((outData: DeployLogData) => {
    //@ts-ignore
    const deployLog = document.createElement("div");
    deployLog.id = "deploy-log";
    deployLog.innerHTML = `
      <div>
        <h3>部署日志</h3>
        <div>
          <p>部署时间: ${outData.deployTime}</p>
          <p>Git提交信息:</p>
          <ul>
            ${outData.gitMsgs.map(msg => `<li>${msg}</li>`).join("")}
          </ul>
        </div>
      </div>
    `;
    //@ts-ignore
    document.body.appendChild(deployLog);
  });
}
