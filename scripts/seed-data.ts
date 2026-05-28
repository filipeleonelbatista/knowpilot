export type SeedDocument = {
  title: string;
  content: string;
};

export type SeedOrgDefinition = {
  name: string;
  slug: string;
  kbName: string;
  attendant: {
    name: string;
    personality: string;
    tone: string;
    characteristics: string;
    extraInstructions: string;
    fallbackMessage: string;
    fallbackEmail?: string;
    fallbackPhone?: string;
    widgetPrimaryColor: string;
  };
  documents: SeedDocument[];
};

function faq(title: string, content: string): SeedDocument {
  return { title, content };
}

const vetDocuments: SeedDocument[] = [
  faq(
    "Horário de funcionamento",
    "A clínica PetVida funciona de segunda a sexta das 8h às 19h e aos sábados das 8h às 14h. Domingos e feriados atendemos apenas emergências com plantão veterinário.",
  ),
  faq(
    "Endereço e estacionamento",
    "Estamos na Rua das Palmeiras, 420 — Jardim Paulista. Há estacionamento gratuito no subsolo para clientes, com validação na recepção.",
  ),
  faq(
    "Consulta de rotina — valores",
    "Consulta clínica geral: R$ 180. Retorno em até 15 dias: R$ 90. Consultas com especialistas (cardio, dermato, ortopedia) a partir de R$ 280.",
  ),
  faq(
    "Vacinação — calendário filhotes",
    "Filhotes recebem V8/V10, giárdia e vermífugo conforme protocolo. Reforços aos 45, 75 e 105 dias. A equipe envia lembrete por WhatsApp.",
  ),
  faq(
    "Vacina antirrábica",
    "Obrigatória a partir de 4 meses. Aplicação anual. Custo: R$ 65. Emitimos certificado para viagens e condomínios.",
  ),
  faq(
    "Castração — preços e preparo",
    "Cães: a partir de R$ 450 (até 15 kg). Gatos: a partir de R$ 380. Jejum de 8h, água liberada até 2h antes. Exames pré-operatórios podem ser exigidos.",
  ),
  faq(
    "Internação e monitoramento",
    "Internação com monitoramento 24h: diária a partir de R$ 220 + medicamentos. Visitas permitidas das 14h às 17h com agendamento.",
  ),
  faq(
    "Emergência fora do horário",
    "Plantão emergencial: (11) 98765-4321. Taxa de urgência noturna: R$ 120 além do procedimento. Trauma grave: prioridade na triagem.",
  ),
  faq(
    "Exames laboratoriais",
    "Hemograma completo: R$ 95. Bioquímica básica: R$ 140. Resultados em 24h úteis; urgência em 4h com acréscimo de 40%.",
  ),
  faq(
    "Ultrassom e raio-X",
    "Ultrassom abdominal: R$ 320. Raio-X (2 incidências): R$ 210. Laudo por veterinário especialista em até 48h.",
  ),
  faq(
    "Banho e tosa",
    "Banho simples (cães pequenos): R$ 70. Tosa higiênica: +R$ 40. Tosa na tesoura conforme porte — orçamento na recepção.",
  ),
  faq(
    "Plano de saúde pet",
    "Não vendemos plano próprio, mas aceitamos reembolso de Petlove e Porto Seguro Pet. Envie guia digital antes da consulta.",
  ),
  faq(
    "Formas de pagamento",
    "Pix, cartão débito/crédito (até 3x sem juros acima de R$ 300), dinheiro. Não aceitamos cheques.",
  ),
  faq(
    "Política de cancelamento",
    "Cancelamentos com mais de 4h de antecedência: sem taxa. No-show: taxa de R$ 50 na próxima consulta.",
  ),
  faq(
    "Primeira consulta — o que levar",
    "Carteira de vacinação, lista de medicamentos, ração habitual e amostra de fezes se houver diarreia nos últimos 3 dias.",
  ),
  faq(
    "Atendimento para aves e exóticos",
    "Atendemos aves e roedores às terças e quintas com Dr. Marcos. Agendamento obrigatório — não há walk-in para exóticos.",
  ),
  faq(
    "Microchipagem",
    "Microchip ISO: R$ 120 incluindo registro no Sistema Nacional. Indicado para viagens e identificação em extravio.",
  ),
  faq(
    "Odontologia veterinária",
    "Limpeza de tártaro com anestesia inalatória: a partir de R$ 550 conforme grau e peso. Avaliação odontológica: R$ 150.",
  ),
  faq(
    "Fisioterapia e reabilitação",
    "Sessões de fisioterapia: R$ 120 cada. Pacotes de 10 sessões: R$ 1.050. Indicado pós-cirurgia ortopédica.",
  ),
  faq(
    "Farmácia veterinária",
    "Farmácia interna com medicamentos comuns. Antibióticos só com receita. Entrega em 5 km: taxa R$ 15.",
  ),
  faq(
    "Hospedagem pet",
    "Não oferecemos hospedagem. Indicamos parceiro Hotel AuAu a 2 km — desconto de 10% para clientes PetVida.",
  ),
  faq(
    "Alergias alimentares — orientação",
    "Teste de sensibilidade alimentar disponível (painel 24 antígenos): R$ 890. Dieta hipoalergênica vendida na recepção.",
  ),
  faq(
    "Teleorientação",
    "Teleconsulta 20 min para dúvidas não urgentes: R$ 95. Não prescrevemos antibióticos controlados por telemedicina.",
  ),
  faq(
    "Convênio com ONGs",
    "ONGs cadastradas têm 15% de desconto em consultas e castrações em campanhas trimestrais — envie CNPJ para cadastro.",
  ),
  faq(
    "Contato e agendamento",
    "WhatsApp agendamento: (11) 91234-5678. E-mail: contato@petvida.demo. Site: petvida.demo/agendar.",
  ),
];

const restaurantDocuments: SeedDocument[] = [
  faq(
    "Horário do restaurante",
    "Almoço de terça a domingo, 11h30–15h. Jantar quinta a sábado, 19h–23h. Segunda-feira fechado para manutenção.",
  ),
  faq(
    "Reservas",
    "Reservas pelo site saborarte.demo ou WhatsApp (11) 99876-5432. Grupos acima de 8 pessoas exigem confirmação com 48h.",
  ),
  faq(
    "Delivery e raio",
    "Delivery via app próprio e iFood. Raio de 6 km a partir da Av. Gastronômica, 88. Pedido mínimo: R$ 45.",
  ),
  faq(
    "Taxa de entrega",
    "Taxa fixa R$ 8 até 3 km; R$ 12 até 6 km. Frete grátis acima de R$ 120 às terças e quartas.",
  ),
  faq(
    "Tempo médio de entrega",
    "30–50 minutos em horário normal. Picos (sexta 19h–21h) podem chegar a 70 min — acompanhe pelo link SMS.",
  ),
  faq(
    "Menu executivo",
    "Menu executivo R$ 49,90: entrada do dia, prato principal, sobremesa e bebida não alcoólica. Apenas no almoço em dias úteis.",
  ),
  faq(
    "Pratos vegetarianos",
    "Opções vegetarianas e veganas marcadas no cardápio. Risoto de cogumelos vegano e burger de grão-de-bico disponíveis.",
  ),
  faq(
    "Alergênicos e glúten",
    "Informe alergias no pedido. Temos opções sem glúten sob demanda; cozinha separada para frutos do mar não é garantida.",
  ),
  faq(
    "Cartão fidelidade",
    "A cada R$ 100 em consumo presencial, R$ 10 de crédito na próxima visita. Válido por 90 dias.",
  ),
  faq(
    "Eventos privados",
    "Salão privativo para até 40 pessoas. Pacote mínimo R$ 3.500 (sábado almoço). Contato: eventos@saborarte.demo.",
  ),
  faq(
    "Estacionamento",
    "Manobrista parceiro na rua lateral — R$ 20 com desconto de R$ 10 na conta para consumo acima de R$ 150.",
  ),
  faq(
    "Cancelamento de pedido",
    "Pedidos podem ser cancelados em até 3 min após confirmação sem custo. Após início do preparo, não cancelamos.",
  ),
  faq(
    "Formas de pagamento",
    "Pix, cartões, Apple Pay e dinheiro. Não aceitamos vale-refeição em delivery — apenas no salão.",
  ),
  faq(
    "Gorjeta",
    "Gorjeta de 10% sugerida no salão (opcional). Entregadores recebem 100% da gorjeta via app.",
  ),
  faq(
    "Bebidas e harmonização",
    "Carta de vinhos nacionais e importados. Taça a partir de R$ 28. Cervejas artesanais locais R$ 18–32.",
  ),
  faq(
    "Menu infantil",
    "Menu kids R$ 32: mini burger ou nuggets, batata e suco. Cadeirão disponível — solicite na reserva.",
  ),
  faq(
    "Sobremesas da casa",
    "Pudim de leite R$ 22. Brownie com sorvete R$ 26. Opção sem lactose: mousse de maracujá R$ 24.",
  ),
  faq(
    "Promoção happy hour",
    "Quinta 17h–19h: chopp artesanal 2 por 1 e petiscos selecionados com 20% off apenas no balcão.",
  ),
  faq(
    "Encomenda de bolos",
    "Bolos sob encomenda com 72h de antecedência. Mínimo 2 kg a partir de R$ 160. Sabores: chocolate, cenoura, red velvet.",
  ),
  faq(
    "Trabalhe conosco",
    "Vagas em saborarte.demo/carreiras. Envie currículo para rh@saborarte.demo com área de interesse.",
  ),
  faq(
    "Nota fiscal",
    "NF-e enviada por e-mail para CPF/CNPJ informado no checkout. Empresas: informe inscrição estadual no campo observações.",
  ),
  faq(
    "Avaliações e feedback",
    "Pesquisa pós-pedido por e-mail. Reclamações respondidas em até 24h úteis em sac@saborarte.demo.",
  ),
  faq(
    "Acessibilidade",
    "Entrada sem degraus, banheiro adaptado e cardápio em braile sob solicitação na recepção.",
  ),
  faq(
    "Ingredientes locais",
    "80% dos vegetais de produtores em Mauá e Santo André. Peixes com selo de origem rastreada.",
  ),
  faq(
    "Contato geral",
    "Telefone fixo (11) 3456-7890. Instagram @saborarte.demo. Endereço: Av. Gastronômica, 88 — Centro.",
  ),
];

const gymDocuments: SeedDocument[] = [
  faq(
    "Horário da academia",
    "Segunda a sexta 5h–23h. Sábado 7h–18h. Domingo 8h–14h. Feriados seguem horário de domingo.",
  ),
  faq(
    "Planos e mensalidades",
    "Básico (musculação): R$ 99/mês. Plus (musculação + aulas): R$ 149. Premium (+ avaliação mensal): R$ 189. Anual com 15% off.",
  ),
  faq(
    "Matrícula e taxa de adesão",
    "Taxa única de matrícula R$ 80 (promoção: isento em plano anual). Documento com foto e comprovante de residência.",
  ),
  faq(
    "Aula experimental",
    "Uma aula experimental grátis para musculação ou spinning — agende na recepção ou pelo app IronFit.",
  ),
  faq(
    "Grade de aulas coletivas",
    "Spinning, funcional, yoga e pilates. Grade completa em ironfit.demo/aulas. Reserva de vaga pelo app até 1h antes.",
  ),
  faq(
    "Personal trainer",
    "Personal avulso: R$ 90/sessão. Pacote 12 sessões: R$ 960. Profissionais credenciados CREF listados na recepção.",
  ),
  faq(
    "Avaliação física",
    "Avaliação com bioimpedância inclusa no Premium; avulsa R$ 120. Agendamento com nutricionista parceiro opcional.",
  ),
  faq(
    "Armários e toalhas",
    "Armário diário R$ 10. Mensal R$ 45. Toalhas não fornecidas — traga sua toalha e garrafa d'água.",
  ),
  faq(
    "Estacionamento",
    "Estacionamento conveniado ao lado — 2h grátis para alunos com validação do ticket na recepção.",
  ),
  faq(
    "Congelamento de plano",
    "Até 30 dias por ano por motivo médico ou viagem (comprovante). Taxa administrativa R$ 30.",
  ),
  faq(
    "Cancelamento de plano",
    "Cancelamento com 30 dias de aviso prévio. Multa de permanência mínima só em contratos promocionais de 12 meses.",
  ),
  faq(
    "Convênio corporativo",
    "Empresas a partir de 10 colaboradores: 20% de desconto. Contato: corporativo@ironfit.demo.",
  ),
  faq(
    "Musculação — regras",
    "Uso de toalha obrigatório nos equipamentos. Devolver anilhas após uso. Gravação de vídeo só em área designada.",
  ),
  faq(
    "Sauna e vestiários",
    "Sauna seca no plano Plus e Premium. Vestiários com chuveiros quentes. Proibido alimentos nos vestiários.",
  ),
  faq(
    "Acompanhante / day use",
    "Day use R$ 40 (uma entrada). Acompanhante treina junto: mesmo valor do day use por visita.",
  ),
  faq(
    "App IronFit",
    "Treinos prescritos, check-in e fila virtual para aulas. Login com CPF cadastrado na matrícula.",
  ),
  faq(
    "Suplementos na recepção",
    "Whey, creatina e BCAA de marcas parceiras. Desconto 10% para alunos em plano Plus/Premium.",
  ),
  faq(
    "Estúdio de bike indoor",
    "42 bikes com monitor de frequência. Chegar 10 min antes para ajuste. Toalha obrigatória.",
  ),
  faq(
    "Treino para iniciantes",
    "Trilha 'Primeiros 30 dias' com acompanhamento de instrutor nas terças e quintas às 10h e 18h.",
  ),
  faq(
    "Cross training box",
    "Box anexo com open gym das 12h–14h para Premium. WODs guiados seg–sex 6h e 19h.",
  ),
  faq(
    "Parq e saúde",
    "Questionário PAR-Q obrigatório. Prescrição médica para liberação se marcar 'sim' em item cardiovascular.",
  ),
  faq(
    "Menores de idade",
    "A partir de 14 anos com autorização dos responsáveis. Entre 14–17 anos: horário até 20h.",
  ),
  faq(
    "Pagamento",
    "Pix recorrente, cartão ou boleto (acréscimo R$ 5). Atraso superior a 5 dias suspende acesso.",
  ),
  faq(
    "Treino em feriados",
    "Feriados nacionais: horário de domingo. Aviso com 48h no app e e-mail.",
  ),
  faq(
    "Contato",
    "Recepção (11) 3344-5566. WhatsApp suporte: (11) 97777-8888. Endereço: Rua do Movimento, 150.",
  ),
];

export const SEED_ORGS: SeedOrgDefinition[] = [
  {
    name: "Clínica Veterinária PetVida",
    slug: "petvida",
    kbName: "Atendimento e serviços",
    attendant: {
      name: "Luna",
      personality: "calorosa e cuidadosa",
      tone: "acolhedor",
      characteristics: "usa linguagem simples, evita termos técnicos sem explicar",
      extraInstructions:
        "Priorize informações sobre horários, valores e preparo de procedimentos. Nunca prescreva medicamentos.",
      fallbackMessage:
        "Não encontrei isso na nossa base. Ligue para o plantão (11) 98765-4321 ou fale com a recepção no WhatsApp (11) 91234-5678.",
      widgetPrimaryColor: "#059669",
    },
    documents: vetDocuments,
  },
  {
    name: "Restaurante Sabor & Arte",
    slug: "sabor-arte",
    kbName: "Cardápio e atendimento",
    attendant: {
      name: "Chef Bot",
      personality: "simpático e direto",
      tone: "informal",
      characteristics: "destaca promoções e prazos de entrega",
      extraInstructions:
        "Sugira reserva para grupos grandes. Não invente pratos fora do cardápio descrito na base.",
      fallbackMessage:
        "Essa informação não está no nosso guia. Chame no WhatsApp (11) 99876-5432 ou e-mail sac@saborarte.demo.",
      widgetPrimaryColor: "#c2410c",
    },
    documents: restaurantDocuments,
  },
  {
    name: "Academia IronFit",
    slug: "ironfit",
    kbName: "Planos e treinos",
    attendant: {
      name: "FitAssist",
      personality: "motivador e objetivo",
      tone: "energético",
      characteristics: "respostas curtas, foco em planos, horários e regras da academia",
      extraInstructions:
        "Incentive agendamento de aula experimental quando o usuário parecer novo. Não monte dietas detalhadas.",
      fallbackMessage:
        "Não achei na base. Passe na recepção ou WhatsApp (11) 97777-8888 para falar com um atendente.",
      widgetPrimaryColor: "#7c3aed",
    },
    documents: gymDocuments,
  },
];

export const DEFAULT_SEED_EMAIL = "demo@knowpilot.local";
export const DEFAULT_SEED_PASSWORD = "demo123456";
export const DEFAULT_SEED_NAME = "Usuário Demo";
