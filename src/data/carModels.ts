export interface CarMake {
  name: string;
  models: string[];
  popularModels?: CarModel[];
}

export interface CarModel {
  name: string;
  trims: string[];
}

export const carModels: CarMake[] = [
  {
    name: "Acura",
    models: ["ILX", "TLX", "RLX", "RDX", "MDX", "NSX"]
  },
  {
    name: "Alfa Romeo",
    models: ["Giulia", "Stelvio", "Tonale"]
  },
  {
    name: "Audi",
    models: ["A3", "A4", "A5", "A6", "A7", "A8", "Q3", "Q5", "Q7", "Q8", "e-tron", "RS3", "RS4", "RS5", "RS6", "RS7", "S3", "S4", "S5", "S6", "S7", "S8", "SQ5", "SQ7", "SQ8", "TT", "R8"]
  },
  {
    name: "BMW",
    models: ["2 Series", "3 Series", "4 Series", "5 Series", "6 Series", "7 Series", "8 Series", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "Z4", "i3", "i4", "iX", "M2", "M3", "M4", "M5", "M8"]
  },
  {
    name: "Buick",
    models: ["Encore", "Encore GX", "Envision", "Enclave"]
  },
  {
    name: "Cadillac",
    models: ["CT4", "CT5", "XT4", "XT5", "XT6", "Escalade", "LYRIQ"]
  },
  {
    name: "Chevrolet",
    models: ["Spark", "Sonic", "Cruze", "Malibu", "Camaro", "Corvette", "Trax", "Equinox", "Blazer", "Traverse", "Tahoe", "Suburban", "Colorado", "Silverado 1500", "Silverado 2500HD", "Silverado 3500HD", "Bolt EV", "Bolt EUV"],
    popularModels: [
      {
        name: "Silverado 1500",
        trims: ["Regular Cab WT", "Double Cab Custom", "Double Cab LT", "Double Cab RST", "Double Cab LTZ", "Crew Cab Custom", "Crew Cab LT", "Crew Cab RST", "Crew Cab LTZ", "Crew Cab Premier", "Crew Cab High Country"]
      },
      {
        name: "Equinox",
        trims: ["L", "LS", "LT", "Premier"]
      }
    ]
  },
  {
    name: "Chrysler",
    models: ["300", "Pacifica"]
  },
  {
    name: "Dodge",
    models: ["Charger", "Challenger", "Durango"]
  },
  {
    name: "FIAT",
    models: ["500", "500X"]
  },
  {
    name: "Ford",
    models: ["Fiesta", "Focus", "Fusion", "Mustang", "EcoSport", "Escape", "Edge", "Explorer", "Expedition", "Ranger", "F-150", "F-250", "F-350", "F-450", "Bronco", "Bronco Sport", "Maverick", "Lightning", "Mustang Mach-E"],
    popularModels: [
      {
        name: "F-150",
        trims: ["Regular Cab XL", "Regular Cab XLT", "SuperCab XL", "SuperCab XLT", "SuperCab Lariat", "SuperCrew XL", "SuperCrew XLT", "SuperCrew Lariat", "SuperCrew King Ranch", "SuperCrew Platinum", "SuperCrew Limited", "Raptor", "Lightning Pro", "Lightning XLT", "Lightning Lariat", "Lightning Platinum"]
      },
      {
        name: "Escape",
        trims: ["S", "SE", "SEL", "Titanium", "Hybrid SE", "Hybrid SEL", "Hybrid Titanium"]
      },
      {
        name: "Explorer",
        trims: ["Base", "XLT", "Limited", "ST", "Platinum", "Hybrid Limited"]
      }
    ]
  },
  {
    name: "Genesis",
    models: ["G70", "G80", "G90", "GV60", "GV70", "GV80"]
  },
  {
    name: "GMC",
    models: ["Terrain", "Acadia", "Yukon", "Yukon XL", "Canyon", "Sierra 1500", "Sierra 2500HD", "Sierra 3500HD", "Hummer EV"]
  },
  {
    name: "Honda",
    models: ["Fit", "Civic", "Accord", "Insight", "CR-V", "HR-V", "Passport", "Pilot", "Ridgeline"],
    popularModels: [
      {
        name: "Civic",
        trims: ["LX", "Sport", "EX", "Touring", "Si", "Type R", "Hatchback Sport", "Hatchback Sport Touring"]
      },
      {
        name: "Accord",
        trims: ["LX", "Sport", "EX-L", "Touring", "Hybrid", "Hybrid EX-L", "Hybrid Touring"]
      },
      {
        name: "CR-V",
        trims: ["LX", "Sport", "EX", "EX-L", "Touring", "Hybrid Sport", "Hybrid EX", "Hybrid EX-L", "Hybrid Touring"]
      }
    ]
  },
  {
    name: "Hyundai",
    models: ["Accent", "Elantra", "Sonata", "Veloster", "Venue", "Kona", "Tucson", "Santa Fe", "Santa Cruz", "Palisade", "IONIQ 5", "IONIQ 6"],
    popularModels: [
      {
        name: "Tucson",
        trims: ["Essential", "Preferred", "Ultimate", "Hybrid Preferred", "Hybrid Ultimate", "N Line"]
      },
      {
        name: "Elantra",
        trims: ["Essential", "Preferred", "Ultimate", "N Line", "Hybrid Essential", "Hybrid Preferred", "Hybrid Ultimate"]
      }
    ]
  },
  {
    name: "INFINITI",
    models: ["Q50", "Q60", "QX50", "QX55", "QX60", "QX80"]
  },
  {
    name: "Jaguar",
    models: ["XE", "XF", "XJ", "F-PACE", "E-PACE", "I-PACE", "F-TYPE"]
  },
  {
    name: "Jeep",
    models: ["Compass", "Cherokee", "Grand Cherokee", "Wrangler", "Gladiator", "Renegade", "Grand Cherokee L"],
    popularModels: [
      {
        name: "Wrangler",
        trims: ["Sport", "Sport S", "Willys", "Sahara", "Rubicon", "Unlimited Sport", "Unlimited Sport S", "Unlimited Willys", "Unlimited Sahara", "Unlimited Rubicon", "4xe Sahara", "4xe Rubicon"]
      },
      {
        name: "Grand Cherokee",
        trims: ["Laredo", "Altitude", "Limited", "Trailhawk", "Overland", "Summit", "SRT", "Trackhawk", "4xe Limited", "4xe Trailhawk", "4xe Overland", "4xe Summit"]
      }
    ]
  },
  {
    name: "Kia",
    models: ["Rio", "Forte", "K5", "Stinger", "Soul", "Seltos", "Sportage", "Sorento", "Telluride", "Niro", "EV6"]
  },
  {
    name: "Land Rover",
    models: ["Range Rover Evoque", "Range Rover Velar", "Range Rover Sport", "Range Rover", "Discovery Sport", "Discovery", "Defender"]
  },
  {
    name: "Lexus",
    models: ["IS", "ES", "GS", "LS", "LC", "RC", "UX", "NX", "RX", "GX", "LX"]
  },
  {
    name: "Lincoln",
    models: ["Corsair", "Nautilus", "Aviator", "Navigator"]
  },
  {
    name: "Mazda",
    models: ["Mazda3", "Mazda6", "MX-5 Miata", "CX-3", "CX-30", "CX-5", "CX-9", "CX-50"]
  },
  {
    name: "Mercedes-Benz",
    models: ["A-Class", "C-Class", "E-Class", "S-Class", "CLA", "CLS", "GLA", "GLB", "GLC", "GLE", "GLS", "G-Class", "SL", "AMG GT", "EQS", "EQE", "EQB", "EQA"]
  },
  {
    name: "MINI",
    models: ["Cooper", "Cooper Countryman", "Cooper Clubman"]
  },
  {
    name: "Mitsubishi",
    models: ["Mirage", "Eclipse Cross", "Outlander", "Outlander PHEV"]
  },
  {
    name: "Nissan",
    models: ["Versa", "Sentra", "Altima", "Maxima", "370Z", "400Z", "Kicks", "Rogue", "Murano", "Pathfinder", "Armada", "Frontier", "Titan", "Leaf", "Ariya"],
    popularModels: [
      {
        name: "Rogue",
        trims: ["S", "SV", "SL", "Platinum"]
      },
      {
        name: "Altima",
        trims: ["S", "SV", "SR", "SL", "Platinum"]
      }
    ]
  },
  {
    name: "Porsche",
    models: ["718 Boxster", "718 Cayman", "911", "Panamera", "Macan", "Cayenne", "Taycan"]
  },
  {
    name: "Ram",
    models: ["1500", "2500", "3500", "ProMaster", "ProMaster City"]
  },
  {
    name: "Subaru",
    models: ["Impreza", "Legacy", "WRX", "BRZ", "Crosstrek", "Forester", "Outback", "Ascent"],
    popularModels: [
      {
        name: "Outback",
        trims: ["Base", "Premium", "Limited", "Touring", "Wilderness"]
      },
      {
        name: "Forester",
        trims: ["Base", "Premium", "Sport", "Limited", "Wilderness"]
      }
    ]
  },
  {
    name: "Toyota",
    models: ["Yaris", "Corolla", "Camry", "Avalon", "Prius", "C-HR", "RAV4", "Venza", "Highlander", "4Runner", "Sequoia", "Land Cruiser", "Tacoma", "Tundra", "Sienna", "GR86", "Supra", "Mirai"],
    popularModels: [
      {
        name: "Camry",
        trims: ["LE", "SE", "XLE", "XSE", "TRD", "Hybrid LE", "Hybrid SE", "Hybrid XLE", "Hybrid XSE"]
      },
      {
        name: "Corolla",
        trims: ["L", "LE", "SE", "XLE", "SE Nightshade", "XSE", "Hybrid LE", "Hybrid SE"]
      },
      {
        name: "RAV4",
        trims: ["LE", "XLE", "XLE Premium", "Adventure", "TRD Off-Road", "Limited", "Prime SE", "Prime XSE", "Prime XSE with PP"]
      },
      {
        name: "Highlander",
        trims: ["L", "LE", "XLE", "Limited", "Platinum", "Hybrid LE", "Hybrid XLE", "Hybrid Limited", "Hybrid Platinum"]
      }
    ]
  },
  {
    name: "Volkswagen",
    models: ["Jetta", "Passat", "Arteon", "Golf", "GTI", "Golf R", "Taos", "Tiguan", "Atlas", "Atlas Cross Sport", "ID.4"]
  },
  {
    name: "Volvo",
    models: ["S60", "S90", "V60", "V90", "XC40", "XC60", "XC90", "C40", "XC40 Recharge"]
  }
];

// Helper function to get models for a specific make
export const getModelsForMake = (makeName: string): string[] => {
  const make = carModels.find(m => m.name.toLowerCase() === makeName.toLowerCase());
  return make ? make.models : [];
};

// Helper function to get all make names
export const getAllMakes = (): string[] => {
  return carModels.map(make => make.name);
};

// Helper function to get trims for a specific make and model
export const getTrimsForModel = (makeName: string, modelName: string): string[] => {
  const make = carModels.find(m => m.name.toLowerCase() === makeName.toLowerCase());
  if (!make || !make.popularModels) return [];
  
  const model = make.popularModels.find(m => m.name.toLowerCase() === modelName.toLowerCase());
  return model ? model.trims : [];
};

// Helper function to check if a model has trim data available
export const hasTrimsForModel = (makeName: string, modelName: string): boolean => {
  const make = carModels.find(m => m.name.toLowerCase() === makeName.toLowerCase());
  if (!make || !make.popularModels) return false;
  
  return make.popularModels.some(m => m.name.toLowerCase() === modelName.toLowerCase());
};
// Trim request tracking system
export interface TrimRequest {
  make: string;
  model: string;
  requestedBy?: string;
  timestamp: Date;
  count: number;
}

// In-memory storage for trim requests (in production, use database)
let trimRequests: TrimRequest[] = [];

// Function to request trims for a model that doesn't have them yet
export const requestTrimsForModel = (makeName: string, modelName: string, userEmail?: string): void => {
  const key = `${makeName.toLowerCase()}-${modelName.toLowerCase()}`;
  const existingRequest = trimRequests.find(r => 
    r.make.toLowerCase() === makeName.toLowerCase() && 
    r.model.toLowerCase() === modelName.toLowerCase()
  );

  if (existingRequest) {
    existingRequest.count++;
    existingRequest.timestamp = new Date();
  } else {
    trimRequests.push({
      make: makeName,
      model: modelName,
      requestedBy: userEmail,
      timestamp: new Date(),
      count: 1
    });
  }

  console.log(`📝 Trim request logged: ${makeName} ${modelName} (${existingRequest ? existingRequest.count : 1} requests)`);
};

// Get most requested trims (for admin/development)
export const getMostRequestedTrims = (): TrimRequest[] => {
  return trimRequests
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
};

// Get all trim requests
export const getAllTrimRequests = (): TrimRequest[] => {
  return [...trimRequests].sort((a, b) => b.count - a.count);
};

// Clear requests (for testing)
export const clearTrimRequests = (): void => {
  trimRequests = [];
};

// Function to add new trim data (for when you implement requested trims)
export const addTrimsForModel = (makeName: string, modelName: string, trims: string[]): boolean => {
  const make = carModels.find(m => m.name.toLowerCase() === makeName.toLowerCase());
  if (!make) return false;

  if (!make.popularModels) {
    make.popularModels = [];
  }

  const existingModel = make.popularModels.find(m => m.name.toLowerCase() === modelName.toLowerCase());
  if (existingModel) {
    existingModel.trims = trims;
  } else {
    make.popularModels.push({
      name: modelName,
      trims: trims
    });
  }

  console.log(`✅ Added trims for ${makeName} ${modelName}:`, trims);
  return true;
};

// Helper to get suggested trims based on similar models (fallback)
export const getSuggestedTrims = (makeName: string, modelName: string): string[] => {
  // Generic trim suggestions based on vehicle type and make
  const make = makeName.toLowerCase();
  const model = modelName.toLowerCase();

  // Luxury brands
  if (['bmw', 'mercedes-benz', 'audi', 'lexus', 'infiniti', 'cadillac', 'lincoln', 'genesis'].includes(make)) {
    return ['Base', 'Premium', 'Luxury', 'Sport', 'Ultimate'];
  }

  // Trucks
  if (model.includes('f-150') || model.includes('silverado') || model.includes('ram') || model.includes('sierra')) {
    return ['Regular Cab', 'Extended Cab', 'Crew Cab', 'Work Truck', 'LT', 'LTZ', 'High Country'];
  }

  // SUVs
  if (model.includes('suv') || model.includes('cx-') || model.includes('cr-v') || model.includes('rav4')) {
    return ['Base', 'S', 'SE', 'SEL', 'Limited', 'Premium'];
  }

  // Default suggestions
  return ['Base', 'S', 'SE', 'SEL', 'SL', 'Limited', 'Premium'];
};