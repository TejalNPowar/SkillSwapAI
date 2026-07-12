import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiCalendar } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import SkillTag from "../components/SkillTag";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";
// import { getProfile, sendRequest } from "../services/api";
import { getProfile, getUserById } from "../services/api";
import EditProfileModal from "../components/EditProfileModal.jsx";

export default function Profile() {
  const { id } = useParams();
  const { user: authUser } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRequest, setShowRequest] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [sent, setSent] = useState(false);

  

  useEffect(() => {

    const fetchProfile = async () => {

        try {

            let response;

            if (id) {
                response = await getUserById(id);
            } else {
                response = await getProfile();
            }

            setProfileUser(response.data.user);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    fetchProfile();

}, [id]);

  const handleSendRequest = async () => {
    try {
      await sendRequest({
        fromUserId: authUser?._id,
        toUserId: profileUser?._id,
        skill: profileUser?.skillsOffered?.[0],
      });

      setSent(true);
      setShowRequest(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <h2 className="text-xl font-semibold">Loading profile...</h2>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <h2 className="text-xl font-semibold">Profile not found.</h2>
        </div>
      </div>
    );
  }
  
  console.log("Auth User:", authUser);
  console.log("Profile User:", profileUser);
  console.log("Same user?", authUser?._id === profileUser?._id);

  return (
    <div className="flex page-enter">
      <Sidebar />

      <div className="container-page flex-1 py-8">

        <div className="card p-6">

          <div className="flex flex-col items-center gap-4">

            <img
              src={
                profileUser.profileImage ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  profileUser.name
                )}`
              }
              alt={profileUser.name}
              className="h-32 w-32 rounded-full object-cover border"
            />

            <div className="text-center">
              <h1 className="text-3xl font-bold">
                {profileUser.name}
              </h1>

              <p className="text-gray-500 mt-2">
                {profileUser.department}
              </p>

              <p className="text-gray-500">
                {profileUser.college}
              </p>
            </div>

          </div>

          <div className="mt-8">

            <h2 className="text-xl font-semibold">
              About
            </h2>

            <p className="mt-2 text-gray-600">
              {profileUser.bio || "No bio added yet."}
            </p>

          </div>

          <div className="mt-8">

            <h2 className="text-xl font-semibold">
              Skills Offered
            </h2>

            <div className="flex flex-wrap gap-2 mt-3">

              {(profileUser.skillsOffered || []).length === 0 ? (
                <p className="text-gray-400">
                  No skills added.
                </p>
              ) : (
                profileUser.skillsOffered.map((skill) => (
                  <SkillTag
                    key={skill}
                    label={skill}
                    kind="offer"
                  />
                ))
              )}

            </div>

          </div>

          <div className="mt-8">

            <h2 className="text-xl font-semibold">
              Skills Wanted
            </h2>

            <div className="flex flex-wrap gap-2 mt-3">

              {(profileUser.skillsWanted || []).length === 0 ? (
                <p className="text-gray-400">
                  No skills added.
                </p>
              ) : (
                profileUser.skillsWanted.map((skill) => (
                  <SkillTag
                    key={skill}
                    label={skill}
                    kind="want"
                  />
                ))
              )}

            </div>

          </div>

          <div className="mt-8">

            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <FiCalendar />
              Availability
            </h2>

            <p className="mt-2 text-gray-600">
              {profileUser.availability || "Not specified"}
            </p>

          </div>

          {authUser?._id === profileUser?._id ? (

  <div className="mt-10">

    <button
      onClick={() => setShowEditModal(true)}
      className="btn-primary"
    >
      Edit Profile
    </button>

  </div>

) : (

  <div className="mt-10">

    <button
      onClick={() => setShowRequest(true)}
      className="btn-primary"
      disabled={sent}
    >
      {sent ? "Request Sent" : "Request Skill Swap"}
    </button>

  </div>

)}
        </div>

      </div>

    <EditProfileModal
    open={showEditModal}
    onClose={() => setShowEditModal(false)}
    profileUser={profileUser}
    onProfileUpdated={(updatedUser) => {
        setProfileUser(updatedUser);
    }}
/>

      <Modal
        open={showRequest}
        onClose={() => setShowRequest(false)}
        title="Send Skill Swap Request"
      >
        <p>
          Send a request to learn{" "}
          <strong>
            {profileUser.skillsOffered?.[0] || "this skill"}
          </strong>{" "}
          from {profileUser.name}?
        </p>

        <div className="mt-6 flex gap-3">

          <button
            className="btn-outline flex-1"
            onClick={() => setShowRequest(false)}
          >
            Cancel
          </button>

          <button
            className="btn-primary flex-1"
            onClick={handleSendRequest}
          >
            Send Request
          </button>

        </div>

      </Modal>

    </div>
  );
}