import { useEffect, useState } from "react";
import Modal from "./Modal";
import { updateProfile } from "../services/api";

export default function EditProfileModal({
  open,
  onClose,
  profileUser,
  onProfileUpdated,
}) {
  const [form, setForm] = useState({
    bio: "",
    skillsOffered: "",
    skillsWanted: "",
    availability: "Weekdays",
    experience: "Beginner",
});

const [saving, setSaving] = useState(false);

useEffect(() => {

    if (!profileUser) return;

    setForm({

        bio: profileUser.bio || "",

        skillsOffered: (profileUser.skillsOffered || []).join(", "),

        skillsWanted: (profileUser.skillsWanted || []).join(", "),

        availability: profileUser.availability || "Weekdays",

        experience: profileUser.experience || "Beginner",

    });

}, [profileUser, open]);




  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };


  const handleSave = async () => {
  try {
    setSaving(true);

    const payload = {
      bio: form.bio,
      skillsOffered: form.skillsOffered
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),

      skillsWanted: form.skillsWanted
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),

      availability: form.availability,
      experience: form.experience,
    };

    const response = await updateProfile(payload);

    onProfileUpdated(response.data.user);

    onClose();

  } catch (error) {
    console.error(error);
    alert("Failed to update profile.");
  } finally {
    setSaving(false);
  }
};




  return (

    <Modal
      open={open}
      onClose={onClose}
      title="Edit Profile"
    >

      <div className="space-y-4">

        <div>

          <label className="label-field">
            Bio
          </label>

          <textarea
            rows={4}
            name="bio"
            value={form.bio}
            onChange={handleChange}
            className="input-field"
          />

        </div>

        <div>

          <label className="label-field">
            Skills Offered
          </label>

          <input
            name="skillsOffered"
            value={form.skillsOffered}
            onChange={handleChange}
            className="input-field"
            placeholder="Java, React, DSA"
          />

        </div>

        <div>

          <label className="label-field">
            Skills Wanted
          </label>

          <input
            name="skillsWanted"
            value={form.skillsWanted}
            onChange={handleChange}
            className="input-field"
            placeholder="Node, Docker"
          />

        </div>

        <div>

          <label className="label-field">
            Availability
          </label>

          <select
            name="availability"
            value={form.availability}
            onChange={handleChange}
            className="input-field"
          >

            <option>Weekdays</option>

            <option>Weekends</option>

            <option>Evenings</option>

          </select>

        </div>

        <div>

          <label className="label-field">
            Experience
          </label>

          <select
            name="experience"
            value={form.experience}
            onChange={handleChange}
            className="input-field"
          >

            <option>Beginner</option>

            <option>Intermediate</option>

            <option>Advanced</option>

          </select>

        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary w-full"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        
      </div>

    </Modal>

  );

}