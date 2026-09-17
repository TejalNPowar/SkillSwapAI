// Mirrors server/utils/sessionTiming.js. Kept in sync manually — the
// backend's /api/sessions/:id/join endpoint is the authoritative check;
// this is only used to decide what the Join button looks like before
// the user clicks it.

export const JOIN_GRACE_PERIOD_MINUTES = 5;

// Returns one of: 'upcoming' | 'live' | 'completed' | 'cancelled'
export function getSessionState(session, now = Date.now()) {
  if (session.status === "Cancelled") return "cancelled";

  const start = new Date(session.scheduledDate).getTime();
  const durationMs = (session.duration || 0) * 60 * 1000;
  const graceMs = JOIN_GRACE_PERIOD_MINUTES * 60 * 1000;
  const joinableUntil = start + durationMs + graceMs;

  if (now < start) return "upcoming";
  if (now <= joinableUntil) return "live";
  return "completed";
}
