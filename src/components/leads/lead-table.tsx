import Link from "next/link";
import type { Lead } from "@/lib/types/database";
import { LEAD_SOURCE_LABELS } from "@/lib/constants";
import { LeadStatusBadge } from "@/components/leads/lead-status-badge";
import { getInitials, formatDateVn } from "@/lib/utils";

export function LeadTable({ leads }: { leads: Lead[] }) {
  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-border-cream shadow-whisper p-16 text-center">
        <span className="material-symbols-outlined text-5xl text-warm-silver">
          group
        </span>
        <h3 className="font-headline text-2xl font-medium mt-4">
          Chưa có lead phù hợp
        </h3>
        <p className="text-sm text-olive-gray mt-2 mb-6">
          Thử thay đổi bộ lọc hoặc bắt đầu thêm khách hàng mới.
        </p>
        <Link
          href="/leads/new"
          className="inline-flex items-center gap-2 bg-terracotta text-ivory px-5 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">
            person_add
          </span>
          Thêm Lead mới
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-ivory border-b border-border-cream">
            <th className="px-6 py-4 font-headline text-lg font-medium text-near-black">
              Tên khách hàng
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-stone-gray uppercase tracking-wider">
              Số điện thoại
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-stone-gray uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-stone-gray uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-stone-gray uppercase tracking-wider">
              Nguồn
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-stone-gray uppercase tracking-wider">
              Ngày tạo
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-stone-gray uppercase tracking-wider text-right">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-cream">
          {leads.map((lead) => (
            <tr
              key={lead.id}
              className="hover:bg-ivory transition-colors group"
            >
              <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-parchment flex items-center justify-center font-headline text-terracotta font-medium border border-border-warm">
                    {getInitials(lead.full_name)}
                  </div>
                  <div>
                    <Link
                      href={`/leads/${lead.id}`}
                      className="font-medium text-near-black hover:text-terracotta transition-colors"
                    >
                      {lead.full_name}
                    </Link>
                    {lead.position ? (
                      <p className="text-xs text-stone-gray">{lead.position}</p>
                    ) : null}
                  </div>
                </div>
              </td>
              <td className="px-6 py-5 text-sm text-olive-gray">
                {lead.phone}
              </td>
              <td className="px-6 py-5 text-sm text-olive-gray">
                {lead.email ?? "—"}
              </td>
              <td className="px-6 py-5">
                <LeadStatusBadge status={lead.status} />
              </td>
              <td className="px-6 py-5 text-sm text-olive-gray">
                {LEAD_SOURCE_LABELS[lead.source]}
              </td>
              <td className="px-6 py-5 text-sm text-olive-gray">
                {formatDateVn(lead.created_at)}
              </td>
              <td className="px-6 py-5 text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/leads/${lead.id}`}
                    aria-label="Xem chi tiết"
                    title="Xem"
                    className="p-1.5 text-stone-gray hover:text-terracotta hover:bg-ivory rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      visibility
                    </span>
                  </Link>
                  <Link
                    href={`/leads/${lead.id}/edit`}
                    aria-label="Chỉnh sửa"
                    title="Sửa"
                    className="p-1.5 text-stone-gray hover:text-terracotta hover:bg-ivory rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      edit
                    </span>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
