const nodemailer = require('nodemailer');

exports.transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: "bilalmuhammad0324@gmail.com",
        pass: "qeis uwgm weuk pimy",
    },
});
