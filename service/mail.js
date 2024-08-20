  const nodemailer = require('nodemailer');

  async function SendMail({from,to,subject,text,html,attachments}){
  let transporter = nodemailer.createTransport({
    host : process.env.SMPT_HOST,
    port : process.env.SMPT_PORT,
    secure : true,
    auth : {
      user : process.env.USER,
      pass : process.env.PASSWORD
    },
  }) 
  let info = await transporter.sendMail({
    from : from,
    to : to,
    subject : subject,
    text : text,
    html : html,
    attachments: attachments
  })
  }

  module.exports = SendMail;