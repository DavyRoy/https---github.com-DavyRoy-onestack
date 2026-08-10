"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Status = "NEW"|"IN_REVIEW"|"APPROVED"|"IN_PROGRESS"|"COMPLETED"|"CANCELLED";
const SL: Record<Status,string> = {
  NEW:"Новая", IN_REVIEW:"На рассмотрении", APPROVED:"Одобрена",
  IN_PROGRESS:"В работе", COMPLETED:"Выполнена", CANCELLED:"Отменена",
};
const SVC_N: Record<string,string> = {
  sites:"Разработка сайта", webapp:"Веб-приложение", mobile:"Мобильное приложение",
  complex:"Разработка полного стека", redesign:"Редизайн / UI-UX", support:"Техническая поддержка",
};

function orderNo(id: string) { return "OS-" + id.replace(/-/g,"").slice(0,8).toUpperCase(); }
function fd(d: string) {
  return new Date(d).toLocaleDateString("ru-RU",{day:"2-digit",month:"long",year:"numeric"});
}
function fmtRub(v: number) { return `${(v/100).toLocaleString("ru")} руб.`; }

export default function PrintPage() {
  const { id } = useParams<{ id: string }>();
  const [req, setReq]     = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("mgr_token") ?? "";
    if (!token) { setError("Не авторизован"); return; }
    fetch(`/api/manager/requests/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.error) setError(d.error); else setReq(d); })
      .catch(() => setError("Ошибка загрузки"));
  }, [id]);

  useEffect(() => {
    if (req) setTimeout(() => window.print(), 600);
  }, [req]);

  if (error) return <div style={{ padding:40, fontFamily:"serif", color:"red" }}>Ошибка: {error}</div>;
  if (!req)  return <div style={{ padding:40, fontFamily:"serif", color:"#666" }}>Загрузка...</div>;

  const stages  = req.project?.stages ?? [];
  const done    = stages.filter((s:any) => s.status === "COMPLETED").length;
  const pct     = stages.length ? Math.round(done/stages.length*100) : 0;

  return (
    <>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:#fff; color:#0f0f0f; font-family:'Times New Roman',Times,serif; }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          @page { margin: 20mm 18mm; size: A4; }
        }
        @media screen { body { max-width: 800px; margin: 0 auto; padding: 40px 20px; } }
      `}</style>

      {/* Print button — hidden on print */}
      <div className="no-print" style={{ marginBottom:24, display:"flex", gap:10 }}>
        <button onClick={() => window.print()}
          style={{ background:"#07100e",color:"#fff",border:"none",borderRadius:8,padding:"10px 22px",fontSize:14,cursor:"pointer",fontFamily:"system-ui" }}>
          🖨 Распечатать
        </button>
        <button onClick={() => window.close()}
          style={{ background:"#f3f3f3",color:"#333",border:"none",borderRadius:8,padding:"10px 18px",fontSize:14,cursor:"pointer",fontFamily:"system-ui" }}>
          Закрыть
        </button>
      </div>

      {/* ══ DOCUMENT ══ */}
      <div style={{ border:"1px solid #ccc", borderRadius:4, padding:"40px 44px", minHeight:"95vh" }}>

        {/* Letterhead */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:32, paddingBottom:20, borderBottom:"2px solid #07100e" }}>
          <div>
            <div style={{ fontSize:24, fontWeight:700, color:"#07100e", letterSpacing:-0.5 }}>OneStack</div>
            <div style={{ fontSize:11, color:"#666", marginTop:3 }}>Разработка цифровых продуктов</div>
            <div style={{ fontSize:11, color:"#666", marginTop:1 }}>hello@onestack.ru · onestack24.ru</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:13, color:"#444", marginBottom:4 }}>НАРЯД-ЗАКАЗ</div>
            <div style={{ fontSize:22, fontWeight:700, color:"#07100e" }}>{orderNo(req.id)}</div>
            <div style={{ fontSize:11, color:"#666", marginTop:4 }}>от {fd(req.createdAt)}</div>
          </div>
        </div>

        {/* Parties */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32, marginBottom:28 }}>
          <div>
            <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:1, color:"#888", marginBottom:8, fontFamily:"system-ui" }}>ИСПОЛНИТЕЛЬ</div>
            <div style={{ fontSize:13, fontWeight:700 }}>ООО «OneStack»</div>
            <div style={{ fontSize:12, color:"#444", marginTop:3, lineHeight:1.7 }}>
              hello@onestack.ru<br/>
              onestack24.ru
            </div>
          </div>
          <div>
            <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:1, color:"#888", marginBottom:8, fontFamily:"system-ui" }}>ЗАКАЗЧИК</div>
            <div style={{ fontSize:13, fontWeight:700 }}>{req.user?.name ?? "—"}</div>
            <div style={{ fontSize:12, color:"#444", marginTop:3, lineHeight:1.7 }}>
              {req.user?.email}<br/>
              {req.user?.phone && <>{req.user.phone}<br/></>}
              {req.user?.company && req.user.company}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop:"1px solid #ddd", marginBottom:24 }} />

        {/* Subject */}
        <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:20 }}>
          <thead>
            <tr style={{ background:"#07100e", color:"#fff" }}>
              <th style={{ padding:"10px 14px", textAlign:"left", fontSize:12, fontFamily:"system-ui", fontWeight:600 }}>Предмет договора</th>
              <th style={{ padding:"10px 14px", textAlign:"left", fontSize:12, fontFamily:"system-ui", fontWeight:600, width:140 }}>Статус</th>
              <th style={{ padding:"10px 14px", textAlign:"right", fontSize:12, fontFamily:"system-ui", fontWeight:600, width:140 }}>Стоимость</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background:"#f9f9f9", borderBottom:"1px solid #eee" }}>
              <td style={{ padding:"12px 14px", fontSize:13 }}>
                <div style={{ fontWeight:700 }}>{req.project?.title || SVC_N[req.service] || req.service}</div>
                {req.project?.startDate && req.project?.endDate && (
                  <div style={{ fontSize:11, color:"#666", marginTop:3 }}>
                    {fd(req.project.startDate)} — {fd(req.project.endDate)}
                  </div>
                )}
              </td>
              <td style={{ padding:"12px 14px", fontSize:12, color:"#444" }}>
                {SL[req.status as Status]}
              </td>
              <td style={{ padding:"12px 14px", fontSize:14, fontWeight:700, textAlign:"right" }}>
                {req.price ? fmtRub(req.price) : "По договорённости"}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Work composition */}
        {(req.features?.length > 0 || stages.length > 0) && (
          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:1, color:"#888", marginBottom:12, fontFamily:"system-ui" }}>
              СОСТАВ РАБОТ
            </div>

            {req.features?.length > 0 && (
              <table style={{ width:"100%", borderCollapse:"collapse", marginBottom: stages.length > 0 ? 14 : 0 }}>
                <tbody>
                  {(req.features as string[]).map((f: string, i: number) => (
                    <tr key={i} style={{ borderBottom:"1px solid #f0f0f0" }}>
                      <td style={{ padding:"7px 14px 7px 0", fontSize:12, width:28, color:"#888" }}>{i+1}.</td>
                      <td style={{ padding:"7px 0", fontSize:12 }}>{f}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {stages.length > 0 && (
              <>
                <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:1, color:"#888", margin:"14px 0 10px", fontFamily:"system-ui" }}>
                  ЭТАПЫ ВЫПОЛНЕНИЯ
                </div>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead>
                    <tr style={{ background:"#f5f5f5", borderBottom:"1px solid #ddd" }}>
                      <th style={{ padding:"8px 10px", textAlign:"left", fontSize:11, fontFamily:"system-ui", fontWeight:600, width:28 }}>№</th>
                      <th style={{ padding:"8px 10px", textAlign:"left", fontSize:11, fontFamily:"system-ui", fontWeight:600 }}>Этап</th>
                      <th style={{ padding:"8px 10px", textAlign:"left", fontSize:11, fontFamily:"system-ui", fontWeight:600, width:120 }}>Статус</th>
                      <th style={{ padding:"8px 10px", textAlign:"right", fontSize:11, fontFamily:"system-ui", fontWeight:600, width:100 }}>Дата завершения</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stages.map((s: any, i: number) => {
                      const isDone = s.status === "COMPLETED";
                      const isAct  = s.status === "IN_PROGRESS";
                      return (
                        <tr key={s.id} style={{ borderBottom:"1px solid #f0f0f0", background: isDone?"#f0fff8": isAct?"#fffbf0":"#fff" }}>
                          <td style={{ padding:"9px 10px", fontSize:12, color:"#888" }}>{i+1}</td>
                          <td style={{ padding:"9px 10px" }}>
                            <div style={{ fontSize:12, fontWeight: isDone||isAct ? 600 : 400 }}>{s.title}</div>
                            {s.description && <div style={{ fontSize:10, color:"#888", marginTop:2 }}>{s.description}</div>}
                          </td>
                          <td style={{ padding:"9px 10px", fontSize:11, color: isDone?"#059669":isAct?"#d97706":"#666" }}>
                            {isDone ? "✓ Выполнен" : isAct ? "В работе" : "Ожидает"}
                          </td>
                          <td style={{ padding:"9px 10px", fontSize:11, textAlign:"right", color:"#666" }}>
                            {s.completedAt ? fd(s.completedAt) : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {pct > 0 && (
                  <div style={{ marginTop:12, fontSize:12, color:"#444", textAlign:"right" }}>
                    Общий прогресс: <strong>{pct}%</strong> ({done} из {stages.length} этапов)
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Description */}
        {req.message && (
          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:1, color:"#888", marginBottom:8, fontFamily:"system-ui" }}>ОПИСАНИЕ ЗАДАЧИ</div>
            <div style={{ fontSize:12, color:"#333", lineHeight:1.7, padding:"12px 14px", background:"#fafafa", border:"1px solid #eee", borderRadius:4 }}>
              {req.message}
            </div>
          </div>
        )}

        {/* Total */}
        {req.price && (
          <div style={{ borderTop:"2px solid #07100e", paddingTop:16, marginBottom:32 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
              <div style={{ fontSize:13, fontWeight:700 }}>ИТОГО к оплате:</div>
              <div style={{ fontSize:22, fontWeight:700, color:"#07100e" }}>{fmtRub(req.price)}</div>
            </div>
          </div>
        )}

        {/* Signatures */}
        <div style={{ marginTop:"auto", paddingTop:32 }}>
          <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:1, color:"#888", marginBottom:20, fontFamily:"system-ui" }}>ПОДПИСИ СТОРОН</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:40 }}>
            {["Исполнитель: ООО «OneStack»", `Заказчик: ${req.user?.name ?? ""}`.trim()].map((label, i) => (
              <div key={i}>
                <div style={{ fontSize:12, fontWeight:600, marginBottom:20 }}>{label}</div>
                <div style={{ borderTop:"1px solid #333", paddingTop:6, fontSize:10, color:"#888" }}>Подпись / Дата</div>
                <div style={{ borderTop:"1px solid #333", marginTop:32, paddingTop:6, fontSize:10, color:"#888" }}>ФИО / Печать</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop:40, paddingTop:12, borderTop:"1px solid #eee", display:"flex", justifyContent:"space-between" }}>
          <div style={{ fontSize:10, color:"#aaa" }}>Документ сформирован автоматически · OneStack CRM</div>
          <div style={{ fontSize:10, color:"#aaa" }}>{orderNo(req.id)} · {fd(req.createdAt)}</div>
        </div>
      </div>
    </>
  );
}
