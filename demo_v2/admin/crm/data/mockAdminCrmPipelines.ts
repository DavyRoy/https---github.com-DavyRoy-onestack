export type LeadSource = { id: string; name: string; channel: "site"|"call"|"chat"|"ads"|"other"; active: boolean };
export const ADMIN_CRM_SOURCES: LeadSource[] = [
  { id:"site", name:"Сайт", channel:"site", active:true },
  { id:"call", name:"Звонок", channel:"call", active:true },
  { id:"chat", name:"Мессенджер", channel:"chat", active:true },
  { id:"ads",  name:"Реклама", channel:"ads", active:true },
];

export type PipelineStage = { id: string; name: string; probability?: number; slaHours?: number; color?: string };
export type Pipeline = { id: string; name: string; target: "B2C"|"B2B"; active: boolean; stages: PipelineStage[] };
export const ADMIN_CRM_PIPELINES: Pipeline[] = [
  {
    id:"p-default",
    name:"Стандартная воронка",
    target:"B2C",
    active:true,
    stages:[
      { id:"new", name:"Новый", probability:5, slaHours:4, color:"#60a5fa" },
      { id:"qualification", name:"Квалификация", probability:20, slaHours:12, color:"#34d399" },
      { id:"proposal", name:"Коммерческое", probability:45, slaHours:24, color:"#fbbf24" },
      { id:"negotiation", name:"Переговоры", probability:70, slaHours:48, color:"#f97316" },
      { id:"won", name:"Сделка", probability:100, color:"#22c55e" },
      { id:"lost", name:"Потеряно", probability:0, color:"#ef4444" },
    ]
  }
];