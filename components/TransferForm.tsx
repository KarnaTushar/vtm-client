// components/TransferForm.tsx
import React, { useState, useEffect } from 'react';
import { getDrivers, getVehicles, transferVehicle } from '../services/api';

interface TransferFormProps {
  vehicleId?: number | null;
  onClose: () => void;
  type: 'add' | 'edit';
  syncTransferList: (transfer: any) => void;
}

const TransferForm: React.FC<TransferFormProps> = ({ vehicleId, onClose, type, syncTransferList }) => {
  const [fromDriverId, setFromDriverId] = useState<number | null>(null);
  const [toDriverId, setToDriverId] = useState<number | null>(null);
  const [drivers, setDrivers] = useState<{ id: number, name: string }[]>([]);
  const [vehicles, setVehicles] = useState<{ id: number, vehicleNumber: string }[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(vehicleId || null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDriversAndVehicles = async () => {
      try {
        const driversData = await getDrivers();
        setDrivers(driversData);

        const vehiclesData = await getVehicles();
        setVehicles(vehiclesData);

        if (vehicleId) {
          setSelectedVehicleId(vehicleId);
        }
      } catch (error) {
        setError('Failed to fetch drivers or vehicles');
      }
    };

    fetchDriversAndVehicles();
  }, [vehicleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedVehicleId && toDriverId !== null) {
        const newTransfer = {
          fromDriverId,
          toDriverId,
          vehicleId: selectedVehicleId,
        };
        const transfer = await transferVehicle(fromDriverId, toDriverId, selectedVehicleId);
        const response = syncTransferList(transfer);
        console.log(response)
        onClose();
      } else {
        setError('Please select a vehicle and a driver to transfer to.');
      }
    } catch (error) {
      setError('Failed to create transfer');
    }
  };

  return (
    <div className="transfer-form">
      <h2>{type === 'add' ? 'Add New Transfer' : 'Edit Transfer'}</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="vehicle">Vehicle</label>
          <select
            id="vehicle"
            value={selectedVehicleId ?? ''}
            onChange={(e) => setSelectedVehicleId(Number(e.target.value))}
            required
          >
            <option value="" disabled>Select a vehicle</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.vehicleNumber}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="fromDriver">From Driver (optional)</label>
          <select
            id="fromDriver"
            value={fromDriverId ?? ''}
            onChange={(e) => setFromDriverId(Number(e.target.value))}
          >
            <option value="" disabled>Select a driver</option>
            <option value={undefined}>None</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="toDriver">To Driver</label>
          <select
            id="toDriver"
            value={toDriverId ?? ''}
            onChange={(e) => setToDriverId(Number(e.target.value))}
            required
          >
            <option value="" disabled>Select a driver</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">{type === 'add' ? 'Add Transfer' : 'Update Transfer'}</button>
        <button type="button" onClick={onClose} className="btn btn-cancel">Cancel</button>
      </form>
    </div>
  );
};

export default TransferForm;
