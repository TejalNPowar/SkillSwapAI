const { google } = require("googleapis");
const User = require("../models/User");


// Create Google Meet for a SkillSwap user
const createMeetForUser = async (userId) => {

    // Find SkillSwap user
    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found.");
    }

    // Check Google connection
    if (!user.googleRefreshToken) {
        throw new Error("Google account is not connected.");
    }

    // Create OAuth client
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    // Use saved refresh token
    oauth2Client.setCredentials({
        refresh_token: user.googleRefreshToken
    });

    // Create Google Meet API client
    const meet = google.meet({
        version: "v2",
        auth: oauth2Client
    });

    // Create Meet space
    const response = await meet.spaces.create({
        requestBody: {}
    });

    console.log("Google Meet created:", response.data);

    return {
        meetLink: response.data.meetingUri,
        meetSpaceName: response.data.name,
        space: response.data
    };
};


// HTTP controller
const createMeet = async (req, res) => {

    try {

        const result = await createMeetForUser(req.user.id);

        return res.status(200).json({
            success: true,
            message: "Google Meet created successfully.",
            meetLink: result.meetLink,
            space: result.space
        });

    } catch (error) {

        console.error("Google Meet Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create Google Meet.",
            error: error.message
        });
    }
};


module.exports = {
    createMeet,
    createMeetForUser
};