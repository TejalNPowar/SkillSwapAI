const Session = require("../models/Session");
const SwapRequest = require("../models/SwapRequest");
const User = require("../models/User");
const { createMeetForUser } = require("./meetController");
const {
    MIN_DURATION_MINUTES,
    MAX_DURATION_MINUTES,
    getSessionState,
} = require("../utils/sessionTiming");

const createSession = async (req, res) => {
    try {

        const {
            studentId,
            swapRequestId,
            skill,
            scheduledDate,
            duration,
            notes,
        } = req.body;

        const teacherId = req.user.id;

        // Required fields
        if (
            !studentId ||
            !swapRequestId ||
            !skill ||
            !scheduledDate
        ) {
            return res.status(400).json({
                success: false,
                message: "All required fields are required.",
            });
        }

        // Validate scheduledDate
        const parsedDate = new Date(scheduledDate);

        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Scheduled date is not a valid date.",
            });
        }

        if (parsedDate.getTime() <= Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Scheduled date must be in the future.",
            });
        }

        // Validate duration (default handled by the schema if not provided)
        const durationValue = duration === undefined || duration === null || duration === ""
            ? 60
            : Number(duration);

        if (
            !Number.isFinite(durationValue) ||
            durationValue < MIN_DURATION_MINUTES ||
            durationValue > MAX_DURATION_MINUTES
        ) {
            return res.status(400).json({
                success: false,
                message: `Duration must be a number between ${MIN_DURATION_MINUTES} and ${MAX_DURATION_MINUTES} minutes.`,
            });
        }

        // Teacher cannot teach themselves
        if (teacherId === studentId) {
            return res.status(400).json({
                success: false,
                message: "Teacher and Student cannot be the same.",
            });
        }

        // Check student
        const student = await User.findById(studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found.",
            });
        }


        // Check teacher's Google connection
        const teacher = await User.findById(teacherId);

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found.",
            });
        }

        if (!teacher.googleRefreshToken) {
            return res.status(400).json({
                success: false,
                message: "Please connect your Google account before scheduling a session.",
            });
        }


        // Check Swap Request
        const swapRequest = await SwapRequest.findById(
            swapRequestId
        );

        if (!swapRequest) {
            return res.status(404).json({
                success: false,
                message: "Swap Request not found.",
            });
        }

        if (swapRequest.status !== "Accepted") {
            return res.status(400).json({
                success: false,
                message: "Only accepted swap requests can be scheduled.",
            });
}


        // Check if session already exists for this swap request
        const existingSession = await Session.findOne({
            swapRequest: swapRequestId,
        });

        if (existingSession) {
            return res.status(400).json({
                success: false,
                message: "A session has already been scheduled for this request.",
            });
        }


        // Create the Google Meet space for this session (single call — this
        // is the ONLY place a Meet space is created for a session)
        const googleMeet = await createMeetForUser(teacherId);

        // Create SkillSwap session
        const session = await Session.create({

            teacher: teacherId,

            student: studentId,

            swapRequest: swapRequestId,

            skill,

            scheduledDate: parsedDate,

            duration: durationValue,

            meetLink: googleMeet.meetLink,

            meetSpaceName: googleMeet.meetSpaceName,

            notes: notes || "",

        });

        return res.status(201).json({

            success: true,

            message: "Session scheduled successfully.",

            session,

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error",

        });

    }
};


const getMySessions = async (req, res) => {
    try {

        const userId = req.user.id;

        const sessions = await Session.find({
            $or: [
                { teacher: userId },
                { student: userId }
            ]
        })
        .populate("teacher", "name email profileImage")
        .populate("student", "name email profileImage")
        .sort({ scheduledDate: 1 });

        // Attach a computed timing state for convenience. This is NOT the
        // authoritative check — /api/sessions/:id/join re-verifies server-side
        // at click time — but it lets the UI render the right button state
        // without duplicating the exact window math from this file.
        const sessionsWithState = sessions.map((s) => {
            const obj = s.toObject();
            obj.computedState = getSessionState(s);
            return obj;
        });

        return res.status(200).json({
            success: true,
            sessions: sessionsWithState
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};


const joinSession = async (req, res) => {
    try {

        const userId = req.user.id;
        const { id } = req.params;

        const session = await Session.findById(id);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found.",
            });
        }

        // Only the teacher or student on this session may join it
        const isParticipant =
            String(session.teacher) === String(userId) ||
            String(session.student) === String(userId);

        if (!isParticipant) {
            return res.status(403).json({
                success: false,
                message: "You are not a participant in this session.",
            });
        }

        if (session.status === "Cancelled") {
            return res.status(400).json({
                success: false,
                message: "This session was cancelled.",
            });
        }

        const state = getSessionState(session);

        if (state === "upcoming") {
            return res.status(400).json({
                success: false,
                message: "This session hasn't started yet.",
            });
        }

        if (state === "completed") {
            return res.status(400).json({
                success: false,
                message: "This session has already ended.",
            });
        }

        if (!session.meetLink) {
            return res.status(400).json({
                success: false,
                message: "No Google Meet link is available for this session.",
            });
        }

        return res.status(200).json({
            success: true,
            meetLink: session.meetLink,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }
};


module.exports = {
    createSession,
    getMySessions,
    joinSession,
};