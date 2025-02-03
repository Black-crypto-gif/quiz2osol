const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "fethimellal@gmail.com",
    pass: "0780795322FethiMellal",
  },
});

exports.sendResults = functions.firestore.document("scores/{docId}")
  .onCreate((snap, context) => {
    const data = snap.data();
    const mailOptions = {
      from: "your-email@gmail.com",
      to: data.email,
      subject: "نتيجة الاختبار",
      text: `مرحبًا ${data.fullName}،\n\nحصلت على نسبة ${data.score}% في اختبارك.\n\nأخطاءك كانت في:\n${data.mistakes.join("\n")}`,
    };

    return transporter.sendMail(mailOptions)
      .then(() => console.log("Email sent successfully"))
      .catch((error) => console.error("Error sending email:", error));
  });
