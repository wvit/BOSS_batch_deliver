(()=>{"use strict";let e=null;chrome.runtime.onMessage.addListener(((t,n,o)=>{const{action:c,jobData:i,chatMessage:a}=t;return"openChatPage"===c?(async(t,n,o)=>{const{encryptBossId:c,encryptJobId:i,securityId:a,lid:r}=t;e||(e=await new Promise((e=>{chrome.windows.create({url:"about:blank",type:"normal",state:"minimized"},(t=>e(t.id)))})));const s=await new Promise((t=>{chrome.tabs.create({windowId:e,url:`https://www.zhipin.com/web/geek/chat?id=${c}&jobId=${i}&securityId=${a}&lid=${r}`},(e=>t(e.id)))}));chrome.scripting.executeScript({target:{tabId:s},func:async e=>{const t=e=>document.querySelector(e),n=e=>new Promise((t=>setTimeout(t,e)));await n(500);const[o,c,i]=[t("#chat-input"),t(".emoj.emoj-1"),t(".chat-op .btn-send")];return o&&c&&i?(c.click(),await n(500),o.innerText=e,await n(500),i.click(),await n(500),"success"):"error"},args:[n]},o)})(i,a,o):"closeWindow"===c&&e&&chrome.windows.remove(e,(()=>{e=null})),!0})),chrome.windows.onRemoved.addListener((t=>{t===e&&(e=null)}))})();