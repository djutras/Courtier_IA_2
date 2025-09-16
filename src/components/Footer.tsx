import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, Mail, Phone, MapPin, Languages } from 'lucide-react';

interface FooterProps {
  language?: 'en' | 'fr';
}

export function Footer({ language: propLanguage }: FooterProps = {}) {
  const location = useLocation();
  const isEnglish = location.pathname.includes('/en/');
  const language = propLanguage || (isEnglish ? 'en' : 'fr');

  const content = {
    en: {
      company: "Sam AI Auto Expert",
      tagline: "Your AI-powered car buying assistant",
      description: "Get the best car deals without any work. Sam negotiates with multiple dealerships to secure the lowest prices for you.",
      navigation: {
        title: "Navigation",
        links: [
          { label: "How it Works", path: "/en/how-it-works" },
          { label: "Privacy", path: "/en/privacy" },
          { label: "Contact", path: "/en/contact" }
        ]
      },
      contact: {
        title: "Contact Info",
        email: "support@sam-auto-ai.com",
        phone: "1-800-SAM-AUTO",
        address: "Montreal, Quebec, Canada"
      },
      legal: {
        copyright: "© 2025 Sam AI Auto Expert. All rights reserved.",
        terms: "Terms of Service",
        privacy: "Privacy Policy"
      }
    },
    fr: {
      company: "Sam Expert Auto IA",
      tagline: "Votre assistant d'achat automobile alimenté par l'IA",
      description: "Obtenez les meilleures offres auto sans aucun travail. Sam négocie avec plusieurs concessionnaires pour vous sécuriser les prix les plus bas.",
      navigation: {
        title: "Navigation",
        links: [
          { label: "Fonctionnement", path: "/fr/fonctionnement" },
          { label: "Confidentialité", path: "/fr/confidentialite" },
          { label: "Contact", path: "/fr/contact" }
        ]
      },
      contact: {
        title: "Coordonnées",
        email: "support@sam-auto-ia.com",
        phone: "1-800-SAM-AUTO",
        address: "Montréal, Québec, Canada"
      },
      legal: {
        copyright: "© 2025 Sam Expert Auto IA. Tous droits réservés.",
        terms: "Conditions de Service",
        privacy: "Politique de Confidentialité"
      }
    }
  };

  const currentContent = content[language];

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                <Car className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
                  {currentContent.company}
                </h3>
                <p className="text-blue-200 text-sm">
                  {currentContent.tagline}
                </p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
              {currentContent.description}
            </p>
            
            {/* Language Toggle */}
            <div className="flex items-center gap-3">
              <Languages className="w-5 h-5 text-blue-300" />
              <div className="flex items-center gap-2 bg-white bg-opacity-10 rounded-lg p-1">
                <Link
                  to={language === 'en' ? "/en/how-it-works" : "/fr/fonctionnement"}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    language === 'fr' 
                      ? 'bg-white text-indigo-700' 
                      : 'text-blue-200 hover:text-white'
                  }`}
                >
                  FR
                </Link>
                <Link
                  to={language === 'en' ? "/en/how-it-works" : "/fr/fonctionnement"}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    language === 'en' 
                      ? 'bg-white text-indigo-700' 
                      : 'text-blue-200 hover:text-white'
                  }`}
                >
                  EN
                </Link>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-200">
              {currentContent.navigation.title}
            </h4>
            <ul className="space-y-3">
              {currentContent.navigation.links.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <div className="w-1 h-1 bg-blue-400 rounded-full group-hover:bg-white transition-colors"></div>
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/chat"
                  className="text-blue-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group font-medium"
                >
                  <div className="w-1 h-1 bg-blue-400 rounded-full group-hover:bg-white transition-colors"></div>
                  {language === 'en' ? 'Start Chat' : 'Commencer le Chat'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-200">
              {currentContent.contact.title}
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-400" />
                <a 
                  href={`mailto:${currentContent.contact.email}`}
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  {currentContent.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-400" />
                <a 
                  href={`tel:${currentContent.contact.phone}`}
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  {currentContent.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300">
                  {currentContent.contact.address}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              {currentContent.legal.copyright}
            </p>
            <div className="flex items-center gap-6">
              <Link
                to={language === 'en' ? '/en/privacy' : '/fr/confidentialite'}
                className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
              >
                {currentContent.legal.privacy}
              </Link>
              <span className="text-gray-600">•</span>
              <Link
                to={language === 'en' ? '/en/terms' : '/fr/conditions'}
                className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
              >
                {currentContent.legal.terms}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}