import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, MessageCircle, Languages, Globe } from 'lucide-react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { sendToMakeWebhook } from '../services/webhook';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export function Contact() {
  const location = useLocation();
  const isEnglish = location.pathname.includes('/en/');
  const language = isEnglish ? 'en' : 'fr';

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const content = {
    en: {
      title: "Contact Us",
      subtitle: "Get in touch with our team",
      description: "Have questions about Sam AI Auto Expert? We're here to help you get the best car deals.",
      form: {
        title: "Send us a message",
        name: "Full Name",
        email: "Email Address",
        phone: "Phone Number",
        subject: "Subject",
        message: "Message",
        submit: "Send Message",
        submitting: "Sending...",
        success: "Message sent successfully!",
        successDesc: "We'll get back to you within 24 hours.",
        error: "Failed to send message",
        errorDesc: "Please try again or contact us directly."
      },
      info: {
        title: "Contact Information",
        email: "support@sam-auto-ai.com",
        phone: "1-800-SAM-AUTO",
        address: "Montreal, Quebec, Canada",
        hours: "Monday - Friday: 9:00 AM - 6:00 PM EST"
      }
    },
    fr: {
      title: "Nous Contacter",
      subtitle: "Entrez en contact avec notre équipe",
      description: "Vous avez des questions sur Sam Expert Auto IA ? Nous sommes là pour vous aider à obtenir les meilleures offres auto.",
      form: {
        title: "Envoyez-nous un message",
        name: "Nom complet",
        email: "Adresse courriel",
        phone: "Numéro de téléphone",
        subject: "Sujet",
        message: "Message",
        submit: "Envoyer le message",
        submitting: "Envoi en cours...",
        success: "Message envoyé avec succès !",
        successDesc: "Nous vous répondrons dans les 24 heures.",
        error: "Échec de l'envoi du message",
        errorDesc: "Veuillez réessayer ou nous contacter directement."
      },
      info: {
        title: "Coordonnées",
        email: "support@sam-auto-ia.com",
        phone: "1-800-SAM-AUTO",
        address: "Montréal, Québec, Canada",
        hours: "Lundi - Vendredi : 9h00 - 18h00 EST"
      }
    }
  };

  const currentContent = content[language];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Send to webhook
      const webhookPayload = {
        message: `Contact form submission from ${formData.name}`,
        response: `Subject: ${formData.subject}\nMessage: ${formData.message}`,
        timestamp: new Date().toISOString(),
        conversationId: `contact_${Date.now()}`,
        email: formData.email,
        fullHistory: [
          { role: 'user', content: `Name: ${formData.name}` },
          { role: 'user', content: `Email: ${formData.email}` },
          { role: 'user', content: `Phone: ${formData.phone}` },
          { role: 'user', content: `Subject: ${formData.subject}` },
          { role: 'user', content: `Message: ${formData.message}` }
        ],
        formType: 'contact',
        contactData: formData
      };

      await sendToMakeWebhook(webhookPayload);
      console.log('Contact form sent to webhook successfully');
      
      setSubmitStatus('success');
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        setSubmitStatus('idle');
      }, 3000);
      
    } catch (error) {
      console.error('Contact form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation />
      
      {/* Language Toggle */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Globe size={16} />
              <span>{language === 'en' ? 'Language:' : 'Langue:'}</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <Languages size={16} className="text-gray-600" />
              <Link
                to="/fr/contact"
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  language === 'fr' 
                    ? 'bg-white text-indigo-700 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                FR
              </Link>
              <Link
                to="/en/contact"
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  language === 'en' 
                    ? 'bg-white text-indigo-700 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                EN
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-4 rounded-full">
              <MessageCircle className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 bg-clip-text text-transparent">
            {currentContent.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-4">
            {currentContent.subtitle}
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            {currentContent.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {currentContent.form.title}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  {currentContent.form.name} *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  placeholder={currentContent.form.name}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {currentContent.form.email} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    {currentContent.form.phone}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    placeholder="(514) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  {currentContent.form.subject} *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  placeholder={currentContent.form.subject}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  {currentContent.form.message} *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none"
                  placeholder={currentContent.form.message}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 text-white font-bold rounded-lg hover:from-blue-700 hover:via-indigo-800 hover:to-purple-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    {currentContent.form.submitting}
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    {currentContent.form.submit}
                  </>
                )}
              </button>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-green-800 font-medium">{currentContent.form.success}</p>
                    <p className="text-green-700 text-sm">{currentContent.form.successDesc}</p>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-red-800 font-medium">{currentContent.form.error}</p>
                    <p className="text-red-700 text-sm">{currentContent.form.errorDesc}</p>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {currentContent.info.title}
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <a 
                      href={`mailto:${currentContent.info.email}`}
                      className="text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      {currentContent.info.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <a 
                      href={`tel:${currentContent.info.phone}`}
                      className="text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      {currentContent.info.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Location</h3>
                    <p className="text-gray-600">{currentContent.info.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Start */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 rounded-3xl shadow-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                {language === 'en' ? 'Ready to Start?' : 'Prêt à commencer?'}
              </h3>
              <p className="text-blue-100 mb-6">
                {language === 'en' 
                  ? 'Skip the contact form and start your vehicle consultation right now!'
                  : 'Sautez le formulaire de contact et commencez votre consultation véhicule maintenant!'
                }
              </p>
              <Link
                to="/chat"
                className="inline-flex items-center gap-3 bg-white text-indigo-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
              >
                <MessageCircle className="w-5 h-5" />
                {language === 'en' ? 'Start Chat with Sam' : 'Commencer le Chat avec Sam'}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}