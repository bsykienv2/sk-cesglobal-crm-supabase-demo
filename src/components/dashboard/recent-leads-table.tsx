import Link from "next/link";
import type { Lead } from "@/lib/types/database";
import { LeadStatusBadge } from "@/components/leads/lead-status-badge";
import { getInitials, relativeDateVn } from "@/lib/utils";

export function RecentLeadsTable({ leads }: { leads: Lead[] }) {
  if (leads.length === 0) {
    return (
      <div className="bg-ivory rounded-2xl ring-shadow whisper-shadow p-10 text-center">
        <span className="material-symbols-outlined text-4xl text-warm-silver">
          inbox
        </span>
        <h3 className="font-headline text-xl font-medium mt-3">
          Chưa có lead nào
        </h3>
        <p className="text-sm text-olive-gray mt-1 mb-6">
          Bắt đầu hành trình bằng cách thêm khách hàng đầu tiên của bạn.
        </p>
        <Link
          href="/leads/new"
          className="inline-flex items-center gap-2 bg-terracotta text-ivory px-5 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Thêm Lead đầu tiên
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-ivory rounded-2xl ring-shadow whisper-shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-cream">
              <th className="px-6 py-4 text-[12px] uppercase tracking-wider font-semibold text-stone-gray">
                Tên khách hàng
              </th>
              <th className="px-6 py-4 text-[12px] uppercase tracking-wider font-semibold text-stone-gray">
                Số điện thoại
              </th>
              <th className="px-6 py-4 text-[12px] uppercase tracking-wider font-semibold text-stone-gray">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-[12px] uppercase tracking-wider font-semibold text-stone-gray">
                Ngày tạo
              </th>
              <th className="px-6 py-4 text-right" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border-cream">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="hover:bg-[#fcfbf7] transition-colors group"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-border-cream flex items-center justify-center text-terracotta font-semibold text-xs">
                      {getInitials(lead.full_name)}
                    </div>
                    <Link
                      href={`/leads/${lead.id}`}
                      className="font-medium text-near-black hover:text-terracotta transition-colors"
                    >
                      {lead.full_name}
                    </Link>
                  </div>
                </td>
                <td className="px-6 py-5 text-olive-gray">{lead.phone}</td>
                <td className="px-6 py-5">
                  <LeadStatusBadge status={lead.status} />
                </td>
                <td className="px-6 py-5 text-stone-gray text-sm">
                  {relativeDateVn(lead.created_at)}
                </td>
                <td className="px-6 py-5 text-right">
                  <Link
                    href={`/leads/${lead.id}`}
                    aria-label="Xem chi tiết"
                    className="inline-block p-1 text-warm-silver hover:text-near-black transition-colors"
                  >
                    <span className="material-symbols-outlined">
                      chevron_right
                    </span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
