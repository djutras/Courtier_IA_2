import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Shield, Lock, Eye, UserCheck, Cookie, FileText, Languages, Globe } from 'lucide-react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

export function Privacy() {
  const location = useLocation();
  const isEnglish = location.pathname.includes('/en/');
  const language = isEnglish ? 'en' : 'fr';

  const content = {
    en: {
      title: "Privacy Policy",
      subtitle: "Your privacy and data security are our top priorities",
      lastUpdated: "Last updated: January 2025",
      sections: [
        {
          icon: FileText,
          title: "Information We Collect",
          content: [
            "Personal information you provide during vehicle consultation (name, contact details, preferences)",
            "Vehicle specifications and requirements you share with Sam AI",
            "Communication records between you and our AI system",
            "Technical information about your device and browser for service improvement",
            "Cookies and similar technologies for website functionality"
          ]
        },
        {
          icon: Eye,
          title: "How We Use Your Information",
          content: [
            "To provide personalized vehicle recommendations and negotiate on your behalf",
            "To communicate with dealerships and present offers to you",
            "To improve our AI algorithms and service quality",
            "To send you updates about your vehicle search and offers",
            "To comply with legal obligations and protect our rights"
          ]
        },
        {
          icon: Shield,
          title: "Data Protection & Security",
          content: [
            "Industry-standard encryption for all data transmission and storage",
            "Secure servers with regular security audits and monitoring",
            "Limited access to your data on a need-to-know basis",
            "Regular backups with encrypted storage solutions",
            "Compliance with applicable data protection regulations"
          ]
        },
        {
          icon: UserCheck,
          title: "Your Rights",
          content: [
            "Access: Request a copy of the personal data we hold about you",
            "Correction: Request correction of inaccurate or incomplete data",
            "Deletion: Request deletion of your personal data (subject to legal requirements)",
            "Portability: Request transfer of your data to another service provider",
            "Objection: Object to processing of your data for certain purposes"
          ]
        },
        {
          icon: Cookie,
          title: "Cookies & Tracking",
          content: [
            "Essential cookies for website functionality and security",
            "Analytics cookies to understand how you use our service",
            "Preference cookies to remember your language and settings",
            "You can control cookie settings through your browser preferences",
            "Some features may not work properly if cookies are disabled"
          ]
        },
        {
          icon: Lock,
          title: "Data Sharing & Third Parties",
          content: [
            "We share your vehicle requirements with authorized dealerships only",
            "No sale of personal data to third parties for marketing purposes",
            "Service providers bound by strict confidentiality agreements",
            "Legal disclosure only when required by law or court order",
            "Your explicit consent required for any other data sharing"
          ]
        }
      ],
      contact: {
        title: "Contact Us About Privacy",
        description: "If you have questions about this privacy policy or your data rights, please contact us:",
        email: "privacy@sam-auto-ai.com",
        response: "We respond to all privacy inquiries within 48 hours."
      }
    },
    fr: {
      title: "Politique de Confidentialité",
      subtitle: "Votre vie privée et la sécurité de vos données sont nos priorités absolues",
      lastUpdated: "Dernière mise à jour : Janvier 2025",
      sections: [
        {
          icon: FileText,
          title: "Informations que Nous Collectons",
          content: [
            "Informations personnelles que vous fournissez lors de la consultation véhicule (nom, coordonnées, préférences)",
            "Spécifications et exigences de véhicule que vous partagez avec Sam IA",
            "Enregistrements de communication entre vous et notre système IA",
            "Informations techniques sur votre appareil et navigateur pour l'amélioration du service",
            "Cookies et technologies similaires pour la fonctionnalité du site web"
          ]
        },
        {
          icon: Eye,
          title: "Comment Nous Utilisons Vos Informations",
          content: [
            "Pour fournir des recommandations de véhicules personnalisées et négocier en votre nom",
            "Pour communiquer avec les concessionnaires et vous présenter des offres",
            "Pour améliorer nos algorithmes IA et la qualité du service",
            "Pour vous envoyer des mises à jour sur votre recherche de véhicule et les offres",
            "Pour respecter les obligations légales et protéger nos droits"
          ]
        },
        {
          icon: Shield,
          title: "Protection et Sécurité des Données",
          content: [
            "Chiffrement standard de l'industrie pour toute transmission et stockage de données",
            "Serveurs sécurisés avec audits de sécurité réguliers et surveillance",
            "Accès limité à vos données sur une base de besoin de savoir",
            "Sauvegardes régulières avec solutions de stockage chiffrées",
            "Conformité aux réglementations applicables de protection des données"
          ]
        },
        {
          icon: UserCheck,
          title: "Vos Droits",
          content: [
            "Accès : Demander une copie des données personnelles que nous détenons sur vous",
            "Correction : Demander la correction de données inexactes ou incomplètes",
            "Suppression : Demander la suppression de vos données personnelles (sous réserve d'exigences légales)",
            "Portabilité : Demander le transfert de vos données à un autre fournisseur de services",
            "Objection : S'opposer au traitement de vos données à certaines fins"
          ]
        },
        {
          icon: Cookie,
          title: "Cookies et Suivi",
          content: [
            "Cookies essentiels pour la fonctionnalité et la sécurité du site web",
            "Cookies d'analyse pour comprendre comment vous utilisez notre service",
            "Cookies de préférence pour mémoriser votre langue et paramètres",
            "Vous pouvez contrôler les paramètres de cookies via les préférences de votre navigateur",
            "Certaines fonctionnalités peuvent ne pas fonctionner correctement si les cookies sont désactivés"
          ]
        },
        {
          icon: Lock,
          title: "Partage de Données et Tiers",
          content: [
            "Nous partageons vos exigences de véhicule avec les concessionnaires autorisés seulement",
            "Aucune vente de données personnelles à des tiers à des fins de marketing",
            "Fournisseurs de services liés par des accords de confidentialité stricts",
            "Divulgation légale seulement lorsque requis par la loi ou ordonnance du tribunal",
            "Votre consentement explicite requis pour tout autre partage de données"
          ]
        }
      ],
      contact: {
        title: "Nous Contacter à Propos de la Confidentialité",
        description: "Si vous avez des questions sur cette politique de confidentialité ou vos droits de données, veuillez nous contacter :",
        email: "confidentialite@sam-auto-ia.com",
        response: "Nous répondons à toutes les demandes de confidentialité dans les 48 heures."
      }
    }
  };

  const currentContent = content[language];

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
                to="/fr/confidentialite"
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  language === 'fr' 
                    ? 'bg-white text-indigo-700 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                FR
              </Link>
              <Link
                to="/en/privacy"
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

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-4 rounded-full">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 bg-clip-text text-transparent">
            {currentContent.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-4">
            {currentContent.subtitle}
          </p>
          <p className="text-sm text-gray-500">
            {currentContent.lastUpdated}
          </p>
        </div>

        {/* Privacy Sections */}
        <div className="space-y-8 mb-16">
          {currentContent.sections.map((section, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 rounded-full flex items-center justify-center">
                  <section.icon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {section.title}
                </h2>
              </div>
              
              <ul className="space-y-3">
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mt-2"></div>
                    <p className="text-gray-700 leading-relaxed">
                      {item}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 rounded-3xl shadow-2xl p-8 md:p-12 text-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">
              {currentContent.contact.title}
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {currentContent.contact.description}
            </p>
            
            <div className="bg-white bg-opacity-20 rounded-xl p-6 mb-6 inline-block">
              <p className="text-2xl font-bold mb-2">
                {currentContent.contact.email}
              </p>
              <p className="text-blue-100">
                {currentContent.contact.response}
              </p>
            </div>
            
            <Link
              to="/chat"
              className="inline-flex items-center gap-3 bg-white text-indigo-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {language === 'en' ? 'Start Secure Consultation' : 'Commencer la Consultation Sécurisée'}
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}