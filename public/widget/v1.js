"use strict";(()=>{(function(){let s=document.currentScript,h=s?.getAttribute("data-widget-key"),z=s?.getAttribute("data-position")??"bottom-right";if(!h){console.error("[KB Chat] data-widget-key is required");return}let w=s?.src?new URL(s.src).origin:window.location.origin;function u(t){if(!t)return;let e=t.trim();if(!(!e||e==="null"||e==="undefined"))try{let n=new URL(e);return n.protocol!=="http:"&&n.protocol!=="https:"?void 0:n.origin}catch{return}}function M(){let t=u(s?.getAttribute("data-embed-origin"));if(t)return t;if(document.referrer)try{let e=u(new URL(document.referrer).origin);if(e)return e}catch{}try{if(window.parent!==window){let e=u(window.parent.location.origin);if(e)return e}}catch{}return u(window.location.origin)}let f=M(),y=document.createElement("div");y.id="kb-chat-widget-host",document.body.appendChild(y);let L=y.attachShadow({mode:"open"}),i="#2563eb",v="Assistente",C=!1,E=!1,m="",O=document.createElement("style");O.textContent=`
    * { box-sizing: border-box; font-family: system-ui, sans-serif; }
    .fab {
      position: fixed;
      ${z.includes("left")?"left: 20px":"right: 20px"};
      bottom: 20px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      color: white;
      font-size: 24px;
      box-shadow: 0 4px 20px rgba(0,0,0,.2);
      z-index: 2147483646;
    }
    .panel {
      position: fixed;
      ${z.includes("left")?"left: 20px":"right: 20px"};
      bottom: 88px;
      width: 360px;
      max-width: calc(100vw - 40px);
      height: 480px;
      max-height: calc(100vh - 120px);
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 8px 40px rgba(0,0,0,.15);
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 2147483647;
    }
    .panel.open { display: flex; }
    .header {
      padding: 14px 16px;
      color: white;
      font-weight: 600;
    }
    .messages {
      flex: 1;
      overflow-y: auto;
      padding: 12px;
      background: #f8fafc;
    }
    .msg {
      max-width: 85%;
      margin-bottom: 8px;
      padding: 8px 12px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.4;
    }
    .msg.user { margin-left: auto; background: var(--primary); color: white; }
    .msg.bot { background: #e2e8f0; color: #1e293b; }
    .status { font-size: 12px; color: #b45309; padding: 0 12px 8px; }
    .footer {
      display: flex;
      gap: 8px;
      padding: 12px;
      border-top: 1px solid #e2e8f0;
    }
    input {
      flex: 1;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 8px 10px;
      font-size: 14px;
    }
    button.send {
      border: none;
      border-radius: 8px;
      padding: 8px 14px;
      color: white;
      cursor: pointer;
    }
    .upgrade {
      display: block;
      margin: 8px 12px;
      text-align: center;
      font-size: 12px;
      color: var(--primary);
    }
  `;let a=document.createElement("button");a.className="fab",a.textContent="\u{1F4AC}",a.setAttribute("aria-label","Abrir chat");let d=document.createElement("div");d.className="panel";let g=document.createElement("div");g.className="header";let c=document.createElement("div");c.className="messages";let x=document.createElement("div");x.className="status";let k=document.createElement("footer");k.className="footer";let l=document.createElement("input");l.placeholder="Digite sua pergunta\u2026";let p=document.createElement("button");p.className="send",p.textContent="Enviar",k.append(l,p),d.append(g,c,x,k),L.append(O,a,d);function N(){L.host.style.setProperty("--primary",i),a.style.background=i,g.style.background=i,p.style.background=i}function R(t,e){let n=document.createElement("div");return n.className=`msg ${t}`,n.textContent=e,c.appendChild(n),c.scrollTop=c.scrollHeight,n}async function H(){try{let t=new URL(`${w}/api/public/widget/config`);t.searchParams.set("key",h),f&&t.searchParams.set("embedOrigin",f);let e=await fetch(t.toString());if(e.ok){let n=await e.json();v=n.name??v,i=n.primaryColor??i,g.textContent=v,N()}}catch{N()}}async function T(){let t=l.value.trim();if(!t||E)return;l.value="",E=!0,m="",x.textContent="",R("user",t);let e=R("bot","\u2026"),n="";try{let U={message:t,widgetKey:h};f&&(U.embedOrigin=f);let A=(await fetch(`${w}/api/public/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(U)})).body?.getReader(),K=new TextDecoder;if(!A)throw new Error("Sem resposta");let S="";for(;;){let{done:_,value:j}=await A.read();if(_)break;S+=K.decode(j,{stream:!0});let P=S.split(`

`);S=P.pop()??"";for(let q of P){let B=q.split(`
`),b="message",$="";for(let o of B)o.startsWith("event: ")&&(b=o.slice(7)),o.startsWith("data: ")&&($=o.slice(6));if(!$)continue;let r=JSON.parse($);if(b==="queued"&&(m=`Na fila: posi\xE7\xE3o ${r.position}, ~${Math.ceil(Number(r.estimated_wait_seconds)/60)} min`,x.textContent=m),b==="token"&&typeof r.content=="string"&&(n+=r.content,e.textContent=n),b==="error"&&(e.textContent=String(r.message),r.upgradeUrl)){let o=document.createElement("a");o.className="upgrade",o.href=`${w}${r.upgradeUrl}`,o.target="_blank",o.rel="noopener",o.textContent="Conhecer Plano Pro \u2014 R$ 90/m\xEAs",d.appendChild(o)}}}!n&&!m&&(e.textContent="Sem resposta.")}catch{e.textContent="Erro ao conectar. Tente novamente em alguns minutos."}finally{E=!1}}a.addEventListener("click",()=>{C=!C,d.classList.toggle("open",C)}),p.addEventListener("click",()=>{T()}),l.addEventListener("keydown",t=>{t.key==="Enter"&&T()}),H(),N()})();})();
