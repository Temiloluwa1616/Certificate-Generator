const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your_email@gmail.com",
    pass: "your_password",
  },
});

// Custom Function: Send Certificate Email
exports.sendCertificateEmail = functions.firestore
  .document("certificates/{certificateId}")
  .onCreate(async (snap) => {
    const { name, email, course, certificateURL } = snap.data();

    const mailOptions = {
      from: "your_email@gmail.com",
      to: email,
      subject: `Your Certificate for ${course}`,
      text: `Hi ${name},\n\nCongratulations on completing the ${course} course! Your certificate is ready: ${certificateURL}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${email}`);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  });

// Example Hello World function (optional, can be removed)
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});
