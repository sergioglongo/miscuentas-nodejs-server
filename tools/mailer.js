import config from "../config/config";
const nodemailer = require("nodemailer");
import fs from "fs";
import path from "path";

export function Code_Mail_Send(email, code) {
  const templatePath = path.join(
    __dirname,
    "../config/Templates",
    "templaterecovery.html"
  );
  const template = fs.readFileSync(templatePath, "utf8");

  const html = template.replace("{{codigo}}", code);

  const subject = "Enviado desde app miscuentas";

  // Envía el correo electrónico
  sendEmail(email, subject, html);
}

export async function Invalid_Member_Mail_Send(
  email,
  userStatus,
  membership
) {
  const html = `
  <html>
    <head>
      <title>Intento de inicio miembro inhabilitado</title>
    </head>
    <body>
      <h1>Miembro inhabilitado</h1>
      <p>Email: ${email}</p>
      <p>Situación de matricula: ${userStatus}</p>
      <p>Matricula: ${membership}</p>
    </body>
  </html>
`;

  const subject = "CPIA APP - Miembro inhabilitado";

  // Envía el correo electrónico
  await sendEmail(email, subject, html);
}

export async function Debit_Mail_Send(
  useremail,
  name,
  cardType,
  cardNumber
) {
  const html = `
    <html>
        <head>
        <title>Debito automatico</title>
        </head>
        <body>
        <h1>Debito automatico solicitado</h1>
        <p>Nombre y apellido en la tarjeta: ${name}</p>
        <p>Tipo de tarjeta: ${cardType}</p>
        <p>Número de tarjeta: ${cardNumber}</p>
        <p>Email de contacto: ${useremail}</p>
        </body>
    </html>
    `;

  const subject = "CPIA APP - Debito automatico solicitado";

  // Envía el correo electrónico
  await sendEmail("miscuentas@miscuentas.com", subject, html);
}

export default async function sendEmail(
  email,
  subject,
  html,
  attachment
) {
  const transporter = nodemailer.createTransport({
    host: "mail.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
  });

  const mailOptions = {
    from: config.email.user,
    to: email,
    subject: subject,
    html: html, // Embedded image links to content ID
    attachments: [
      {
        filename: "logo.png",
        path: "./config/service/Templates/logo.png",
        cid: "logo.png",
      },
      ...(attachment ? [attachment] : []),
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
}
