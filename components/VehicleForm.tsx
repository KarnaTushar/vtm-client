import React, { useState, useEffect } from 'react';
import { addVehicle, updateVehicle } from '../services/api';
import { useRouter } from 'next/router';

interface VehicleFormProps {
  vehicle?: {
    id: number;
    vehicleNumber: string;
    vehicleType: string;
    puc_certificate: File | null;
    insurance_certificate: File | null;
  };
  onClose?: () => void;
  type: 'add' | 'edit';
  syncVehicleList: (driver: any) => void
}

const VehicleForm: React.FC<VehicleFormProps> = ({ vehicle, onClose, type, syncVehicleList }) => {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [pucCertificate, setPucCertificate] = useState<File | null>(null);
  const [insuranceCertificate, setInsuranceCertificate] = useState<File | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (vehicle) {
      setVehicleNumber(vehicle.vehicleNumber);
      setVehicleType(vehicle.vehicleType);
    }
  }, [vehicle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('vehicleNumber', vehicleNumber);
    formData.append('vehicleType', vehicleType);
    if (pucCertificate) {
      formData.append('puc_certificate', pucCertificate);
    }
    if (insuranceCertificate) {
      formData.append('insurance_certificate', insuranceCertificate);
    }

    try {
      if (vehicle) {
        await updateVehicle(formData, vehicle.id);
        router.push('/vehicles');
      } else {
        const response = await addVehicle(formData);
        syncVehicleList(response)
      }
      if (onClose) onClose();
    } catch (error) {
      console.error('Error saving vehicle:', error);
    }
  };

  const handlePucCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setPucCertificate(file);
    }
  };

  const handleInsuranceCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setInsuranceCertificate(file);
    }
  };

  return (
    <div className="vehicle-form-card">
      <form onSubmit={handleSubmit}>
        <label>
          Vehicle Number:
          <input
            type="text"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            placeholder="Vehicle Number"
            required
          />
        </label>
        <label>
          Vehicle Type:
          <input
            type="text"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            placeholder="Vehicle Type"
          />
        </label>
        <label>
          PUC Certificate:
          <input
            type="file"
            onChange={handlePucCertificateChange}
            accept="image/*"
          />
        </label>
        <label>
          Insurance Certificate:
          <input
            type="file"
            onChange={handleInsuranceCertificateChange}
            accept="image/*"
          />
        </label>
        <button type="submit">{vehicle ? 'Update Vehicle' : 'Add Vehicle'}</button>
        {onClose && <button type="button" onClick={onClose}>Cancel</button>}
        {type === "edit" ? <button type="button" onClick={() => router.push('/vehicles')}>Cancel</button> : null}
      </form>
    </div>
  );
};

export default VehicleForm;
