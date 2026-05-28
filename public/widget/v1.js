"use strict";(()=>{(function(){let p=document.currentScript,x=p?.getAttribute("data-widget-key"),$=p?.getAttribute("data-position")??"bottom-right";if(!x){console.error("[KB Chat] data-widget-key is required");return}let b=p?.src?new URL(p.src).origin:window.location.origin,h=document.createElement("div");h.id="kb-chat-widget-host",document.body.appendChild(h);let S=h.attachShadow({mode:"open"}),r="#2563eb",y="Assistente",w=!1,v=!1,m="",z=document.createElement("style");z.textContent=`
    * { box-sizing: border-box; font-family: system-ui, sans-serif; }
    .fab {
      position: fixed;
      ${$.includes("left")?"left: 20px":"right: 20px"};
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
      ${$.includes("left")?"left: 20px":"right: 20px"};
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
  `;let s=document.createElement("button");s.className="fab",s.textContent="\u{1F4AC}",s.setAttribute("aria-label","Abrir chat");let i=document.createElement("div");i.className="panel";let u=document.createElement("div");u.className="header";let d=document.createElement("div");d.className="messages";let g=document.createElement("div");g.className="status";let C=document.createElement("footer");C.className="footer";let c=document.createElement("input");c.placeholder="Digite sua pergunta\u2026";let l=document.createElement("button");l.className="send",l.textContent="Enviar",C.append(c,l),i.append(u,d,g,C),S.append(z,s,i);function k(){S.host.style.setProperty("--primary",r),s.style.background=r,u.style.background=r,l.style.background=r}function T(t,n){let o=document.createElement("div");return o.className=`msg ${t}`,o.textContent=n,d.appendChild(o),d.scrollTop=d.scrollHeight,o}let L=window.location.origin;async function O(){try{let t=await fetch(`${b}/api/public/widget/config?key=${encodeURIComponent(x)}&embedOrigin=${encodeURIComponent(L)}`);if(t.ok){let n=await t.json();y=n.name??y,r=n.primaryColor??r,u.textContent=y,k()}}catch{k()}}async function R(){let t=c.value.trim();if(!t||v)return;c.value="",v=!0,m="",g.textContent="",T("user",t);let n=T("bot","\u2026"),o="";try{let U=(await fetch(`${b}/api/public/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:t,widgetKey:x,embedOrigin:L})})).body?.getReader(),M=new TextDecoder;if(!U)throw new Error("Sem resposta");let E="";for(;;){let{done:P,value:_}=await U.read();if(P)break;E+=M.decode(_,{stream:!0});let A=E.split(`

`);E=A.pop()??"";for(let j of A){let q=j.split(`
`),f="message",N="";for(let e of q)e.startsWith("event: ")&&(f=e.slice(7)),e.startsWith("data: ")&&(N=e.slice(6));if(!N)continue;let a=JSON.parse(N);if(f==="queued"&&(m=`Na fila: posi\xE7\xE3o ${a.position}, ~${Math.ceil(Number(a.estimated_wait_seconds)/60)} min`,g.textContent=m),f==="token"&&typeof a.content=="string"&&(o+=a.content,n.textContent=o),f==="error"&&(n.textContent=String(a.message),a.upgradeUrl)){let e=document.createElement("a");e.className="upgrade",e.href=`${b}${a.upgradeUrl}`,e.target="_blank",e.rel="noopener",e.textContent="Conhecer Plano Pro \u2014 R$ 90/m\xEAs",i.appendChild(e)}}}!o&&!m&&(n.textContent="Sem resposta.")}catch{n.textContent="Erro ao conectar. Tente novamente em alguns minutos."}finally{v=!1}}s.addEventListener("click",()=>{w=!w,i.classList.toggle("open",w)}),l.addEventListener("click",()=>{R()}),c.addEventListener("keydown",t=>{t.key==="Enter"&&R()}),O(),k()})();})();
