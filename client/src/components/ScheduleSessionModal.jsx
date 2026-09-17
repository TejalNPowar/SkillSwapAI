import { useEffect, useState } from "react";
import Modal from "./Modal";
import { createSession } from "../services/api";

// Mirrors server/utils/sessionTiming.js MIN/MAX_DURATION_MINUTES.
// Backend re-validates authoritatively; this is just for UX.
const MIN_DURATION_MINUTES = 15;
const MAX_DURATION_MINUTES = 240;

// request: the Accepted SwapRequest being scheduled
// currentUserId: the logged-in user (becomes teacher)
// otherUser: the other participant (becomes student), populated object {_id, name, ...}
// defaultSkill: offeredSkill if current user is the sender, requestedSkill if receiver
export default function ScheduleSessionModal({
  open,
  onClose,
  request,
  currentUserId,
  otherUser,
  defaultSkill,
  onScheduled,
  onScheduleFailed,
}) {
  const [skill, setSkill] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(60);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setSkill(defaultSkill || "");
    setDate("");
    setTime("");
    setDuration(60);
    setNotes("");
    setError("");
  }, [open, defaultSkill, request]);

  const handleSchedule = async () => {
    if (saving) return; // prevent double-click / double-submit

    setError("");

    if (!skill.trim()) {
      setError("Please enter a skill for the session.");
      return;
    }
    if (!date || !time) {
      setError("Please choose a date and time.");
      return;
    }

    const scheduledDate = new Date(`${date}T${time}`);
    if (Number.isNaN(scheduledDate.getTime())) {
      setError("That date/time isn't valid.");
      return;
    }
    if (scheduledDate.getTime() <= Date.now()) {
      setError("Please pick a date and time in the future.");
      return;
    }

    const durationNum = Number(duration);
    if (
      !Number.isFinite(durationNum) ||
      durationNum < MIN_DURATION_MINUTES ||
      durationNum > MAX_DURATION_MINUTES
    ) {
      setError(`Duration must be between ${MIN_DURATION_MINUTES} and ${MAX_DURATION_MINUTES} minutes.`);
      return;
    }

    try {
      setSaving(true);

      const response = await createSession({
        studentId: otherUser?._id,
        swapRequestId: request?._id,
        skill: skill.trim(),
        scheduledDate: scheduledDate.toISOString(),
        duration: durationNum,
        notes: notes.trim(),
      });

      onScheduled(response.data.session);
      onClose();
    } catch (err) {
      console.error(err);
      // The backend is the source of truth for duplicate-session protection
      // (e.g. the other participant scheduled first in a race). Surface that
      // message directly instead of a generic failure.
      setError(
        err.response?.data?.message ||
          "Failed to schedule the session. Please try again."
      );
      onScheduleFailed?.();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Schedule Session">
      {request && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            Scheduling with <span className="font-medium text-slate-700">{otherUser?.name}</span>
          </p>

          <div>
            <label className="label-field">Skill</label>
            <input
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="input-field"
              placeholder="e.g. React"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-field">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="label-field">Duration (minutes)</label>
            <input
              type="number"
              min={MIN_DURATION_MINUTES}
              max={MAX_DURATION_MINUTES}
              step="15"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="label-field">Notes (optional)</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-field"
              placeholder="Anything to prepare or cover in the session"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button onClick={onClose} className="btn-outline flex-1" disabled={saving}>
              Cancel
            </button>
            <button onClick={handleSchedule} className="btn-primary flex-1" disabled={saving}>
              {saving ? "Scheduling..." : "Schedule Session"}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
