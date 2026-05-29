(function () {
  const script = document.currentScript as HTMLScriptElement | null;
  const widgetKey = script?.getAttribute("data-widget-key");
  const position = script?.getAttribute("data-position") ?? "bottom-right";

  if (!widgetKey) {
    console.error("[KB Chat] data-widget-key is required");
    return;
  }

  const baseUrl = script?.src
    ? new URL(script.src).origin
    : window.location.origin;

  const ngrokBypassHeaders = {
    "ngrok-skip-browser-warning": "true",
  };

  function normalizeHttpOrigin(value: string | null | undefined): string | undefined {
    if (!value) return undefined;
    const trimmed = value.trim();
    if (!trimmed || trimmed === "null" || trimmed === "undefined") return undefined;
    try {
      const url = new URL(trimmed);
      if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
      return url.origin;
    } catch {
      return undefined;
    }
  }

  function resolveClientEmbedOrigin(): string | undefined {
    const fromAttr = normalizeHttpOrigin(script?.getAttribute("data-embed-origin"));
    if (fromAttr) return fromAttr;

    if (document.referrer) {
      try {
        const fromReferrer = normalizeHttpOrigin(new URL(document.referrer).origin);
        if (fromReferrer) return fromReferrer;
      } catch {
        // ignore invalid referrer
      }
    }

    try {
      if (window.parent !== window) {
        const fromParent = normalizeHttpOrigin(window.parent.location.origin);
        if (fromParent) return fromParent;
      }
    } catch {
      // cross-origin parent
    }

    return normalizeHttpOrigin(window.location.origin);
  }

  const embedOrigin = resolveClientEmbedOrigin();

  const host = document.createElement("div");
  host.id = "kb-chat-widget-host";
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: "open" });
  let primaryColor = "#2563eb";
  let botName = "Assistente";
  let open = false;
  let loading = false;
  let statusText = "";

  const style = document.createElement("style");
  style.textContent = `
    * { box-sizing: border-box; font-family: system-ui, sans-serif; }
    .fab {
      position: fixed;
      ${position.includes("left") ? "left: 20px" : "right: 20px"};
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
      ${position.includes("left") ? "left: 20px" : "right: 20px"};
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
  `;

  const fab = document.createElement("button");
  fab.className = "fab";
  fab.textContent = "💬";
  fab.setAttribute("aria-label", "Abrir chat");

  const panel = document.createElement("div");
  panel.className = "panel";

  const header = document.createElement("div");
  header.className = "header";

  const messages = document.createElement("div");
  messages.className = "messages";

  const statusEl = document.createElement("div");
  statusEl.className = "status";

  const footer = document.createElement("footer");
  footer.className = "footer";

  const input = document.createElement("input");
  input.placeholder = "Digite sua pergunta…";

  const sendBtn = document.createElement("button");
  sendBtn.className = "send";
  sendBtn.textContent = "Enviar";

  footer.append(input, sendBtn);
  panel.append(header, messages, statusEl, footer);
  shadow.append(style, fab, panel);

  function applyTheme() {
    shadow.host.style.setProperty("--primary", primaryColor);
    fab.style.background = primaryColor;
    header.style.background = primaryColor;
    sendBtn.style.background = primaryColor;
  }

  function addMessage(role: "user" | "bot", text: string) {
    const el = document.createElement("div");
    el.className = `msg ${role}`;
    el.textContent = text;
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
    return el;
  }

  async function loadConfig() {
    try {
      const configUrl = new URL(`${baseUrl}/api/public/widget/config`);
      configUrl.searchParams.set("key", widgetKey);
      if (embedOrigin) configUrl.searchParams.set("embedOrigin", embedOrigin);
      const res = await fetch(configUrl.toString(), {
        headers: ngrokBypassHeaders,
      });
      if (res.ok) {
        const data = (await res.json()) as {
          name?: string;
          primaryColor?: string;
        };
        botName = data.name ?? botName;
        primaryColor = data.primaryColor ?? primaryColor;
        header.textContent = botName;
        applyTheme();
      }
    } catch {
      applyTheme();
    }
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text || loading) return;
    input.value = "";
    loading = true;
    statusText = "";
    statusEl.textContent = "";
    addMessage("user", text);
    const botEl = addMessage("bot", "…");
    let reply = "";

    try {
      const payload: { message: string; widgetKey: string; embedOrigin?: string } = {
        message: text,
        widgetKey,
      };
      if (embedOrigin) payload.embedOrigin = embedOrigin;

      const res = await fetch(`${baseUrl}/api/public/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...ngrokBypassHeaders,
        },
        body: JSON.stringify(payload),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("Sem resposta");

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const part of parts) {
          const lines = part.split("\n");
          let event = "message";
          let data = "";
          for (const line of lines) {
            if (line.startsWith("event: ")) event = line.slice(7);
            if (line.startsWith("data: ")) data = line.slice(6);
          }
          if (!data) continue;
          const parsed = JSON.parse(data) as Record<string, unknown>;

          if (event === "queued") {
            statusText = `Na fila: posição ${parsed.position}, ~${Math.ceil(Number(parsed.estimated_wait_seconds) / 60)} min`;
            statusEl.textContent = statusText;
          }
          if (event === "token" && typeof parsed.content === "string") {
            reply += parsed.content;
            botEl.textContent = reply;
          }
          if (event === "error") {
            botEl.textContent = String(parsed.message);
            if (parsed.upgradeUrl) {
              const link = document.createElement("a");
              link.className = "upgrade";
              link.href = `${baseUrl}${parsed.upgradeUrl}`;
              link.target = "_blank";
              link.rel = "noopener";
              link.textContent = "Conhecer Plano Pro — R$ 90/mês";
              panel.appendChild(link);
            }
          }
        }
      }
      if (!reply && !statusText) {
        botEl.textContent = "Sem resposta.";
      }
    } catch {
      botEl.textContent =
        "Erro ao conectar. Tente novamente em alguns minutos.";
    } finally {
      loading = false;
    }
  }

  fab.addEventListener("click", () => {
    open = !open;
    panel.classList.toggle("open", open);
  });

  sendBtn.addEventListener("click", () => void sendMessage());
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") void sendMessage();
  });

  void loadConfig();
  applyTheme();
})();
