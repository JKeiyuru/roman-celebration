// test-email.js
// Run this to test if your email configuration is working
// Usage: node test-email.js

require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('🔍 Testing Email Configuration...\n');

// Check if environment variables are set
console.log('EMAIL_USER:', process.env.EMAIL_USER || '❌ NOT SET');
console.log('EMAIL_APP_PASSWORD:', process.env.EMAIL_APP_PASSWORD ? '✅ SET (hidden)' : '❌ NOT SET');
console.log('FAMILY_EMAIL:', process.env.FAMILY_EMAIL || '❌ NOT SET');
console.log('\n');

if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD || !process.env.FAMILY_EMAIL) {
  console.log('❌ Error: Missing email configuration in .env file');
  console.log('Please make sure all three variables are set:\n');
  console.log('EMAIL_USER=your-email@gmail.com');
  console.log('EMAIL_APP_PASSWORD=your-16-char-app-password');
  console.log('FAMILY_EMAIL=recipient@gmail.com\n');
  process.exit(1);
}

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

// Verify connection
console.log('📡 Verifying SMTP connection...\n');
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ SMTP Connection Failed!');
    console.log('Error:', error.message);
    console.log('\n💡 Common fixes:');
    console.log('1. Make sure you\'re using Gmail App Password (not regular password)');
    console.log('2. Enable 2-Step Verification in Google Account');
    console.log('3. Generate App Password at: https://myaccount.google.com/apppasswords');
    console.log('4. Make sure EMAIL_APP_PASSWORD has no extra spaces\n');
  } else {
    console.log('✅ SMTP Connection Successful!\n');
    
    // Send test email
    console.log('📧 Sending test email...\n');
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.FAMILY_EMAIL,
      subject: '🎉 Test Email - Roman\'s Celebration RSVP System',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #d97706, #ea580c, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .success { background: #10b981; color: white; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">👑</h1>
              <h2 style="margin: 10px 0 0 0;">Email System is Working!</h2>
            </div>
            <div class="content">
              <div class="success">
                <h3 style="margin: 0;">✅ SUCCESS!</h3>
              </div>
              <p><strong>If you're seeing this email, your notification system is configured correctly!</strong></p>
              <p>You will now receive notifications whenever someone RSVPs for Roman's celebration.</p>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
              <p style="font-size: 14px; color: #666;">
                <strong>Configuration Details:</strong><br>
                From: ${process.env.EMAIL_USER}<br>
                To: ${process.env.FAMILY_EMAIL}<br>
                Date: ${new Date().toLocaleString('en-KE', { 
                  dateStyle: 'full', 
                  timeStyle: 'short',
                  timeZone: 'Africa/Nairobi'
                })}
              </p>
              <p style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
                🎊 Harambee! Let us all pull together 🎊
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('❌ Failed to send test email!');
        console.log('Error:', error.message);
      } else {
        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log(`\n📬 Check inbox: ${process.env.FAMILY_EMAIL}`);
        console.log('   (Also check Spam/Junk folder)\n');
      }
    });
  }
});