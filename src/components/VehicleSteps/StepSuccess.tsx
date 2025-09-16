import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, MessageCircle, Home, RotateCcw } from 'lucide-react';
import { Navigation } from '../Navigation';
import { Footer } from '../Footer';

export function StepSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Navigation />
      
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-600 p-4 rounded-full">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Demande Soumise avec Succès !
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Sam IA analysera vos exigences et contactera les concessionnaires en votre nom. 
            Vous recevrez les meilleures offres dans les <strong>24-48 heures</strong>.
          </p>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">🚀 Prochaines étapes</h2>
            <ul className="text-left text-blue-800 space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Sam analyse votre profil véhicule
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Contact automatique des concessionnaires
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Négociation des meilleurs prix
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Réception des offres par courriel
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/chat"
              className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              <MessageCircle size={20} />
              Discuter avec Sam
            </Link>
            
            <Link
              to="/vehicle-step/1"
              className="inline-flex items-center gap-3 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
            >
              <RotateCcw size={20} />
              Nouvelle demande
            </Link>
            
            <Link
              to="/"
              className="inline-flex items-center gap-3 px-6 py-3 bg-gray-600 text-white font-semibold rounded-xl hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
            >
              <Home size={20} />
              Accueil
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}