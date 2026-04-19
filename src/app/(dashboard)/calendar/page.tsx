import { createSupabaseServerClient } from "@/lib/supabase/server";
import { format, isToday, isYesterday } from "date-fns";
import { vi } from "date-fns/locale";
import { GlobalInteractionModal } from "@/components/calendar/global-interaction-modal";
import { EditInteractionModal } from "@/components/interactions/edit-interaction-modal";
import { DeleteInteractionButton } from "@/components/interactions/delete-interaction-button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Lịch Trình • CRM Pro",
};

// Helper: Format date into beautiful grouping headers
function getDayGrouping(dateString: string) {
  const date = new Date(dateString);
  if (isToday(date)) return "Hôm nay";
  if (isYesterday(date)) return "Hôm qua";
  return format(date, "EEEE, dd/MM/yyyy", { locale: vi });
}

export default async function CalendarPage(props: {
  searchParams: Promise<{ query?: string; view?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const view = searchParams?.view || "timeline"; // 'timeline' | 'table' | 'grid'
  
  const supabase = await createSupabaseServerClient();

  // Fetch interactions and leads in parallel
  const [
    { data: rawEvents, error },
    { data: leadsData }
  ] = await Promise.all([
    supabase
      .from("interactions")
      .select(`*, leads ( full_name, position, phone )`)
      .in("type", ["meeting", "call"])
      .order("occurred_at", { ascending: false }),
    supabase
      .from("leads")
      .select("id, full_name")
      .order("full_name")
  ]);

  const leads = leadsData || [];

  if (error) {
    console.error("Lỗi lấy dữ liệu calendar:", error);
  }

  // Lọc theo search input (Tên hoặc SĐT)
  const events = (rawEvents || []).filter((e) => {
    if (!query) return true;
    const q = query.toLowerCase();
    const lead: any = e.leads;
    return (
      lead?.full_name?.toLowerCase().includes(q) ||
      lead?.phone?.toLowerCase().includes(q)
    );
  });

  // Group events by day (Dùng cho Timeline và Grid)
  const groupedEvents = events.reduce(
    (acc, event) => {
      const group = getDayGrouping(event.occurred_at);
      if (!acc[group]) acc[group] = [];
      acc[group].push(event);
      return acc;
    },
    {} as Record<string, typeof events>,
  );

  return (
    <main className="p-6 md:p-10 max-w-[1200px] mx-auto w-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="font-headline text-3xl font-medium text-terracotta tracking-tight">
            Lịch trình &amp; Công việc
          </h1>
          <p className="text-olive-gray mt-2 text-sm font-medium">
            Theo dõi các cuộc họp và gọi điện tư vấn gần đây của bạn.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* View Toggles */}
          <div className="flex items-center bg-white border border-border-warm rounded-full p-1 shadow-sm">
            <Link 
              href={`/calendar?view=timeline${query ? `&query=${query}` : ""}`}
              className={cn("p-1.5 rounded-full transition-all flex items-center justify-center", view === "timeline" ? "bg-pale-cyan text-focus-blue" : "text-stone-gray hover:text-near-black hover:bg-warm-sand")}
              title="Xem chuỗi sự kiện"
            >
              <span className="material-symbols-outlined text-[18px]">view_timeline</span>
            </Link>
            <Link 
              href={`/calendar?view=grid${query ? `&query=${query}` : ""}`}
              className={cn("p-1.5 rounded-full transition-all flex items-center justify-center", view === "grid" ? "bg-pale-cyan text-focus-blue" : "text-stone-gray hover:text-near-black hover:bg-warm-sand")}
              title="Xem dạng ô lưới"
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
            </Link>
            <Link 
              href={`/calendar?view=table${query ? `&query=${query}` : ""}`}
              className={cn("p-1.5 rounded-full transition-all flex items-center justify-center", view === "table" ? "bg-pale-cyan text-focus-blue" : "text-stone-gray hover:text-near-black hover:bg-warm-sand")}
              title="Xem danh sách chi tiết"
            >
              <span className="material-symbols-outlined text-[18px]">table_rows</span>
            </Link>
          </div>

          {/* Search Box */}
          <form method="GET" action="/calendar" className="flex items-center bg-white rounded-full border px-4 py-2 bg-ivory border-border-warm shadow-sm transition-all focus-within:ring-2 focus-within:ring-focus-blue focus-within:border-transparent">
            <input type="hidden" name="view" value={view} />
            <span className="material-symbols-outlined text-stone-gray mr-2 text-[20px]">search</span>
            <input 
              name="query" 
              type="text" 
              placeholder="Tên / SĐT..." 
              defaultValue={query}
              className="outline-none text-[14px] w-full sm:w-40 bg-transparent text-near-black font-medium"
            />
            <button type="submit" className="hidden">Tìm</button>
          </form>

          <GlobalInteractionModal leads={leads} />
        </div>
      </div>

      {events.length === 0 && (
        <div className="text-center py-20 bg-white border border-border-cream border-dashed rounded-3xl mt-8">
          <span className="material-symbols-outlined text-[48px] text-border-warm mb-3">
            search_off
          </span>
          <p className="text-olive-gray font-medium">
            Không tìm thấy lịch trình hay sự kiện nào phù hợp.
          </p>
        </div>
      )}

      {/* ===================== VIEW LOGIC ===================== */}
      
      {/* 1. TIMELINE VIEW */}
      {view === "timeline" && events.length > 0 && (
        <div className="space-y-12 relative max-w-[1000px]">
          <div className="absolute left-[29px] top-4 bottom-0 w-px bg-border-cream hidden md:block"></div>

          {Object.entries(groupedEvents).map(([dateGroup, dayEvents]) => (
            <div key={dateGroup} className="relative">
              <div className="sticky top-20 z-10 inline-block mb-4">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-gray bg-parchment/90 backdrop-blur px-3 py-1.5 rounded-full border border-border-cream shadow-sm">
                  {dateGroup}
                </h2>
              </div>

              <div className="space-y-6">
                {dayEvents.map((event) => {
                  const isMeeting = event.type === "meeting";
                  const lead: any = event.leads;

                  return (
                    <div key={event.id} className="flex flex-col md:flex-row gap-4 md:gap-6 group">
                      <div className="flex items-center md:items-start gap-4 md:w-32 shrink-0">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm relative z-10 transition-transform group-hover:scale-105 ${isMeeting ? "bg-orange-50 border-orange-200 text-orange-700" : "bg-green-50 border-green-200 text-green-700"}`}>
                          <span className="material-symbols-outlined text-[24px]">
                            {isMeeting ? "handshake" : "call"}
                          </span>
                        </div>
                        <div className="md:mt-1.5">
                          <p className="text-sm font-semibold text-near-black">
                            {format(new Date(event.occurred_at), "HH:mm")}
                          </p>
                          {event.duration_minutes && (
                            <p className="text-xs text-olive-gray font-medium">
                              {event.duration_minutes} pt
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 bg-white border border-border-cream rounded-3xl p-5 hover:shadow-md hover:border-focus-blue/50 transition-all relative group/card">
                        <div className="absolute top-4 right-4 flex gap-1 opacity-100 sm:opacity-0 group-hover/card:opacity-100 transition-opacity z-10 bg-white/90 backdrop-blur rounded-xl p-0.5 shadow-sm border border-border-cream">
                          <EditInteractionModal interaction={event} leads={leads} />
                          <DeleteInteractionButton id={event.id!} leadId={event.lead_id} />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${isMeeting ? "bg-orange-100/50 text-orange-700" : "bg-green-100/50 text-green-700"}`}>
                                {isMeeting ? "Họp mặt" : "Gọi điện"}
                              </span>
                            </div>
                            <h3 className="font-headline text-[17px] font-medium text-near-black">
                              {event.title}
                            </h3>
                            {event.content && (
                              <p className="text-sm text-olive-gray mt-2 leading-relaxed">
                                {event.content}
                              </p>
                            )}
                          </div>
                          
                          <div className="sm:text-right bg-warm-sand/40 p-3 rounded-2xl sm:min-w-[180px]">
                            <p className="text-xs text-stone-gray uppercase font-bold tracking-wider mb-1">Gặp gỡ</p>
                            <p className="text-sm font-bold text-terracotta">{lead?.full_name}</p>
                            {lead?.phone && <p className="text-xs font-semibold text-olive-gray mt-1">{lead.phone}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. GRID VIEW */}
      {view === "grid" && events.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {events.map(event => {
             const isMeeting = event.type === "meeting";
             const lead: any = event.leads;
             return (
               <div key={event.id} className="bg-white border border-border-cream shadow-sm rounded-3xl p-6 hover:shadow-md hover:border-focus-blue/40 transition-all flex flex-col h-full relative group/card">
                  <div className="absolute top-4 right-4 flex gap-1 opacity-100 sm:opacity-0 group-hover/card:opacity-100 transition-opacity z-10 bg-white/90 backdrop-blur rounded-xl p-0.5 shadow-sm border border-border-cream">
                    <EditInteractionModal interaction={event} leads={leads} />
                    <DeleteInteractionButton id={event.id!} leadId={event.lead_id} />
                  </div>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 ${isMeeting ? "bg-orange-100/50 text-orange-700" : "bg-green-100/50 text-green-700"}`}>
                       <span className="material-symbols-outlined !text-[14px]">
                          {isMeeting ? "handshake" : "call"}
                       </span>
                       {isMeeting ? "Họp mặt" : "Gọi điện"}
                    </span>
                    <span className="text-xs font-semibold text-stone-gray">
                      {format(new Date(event.occurred_at), "dd/MM, HH:mm")}
                    </span>
                  </div>
                  
                  <h3 className="font-headline text-lg font-bold text-near-black mb-2">{event.title}</h3>
                  <p className="text-sm text-olive-gray line-clamp-3 mb-6 flex-1">
                    {event.content || "Không có nội dung chi tiết."}
                  </p>

                  <div className="mt-auto pt-4 border-t border-dashed border-border-cream flex justify-between items-center bg-parchment/30 -mx-6 -mb-6 p-4 rounded-b-3xl">
                     <div>
                       <p className="text-[10px] uppercase font-bold text-stone-gray mb-0.5">Khách hàng</p>
                       <p className="text-sm font-bold text-focus-blue">{lead?.full_name}</p>
                     </div>
                     {lead?.phone && (
                        <a href={`tel:${lead.phone}`} className="w-8 h-8 rounded-full bg-pale-cyan text-focus-blue flex items-center justify-center hover:bg-focus-blue hover:text-white transition-colors" title="Gọi khách hàng">
                          <span className="material-symbols-outlined !text-[16px]">dialpad</span>
                        </a>
                     )}
                  </div>
               </div>
             )
          })}
        </div>
      )}

      {/* 3. TABLE VIEW */}
      {view === "table" && events.length > 0 && (
        <div className="bg-white border border-border-cream rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-parchment/60 border-b border-border-cream">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-stone-gray whitespace-nowrap">Thời gian</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-stone-gray whitespace-nowrap">Loại</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-stone-gray min-w-[200px]">Khách hàng</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-stone-gray min-w-[300px]">Sự kiện</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-stone-gray whitespace-nowrap">Thời lượng</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-stone-gray whitespace-nowrap text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-cream">
                {events.map((event) => {
                  const lead: any = event.leads;
                  const isMeeting = event.type === "meeting";
                  return (
                    <tr key={event.id} className="hover:bg-pale-cyan/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-semibold text-near-black">{format(new Date(event.occurred_at), "dd/MM/yyyy")}</p>
                        <p className="text-xs font-medium text-stone-gray mt-1">{format(new Date(event.occurred_at), "HH:mm")}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${isMeeting ? "bg-orange-50 text-orange-700" : "bg-green-50 text-green-700"}`}>
                           <span className="material-symbols-outlined !text-[14px]">
                              {isMeeting ? "handshake" : "call"}
                           </span>
                           {isMeeting ? "Họp" : "Gọi"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-terracotta">{lead?.full_name}</p>
                        <p className="text-xs font-medium text-olive-gray mt-1">{lead?.phone || "Chưa cập nhật SĐT"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-near-black break-words">{event.title}</p>
                        {event.content && <p className="text-xs font-medium text-stone-gray mt-1 line-clamp-1">{event.content}</p>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {event.duration_minutes ? (
                          <span className="text-sm font-semibold text-focus-blue bg-pale-cyan px-2.5 py-1 rounded-lg">
                            {event.duration_minutes} phút
                          </span>
                        ) : (
                          <span className="text-stone-gray text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-1 relative">
                          <EditInteractionModal interaction={event} leads={leads} />
                          <DeleteInteractionButton id={event.id!} leadId={event.lead_id} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
