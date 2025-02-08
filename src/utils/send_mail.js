const { text } = require("express");
const { transporter } = require("../configs/mail");


let template = `
<!doctype html>
<html ⚡4email data-css-strict>
    <head>
        <meta charset="utf-8">
        <style amp4email-boilerplate>body{visibility:hidden}</style>
        <script async src="https://cdn.ampproject.org/v0.js"></script>
        <style amp-custom>
            body {
                background-color: #f2f2f2;
            }
            h1 {
                background-color:rgb(140, 255, 230);
                padding: 20px;
                font-size: 20px;
                font-weight: bold;
                text-align: center;
                width: 100%;
                color: rgb(0, 23, 9);
            }

            .description {
                padding: 20px;
                font-size: 20px;
                text-align: center;
                width: 100%;
                color: rgb(0, 23, 9);
            }

        </style>
    </head>
    <body>
        <div class="header">
            <h1>{Title}</h1>
            <p class="description">{Description}</p></p>
        </div>
      
    </body>
</html>
`

function message_template({
    title,
    description,
    from,
    to,
    subject,
}) {
    return {
        from,
        to,
        subject,
        text: `${title}\n${description}\n`,
        html: `<div>
            <h1 style="background-color:rgb(140, 255, 230); padding: 20px; font-size: 20px; font-weight: bold; text-align: center; width: 100%; color: rgb(0, 23, 9);">${title}</h1>
            <p class="description" style="padding: 20px; font-size: 20px; text-align: center; width: 100%;">${description}</p>
        </div>`,
        amp: template
            .replace("{Title}", title)
            .replace("{Description}", description)
    }
}

function message_otp({ to, otp }) {
    return message_template({
        title: otp,
        description: "Votre code de securite expirera dans 5 minutes",
        fontSize: 32,
        from: "Maryme",
        to,
        subject: "Code OTP",
    })
}


async function send_otp(to, otp) {
    try {
        let info = await transporter.sendMail(message_otp({ to, otp }));
        return info;
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

module.exports = { send_otp };