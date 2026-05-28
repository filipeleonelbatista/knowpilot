export const siteConfig = {
  name: "KnowPilot",
  tagline: "Base de conhecimento com IA que responde só o que você ensinou",
  description:
    "Plataforma para criar base de conhecimento, configurar atendente IA com Ollama local e embedar chat no seu site. RAG, widget e fila inteligente.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  keywords: [
    "base de conhecimento",
    "chatbot IA",
    "Ollama",
    "RAG",
    "widget chat",
    "atendimento automatizado",
    "IA local",
  ],
  ogImage: "/og-image.svg",
};
