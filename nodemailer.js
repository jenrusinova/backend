const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD
  }
})

let regConfirmation = {
  from: 'petpix32@gmail.com',
  to: '',
  subject: 'PetPix Account Confirmation',
  text: 'Welcome to PetPix! Please press the button below to confirm your new account.'
}

module.exports = { transporter, regConfirmation };
