import React, { useState, useEffect } from 'react';
import { BarChart3, Clock, TrendingUp, Database } from 'lucide-react';
import { 
  getAllTrimRequests, 
  getMostRequestedTrims, 
  clearTrimRequests,
  addTrimsForModel,
  TrimRequest 
} from '../data/carModels';

export function TrimRequestTracker() {
  const [requests, setRequests] = useState<TrimRequest[]>([]);
  const [showAll, setShowAll] = useState(false);

  const refreshData = () => {
    setRequests(getAllTrimRequests());
  };

  useEffect(() => {
    refreshData();
    // Refresh every 30 seconds to show new requests
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleClearRequests = () => {
    clearTrimRequests();
    refreshData();
  };

  const handleAddTrims = (make: string, model: string) => {
    const trimsInput = prompt(`Enter trims for ${make} ${model} (comma-separated):`);
    if (trimsInput) {
      const trims = trimsInput.split(',').map(t => t.trim()).filter(t => t);
      if (trims.length > 0) {
        addTrimsForModel(make, model, trims);
        alert(`Added ${trims.length} trims for ${make} ${model}`);
      }
    }
  };

  const displayRequests = showAll ? requests : requests.slice(0, 10);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Trim Request Tracker</h2>
            <p className="text-gray-600">Track user requests for missing trim data</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={refreshData}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Refresh
          </button>
          <button
            onClick={handleClearRequests}
            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">Total Requests</span>
          </div>
          <p className="text-2xl font-bold text-blue-600 mt-1">{requests.length}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-900">Total Count</span>
          </div>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {requests.reduce((sum, r) => sum + r.count, 0)}
          </p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-purple-900">Most Recent</span>
          </div>
          <p className="text-sm font-medium text-purple-600 mt-1">
            {requests.length > 0 
              ? requests[0].timestamp.toLocaleTimeString()
              : 'No requests yet'
            }
          </p>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">
            {showAll ? 'All Requests' : 'Top 10 Requests'}
          </h3>
          {requests.length > 10 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {showAll ? 'Show Less' : `Show All (${requests.length})`}
            </button>
          )}
        </div>

        {displayRequests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Database size={48} className="mx-auto mb-4 opacity-50" />
            <p>No trim requests yet</p>
            <p className="text-sm mt-2">Requests will appear when users ask for missing trims</p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayRequests.map((request, index) => (
              <div
                key={`${request.make}-${request.model}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900">
                      {request.make} {request.model}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {request.count} request{request.count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Last requested: {request.timestamp.toLocaleString()}
                    {request.requestedBy && (
                      <span className="ml-2">by {request.requestedBy}</span>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => handleAddTrims(request.make, request.model)}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                >
                  Add Trims
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-medium text-yellow-900 mb-2">How it works:</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• When users select a make/model without trim data, a request is logged</li>
          <li>• Requests are counted and ranked by popularity</li>
          <li>• Click "Add Trims" to quickly add trim data for requested models</li>
          <li>• Focus on the most requested models first for maximum impact</li>
        </ul>
      </div>
    </div>
  );
}