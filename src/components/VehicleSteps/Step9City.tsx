import React, { useState } from 'react';
import { StepLayout } from './StepLayout';
import { useVehicleFormState } from '../../hooks/useVehicleFormState';
import { MapPin, Search, Navigation } from 'lucide-react';

const quebecCities = [
  "Montréal", "Québec", "Laval", "Gatineau", "Longueuil", "Sherbrooke",
  "Saguenay", "Lévis", "Trois-Rivières", "Terrebonne", "Saint-Jean-sur-Richelieu",
  "Repentigny", "Brossard", "Drummondville", "Saint-Jérôme", "Granby",
  "Blainville", "Saint-Hyacinthe", "Shawinigan", "Dollard-des-Ormeaux",
  "Joliette", "Victoriaville", "Rimouski", "Saint-Eustache", "Saint-Bruno-de-Montarville",
  "Mascouche", "Beloeil", "Châteauguay", "Saint-Constant", "Mirabel",
  "Chambly", "Saint-Lambert", "Boucherville", "Candiac", "Rouyn-Noranda",
  "Alma", "Sorel-Tracy", "Val-d'Or", "Sept-Îles", "Thetford Mines",
  "Sainte-Julie", "Vaudreuil-Dorion", "Chicoutimi", "Baie-Comeau", "Saint-Georges",
  "Sainte-Thérèse", "Jonquière", "Varennes"
];

const popularCities = ["Montréal", "Québec", "Laval", "Gatineau", "Longueuil", "Sherbrooke"];

export function Step9City() {
  const { formData, updateField } = useVehicleFormState();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllCities, setShowAllCities] = useState(false);

  const handleCitySelect = (city: string) => {
    updateField('city', city);
    setSearchTerm('');
  };

  const handleCustomCity = (city: string) => {
    updateField('city', city);
  };

  const filteredCities = quebecCities.filter(city =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayCities = showAllCities ? filteredCities : popularCities.filter(city =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <StepLayout
      currentStep={9}
      totalSteps={10}
      title="Dans quelle ville résidez-vous ?"
      description="Pour vous jumeler avec les concessionnaires les plus près de chez vous"
      canProceed={!!formData.city}
    >
      <div className="space-y-6">
        <div className="max-w-2xl mx-auto">
          {/* Search input */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher votre ville..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>

          {/* Popular cities (when no search) */}
          {!searchTerm && !showAllCities && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Villes populaires :</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {popularCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleCitySelect(city)}
                    className={`p-3 text-sm font-medium border-2 rounded-xl transition-all duration-200 ${
                      formData.city === city
                        ? 'bg-blue-600 text-white border-blue-600 transform scale-105 shadow-lg'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50 hover:transform hover:scale-102'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* All cities grid */}
          {(searchTerm || showAllCities) && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-gray-700">
                  {searchTerm ? `Résultats pour "${searchTerm}"` : 'Toutes les villes'}
                  {filteredCities.length > 0 && ` (${filteredCities.length})`}
                </h3>
              </div>
              
              {displayCities.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                  {displayCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      className={`p-2 text-sm font-medium border-2 rounded-lg transition-all duration-200 ${
                        formData.city === city
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MapPin size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Aucune ville trouvée pour "{searchTerm}"</p>
                  <p className="text-sm mt-2">Essayez un autre terme ou entrez votre ville manuellement</p>
                </div>
              )}
            </div>
          )}

          {/* Show all cities button */}
          {!searchTerm && !showAllCities && (
            <div className="text-center mb-4">
              <button
                onClick={() => setShowAllCities(true)}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Voir toutes les villes du Québec ({quebecCities.length})
              </button>
            </div>
          )}

          {/* Custom city input */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Votre ville n'est pas dans la liste ? Entrez-la ici :
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleCustomCity(e.target.value)}
              placeholder="Entrez le nom de votre ville..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Selected city display */}
        {formData.city && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">Ville sélectionnée:</span>
              <span className="text-blue-700 font-bold">{formData.city}</span>
            </div>
          </div>
        )}

        {/* Why we need location */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Navigation className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-green-900">Pourquoi votre ville ?</h4>
          </div>
          <ul className="text-sm text-green-800 space-y-1">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
              Trouver les concessionnaires les plus proches
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
              Réduire les frais de transport et livraison
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
              Faciliter les visites et essais routiers
            </li>
          </ul>
        </div>
      </div>
    </StepLayout>
  );
}