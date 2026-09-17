import { useState } from "react";
import { FiCalendar, FiClock, FiVideo, FiAlertCircle } from "react-icons/fi";
import { joinSession } from "../services/api";
import { getSessionState } from "../utils/sessionTiming";

const STATE_LABELS = {
  upcoming: "Upcoming",
  live: "Live",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATE_STYLES = {
  upcoming: "bg-amber-100 text-amber-700",
  live: "bg-green-100 text-green-700",
  completed: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function SessionCard({ session }) {
  const [joining, setJoining] = useState(false);

  // The backend already attaches computedState on fetch; fall back to
  // computing it locally in case that's ever missing (e.g. stale data).
  const state = session.computedState || getSessionState(session);

  const hasMeetLink = !!session.meetLink;

  const handleJoin = async () => {
    if (joining) return; // prevent double-click

    if (!hasMeetLink) {
      alert("No Google Meet link is available for this session.");
      return;
    }

    try {
      setJoining(true);
      // The backend is the source of truth for whether joining is allowed
      // right now — we don't just trust the locally-computed state.
      const response = await joinSession(session._id);
      window.open(response.data.meetLink, "_blank");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Unable to join this session right now.");
    } finally {
      setJoining(false);
    }
  };

  const joinDisabled = state !== "live" || !hasMeetLink;

  return (
    <div className="card p-5 flex flex-col gap-6">

      {/* Skill */}
      <div className="flex items-center justify-between">

    <div>

        <p className="text-xs uppercase tracking-widest text-slate-400">
            Learning Skill
        </p>

        <h2 className="text-2xl font-bold text-slate-800">
            {session.skill}
        </h2>

    </div>

    <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${STATE_STYLES[state]}`}
    >
        {STATE_LABELS[state]}
    </span>

</div>

      {/* Skill Guide */}
      <div className="flex items-center gap-3">

    <img
        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            session.skillGuide
        )}&background=4F46E5&color=fff`}
        alt={session.skillGuide}
        className="h-12 w-12 rounded-full shadow"
    />

    <div>

        <p className="font-semibold text-slate-800">
            {session.skillGuide}
        </p>

        <p className="text-sm text-primary">
            Skill Guide
        </p>

    </div>

</div>

      {/* Skill Explorer */}
      <div className="flex items-center gap-3">

    <img
        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            session.skillExplorer
        )}&background=10B981&color=fff`}
        alt={session.skillExplorer}
        className="h-12 w-12 rounded-full shadow"
    />

    <div>

        <p className="font-semibold text-slate-800">
            {session.skillExplorer}
        </p>

        <p className="text-sm text-emerald-600">
            Skill Explorer
        </p>

    </div>

</div>

      {/* Date */}
      <div className="flex items-center gap-3 text-slate-600">

        <FiCalendar />

        <span>
            {new Date(session.scheduledDate).toLocaleString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
            })}
        </span>

      </div>

      {/* Duration */}
      <div className="flex items-center gap-3 text-slate-600">

        <FiClock />

        <span>

          <strong>{session.duration}</strong> Minutes

      </span>

      </div>

      {/* Join Button */}

      {!hasMeetLink ? (
        <div className="mt-2 flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-500">
          <FiAlertCircle />
          No Meet link available for this session.
        </div>
      ) : (
        <button
          className="btn-primary mt-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={joinDisabled || joining}
          onClick={handleJoin}
        >
          <FiVideo />
          {joining
            ? "Joining..."
            : state === "upcoming"
            ? "Join opens at start time"
            : state === "completed"
            ? "Session ended"
            : state === "cancelled"
            ? "Session cancelled"
            : "Join Meeting"}
        </button>
      )}
    </div>
  );
}
