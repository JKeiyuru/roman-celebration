import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Send, CheckCircle, Users, Sparkles, Star, Crown } from 'lucide-react';

const RomanCelebration = () => {
  const [formData, setFormData] = useState({
    name: '',
    guests: 1,
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ totalGuests: 0, totalRsvps: 0 });
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/rsvp/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      setError('Please fill in your name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        fetchStats();
      } else {
        const data = await response.json();
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Could not submit RSVP. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Floating particles animation
  const FloatingParticle = ({ delay, duration, left }) => (
    <div 
      className="absolute w-2 h-2 bg-amber-400 rounded-full opacity-40"
      style={{
        left: `${left}%`,
        animation: `float ${duration}s ease-in-out ${delay}s infinite`,
        top: '100%'
      }}
    />
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.4; }
          50% { transform: translateY(-100vh) rotate(180deg); opacity: 0.6; }
          90% { opacity: 0.3; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(251, 191, 36, 0.3); }
          50% { box-shadow: 0 0 40px rgba(251, 191, 36, 0.6); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
          background: linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.3), transparent);
          background-size: 1000px 100%;
        }
        .pattern-overlay {
          background-image: 
            radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(249, 115, 22, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, rgba(239, 68, 68, 0.1) 0%, transparent 50%);
        }
      `}</style>

      {/* Animated Background Pattern */}
      <div className="pattern-overlay fixed inset-0 pointer-events-none" />
      
      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <FloatingParticle 
          key={i} 
          delay={i * 0.8} 
          duration={8 + Math.random() * 4}
          left={Math.random() * 100}
        />
      ))}

      {/* Decorative Pattern Overlay */}
      <div className="fixed inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v6h6V4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="relative">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
          {/* Animated Crown and Stars */}
          <div className="flex justify-center mb-8 relative">
            <div className="relative">
              <Crown className="w-20 h-20 text-amber-600 relative z-10" style={{
                filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.5))',
                animation: 'pulse-glow 2s ease-in-out infinite'
              }} />
              <Star className="w-6 h-6 text-amber-400 absolute -top-2 -left-2 animate-pulse" />
              <Star className="w-6 h-6 text-orange-400 absolute -top-2 -right-2 animate-pulse" style={{ animationDelay: '0.5s' }} />
              <Star className="w-5 h-5 text-red-400 absolute -bottom-1 left-1/2 -translate-x-1/2 animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-400 to-red-400 blur-2xl opacity-30 animate-pulse" />
            </div>
          </div>

          {/* Main Title with Shimmer Effect */}
          <div className="text-center space-y-6 mb-16">
            <div className="relative inline-block">
              <h1 className="text-6xl sm:text-7xl font-serif text-gray-900 tracking-tight relative z-10">
                Roman Kinyua
              </h1>
              <div className="absolute inset-0 animate-shimmer" />
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <div className="h-1 w-16 bg-gradient-to-r from-transparent to-amber-600 rounded-full" />
              <Sparkles className="w-6 h-6 text-amber-600 animate-pulse" />
              <div className="h-1 w-16 bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 rounded-full" />
              <Sparkles className="w-6 h-6 text-orange-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
              <div className="h-1 w-16 bg-gradient-to-l from-transparent to-red-600 rounded-full" />
            </div>
            
            <p className="text-2xl sm:text-3xl text-amber-800 font-light tracking-wide">
              A Celebration of Heritage
            </p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              You are cordially invited to join the Kinyua family as we celebrate Roman's successful passage through a sacred rite of our ancestors - a moment of pride, tradition, and new beginnings.
            </p>
          </div>

          {/* Decorative Quote with Animated Border */}
          <div className="max-w-3xl mx-auto mb-16 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-sm" />
            <div className="relative p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200">
              <div className="text-center">
                <div className="text-5xl text-amber-600 mb-4">"</div>
                <p className="text-xl text-gray-700 italic font-light mb-4">
With courage and grace, a boy steps toward the man he is becoming. And as our fathers did before us, we gather to witness a new path begin.                </p>
                <div className="text-5xl text-amber-600 rotate-180">"</div>
                <p className="text-sm text-gray-500 mt-4">— African Proverb</p>
              </div>
            </div>
          </div>

          {/* Event Details with Hover Effects */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-amber-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="relative">
                <Calendar className="w-12 h-12 text-amber-600 mb-4 mx-auto group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-amber-400 blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">Date</h3>
              <p className="text-gray-600 text-center">Saturday, December 13th, 2025</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-amber-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="relative">
                <Clock className="w-12 h-12 text-amber-600 mb-4 mx-auto group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-orange-400 blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">Time</h3>
              <p className="text-gray-600 text-center">From 12:00 PM Onwards</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-amber-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="relative">
                <MapPin className="w-12 h-12 text-amber-600 mb-4 mx-auto group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-red-400 blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">Venue</h3>
              <p className="text-gray-600 text-center mb-3">Hotel Troy, Karen</p>
              <button
                onClick={() => setShowMap(!showMap)}
                className="text-amber-600 hover:text-amber-700 text-sm font-medium underline underline-offset-2"
              >
                {showMap ? 'Hide Map' : 'View Map'}
              </button>
            </div>
          </div>

          {/* Google Maps Embed */}
          {showMap && (
            <div className="max-w-4xl mx-auto mb-16 rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-200 animate-[fadeIn_0.5s_ease-in-out]">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7106074562303!2d36.759569899999995!3d-1.3501584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f0537ef92c5a1%3A0xc936be83c5005629!2sHotel%20Troy!5e0!3m2!1sen!2ske!4v1763619884788!5m2!1sen!2ske" 
                width="100%" 
                height="450" 
                style={{ border: 0 }}
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Hotel Troy Location"
              />
              <div className="bg-white/90 backdrop-blur-sm p-4 text-center">
                <p className="text-gray-700 font-medium">Hotel Troy - Magadi Road, Karen</p>
                <a 
                  href="https://maps.app.goo.gl/xRD11YFRZAqunbRx5" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-amber-600 hover:text-amber-700 text-sm underline"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          )}

          {/* Stats with Animation */}
          <div className="flex justify-center gap-8 mb-16">
            <div className="text-center transform hover:scale-110 transition-transform duration-300">
              <div className="flex items-center justify-center gap-2 text-4xl font-bold text-amber-700 mb-2">
                <Users className="w-8 h-8 animate-pulse" />
                <span className="tabular-nums">{stats.totalRsvps}</span>
              </div>
              <p className="text-sm text-gray-600">Families Confirmed</p>
            </div>
            <div className="w-px bg-gradient-to-b from-transparent via-amber-300 to-transparent" />
            <div className="text-center transform hover:scale-110 transition-transform duration-300">
              <div className="flex items-center justify-center gap-2 text-4xl font-bold text-amber-700 mb-2">
                <CheckCircle className="w-8 h-8 animate-pulse" style={{ animationDelay: '0.5s' }} />
                <span className="tabular-nums">{stats.totalGuests}</span>
              </div>
              <p className="text-sm text-gray-600">Total Guests</p>
            </div>
          </div>

          {/* RSVP Form */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-amber-200 overflow-hidden animate-pulse-glow">
              <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                <Crown className="w-12 h-12 text-white mx-auto mb-3 relative z-10" />
                <h2 className="text-3xl font-serif text-white mb-2 relative z-10">Confirm Your Presence</h2>
                <p className="text-amber-50 relative z-10">Please let us know if you'll be joining us</p>
              </div>

              <div className="p-8">
                {!submitted ? (
                  <div className="space-y-6">
                    <div className="transform transition-all duration-300 hover:scale-[1.02]">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="transform transition-all duration-300 hover:scale-[1.02]">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Guests *
                      </label>
                      <select
                        name="guests"
                        value={formData.guests}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                          <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                        ))}
                      </select>
                    </div>

                    <div className="transform transition-all duration-300 hover:scale-[1.02]">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message for the Family (Optional)
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none"
                        placeholder="Share your well wishes..."
                      />
                    </div>

                    {error && (
                      <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm animate-[shake_0.5s_ease-in-out]">
                        {error}
                      </div>
                    )}

                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 text-white py-4 px-8 rounded-xl font-semibold text-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Confirm Attendance
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-12 animate-[fadeIn_0.5s_ease-in-out]">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-[bounce_1s_ease-in-out]">
                      <CheckCircle className="w-14 h-14 text-white" />
                    </div>
                    <h3 className="text-3xl font-semibold text-gray-800 mb-4">
                      Asante Sana! 🎉
                    </h3>
                    <p className="text-gray-600 text-lg mb-2">
                      Your RSVP has been confirmed.
                    </p>
                    <p className="text-gray-500">
                      We look forward to celebrating with you at Hotel Troy!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-16 space-y-4">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Star className="w-4 h-4 text-amber-400 animate-pulse" />
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
              <Sparkles className="w-5 h-5 text-orange-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
              <Star className="w-4 h-4 text-amber-400 animate-pulse" style={{ animationDelay: '0.6s' }} />
            </div>
            <p className="text-gray-600 italic text-lg">
              “Let this gathering mark the rising of a new man.”
            </p>
            <p className="text-sm text-gray-500">
              With love, The Kinyua Family
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RomanCelebration;