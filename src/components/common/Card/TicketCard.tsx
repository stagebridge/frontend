import type { Ticket } from "types/ticket";
import { Link } from "react-router-dom";

export default function TicketCard({ ticket }: { ticket: Ticket }) {
  const date =
    ticket.dateEnd && ticket.dateEnd !== ticket.dateStart
      ? `${ticket.dateStart} ~ ${ticket.dateEnd}`
      : ticket.dateStart;

  const price =
    ticket.priceJPY
      ? `${ticket.priceJPY.toLocaleString()}円`
      : ticket.priceKRW
      ? `${ticket.priceKRW.toLocaleString()}원`
      : "-";

  return (
    <Link
      to={`/concert/${ticket.id}`}
      className="block overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="aspect-[3/4] w-full overflow-hidden bg-neutral-100">
        <img src={ticket.cover} alt={ticket.title} className="h-full w-full object-cover" />
      </div>
      <div className="space-y-1 p-3">
        <h3 className="line-clamp-1 text-sm font-semibold">{ticket.title}</h3>
        {ticket.subTitle && (
          <p className="line-clamp-1 text-[12px] text-neutral-500">{ticket.subTitle}</p>
        )}
        <p className="text-[12px] text-neutral-500">{date}</p>
        <p className="text-[12px] text-neutral-500">{ticket.venue}</p>
        <p className="text-[13px] font-medium">{price}</p>
      </div>
    </Link>
  );
}
