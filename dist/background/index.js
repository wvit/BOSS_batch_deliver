(()=>{"use strict";let e=null;chrome.runtime.onMessage.addListener(((t,i,n)=>{const{action:o,jobData:c}=t;return"openChatPage"===o?(async(t,i)=>{const{encryptBossId:n,encryptJobId:o,securityId:c,lid:r}=t;e||(e=await new Promise((e=>{chrome.windows.create({url:"about:blank",type:"normal",width:1200,height:800,left:200,top:200,state:"minimized"},(t=>e(t.id)))})));const s=await new Promise((t=>{chrome.tabs.create({windowId:e,url:`https://www.zhipin.com/web/geek/chat?id=${n}&jobId=${o}&securityId=${c}&lid=${r}`},(e=>t(e.id)))}));chrome.scripting.executeScript({target:{tabId:s},func:async()=>{const e=e=>document.querySelector(e),t=e=>new Promise((t=>setTimeout(t,e)));await t(200);const[i,n,o]=[e("#chat-input"),e(".emoj.emoj-1"),e(".chat-op .btn-send")];return i&&n&&o?(n.click(),i.innerText="你好，我叫吴维，请问贵公司还需要高级前端开发工程师吗，6年前端工作经验。这是我的个人主页，里面有非常详细的自我介绍: https://wuwei.chat",await t(500),o.click(),await t(500),"success"):"error"}},i)})(c,n):"closeWindow"===o&&e&&chrome.windows.remove(e,(()=>{e=null})),!0})),chrome.windows.onRemoved.addListener((t=>{t===e&&(e=null)}))})();