import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Lightbulb, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContactFormProps {
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'compact' | 'suggestions';
}

export default function ContactForm({ 
  title = "Contact Us", 
  subtitle = "Get in touch with our team",
  variant = 'default' 
}: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    try {
      // Create mailto link with form data
      const subject = variant === 'suggestions' 
        ? `RidePilot Feature Suggestion: ${formData.subject || 'New Idea'}`
        : `Contact Form: ${formData.subject}`;
      
      const body = variant === 'suggestions'
        ? `Hi RidePilot Team,

I have a suggestion for improving RidePilot:

IDEA/SUGGESTION:
${formData.message}

ADDITIONAL DETAILS:
Subject: ${formData.subject}

Contact Information:
Name: ${formData.name}
Email: ${formData.email}

Looking forward to seeing this implemented!

Best regards,
${formData.name}`
        : `Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}`;

      const mailtoLink = `mailto:ridepilot.info@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      // Open email client
      window.location.href = mailtoLink;
      
      // Show success message
      setStatus('success');
      
      // Reset form after success
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setStatus('idle');
      }, 3000);

    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
      setErrorMessage('Failed to open email client. Please email us directly at ridepilot.info@gmail.com');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center bg-green-100 rounded-full px-4 py-2 mb-4">
            <Lightbulb className="w-5 h-5 mr-2 text-green-600" />
            <span className="text-sm font-medium text-green-800">Got Ideas?</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Keep the ideas coming—we're listening!
          </h3>
          <p className="text-gray-600">
            We'll go through all your suggestions and bring the best ones to life.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          
          <input
            type="text"
            name="subject"
            placeholder="Feature idea or improvement"
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          />
          
          <textarea
            name="message"
            placeholder="Tell us about your idea..."
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
            required
          />

          {status === 'success' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center bg-green-100 text-green-700 p-3 rounded-lg"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Thank you! Your suggestion has been sent.</span>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start bg-red-100 text-red-700 p-3 rounded-lg"
            >
              <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{errorMessage}</span>
            </motion.div>
          )}
          
          <button
            type="submit"
            disabled={status === 'sending'}
            className={`w-full flex items-center justify-center py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
              status === 'sending'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl'
            } text-white`}
          >
            {status === 'sending' ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Send Suggestion
              </>
            )}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center bg-blue-100 rounded-full px-4 py-2 mb-4">
          <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Get in Touch</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject *
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message *
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            required
          />
        </div>

        {status === 'success' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center bg-green-100 text-green-700 p-4 rounded-lg"
          >
            <CheckCircle className="w-6 h-6 mr-3" />
            <span>Thank you for your message! We'll get back to you soon.</span>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start bg-red-100 text-red-700 p-4 rounded-lg"
          >
            <AlertCircle className="w-6 h-6 mr-3 mt-0.5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </motion.div>
        )}
        
        <button
          type="submit"
          disabled={status === 'sending'}
          className={`w-full flex items-center justify-center py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
            status === 'sending'
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl'
          } text-white`}
        >
          {status === 'sending' ? (
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
          ) : (
            <>
              <Send className="w-6 h-6 mr-3" />
              Send Message
            </>
          )}
        </button>
      </form>
    </div>
  );
}