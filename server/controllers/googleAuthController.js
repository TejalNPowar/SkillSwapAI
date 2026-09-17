const { google } = require("googleapis");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);


// Step 1: Send user to Google
const googleAuth = (req, res) => {

    try {

        // Create a temporary state containing the logged-in user's ID
        const state = jwt.sign(
            {
                userId: req.user.id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "10m",
            }
        );

        const authUrl = oauth2Client.generateAuthUrl({

            access_type: "offline",

            scope: [
                "https://www.googleapis.com/auth/meetings.space.created",
            ],

            prompt: "consent",

            state,

        });

        res.json({
            success: true,
            authUrl,
        });

    } catch (error) {

        console.error("Google Auth Error:", error);

        res.status(500).send(
            "Failed to start Google authentication."
        );
    }
};


// Step 2: Google sends user back
const googleCallback = async (req, res) => {

    try {

        const { code, state } = req.query;

        if (!code) {
            return res.status(400).send(
                "Authorization code missing."
            );
        }

        if (!state) {
            return res.status(400).send(
                "OAuth state missing."
            );
        }


        // Verify state
        const decoded = jwt.verify(
            state,
            process.env.JWT_SECRET
        );

        const userId = decoded.userId;


        // Exchange authorization code for tokens
        const { tokens } = await oauth2Client.getToken(code);

        console.log("Google tokens received.");


        // Find SkillSwap user
        const user = await User.findById(userId);

        if (!user) {

            return res.status(404).send(
                "SkillSwap user not found."
            );
        }


        // Save refresh token
        if (tokens.refresh_token) {

            user.googleRefreshToken = tokens.refresh_token;

            await user.save();

        }


        console.log("Google account connected to:", user.email);


        res.send(`
            <h2>Google account connected successfully! 🎉</h2>

            <p>
                Your Google account is now connected to SkillSwap AI.
            </p>

            <p>
                You can close this tab and return to SkillSwap AI.
            </p>
        `);

    } catch (error) {

        console.error("Google OAuth Error:", error);

        res.status(500).send(
            "Failed to connect Google account."
        );
    }
};


module.exports = {
    googleAuth,
    googleCallback,
};