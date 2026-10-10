const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const createTransporter = () => {
    const host = (process.env.SMTP_HOST || "").trim();
    const username = (process.env.SMTP_USER || "").trim();
    const rawPassword = process.env.SMTP_PASSWORD || "";
    const password = host.toLowerCase() === "smtp.gmail.com"
        ? rawPassword.replace(/\s/g, "")
        : rawPassword;

    if (!host || !username || !password) {
        const error = new Error("SMTP_HOST, SMTP_USER and SMTP_PASSWORD must be configured in server/.env.");
        error.code = "SMTP_CONFIG_MISSING";
        throw error;
    }
    if (host.toLowerCase() === "smtp.gmail.com" && password.length !== 16) {
        const error = new Error("Gmail SMTP_PASSWORD must be a valid 16-character Google App Password, not the normal Gmail password.");
        error.code = "GMAIL_APP_PASSWORD_REQUIRED";
        throw error;
    }

    const port = Number(process.env.SMTP_PORT || 465);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        const error = new Error("SMTP_PORT must be a valid port number.");
        error.code = "SMTP_CONFIG_INVALID";
        throw error;
    }
    const configuredSecure = process.env.SMTP_SECURE;
    const secure = configuredSecure == null || configuredSecure.trim() === ""
        ? port === 465
        : configuredSecure.trim().toLowerCase() === "true";

    return nodemailer.createTransport({
        host,
        port,
        secure,
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 20000,
        auth: { user: username, pass: password },
    });
};

const sendVerificationEmail = async ({
    email,
    name,
    otp,
    purpose = "email_verification",
}) => {
    if (!email) {
        throw new Error("Recipient email is required");
    }

    if (!otp) {
        throw new Error("OTP is required");
    }

    const isPasswordReset = purpose === "password_reset";
    const subject = isPasswordReset ? "Your Hermes password reset code" : "Hermes email verification code";
    const action = isPasswordReset ? "reset your Hermes password" : "verify your Hermes email";

    const smtpHost = (process.env.SMTP_HOST || "").trim().toLowerCase();
    const smtpUser = (process.env.SMTP_USER || "").trim();
    const from = smtpHost === "smtp.gmail.com"
        ? `Hermes <${smtpUser}>`
        : (process.env.SMTP_FROM || `Hermes <${smtpUser}>`);

    const message = {
        // Gmail only allows the authenticated account (or a configured alias)
        // as the sender. Use the authenticated address to avoid mismatched From.
        from,

        ...(smtpUser && { replyTo: smtpUser }),

        to: email,

        subject,

        text: `
Hello ${name || "there"},

Your Hermes code to ${action} is:

${otp}

This code expires in 10 minutes.

If you did not create a Hermes account, you can ignore this email.

— Hermes
        `.trim(),

        html: `
            <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto;">
                <h2>${isPasswordReset ? "Reset your Hermes password" : "Verify your Hermes account"}</h2>

                <p>Hello ${name || "there"},</p>

                <p>Your code to ${action} is:</p>

                <div style="
                    font-size: 32px;
                    font-weight: bold;
                    letter-spacing: 8px;
                    padding: 18px;
                    background: #f3f4f6;
                    text-align: center;
                    border-radius: 10px;
                ">
                    ${otp}
                </div>

                <p>
                    This code expires in <strong>10 minutes</strong>.
                </p>

                <p>
                    If you did not create a Hermes account, you can ignore this email.
                </p>

                <p>— Hermes</p>
            </div>
        `,
    };

    const transporter = createTransporter();
    const delivery = await transporter.sendMail(message);

    const wasAccepted = (delivery.accepted || []).some(
        (recipient) => String(recipient).toLowerCase() === email.trim().toLowerCase()
    );
    if (!wasAccepted) {
        const error = new Error("The SMTP server did not accept the verification email recipient.");
        error.code = "EMAIL_RECIPIENT_REJECTED";
        throw error;
    }

    console.info("Verification email accepted by SMTP provider");
};

const verifyEmailTransport = async () => {
    const transporter = createTransporter();
    await transporter.verify();

    console.log("Hermes SMTP connection verified");
};

module.exports = {
    sendVerificationEmail,
    verifyEmailTransport,
};
