// test-resend-email.js
require('dotenv').config();
const { Resend } = require('resend');

console.log('🔍 Testing Resend Email Configuration...\n');

// Check if environment variables are set
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ SET (hidden)' : '❌ NOT SET');
console.log('FAMILY_EMAIL:', process.env.FAMILY_EMAIL || '❌ NOT SET');
console.log('\n');

if (!process.env.RESEND_API_KEY || !process.env.FAMILY_EMAIL) {
  console.log('❌ Error: Missing configuration in .env file');
  console.log('Please make sure both variables are set:\n');
  console.log('RESEND_API_KEY=your-resend-api-key');
  console.log('FAMILY_EMAIL=recipient@gmail.com\n');
  process.exit(1);
}

const resend = new Resend(process.env.RESEND_API_KEY);

console.log('📧 Sending test email via Resend...\n');

async function sendTestEmail() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Roman Celebration <notifications@resend.dev>',
      to: [process.env.FAMILY_EMAIL],
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
              <h2 style="margin: 10px 0 0 0;">Resend Email System is Working!</h2>
            </div>
            <div class="content">
              <div class="success">
                <h3 style="margin: 0;">✅ RESEND SUCCESS!</h3>
              </div>
              <p><strong>If you're seeing this email, your Resend notification system is configured correctly!</strong></p>
              <p>You will now receive notifications whenever someone RSVPs for Roman's celebration.</p>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
              <p style="font-size: 14px; color: #666;">
                <strong>Configuration Details:</strong><br>
                Service: Resend<br>
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
    });

    if (error) {
      console.log('❌ Failed to send test email!');
      console.log('Error:', error.message);
      return;
    }

    console.log('✅ Test email sent successfully via Resend!');
    console.log('Email ID:', data.id);
    console.log(`\n📬 Check inbox: ${process.env.FAMILY_EMAIL}`);
    console.log('   (Also check Spam/Junk folder)\n');
    
  } catch (error) {
    console.log('❌ Error sending test email:');
    console.log(error);
  }
}

sendTestEmail();