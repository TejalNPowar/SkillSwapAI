const Session = require("../models/Session");
const SwapRequest = require("../models/SwapRequest");
const User = require("../models/User");

const createSession = async (req, res) => {
    try {

        const {
            studentId,
            swapRequestId,
            skill,
            scheduledDate,
            duration,
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





        const session = await Session.create({

            teacher: teacherId,

            student: studentId,

            swapRequest: swapRequestId,

            skill,

            scheduledDate,

            duration,

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

module.exports = {
    createSession,
};