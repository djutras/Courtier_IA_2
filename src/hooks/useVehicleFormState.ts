import { useState, useEffect } from 'react';

export interface VehicleFormData {
  brand: string;
  condition: string;
  model: string;
  trim: string;
  dealerships: string;
  contact: string;
  name: string;
  emailPhone: string;
  city: string;
  privacy: string;
}

const initialFormData: VehicleFormData = {
  brand: '',
  condition: '',
  model: '',
  trim: '',
  dealerships: '',
  contact: '',
  name: '',
  emailPhone: '',
  city: '',
  privacy: ''
};

export function useVehicleFormState() {
  const [formData, setFormData] = useState<VehicleFormData>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('vehicleFormData');
    return saved ? JSON.parse(saved) : initialFormData;
  });

  // Save to localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem('vehicleFormData', JSON.stringify(formData));
  }, [formData]);

  const updateField = (field: keyof VehicleFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    localStorage.removeItem('vehicleFormData');
  };

  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 1: return !!formData.brand;
      case 2: return !!formData.condition;
      case 3: return !!formData.model;
      case 4: return !!formData.trim;
      case 5: return !!formData.dealerships;
      case 6: return !!formData.contact;
      case 7: return !!formData.name;
      case 8: return !!formData.emailPhone && formData.emailPhone.includes(' et ');
      case 9: return !!formData.city;
      case 10: return !!formData.privacy;
      default: return false;
    }
  };

  const getCompletedSteps = (): number => {
    let completed = 0;
    for (let i = 1; i <= 10; i++) {
      if (isStepComplete(i)) completed++;
      else break;
    }
    return completed;
  };

  return {
    formData,
    updateField,
    resetForm,
    isStepComplete,
    getCompletedSteps
  };
}