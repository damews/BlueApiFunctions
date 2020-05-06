var nodemailer = require('nodemailer')

var uri = process.env.SMTP
// create reusable transporter object using the default SMTP transport

// var transporter = nodemailer.createTransport({
//     host: "smtp.mailtrap.io",
//     port: 2525,
//     auth: {
//       user: "876744663473c8",
//       pass: "1d4aff4306a6d7"
//     }
//   });
  var transporter = nodemailer.createTransport({
    host: "in-v3.mailjet.com",
    port: 587,
    auth: {
      user: "466530f7656d831f6fba7637a6c6c046",
      pass: "a7532a0b9a1f2473b76f1075490d775e"
    }
  });
  
// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'iblueitservice@gmail.com', // sender address
    to: 'difediv217@oriwijn.com', // list of receivers
    subject: 'Hello World', // Subject line
    html: '<b>Hello world !!!</b>' // html body
}

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
})