import nodemailer from "nodemailer";

// import catchAsync from "./catchAsync";

/*
options: {
    from: sender
    to: [recipent emails],
    subject: email title
    message: email message,
    type: text | html,

}
*/
const sendMail = async (options) => {
  // Only needed if you don't have a real mail account for testing
  const client = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  const transport = nodemailer.createTransport({
    host: process.env.MAIL_SERVICE_HOST,
    port: process.env.MAIL_SERVICE_PORT,
    auth: {
      user: process.env.MAIL_SERVICE_USER,
      pass: process.env.MAIL_SERVICE_PASS,
    },
  });

  // send mail with defined transport object
  let info = await transport.sendMail({
    from: options.from || '"Natrous Customer Serivces" <foo@natrous.com>', // sender address
    to: typeof options.to === "string" ? options.to : options.to.join(","), // list of receivers
    subject: options.subject, // Subject line
    text: options.type === "text" ? options.message : undefined, // plain text body
    html: options.type === "html" ? options.message : undefined, // // html body
  });

  return info;
};

export default sendMail;
