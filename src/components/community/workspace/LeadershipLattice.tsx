import Link from "next/link";
import { buildSignupHref } from "@/lib/data";
import { ROLE_STATUS_COLORS, ROLE_STATUS_LABELS, type RoleAssignment } from "@/lib/community-workspace";

export function LeadershipLattice({
  roles,
  countySlug,
  schoolSlug,
}: {
  roles: RoleAssignment[];
  countySlug: string;
  schoolSlug?: string;
}) {
  return (
    <section className="card">
      <h2 className="text-lg font-bold text-slate-900">Leadership</h2>
      <p className="mt-1 text-sm text-slate-600">
        Service roles, not titles. Vacant slots are invitations to step up.
      </p>
      <ul className="mt-4 divide-y divide-slate-100">
        {roles.map((role) => (
          <li key={role.role} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0">
            <div>
              <p className="font-medium text-slate-900">
                {role.label}
                {role.isOrganizingSpine && (
                  <span className="ml-2 text-xs font-semibold uppercase text-brand-700">Organizing spine</span>
                )}
              </p>
              <p className="text-sm text-slate-600">
                {role.holderName ?? "Open role"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`badge ${ROLE_STATUS_COLORS[role.status]}`}>
                {ROLE_STATUS_LABELS[role.status]}
              </span>
              {!role.holderName && (
                <Link
                  href={`${buildSignupHref({ county: countySlug, school: schoolSlug })}&role=${role.role}`}
                  className="text-xs font-semibold text-brand-700 hover:underline"
                >
                  Volunteer
                </Link>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
