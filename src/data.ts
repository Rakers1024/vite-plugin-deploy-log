import { DeployLogData } from ".";

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
    deployLog.classList.add("hide");
    deployLog.onclick = event => {
      if (event.target.id == "minus") {
        deployLog.classList.remove("show");
        deployLog.classList.add("hide");
      }
      if (event.target.id == "plus") {
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
      #deploy-log {width: 300px;background: teal;position: fixed;bottom: 0;left: 0;opacity: 0.9;}
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
    console.log(deployLog);
    console.log(deployLog.text);
  });
}
