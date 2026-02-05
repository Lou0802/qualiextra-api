import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: './.env' }); // charge correctement le .env même depuis src/utils

// === Configuration SMTP Mailtrap ===
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD,
  }
});

// === Fonction pour envoyer un email de vérification ===
export const sendVerificationEmail = async (email, token) => {
  const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`;
  try {
    await transporter.sendMail({
      from: `"Qualiextra" <no-reply@example.com>`,
      to: email,
      subject: "Vérifiez votre email",
      html: `
        <p>Bonjour,</p>
        <p>Cliquez sur ce lien pour vérifier votre email :</p>
        <a href="${verificationLink}">${verificationLink}</a>
      `,
    });
    console.log(`Email envoyé à ${email}`);
  } catch (err) {
    console.error("Erreur lors de l'envoi de l'email :", err);
  }
};

// === Test simple ===
if (process.argv.includes("--test-email")) {
  (async () => {
    try {
      await transporter.sendMail({
        from: '"Qualiextra" <no-reply@example.com>',
        to: "test@example.com", // envoie à la sandbox Mailtrap
        subject: "Test Email SMTP",
        text: "Si tu reçois cet email, SMTP Mailtrap fonctionne !",
      });
      console.log("Test email envoyé !");
    } catch (err) {
      console.error("Erreur SMTP :", err);
    }
  })();
}