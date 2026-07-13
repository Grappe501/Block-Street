import Link from "next/link";
import type { NotificationCenterView } from "@/lib/civic-action/builds/11.7/ux";

export function NotificationCenterPanel({ view }: { view: NotificationCenterView }) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
        <p className="mt-1 text-sm text-slate-600">{view.unread_count} unread</p>
      </header>

      {view.notifications.length === 0 ? (
        <p className="card text-slate-600">You&apos;re all caught up.</p>
      ) : (
        <ul className="space-y-2" aria-label="Notifications list">
          {view.notifications.map((n) => (
            <li key={n.id} className={`card ${n.read ? "opacity-70" : ""}`}>
              {n.href ? (
                <Link href={n.href} className="block">
                  <span className="font-medium text-slate-900">{n.title}</span>
                  <p className="text-sm text-slate-600">{n.body}</p>
                  <time className="text-xs text-slate-400">{n.when}</time>
                </Link>
              ) : (
                <>
                  <span className="font-medium text-slate-900">{n.title}</span>
                  <p className="text-sm text-slate-600">{n.body}</p>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
