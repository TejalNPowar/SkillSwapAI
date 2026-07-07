import { FiCheck, FiX, FiClock } from "react-icons/fi";

export default function RequestCard({
  request,
  onAccept,
  onReject,
}) {

  const user =
    request.sender || request.receiver;

  const avatar =
    user.profileImage ||
    "https://ui-avatars.com/api/?name=" +
      encodeURIComponent(user.name);

  return (
    <div className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">

      <div className="flex items-center gap-3">

        <img
          src={avatar}
          alt={user.name}
          className="h-12 w-12 rounded-full object-cover"
        />

        <div>

          <h3 className="font-semibold">
            {user.name}
          </h3>

          <p className="text-sm text-slate-500">
            {user.college}
          </p>

          <p className="mt-1 text-sm">
            <span className="font-medium">
              Offered:
            </span>{" "}
            {request.offeredSkill}
          </p>

          <p className="text-sm">
            <span className="font-medium">
              Requested:
            </span>{" "}
            {request.requestedSkill}
          </p>

        </div>

      </div>

      <div className="flex flex-col items-end gap-2">

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            request.status === "Pending"
              ? "bg-yellow-100 text-yellow-700"
              : request.status === "Accepted"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {request.status}
        </span>

        <div className="flex items-center gap-1 text-xs text-slate-500">
          <FiClock size={12} />
          {new Date(request.createdAt).toLocaleDateString()}
        </div>

      </div>

      {onAccept &&
        request.status === "Pending" && (
          <div className="flex gap-2">

            <button
              onClick={() => onAccept(request)}
              className="btn-primary"
            >
              <FiCheck />
              Accept
            </button>

            <button
              onClick={() => onReject(request)}
              className="btn-outline"
            >
              <FiX />
              Reject
            </button>

          </div>
      )}

    </div>
  );
}