"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, LogOut, Paperclip, Send, Printer, Plus, X,
  CheckCircle2, Clock, Flame, AlertCircle, Circle, Loader2,
  FolderOpen, MessageSquare, Settings2, BarChart3, ChevronDown,
} from "lucide-react";

type Status      = "NEW"|"IN_REVIEW"|"APPROVED"|"IN_PROGRESS"|"COMPLETED"|"CANCELLED";
type StageStatus = "PENDING"|"IN_PROGRESS"|"COMPLETED";
type Priority    = "LOW"|"MEDIUM"|"HIGH"|"URGENT";
type ReqType     = "TASK"|"BUG"|"FEATURE"|"SUPPORT"|"AGREEMENT";

const SL: Record<Status,string>      = { NEW:"Новая",IN_REVIEW:"На рассмотрении",APPROVED:"Одобрена",IN_PROGRESS:"В работе",COMPLETED:"Выполнена",CANCELLED:"Отменена" };
const SC: Record<Status,string>      = { NEW:"var(--status-new)",IN_REVIEW:"var(--status-review)",APPROVED:"var(--status-approved)",IN_PROGRESS:"var(--status-progress)",COMPLETED:"var(--status-completed)",CANCELLED:"var(--status-cancelled)" };
const SSL: Record<StageStatus,string>= { PENDING:"Ожидает",IN_PROGRESS:"В работе",COMPLETED:"Выполнен" };
const SSC: Record<StageStatus,string>= { PENDING:"rgba(244,250,248,0.3)",IN_PROGRESS:"var(--status-review)",COMPLETED:"var(--status-completed)" };
const PL:  Record<Priority,string>   = { LOW:"Низкий",MEDIUM:"Средний",HIGH:"Высокий",URGENT:"Срочно" };
const PC:  Record<Priority,string>   = { LOW:"var(--priority-low)",MEDIUM:"var(--priority-medium)",HIGH:"var(--priority-high)",URGENT:"var(--priority-urgent)" };
const TL:  Record<ReqType,string>    = { TASK:"Задача",BUG:"Баг",FEATURE:"Функция",SUPPORT:"Поддержка",AGREEMENT:"Договор" };
const SVC_N: Record<string,string>   = { sites:"Разработка сайта",webapp:"Веб-приложение",mobile:"Мобильное приложение",complex:"Полный стек",redesign:"Редизайн",support:"Техподдержка" };

function fd(d:string){ return new Date(d).toLocaleDateString("ru-RU",{day:"2-digit",month:"long",year:"numeric"}); }
function ft(d:string){ return new Date(d).toLocaleTimeString("ru-RU",{hour:"2-digit",minute:"2-digit"}); }
function fShort(d:string){ return new Date(d).toLocaleDateString("ru-RU",{day:"2-digit",month:"2-digit",year:"2-digit"}); }
function orderNo(id:string){ return "OS-"+id.replace(/-/g,"").slice(0,8).toUpperCase(); }
function fmtRub(v?:number|null){ return v!=null ? `₽ ${(v/100).toLocaleString("ru")}` : null; }
function fmtBytes(b?:number|null){ if(!b)return ""; return b<1048576?`${(b/1024).toFixed(0)} KB`:`${(b/1048576).toFixed(1)} MB`; }

type Req = any;
type Msg = { id:string; role:string; text:string; createdAt:string };

/* ── Reusable tiny components ── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-bold uppercase tracking-[0.8px] mb-2" style={{ color:"var(--muted-foreground)" }}>
      {children}
    </div>
  );
}

function FieldRow({ label, value, accent }: { label:string; value?:string|null; accent?:string }) {
  if (!value) return null;
  return (
    <div className="flex items-baseline justify-between py-1.5" style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
      <span className="text-xs" style={{ color:"var(--muted-foreground)" }}>{label}</span>
      <span className="text-[13px] text-right max-w-[60%]" style={{ color:accent??"var(--foreground)", fontWeight:accent?700:400 }}>{value}</span>
    </div>
  );
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`rounded-lg animate-pulse ${className ?? ""}`} style={{ background:"rgba(255,255,255,0.06)" }} />;
}

export default function RequestPage() {
  const router = useRouter();
  const { id } = useParams<{ id:string }>();
  const [token,   setToken]   = useState("");
  const [req,     setReq]     = useState<Req|null>(null);
  const [chat,    setChat]    = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);

  const [status,   setStatus]   = useState<Status>("NEW");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [reqType,  setReqType]  = useState<ReqType>("TASK");
  const [price,    setPrice]    = useState("");
  const [note,     setNote]     = useState("");
  const [saving,   setSaving]   = useState(false);

  const [showPB,   setShowPB]   = useState(false);
  const [pbTitle,  setPbTitle]  = useState("");
  const [pbStart,  setPbStart]  = useState("");
  const [pbEnd,    setPbEnd]    = useState("");
  const [stageList,setSL2]      = useState([{title:"",desc:""}]);
  const [pbSaving, setPbSav]    = useState(false);

  const [subInput,  setSubInput]  = useState<Record<string,string>>({});
  const [subSaving, setSubSaving] = useState<string|null>(null);

  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [msg,    setMsg]   = useState("");
  const [sending,setSend]  = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const [rightTab, setRightTab] = useState<"control"|"chat"|"files"|"timeline">("control");

  useEffect(()=>{
    const t = localStorage.getItem("mgr_token")??"";
    if(!t){ router.push("/crm"); return; }
    setToken(t); loadReq(t); loadChat(t);
  },[]);

  async function loadReq(t:string){
    setLoading(true);
    try {
      const res = await fetch(`/api/manager/requests/${id}`,{ headers:{ Authorization:`Bearer ${t}` } });
      if(res.status===401){ router.push("/crm"); return; }
      const d = await res.json();
      setReq(d); setStatus(d.status);
      setPriority(d.priority??"MEDIUM");
      setReqType(d.type??"TASK");
      setPrice(d.price ? String(Math.round(d.price/100)) : "");
      setNote(d.managerNote??"");
    } finally { setLoading(false); }
  }

  async function loadChat(t:string){
    const res = await fetch(`/api/manager/requests/${id}/chat`,{ headers:{ Authorization:`Bearer ${t}` } });
    if(res.ok) setChat(await res.json());
  }

  useEffect(()=>{ if(chatRef.current) chatRef.current.scrollTop=chatRef.current.scrollHeight; },[chat]);

  async function saveStatus(){
    setSaving(true);
    try {
      const res = await fetch(`/api/manager/requests/${id}`,{
        method:"PATCH", headers:{ Authorization:`Bearer ${token}`,"Content-Type":"application/json" },
        body: JSON.stringify({ status, priority, type:reqType, price:price?Number(price)*100:null, managerNote:note }),
      });
      if(res.ok){ const d=await res.json(); setReq(d); }
    } finally { setSaving(false); }
  }

  async function updateStage(stageId:string, st:StageStatus){
    await fetch(`/api/manager/stages/${stageId}`,{
      method:"PATCH", headers:{ Authorization:`Bearer ${token}`,"Content-Type":"application/json" },
      body: JSON.stringify({ status:st }),
    });
    loadReq(token);
  }

  async function addSubTask(stageId:string){
    const title = (subInput[stageId]??"").trim();
    if(!title) return;
    setSubSaving(stageId);
    try {
      const res = await fetch(`/api/manager/requests/${id}/subtasks`,{
        method:"POST", headers:{ Authorization:`Bearer ${token}`,"Content-Type":"application/json" },
        body: JSON.stringify({ stageId, title }),
      });
      if(res.ok){ setSubInput(s=>({...s,[stageId]:""})); loadReq(token); }
    } finally { setSubSaving(null); }
  }

  async function toggleSubTask(subId:string, isCompleted:boolean){
    await fetch(`/api/manager/subtasks/${subId}`,{
      method:"PATCH", headers:{ Authorization:`Bearer ${token}`,"Content-Type":"application/json" },
      body: JSON.stringify({ isCompleted }),
    });
    loadReq(token);
  }

  async function deleteSubTask(subId:string){
    await fetch(`/api/manager/subtasks/${subId}`,{
      method:"DELETE", headers:{ Authorization:`Bearer ${token}` },
    });
    loadReq(token);
  }

  async function uploadFile(e:React.ChangeEvent<HTMLInputElement>){
    const file = e.target.files?.[0]; if(!file) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch(`/api/manager/requests/${id}/files`,{
        method:"POST", headers:{ Authorization:`Bearer ${token}` }, body:fd,
      });
      if(res.ok) loadReq(token);
    } finally { setUploading(false); if(fileRef.current) fileRef.current.value=""; }
  }

  async function buildProject(){
    if(!pbTitle.trim()||stageList.some(s=>!s.title.trim())) return;
    setPbSav(true);
    try {
      const res = await fetch(`/api/manager/requests/${id}/project`,{
        method:"POST", headers:{ Authorization:`Bearer ${token}`,"Content-Type":"application/json" },
        body: JSON.stringify({ title:pbTitle, startDate:pbStart||null, endDate:pbEnd||null,
          stages:stageList.map(s=>({ title:s.title, description:s.desc||null })) }),
      });
      if(res.ok){ setShowPB(false); loadReq(token); }
    } finally { setPbSav(false); }
  }

  async function sendMsg(){
    if(!msg.trim()) return;
    setSend(true);
    try {
      const res = await fetch(`/api/manager/requests/${id}/chat`,{
        method:"POST", headers:{ Authorization:`Bearer ${token}`,"Content-Type":"application/json" },
        body: JSON.stringify({ text:msg }),
      });
      if(res.ok){ const m=await res.json(); setMsg(""); setChat(c=>[...c,m]); }
    } finally { setSend(false); }
  }

  /* ── Loading / not found ── */
  if(loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="w-5 h-5 animate-spin" style={{ color:"var(--muted-foreground)" }} />
    </div>
  );
  if(!req) return (
    <div className="flex h-screen items-center justify-center text-sm" style={{ color:"var(--priority-urgent)" }}>
      Заявка не найдена
    </div>
  );

  const sc      = SC[req.status as Status] ?? "var(--primary)";
  const stages  = req.project?.stages??[];
  const allSubs = stages.flatMap((s:any)=>s.subtasks??[]);
  const doneSubs= allSubs.filter((s:any)=>s.isCompleted).length;
  const doneStg = stages.filter((s:any)=>s.status==="COMPLETED").length;
  const pct     = stages.length ? Math.round(doneStg/stages.length*100) : 0;
  const active  = stages.find((s:any)=>s.status==="IN_PROGRESS");
  const files   = req.files??[];
  const unread  = chat.filter(m=>m.role==="client").length;

  const timeline: {label:string; ts:string|null; color:string}[] = [
    { label:"Заявка создана",   ts:req.createdAt,   color:"var(--status-new)" },
    { label:"На рассмотрении",  ts:req.reviewedAt,  color:"var(--status-review)" },
    { label:"Одобрена",         ts:req.approvedAt,  color:"var(--status-approved)" },
    { label:"Взята в работу",   ts:req.startedAt,   color:"var(--status-progress)" },
    { label:"Завершена",        ts:req.completedAt, color:"var(--status-completed)" },
    { label:"Отменена",         ts:req.cancelledAt, color:"var(--status-cancelled)" },
  ].filter(e=>e.ts);

  return (
    <div className="flex h-screen overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className="w-[200px] flex-shrink-0 flex flex-col justify-between py-5 px-3"
        style={{ background:"var(--card)", borderRight:"1px solid var(--border)" }}>
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2.5 px-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
              style={{ background:"rgba(45,212,191,0.12)", border:"1px solid rgba(45,212,191,0.2)", color:"var(--primary)" }}>
              OS
            </div>
            <div>
              <div className="text-sm font-bold leading-none">OneStack</div>
              <div className="text-[10px] mt-0.5" style={{ color:"var(--muted-foreground)" }}>CRM</div>
            </div>
          </div>

          <div className="h-px mb-3" style={{ background:"var(--border)" }} />

          <Link href="/crm/dashboard"
            className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs transition-colors hover:bg-white/5"
            style={{ color:"var(--muted-foreground)" }}>
            <ArrowLeft className="w-3.5 h-3.5" />
            Все заявки
          </Link>

          <div className="h-px my-3" style={{ background:"var(--border)" }} />

          {/* Current request info */}
          <div className="rounded-xl p-3 text-xs" style={{ background:"rgba(255,255,255,0.025)", border:"1px solid var(--border)" }}>
            <div className="text-[10px] font-bold uppercase tracking-[0.8px] mb-2" style={{ color:"var(--muted-foreground)" }}>
              Текущая заявка
            </div>
            <div className="font-bold mb-1" style={{ color:"var(--primary)" }}>{orderNo(req.id)}</div>
            <div className="font-semibold text-sm mb-0.5">{req.user?.name??req.user?.email?.split("@")[0]}</div>
            {req.user?.company && <div className="text-[11px] mb-2" style={{ color:"var(--muted-foreground)" }}>{req.user.company}</div>}
            <div className="flex items-center gap-1.5 mt-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background:sc }} />
              <span className="font-bold text-[11px]" style={{ color:sc }}>{SL[req.status as Status]}</span>
            </div>
            {req.price && (
              <div className="font-black text-sm mt-1.5" style={{ color:"var(--priority-high)" }}>{fmtRub(req.price)}</div>
            )}
          </div>
        </div>

        <div>
          <div className="h-px mb-3" style={{ background:"var(--border)" }} />
          <button onClick={()=>{localStorage.removeItem("mgr_token");router.push("/crm");}}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors hover:bg-white/5"
            style={{ background:"transparent", color:"var(--muted-foreground)" }}>
            <LogOut className="w-3.5 h-3.5" />
            Выйти
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="flex items-center justify-between px-6 py-4 flex-shrink-0 gap-4"
          style={{ borderBottom:"1px solid var(--border)" }}>
          <div className="flex items-center gap-4 min-w-0">
            {/* Service icon */}
            <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-sm"
              style={{ background:`color-mix(in oklch,${sc} 10%,transparent)`, border:`1px solid color-mix(in oklch,${sc} 20%,transparent)`, color:sc }}>
              {(req.service??"?").slice(0,2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-black tracking-tight truncate">
                {req.project?.title||SVC_N[req.service]||req.service}
              </h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs font-mono" style={{ color:"var(--muted-foreground)" }}>{orderNo(req.id)}</span>
                <span style={{ color:"var(--border)" }}>·</span>
                <span className="text-xs" style={{ color:"var(--muted-foreground)" }}>Подано {fd(req.createdAt)}</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md"
                  style={{ background:`color-mix(in oklch,${PC[req.priority as Priority]??"var(--primary)"} 12%,transparent)`,
                    border:`1px solid color-mix(in oklch,${PC[req.priority as Priority]??"var(--primary)"} 25%,transparent)`,
                    color:PC[req.priority as Priority] }}>
                  {PL[req.priority as Priority]??req.priority}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-md" style={{ background:"rgba(255,255,255,0.06)", color:"var(--muted-foreground)" }}>
                  {TL[req.type as ReqType]??req.type}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {files.length>0 && (
              <span className="flex items-center gap-1 text-xs" style={{ color:"var(--muted-foreground)" }}>
                <Paperclip className="w-3.5 h-3.5" />{files.length}
              </span>
            )}
            {/* Status pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background:`color-mix(in oklch,${sc} 10%,transparent)`, border:`1px solid color-mix(in oklch,${sc} 25%,transparent)` }}>
              <div className="w-2 h-2 rounded-full" style={{ background:sc, boxShadow:`0 0 6px ${sc}` }} />
              <span className="text-sm font-bold" style={{ color:sc }}>{SL[req.status as Status]}</span>
            </div>
          </div>
        </header>

        {/* Progress bar */}
        {stages.length>0 && (
          <div className="px-6 py-3 flex-shrink-0" style={{ borderBottom:"1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3 flex-wrap">
                {active && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full"
                    style={{ background:"rgba(251,191,36,0.1)", border:"1px solid rgba(251,191,36,0.2)", color:"var(--status-review)" }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background:"var(--status-review)" }} />
                    В работе: {active.title}
                  </span>
                )}
                <span className="text-xs" style={{ color:"var(--muted-foreground)" }}>
                  {doneStg}/{stages.length} этапов
                  {allSubs.length>0 && ` · ${doneSubs}/${allSubs.length} задач`}
                </span>
              </div>
              <span className="text-base font-black" style={{ color:sc }}>{pct}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,0.06)" }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width:`${pct}%`, background:sc }} />
            </div>
          </div>
        )}

        {/* Body grid */}
        <div className="flex-1 overflow-auto">
          <div className="grid gap-5 p-6" style={{ gridTemplateColumns:"1fr 360px", alignItems:"start" }}>

            {/* ── LEFT column ── */}
            <div className="flex flex-col gap-4">

              {/* Client */}
              <div className="rounded-xl p-5" style={{ background:"rgba(255,255,255,0.025)", border:"1px solid var(--border)" }}>
                <SectionLabel>Клиент</SectionLabel>
                <div className="flex items-center gap-3 mb-4 pb-4" style={{ borderBottom:"1px solid var(--border)" }}>
                  <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-lg"
                    style={{ background:"rgba(45,212,191,0.1)", border:"1px solid rgba(45,212,191,0.18)", color:"var(--primary)" }}>
                    {(req.user?.name||(req.user?.email??"?")).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-base">{req.user?.name??"—"}</div>
                    {req.user?.company && <div className="text-xs font-semibold mt-0.5" style={{ color:"var(--primary)" }}>{req.user.company}</div>}
                  </div>
                </div>
                <FieldRow label="Email"   value={req.user?.email} />
                <FieldRow label="Телефон" value={req.user?.phone} />
                <FieldRow label="Баланс"  value={req.user?.balance!=null?`₽ ${(req.user.balance/100).toLocaleString("ru")}`:null} accent="var(--priority-high)" />
              </div>

              {/* Request details */}
              <div className="rounded-xl p-5" style={{ background:"rgba(255,255,255,0.025)", border:"1px solid var(--border)" }}>
                <SectionLabel>Детали заявки</SectionLabel>
                <FieldRow label="Тип услуги" value={SVC_N[req.service]??req.service} />
                {req.features?.length>0 && (
                  <div className="pt-3">
                    <div className="text-[10px] font-bold uppercase tracking-[0.8px] mb-2" style={{ color:"var(--muted-foreground)" }}>Включено</div>
                    <div className="flex flex-wrap gap-1.5">
                      {(req.features as string[]).map((f:string,i:number)=>(
                        <span key={i} className="text-xs px-2.5 py-1 rounded-full"
                          style={{ background:"rgba(45,212,191,0.08)", border:"1px solid rgba(45,212,191,0.18)", color:"var(--primary)" }}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {req.message && (
                  <div className="pt-3 mt-3" style={{ borderTop:"1px solid var(--border)" }}>
                    <div className="text-[10px] font-bold uppercase tracking-[0.8px] mb-2" style={{ color:"var(--muted-foreground)" }}>Описание</div>
                    <p className="text-sm leading-relaxed m-0" style={{ color:"rgba(244,250,248,0.8)" }}>{req.message}</p>
                  </div>
                )}
              </div>

              {/* Stages */}
              {req.project ? (
                <div className="rounded-xl p-5" style={{ background:"rgba(255,255,255,0.025)", border:"1px solid var(--border)" }}>
                  <div className="flex justify-between items-center mb-4">
                    <SectionLabel>Этапы и задачи</SectionLabel>
                    <button onClick={()=>setShowPB(true)}
                      className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors hover:bg-white/10"
                      style={{ background:"rgba(255,255,255,0.06)", border:"1px solid var(--border)", color:"var(--muted-foreground)" }}>
                      Изменить
                    </button>
                  </div>
                  <div className="flex flex-col">
                    {stages.map((s:any, i:number)=>{
                      const ssc    = SSC[s.status as StageStatus];
                      const isDone = s.status==="COMPLETED";
                      const isAct  = s.status==="IN_PROGRESS";
                      const subs   = s.subtasks??[];
                      const doneS  = subs.filter((x:any)=>x.isCompleted).length;
                      return (
                        <div key={s.id} className="flex gap-4">
                          {/* Timeline dot */}
                          <div className="flex flex-col items-center w-8 flex-shrink-0">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
                              style={{ background:`color-mix(in oklch,${ssc} 12%,transparent)`, border:`2px solid ${ssc}`, color:ssc }}>
                              {isDone ? "✓" : i+1}
                            </div>
                            {i<stages.length-1 && (
                              <div className="w-0.5 flex-1 my-1" style={{ background:isDone?"rgba(52,211,153,0.2)":"rgba(255,255,255,0.06)", minHeight:16 }} />
                            )}
                          </div>
                          {/* Content */}
                          <div className="flex-1 pt-1" style={{ paddingBottom:i<stages.length-1?20:0 }}>
                            <div className="flex justify-between items-start gap-3 mb-2">
                              <span className="text-sm font-medium" style={{ color:isDone?"var(--foreground)":isAct?"var(--status-review)":"rgba(244,250,248,0.55)" }}>
                                {s.title}
                                {subs.length>0 && (
                                  <span className="ml-2 text-[11px]" style={{ color:"var(--muted-foreground)" }}>{doneS}/{subs.length}</span>
                                )}
                              </span>
                              <select value={s.status} onChange={e=>updateStage(s.id,e.target.value as StageStatus)}
                                className="text-[11px] font-bold px-2.5 py-1 rounded-lg flex-shrink-0 cursor-pointer outline-none"
                                style={{ background:`color-mix(in oklch,${ssc} 12%,transparent)`, border:`1px solid color-mix(in oklch,${ssc} 28%,transparent)`, color:ssc }}>
                                <option value="PENDING">Ожидает</option>
                                <option value="IN_PROGRESS">В работе</option>
                                <option value="COMPLETED">Выполнен</option>
                              </select>
                            </div>
                            {s.description && <p className="text-xs mb-2 leading-relaxed" style={{ color:"var(--muted-foreground)" }}>{s.description}</p>}
                            {s.completedAt && (
                              <div className="flex items-center gap-1.5 text-[11px] mb-2" style={{ color:"var(--status-completed)" }}>
                                <CheckCircle2 className="w-3 h-3" />
                                Завершён {fShort(s.completedAt)}
                              </div>
                            )}
                            {/* Subtasks */}
                            {subs.length>0 && (
                              <div className="flex flex-col gap-1 mb-2">
                                {subs.map((sub:any)=>(
                                  <div key={sub.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                                    style={{ background:"rgba(255,255,255,0.025)" }}>
                                    <input type="checkbox" checked={sub.isCompleted}
                                      onChange={e=>toggleSubTask(sub.id,e.target.checked)}
                                      className="w-3.5 h-3.5 cursor-pointer flex-shrink-0"
                                      style={{ accentColor:"var(--status-completed)" }} />
                                    <span className="text-xs flex-1" style={{ color:sub.isCompleted?"var(--muted-foreground)":"rgba(244,250,248,0.75)", textDecoration:sub.isCompleted?"line-through":"none" }}>
                                      {sub.title}
                                    </span>
                                    <button onClick={()=>deleteSubTask(sub.id)}
                                      className="opacity-30 hover:opacity-70 transition-opacity flex-shrink-0"
                                      style={{ background:"transparent", border:"none", color:"var(--foreground)", cursor:"pointer" }}>
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                            {/* Add subtask */}
                            <div className="flex gap-2">
                              <input value={subInput[s.id]??""} onChange={e=>setSubInput(si=>({...si,[s.id]:e.target.value}))}
                                className="flex-1 text-xs px-3 py-1.5 rounded-lg outline-none transition-colors"
                                style={{ background:"rgba(255,255,255,0.04)", border:"1px solid var(--border)", color:"var(--foreground)" }}
                                placeholder="+ Добавить задачу..."
                                onKeyDown={e=>e.key==="Enter"&&addSubTask(s.id)}
                                onFocus={e=>(e.target.style.borderColor="rgba(45,212,191,0.35)")}
                                onBlur={e=>(e.target.style.borderColor="var(--border)")} />
                              <button onClick={()=>addSubTask(s.id)}
                                disabled={subSaving===s.id||!(subInput[s.id]??"").trim()}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-opacity disabled:opacity-30"
                                style={{ background:"rgba(45,212,191,0.1)", border:"1px solid rgba(45,212,191,0.2)", color:"var(--primary)", cursor:"pointer" }}>
                                {subSaving===s.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl p-5" style={{ background:"rgba(45,212,191,0.03)", border:"1px solid rgba(45,212,191,0.15)" }}>
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center"
                      style={{ background:"rgba(45,212,191,0.1)", border:"1px solid rgba(45,212,191,0.2)", color:"var(--primary)" }}>
                      <FolderOpen className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-base mb-1">Создайте проект</div>
                      <p className="text-sm leading-relaxed mb-4" style={{ color:"var(--muted-foreground)" }}>
                        Добавьте этапы и подзадачи — клиент увидит прогресс в реальном времени.
                      </p>
                      <button onClick={()=>setShowPB(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
                        style={{ background:"var(--primary)", color:"var(--primary-foreground)" }}>
                        <Plus className="w-4 h-4" />
                        Создать проект с этапами
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT column ── */}
            <div className="flex flex-col">
              {/* Tabs */}
              <div className="flex overflow-hidden rounded-t-xl" style={{ background:"var(--card)", border:"1px solid var(--border)", borderBottom:"none" }}>
                {([
                  ["control",  <Settings2 key="s" className="w-3.5 h-3.5" />,   "Правка"],
                  ["chat",     <MessageSquare key="m" className="w-3.5 h-3.5" />, unread>0 ? `Чат (${unread})` : "Чат"],
                  ["files",    <Paperclip key="p" className="w-3.5 h-3.5" />,   files.length>0 ? `Файлы ${files.length}` : "Файлы"],
                  ["timeline", <BarChart3 key="b" className="w-3.5 h-3.5" />,   "История"],
                ] as const).map(([tid, icon, label]) => {
                  const act = rightTab === tid;
                  return (
                    <button key={tid} onClick={()=>setRightTab(tid as any)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-colors"
                      style={{
                        background: act ? "rgba(45,212,191,0.05)" : "transparent",
                        color:      act ? "var(--primary)" : "var(--muted-foreground)",
                        borderBottom: `2px solid ${act ? "var(--primary)" : "transparent"}`,
                        border:     "none",
                        borderBottomWidth: 2,
                        borderBottomStyle:"solid" as any,
                        borderBottomColor: act ? "var(--primary)" : "transparent",
                        cursor:"pointer",
                      }}>
                      {icon}
                      <span className="hidden sm:inline">{label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab content */}
              <div className="rounded-b-xl p-5 flex-1" style={{ background:"rgba(255,255,255,0.025)", border:"1px solid var(--border)", borderTop:"none" }}>

                {/* ── CONTROL ── */}
                {rightTab==="control" && (
                  <div className="flex flex-col gap-4">
                    {/* Status */}
                    <div>
                      <SectionLabel>Статус</SectionLabel>
                      <div className="flex flex-col gap-1.5">
                        {(Object.keys(SL) as Status[]).map(s=>{
                          const c=SC[s]; const sel=status===s;
                          return (
                            <button key={s} onClick={()=>setStatus(s)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all cursor-pointer"
                              style={{ background:sel?`color-mix(in oklch,${c} 10%,transparent)`:"rgba(255,255,255,0.025)", border:`1px solid ${sel?`color-mix(in oklch,${c} 28%,transparent)`:"var(--border)"}` }}>
                              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background:sel?c:"rgba(255,255,255,0.15)" }} />
                              <span className="text-sm" style={{ color:sel?c:"var(--muted-foreground)", fontWeight:sel?700:400 }}>{SL[s]}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Priority */}
                    <div>
                      <SectionLabel>Приоритет</SectionLabel>
                      <div className="grid grid-cols-2 gap-1.5">
                        {(["LOW","MEDIUM","HIGH","URGENT"] as Priority[]).map(pr=>{
                          const c=PC[pr]; const sel=priority===pr;
                          return (
                            <button key={pr} onClick={()=>setPriority(pr)}
                              className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer"
                              style={{ background:sel?`color-mix(in oklch,${c} 12%,transparent)`:"rgba(255,255,255,0.025)", border:`1px solid ${sel?`color-mix(in oklch,${c} 28%,transparent)`:"var(--border)"}`, color:sel?c:"var(--muted-foreground)", fontWeight:sel?700:400 }}>
                              {pr==="URGENT" && <Flame className="w-3 h-3" />}
                              {pr==="HIGH"   && <AlertCircle className="w-3 h-3" />}
                              {PL[pr]}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Type */}
                    <div>
                      <SectionLabel>Тип</SectionLabel>
                      <select value={reqType} onChange={e=>setReqType(e.target.value as ReqType)}
                        className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors"
                        style={{ background:"rgba(255,255,255,0.04)", border:"1px solid var(--border)", color:"var(--foreground)" }}>
                        {(Object.keys(TL) as ReqType[]).map(t=>(
                          <option key={t} value={t}>{TL[t]}</option>
                        ))}
                      </select>
                    </div>

                    {/* Price */}
                    <div>
                      <SectionLabel>Стоимость (₽)</SectionLabel>
                      <input type="number" value={price} onChange={e=>setPrice(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors"
                        style={{ background:"rgba(255,255,255,0.04)", border:"1px solid var(--border)", color:"var(--foreground)" }}
                        placeholder="0" min={0}
                        onFocus={e=>(e.target.style.borderColor="rgba(45,212,191,0.4)")}
                        onBlur={e=>(e.target.style.borderColor="var(--border)")} />
                    </div>

                    {/* Note */}
                    <div>
                      <SectionLabel>Внутренняя заметка</SectionLabel>
                      <textarea value={note} onChange={e=>setNote(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors resize-y"
                        style={{ background:"rgba(255,255,255,0.04)", border:"1px solid var(--border)", color:"var(--foreground)", minHeight:80 }}
                        placeholder="Видно только вам..."
                        onFocus={e=>(e.target.style.borderColor="rgba(45,212,191,0.4)")}
                        onBlur={e=>(e.target.style.borderColor="var(--border)")} />
                    </div>

                    <button onClick={saveStatus} disabled={saving}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50 cursor-pointer"
                      style={{ background:"var(--primary)", color:"var(--primary-foreground)" }}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Сохранить изменения"}
                    </button>

                    <button onClick={()=>window.open(`/crm/requests/${id}/print`,"_blank")}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-white/5"
                      style={{ background:"transparent", border:"1px solid var(--border)", color:"var(--muted-foreground)", cursor:"pointer" }}>
                      <Printer className="w-4 h-4" />
                      Открыть для печати
                    </button>
                  </div>
                )}

                {/* ── CHAT ── */}
                {rightTab==="chat" && (
                  <div className="flex flex-col" style={{ minHeight:320 }}>
                    <div ref={chatRef} className="flex flex-col gap-2.5 mb-3 overflow-y-auto" style={{ maxHeight:360 }}>
                      {chat.length===0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center gap-2">
                          <MessageSquare className="w-8 h-8 opacity-20" />
                          <p className="text-sm" style={{ color:"var(--muted-foreground)" }}>Нет сообщений</p>
                          <p className="text-xs" style={{ color:"var(--muted-foreground)" }}>Начните диалог с клиентом</p>
                        </div>
                      ) : chat.map(m=>{
                        const isMgr = m.role==="manager";
                        return (
                          <div key={m.id} className={`flex ${isMgr?"justify-end":"justify-start"}`}>
                            <div className="max-w-[82%] px-3.5 py-2.5 rounded-xl"
                              style={{
                                background:isMgr?"rgba(45,212,191,0.08)":"rgba(255,255,255,0.05)",
                                border:`1px solid ${isMgr?"rgba(45,212,191,0.2)":"var(--border)"}`,
                                borderRadius:isMgr?"14px 4px 14px 14px":"4px 14px 14px 14px",
                              }}>
                              <p className="text-sm leading-relaxed m-0">{m.text}</p>
                              <div className="flex justify-between gap-3 mt-1.5 text-[10px]" style={{ color:"var(--muted-foreground)" }}>
                                <span>{isMgr?"Менеджер":"Клиент"}</span>
                                <span>{ft(m.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex gap-2 pt-2" style={{ borderTop:"1px solid var(--border)" }}>
                      <input value={msg} onChange={e=>setMsg(e.target.value)}
                        className="flex-1 px-3 py-2.5 rounded-lg text-sm outline-none transition-colors"
                        style={{ background:"rgba(255,255,255,0.04)", border:"1px solid var(--border)", color:"var(--foreground)" }}
                        placeholder="Написать клиенту..."
                        onFocus={e=>(e.target.style.borderColor="rgba(45,212,191,0.4)")}
                        onBlur={e=>(e.target.style.borderColor="var(--border)")}
                        onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),sendMsg())} />
                      <button onClick={sendMsg} disabled={sending||!msg.trim()}
                        className="px-4 rounded-lg transition-all disabled:opacity-30 flex-shrink-0 cursor-pointer"
                        style={{ background:"var(--primary)", color:"var(--primary-foreground)", border:"none" }}>
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ── FILES ── */}
                {rightTab==="files" && (
                  <div className="flex flex-col gap-3">
                    <input ref={fileRef} type="file" className="hidden" onChange={uploadFile} />
                    <button onClick={()=>fileRef.current?.click()} disabled={uploading}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50 cursor-pointer hover:opacity-90"
                      style={{ background:"rgba(45,212,191,0.08)", border:"1px solid rgba(45,212,191,0.2)", color:"var(--primary)" }}>
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Paperclip className="w-4 h-4" />Прикрепить файл</>}
                    </button>
                    {files.length===0 ? (
                      <div className="flex flex-col items-center py-10 gap-2">
                        <FolderOpen className="w-8 h-8 opacity-20" />
                        <p className="text-sm" style={{ color:"var(--muted-foreground)" }}>Нет файлов</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        {files.map((f:any)=>(
                          <a key={f.id} href={f.url} target="_blank" rel="noopener"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-white/5"
                            style={{ background:"rgba(255,255,255,0.03)", border:"1px solid var(--border)", textDecoration:"none" }}>
                            <div className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-black"
                              style={{ background:"rgba(255,255,255,0.06)", color:"var(--muted-foreground)" }}>
                              {f.mimeType?.startsWith("image") ? "IMG" : f.mimeType?.includes("pdf") ? "PDF" : "DOC"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">{f.name}</div>
                              <div className="text-[11px] mt-0.5" style={{ color:"var(--muted-foreground)" }}>
                                {fmtBytes(f.size)} · {f.uploadedBy==="manager"?"Менеджер":"Клиент"} · {fShort(f.createdAt)}
                              </div>
                            </div>
                            <span className="text-xs flex-shrink-0" style={{ color:"var(--primary)" }}>↗</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── TIMELINE ── */}
                {rightTab==="timeline" && (
                  <div>
                    <SectionLabel>История статусов</SectionLabel>
                    {timeline.length===0 ? (
                      <div className="text-center py-10 text-sm" style={{ color:"var(--muted-foreground)" }}>Нет данных</div>
                    ) : (
                      <div className="relative">
                        <div className="absolute left-[11px] top-3 bottom-3 w-0.5 rounded-full" style={{ background:"rgba(255,255,255,0.05)" }} />
                        <div className="flex flex-col gap-0">
                          {timeline.map((e, i)=>(
                            <div key={i} className="flex gap-4" style={{ paddingBottom:i<timeline.length-1?18:0 }}>
                              <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 z-10"
                                style={{ background:`color-mix(in oklch,${e.color} 12%,transparent)`, border:`2px solid ${e.color}` }}>
                                <div className="w-1.5 h-1.5 rounded-full" style={{ background:e.color }} />
                              </div>
                              <div className="pt-0.5">
                                <div className="text-sm font-medium mb-0.5">{e.label}</div>
                                <div className="text-[11px]" style={{ color:"var(--muted-foreground)" }}>
                                  {new Date(e.ts!).toLocaleDateString("ru-RU",{day:"2-digit",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"})}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {req.startedAt && req.completedAt && (
                      <div className="mt-5 p-4 rounded-xl" style={{ background:"rgba(52,211,153,0.06)", border:"1px solid rgba(52,211,153,0.15)" }}>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold mb-1.5" style={{ color:"var(--status-completed)" }}>
                          <Clock className="w-3 h-3" />
                          Время выполнения
                        </div>
                        <div className="text-lg font-black">
                          {Math.ceil((new Date(req.completedAt).getTime()-new Date(req.startedAt).getTime())/86400000)} дней
                        </div>
                        <div className="text-xs mt-0.5" style={{ color:"var(--muted-foreground)" }}>от старта до завершения</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Project Builder Modal ── */}
      {showPB && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5"
          style={{ background:"rgba(0,0,0,0.75)", backdropFilter:"blur(4px)" }}
          onClick={()=>setShowPB(false)}>
          <div className="w-full max-w-lg rounded-2xl p-7 overflow-y-auto" style={{ maxHeight:"90vh", background:"#0d1c18", border:"1px solid var(--border)" }}
            onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="text-lg font-black">Проект и этапы работ</div>
                <div className="text-xs mt-1" style={{ color:"var(--muted-foreground)" }}>Клиент увидит прогресс в реальном времени</div>
              </div>
              <button onClick={()=>setShowPB(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
                style={{ background:"rgba(255,255,255,0.06)", border:"none", color:"var(--muted-foreground)", cursor:"pointer" }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <SectionLabel>Название проекта *</SectionLabel>
                <input className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background:"rgba(255,255,255,0.04)", border:"1px solid var(--border)", color:"var(--foreground)" }}
                  value={pbTitle} onChange={e=>setPbTitle(e.target.value)}
                  placeholder="Разработка корпоративного сайта"
                  onFocus={e=>(e.target.style.borderColor="rgba(45,212,191,0.4)")}
                  onBlur={e=>(e.target.style.borderColor="var(--border)")} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <SectionLabel>Дата начала</SectionLabel>
                  <input type="date" className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                    style={{ background:"rgba(255,255,255,0.04)", border:"1px solid var(--border)", color:"var(--foreground)" }}
                    value={pbStart} onChange={e=>setPbStart(e.target.value)} />
                </div>
                <div>
                  <SectionLabel>Дата сдачи</SectionLabel>
                  <input type="date" className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                    style={{ background:"rgba(255,255,255,0.04)", border:"1px solid var(--border)", color:"var(--foreground)" }}
                    value={pbEnd} onChange={e=>setPbEnd(e.target.value)} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <SectionLabel>Этапы работ</SectionLabel>
                  <button onClick={()=>setSL2(s=>[...s,{title:"",desc:""}])}
                    className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors hover:bg-white/10"
                    style={{ background:"rgba(255,255,255,0.06)", border:"1px solid var(--border)", color:"var(--muted-foreground)", cursor:"pointer" }}>
                    <Plus className="w-3 h-3" />
                    Этап
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {stageList.map((s,i)=>(
                    <div key={i} className="rounded-xl p-3.5" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid var(--border)" }}>
                      <div className="flex gap-2.5 mb-2">
                        <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-black"
                          style={{ background:"rgba(45,212,191,0.1)", border:"1px solid rgba(45,212,191,0.18)", color:"var(--primary)" }}>
                          {i+1}
                        </div>
                        <input className="flex-1 px-3 py-1.5 rounded-lg text-sm outline-none"
                          style={{ background:"rgba(255,255,255,0.04)", border:"1px solid var(--border)", color:"var(--foreground)" }}
                          value={s.title} onChange={e=>setSL2(a=>a.map((x,j)=>j===i?{...x,title:e.target.value}:x))}
                          placeholder={`Этап ${i+1}...`} />
                        {stageList.length>1 && (
                          <button onClick={()=>setSL2(a=>a.filter((_,j)=>j!==i))}
                            className="flex-shrink-0 opacity-50 hover:opacity-80 transition-opacity"
                            style={{ background:"transparent", border:"none", color:"var(--priority-urgent)", cursor:"pointer" }}>
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <input className="w-full px-3 py-1.5 rounded-lg text-xs outline-none"
                        style={{ background:"rgba(255,255,255,0.04)", border:"1px solid var(--border)", color:"var(--foreground)" }}
                        value={s.desc} onChange={e=>setSL2(a=>a.map((x,j)=>j===i?{...x,desc:e.target.value}:x))}
                        placeholder="Описание (необязательно)" />
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={buildProject}
                disabled={pbSaving||!pbTitle.trim()||stageList.some(s=>!s.title.trim())}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-40 cursor-pointer"
                style={{ background:"var(--primary)", color:"var(--primary-foreground)", border:"none" }}>
                {pbSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" />Создать проект</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
