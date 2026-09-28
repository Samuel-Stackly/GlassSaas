import { useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

/**
 * Reference match for the "greeting/header hierarchy" + "date/productivity
 * card" requirement. Everything shown here is real, derived client-side —
 * not a new feature/endpoint: the greeting word comes from the visitor's
 * own local clock, the date is `new Date()`, and the name is the already-
 * authenticated user's real `name` from useAuth(). The only non-data text
 * is the static encouragement line, which is UI copy (like the reference's
 * own "Stay productive, keep building!"), not a data claim.
 */
function getGreeting(hour: number): string {
  if (hour < 5) return 'Good night';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function DashboardGreeting() {
  const { user } = useAuth();

  // Computed once per mount rather than a live-ticking clock — this is a
  // page header, not a clock widget; re-rendering every second/minute would
  // be motion with no purpose.
  const now = useMemo(() => new Date(), []);
  const greeting = getGreeting(now.getHours());
  const dateLabel = useMemo(
    () => now.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }),
    [now]
  );
  const firstName = user?.name?.trim().split(/\s+/)[0];

  return (
    <header className="dashboard-greeting">
      <div className="min-w-0">
        <p className="dashboard-greeting__eyebrow">WORKSPACE / OVERVIEW</p>
        <h1 className="dashboard-greeting__title">
          {greeting}, <span>{firstName ?? 'there'}.</span>
        </h1>
        <p className="dashboard-greeting__subtitle">Here’s what’s happening with your projects today.</p>
      </div>

      <div className="dashboard-date">
        <span className="dashboard-date__icon" aria-hidden="true">
          <Calendar size={18} />
        </span>
        <span className="dashboard-date__text">
          <span className="dashboard-date__label">TODAY</span>
          <time dateTime={now.toISOString().slice(0, 10)}>{dateLabel}</time>
        </span>
      </div>
    </header>
  );
}
