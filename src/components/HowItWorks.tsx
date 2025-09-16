import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, MessageCircle, Search, Handshake, Trophy, Languages, Globe } from 'lucide-react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

export function HowItWorks() {
  const location = useLocation();
  const isEnglish = location.pathname.includes('/en/');
  const language = isEnglish ? 'en' : 'fr';

  const content = {
    en: {
      title: "How Sam AI Auto Expert Works",
      subtitle: "Your personal AI negotiator that gets you the best car deals without any work from you",
      steps: [
        {
          icon: MessageCircle,
          title: "Initial Consultation",
          description: "Chat with Sam AI to specify your exact vehicle requirements - brand, model, features, budget, and preferences. Sam asks smart questions to understand exactly what you want.",
          details: "Our AI conducts a comprehensive 17-question interview covering everything from vehicle specifications to financing preferences and trade-in details."
        },
        {
          icon: Search,
          title: "AI Analysis & Market Research",
          description: "Sam analyzes the market, compares prices across multiple dealerships, and identifies the best deals available for your specific requirements.",
          details: "Advanced algorithms scan inventory, pricing data, and current promotions to find vehicles that match your criteria at the most competitive prices."
        },
        {
          icon: Handshake,
          title: "Automated Negotiation",
          description: "Sam contacts multiple dealerships on your behalf, negotiates prices, and handles all the back-and-forth communication. You do absolutely nothing.",
          details: "Professional dealer outreach with detailed specifications, trade-in evaluations, and competitive bidding to secure the best possible terms."
        },
        {
          icon: Trophy,
          title: "Best Deal Presentation",
          description: "Receive a curated list of the best offers with complete transparency on pricing, terms, and dealer information. Choose your preferred deal and finalize.",
          details: "Comprehensive comparison of all offers including total cost, monthly payments, trade-in values, and dealer ratings to help you make the best decision."
        }
      ],
      benefits: {
        title: "Why Choose Sam AI Auto Expert?",
        items: [
          "100% automated - no work required from you",
          "Professional negotiation with multiple dealers",
          "Transparent pricing with no hidden fees",
          "Save thousands compared to traditional buying",
          "Complete privacy protection",
          "Expert AI that never gets tired or emotional"
        ]
      },
      cta: {
        title: "Ready to Get Started?",
        description: "Join thousands of satisfied customers who saved money and time with Sam AI Auto Expert.",
        button: "Start Your Free Consultation"
      }
    },
    fr: {
      title: "Comment fonctionne Sam Expert Auto IA",
      subtitle: "Votre négociateur IA personnel qui vous obtient les meilleures offres auto sans aucun travail de votre part",
      steps: [
        {
          icon: MessageCircle,
          title: "Consultation Initiale",
          description: "Discutez avec Sam IA pour spécifier vos exigences exactes de véhicule - marque, modèle, caractéristiques, budget et préférences. Sam pose des questions intelligentes pour comprendre exactement ce que vous voulez.",
          details: "Notre IA mène une entrevue complète de 17 questions couvrant tout, des spécifications du véhicule aux préférences de financement et aux détails d'échange."
        },
        {
          icon: Search,
          title: "Analyse IA et Recherche de Marché",
          description: "Sam analyse le marché, compare les prix chez plusieurs concessionnaires et identifie les meilleures offres disponibles pour vos exigences spécifiques.",
          details: "Des algorithmes avancés scannent l'inventaire, les données de prix et les promotions actuelles pour trouver des véhicules qui correspondent à vos critères aux prix les plus compétitifs."
        },
        {
          icon: Handshake,
          title: "Négociation Automatisée",
          description: "Sam contacte plusieurs concessionnaires en votre nom, négocie les prix et gère toute la communication. Vous ne faites absolument rien.",
          details: "Approche professionnelle des concessionnaires avec spécifications détaillées, évaluations d'échange et enchères compétitives pour sécuriser les meilleures conditions possibles."
        },
        {
          icon: Trophy,
          title: "Présentation de la Meilleure Offre",
          description: "Recevez une liste organisée des meilleures offres avec une transparence complète sur les prix, les conditions et les informations des concessionnaires. Choisissez votre offre préférée et finalisez.",
          details: "Comparaison complète de toutes les offres incluant le coût total, les paiements mensuels, les valeurs d'échange et les évaluations des concessionnaires pour vous aider à prendre la meilleure décision."
        }
      ],
      benefits: {
        title: "Pourquoi choisir Sam Expert Auto IA?",
        items: [
          "100% automatisé - aucun travail requis de votre part",
          "Négociation professionnelle avec plusieurs concessionnaires",
          "Prix transparents sans frais cachés",
          "Économisez des milliers comparé à l'achat traditionnel",
          "Protection complète de la vie privée",
          "IA experte qui ne se fatigue jamais et reste objective"
        ]
      },
      cta: {
        title: "Prêt à commencer?",
        description: "Rejoignez des milliers de clients satisfaits qui ont économisé argent et temps avec Sam Expert Auto IA.",
        button: "Commencer votre consultation gratuite"
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
                to="/fr/fonctionnement"
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  language === 'fr' 
                    ? 'bg-white text-indigo-700 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                FR
              </Link>
              <Link
                to="/en/how-it-works"
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 bg-clip-text text-transparent">
            {currentContent.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {currentContent.subtitle}
          </p>
        </div>

        {/* Process Steps */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentContent.steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connection Line */}
                {index < currentContent.steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-8 h-0.5 bg-gradient-to-r from-indigo-300 to-purple-300 z-0"></div>
                )}
                
                <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative z-10">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 rounded-full mb-6 mx-auto">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold mb-3">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {step.description}
                  </p>
                  
                  <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {step.details}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {currentContent.benefits.title}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentContent.benefits.items.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
                <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mt-1">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <p className="text-gray-700 font-medium leading-relaxed">
                  {benefit}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 rounded-3xl shadow-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">
            {currentContent.cta.title}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {currentContent.cta.description}
          </p>
          <Link
            to="/chat"
            className="inline-flex items-center gap-3 bg-white text-indigo-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            {currentContent.cta.button}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}