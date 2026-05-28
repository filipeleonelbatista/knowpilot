import { applyPreset, attendantPresets } from "../src/lib/attendant/presets";
import type { SeedOrgDefinition } from "./seed-data";

function faq(title: string, content: string) {
  return { title, content };
}

const saasPreset = attendantPresets.find((p) => p.id === "saas-b2b")!;

const attendantBase = applyPreset(
  {
    name: "Nuve",
    personality: "",
    tone: "",
    characteristics: "",
    extraInstructions: "",
  },
  saasPreset,
);

export const DEFAULT_MINIMAL_SEED_EMAIL = "starter@knowpilot.local";
export const DEFAULT_MINIMAL_SEED_PASSWORD = "starter123456";
export const DEFAULT_MINIMAL_SEED_NAME = "Usuário Starter";

/** Single-org seed: 5 KB items, attendant + widget ready to use. */
export const MINIMAL_SEED_ORG: SeedOrgDefinition = {
  name: "TechStart",
  slug: "techstart",
  kbName: "Central de ajuda",
  attendant: {
    name: "Nuve",
    personality: attendantBase.personality,
    tone: attendantBase.tone,
    characteristics: attendantBase.characteristics,
    extraInstructions: attendantBase.extraInstructions,
    fallbackMessage:
      "Não encontrei isso na nossa documentação. Nossa equipe pode ajudar pelo e-mail ou telefone abaixo.",
    fallbackEmail: "suporte@techstart.demo",
    fallbackPhone: "(11) 4000-1000",
    widgetPrimaryColor: "#2563eb",
  },
  documents: [
    faq(
      "Planos e preços",
      "TechStart oferece Plano Starter (R$ 49/mês, até 3 usuários), Plano Growth (R$ 129/mês, até 15 usuários) e Plano Business (sob consulta). Todos incluem suporte por e-mail em dias úteis. Upgrade ou downgrade a qualquer momento pelo painel em Configurações → Assinatura.",
    ),
    faq(
      "Período de teste gratuito",
      "Novos cadastros têm 14 dias de trial com todas as funções do Plano Growth, sem cartão. Após o trial, a conta passa para Starter automaticamente se não houver assinatura ativa. Dados e bases criadas no trial são mantidos.",
    ),
    faq(
      "Horário do suporte humano",
      "Suporte humano de segunda a sexta, 9h às 18h (horário de Brasília), exceto feriados nacionais. E-mail suporte@techstart.demo — resposta média em 4h úteis. Telefone (11) 4000-1000 para clientes Business.",
    ),
    faq(
      "Cancelamento e reembolso",
      "Cancelamento pelo painel a qualquer momento; o acesso permanece até o fim do ciclo pago. Reembolso integral em até 7 dias após a primeira cobrança de um plano pago. Após 7 dias, não há reembolso proporcional, apenas cancelamento da renovação.",
    ),
    faq(
      "Integrações disponíveis",
      "Integrações nativas: Slack (notificações), Zapier (automações) e API REST com chaves no painel em Desenvolvedor. Webhooks de eventos (novo lead, conversa encerrada) documentados em docs.techstart.demo/api.",
    ),
  ],
};
