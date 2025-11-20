const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

// Function to send notification email
const sendNotificationEmail = async (rsvpData) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.FAMILY_EMAIL,
    subject: `🎉 New RSVP: ${rsvpData.name} - Roman's Celebration`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #d97706, #ea580c, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .detail { margin: 15px 0; padding: 15px; background: white; border-left: 4px solid #d97706; border-radius: 5px; }
          .label { font-weight: bold; color: #d97706; margin-bottom: 5px; }
          .value { color: #333; font-size: 16px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          .crown { font-size: 40px; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="crown">👑</div>
            <h1 style="margin: 0;">New RSVP Received!</h1>
            <p style="margin: 10px 0 0 0;">Someone just confirmed their attendance for Roman's celebration</p>
          </div>
          <div class="content">
            <div class="detail">
              <div class="label">Guest Name:</div>
              <div class="value">${rsvpData.name}</div>
            </div>
            
            <div class="detail">
              <div class="label">Number of Guests:</div>
              <div class="value">${rsvpData.guests} ${rsvpData.guests === 1 ? 'Guest' : 'Guests'}</div>
            </div>
            
            ${rsvpData.message ? `
            <div class="detail">
              <div class="label">Message:</div>
              <div class="value">${rsvpData.message}</div>
            </div>
            ` : ''}
            
            <div class="detail">
              <div class="label">Submitted On:</div>
              <div class="value">${new Date(rsvpData.createdAt).toLocaleString('en-KE', { 
                dateStyle: 'full', 
                timeStyle: 'short',
                timeZone: 'Africa/Nairobi'
              })}</div>
            </div>
            
            <div class="footer">
              <p>🎊 Harambee! Let us all pull together 🎊</p>
              <p style="font-size: 12px; color: #999;">This is an automated notification from Roman's Celebration RSVP System</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Notification email sent successfully');
  } catch (error) {
    console.error('Error sending notification email:', error);
    // Don't throw error - we don't want to fail the RSVP if email fails
  }
};

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/roman-celebration', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// RSVP Schema
const rsvpSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  guests: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  message: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const RSVP = mongoose.model('RSVP', rsvpSchema);

// Routes

// Create RSVP
app.post('/api/rsvp', async (req, res) => {
  try {
    const { name, guests, message } = req.body;

    // Validation
    if (!name || !guests) {
      return res.status(400).json({ 
        message: 'Please provide name and number of guests' 
      });
    }

    const rsvp = new RSVP({
      name,
      guests: parseInt(guests),
      message
    });

    await rsvp.save();

    res.status(201).json({ 
      message: 'RSVP confirmed successfully!',
      rsvp 
    });
  } catch (error) {
    console.error('Error creating RSVP:', error);
    res.status(500).json({ 
      message: 'Error submitting RSVP. Please try again.' 
    });
  }
});

// Get all RSVPs (for admin view)
app.get('/api/rsvp/all', async (req, res) => {
  try {
    const rsvps = await RSVP.find().sort({ createdAt: -1 });
    res.json(rsvps);
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    res.status(500).json({ 
      message: 'Error fetching RSVPs' 
    });
  }
});

// Get RSVP stats
app.get('/api/rsvp/stats', async (req, res) => {
  try {
    const totalRsvps = await RSVP.countDocuments();
    const guestsAggregation = await RSVP.aggregate([
      {
        $group: {
          _id: null,
          totalGuests: { $sum: '$guests' }
        }
      }
    ]);

    const totalGuests = guestsAggregation.length > 0 ? guestsAggregation[0].totalGuests : 0;

    res.json({ 
      totalRsvps, 
      totalGuests 
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      message: 'Error fetching statistics' 
    });
  }
});

// Delete RSVP (for admin)
app.delete('/api/rsvp/:id', async (req, res) => {
  try {
    const rsvp = await RSVP.findByIdAndDelete(req.params.id);
    if (!rsvp) {
      return res.status(404).json({ message: 'RSVP not found' });
    }
    res.json({ message: 'RSVP deleted successfully' });
  } catch (error) {
    console.error('Error deleting RSVP:', error);
    res.status(500).json({ message: 'Error deleting RSVP' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});