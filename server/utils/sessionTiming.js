// Shared session-timing rules used by sessionController.js.
//
// A session is "live" (joinable) from its scheduledDate until
// scheduledDate + duration + JOIN_GRACE_PERIOD_MINUTES.
//
// The grace period exists only to tolerate minor real-world lateness
// (a session running a few minutes over) — it does NOT allow joining early.
// Before scheduledDate, a session is always "upcoming" and not joinable.

const JOIN_GRACE_PERIOD_MINUTES = 5;

const MIN_DURATION_MINUTES = 15;
const MAX_DURATION_MINUTES = 240; // 4 hours — generous upper bound for a student project

function getSessionWindow(session) {
  const start = new Date(session.scheduledDate).getTime();
  const durationMs = (session.duration || 0) * 60 * 1000;
  const graceMs = JOIN_GRACE_PERIOD_MINUTES * 60 * 1000;

  return {
    start,
    end: start + durationMs, // the "official" end, used for the Completed label
    joinableUntil: start + durationMs + graceMs, // when Join actually stops working
  };
}

// Returns one of: 'upcoming' | 'live' | 'completed' | 'cancelled'
function getSessionState(session, now = Date.now()) {
  if (session.status === "Cancelled") return "cancelled";

  const { start, joinableUntil } = getSessionWindow(session);

  if (now < start) return "upcoming";
  if (now <= joinableUntil) return "live";
  return "completed";
}

function isJoinable(session, now = Date.now()) {
  return getSessionState(session, now) === "live";
}

module.exports = {
  JOIN_GRACE_PERIOD_MINUTES,
  MIN_DURATION_MINUTES,
  MAX_DURATION_MINUTES,
  getSessionWindow,
  getSessionState,
  isJoinable,
};
