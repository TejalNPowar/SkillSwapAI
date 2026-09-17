import Sidebar from "../components/Sidebar";
import SessionCard from "../components/SessionCard";
import { useEffect, useState } from "react";
import { getMySessions } from "../services/api";

export default function MySessions() {

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchSessions = async () => {

      try {

        const response = await getMySessions();

        if (response.data.success) {
          setSessions(response.data.sessions);
        }

      } catch (error) {

        console.error("Failed to fetch sessions:", error);

      } finally {

        setLoading(false);

      }

    };

    fetchSessions();

  }, []);

  if (loading) {
    return (
      <div className="flex page-enter">

        <Sidebar />

        <div className="container-page flex-1 py-8">

          <p className="text-gray-500">
            Loading your sessions...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="flex page-enter">

      <Sidebar />

      <div className="container-page flex-1 py-8">

        {/* Page Header */}

        <div className="mb-8">

          <h1 className="text-4xl font-bold text-slate-900">
            📅 My Learning Journey
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your sessions, track your progress,
            and continue your skill exchange journey.
          </p>

        </div>


        {/* Section Heading */}

        <div className="mb-4">

          <h2 className="text-2xl font-semibold">
            Upcoming Sessions
          </h2>

          <p className="text-slate-500">
            Your scheduled skill exchange sessions.
          </p>

        </div>


        {/* Sessions */}

        <div className="grid md:grid-cols-2 gap-6 mt-8">

          {sessions.length > 0 ? (

            sessions.map((session) => (

              <SessionCard
                key={session._id}
                session={{
                  ...session,
                  skillGuide: session.teacher?.name,
                  skillExplorer: session.student?.name,
                }}
              />

            ))

          ) : (

            <p className="text-slate-500">
              No sessions found.
            </p>

          )}

        </div>

      </div>

    </div>
  );
}