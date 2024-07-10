// components/TransferList.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { listTransfers, getDriverForVehicle } from '../services/api';
import TransferForm from '@/components/TransferForm';

interface Transfer {
  id: number;
  fromDriver?: {
    id: number;
    name: string;
  };
  toDriver?: {
    id: number;
    name: string;
  };
  vehicle: {
    id: number;
    vehicleNumber: string;
    vehicleType: string;
  };
  transferDate: string; // Assuming transferDate is a string in ISO format (can adjust as per backend response)
}

const TransferList: React.FC = () => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [driverDetails, setDriverDetails] = useState<any | null>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showTransferHistory, setShowTransferHistory] = useState<boolean>(true);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        const data = await listTransfers(); // Assuming listTransfers fetches all transfer history
        setTransfers(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch transfer history');
        setLoading(false);
      }
    };

    fetchTransfers();
  }, [showTransferHistory]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await getDriverForVehicle(searchTerm);
      setDriverDetails(result);
      setShowTransferHistory(false);
    } catch (error) {
      console.log(error)
      // setError('Failed to fetch transfer details');  
      alert ("Driver not found");
      setSearchTerm('');

    }
  };

  const handleAddClick = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedVehicleId(null);
  };

  const handleSyncTransferList = (transfer: any) => {
    setTransfers([...transfers, transfer]);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
<div className="transfer-list">
      <h2>Transfer History</h2>
      <button onClick={handleAddClick} className="btn btn-primary">Create New Transfer</button>
      {showForm && (
        <TransferForm onClose={handleCloseForm} type='add' syncTransferList={handleSyncTransferList} />
      )}
      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          placeholder="Enter Vehicle Number"
          value={searchTerm}
          onChange={handleSearchChange}
          className="input"
        />
        <button type="submit" className="btn btn-search">Search</button>
        <button
          type="button"
          onClick={() => {
            setDriverDetails({});
            setSearchTerm('');
            setShowTransferHistory(true);
          }}
          className="btn btn-cancel"
        >Cancel</button>
      </form>
      {showTransferHistory ?
        <ul className="transfer-list-items">
          {transfers.map((transfer) => (
            <li key={transfer.id} className="transfer-item">
              <strong>Transfer ID:</strong> {transfer.id}<br />
              <strong>From Driver:</strong> {transfer.fromDriver ? transfer.fromDriver.name : 'N/A'}<br />
              <strong>To Driver:</strong> {transfer.toDriver ? transfer.toDriver.name : 'N/A'}<br />
              <strong>Vehicle:</strong> {transfer.vehicle.vehicleNumber}<br />
              <strong>Vehicle type: {transfer.vehicle.vehicleType}</strong><br />
              <strong>Transfer Date:</strong> {new Date(transfer.transferDate).toLocaleString()}<br />
              {/* <button onClick={() => {router.push(`/editTransferDetails/${transfer.id}`)}}>Transfer this vehicle</button> */}
            </li>
          ))}
        </ul>
        :
        <ul className="drivers-list">
          <li className="driver-item" key={driverDetails.id}>
            <div className="driver-info">
              <div className="profile-photo">
                {driverDetails.profile_photo ? (
                  <img id={driverDetails.id.toString()} src={driverDetails.profile_photo} alt={`${driverDetails.name}`} />
                ) : (
                  <img src="" alt="Default Avatar" className="default-avatar" />
                )}
              </div>
              <div>
                <h2>Name: {driverDetails.name}</h2>
                <p>Phone: {driverDetails.phone_number}</p>
              </div>
            </div>
          </li>
        </ul>
      }
    </div>
  );
};

export default TransferList;
