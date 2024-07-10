import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getVehicles, deleteVehicle } from '../services/api'; // Adjust the import path as per your project structure
import VehicleForm from '@/components/VehicleForm';
interface Vehicle {
  id: number;
  vehicleNumber: string;
  vehicleType: string;
  puc_certificate: string;
  insurance_certificate: string;
}

const Vehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await getVehicles();
        setVehicles(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch vehicles');
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleEditClick = (id: number) => {
    router.push(`/editVehicle/${id}`); // Adjust the route as per your application
  };

  const handleAddClick = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleSyncVehicleList = async (vehicle: any) => {
    console.log("new Vehicle: ", vehicle)
    vehicles.push(vehicle)
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteVehicle(id);
      if (response.status === 204) {
        setVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle.id !== id));
      } else {
        console.error('Failed to delete vehicle');
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="vehicles-page">
      <div className="header">
        <h1>Vehicles</h1>
        <button className="add-button" onClick={handleAddClick}>Add New</button>
      </div>
      {showForm && <VehicleForm onClose={handleCloseForm} type='add' syncVehicleList={handleSyncVehicleList} />} {/* Adjust VehicleForm component as per your implementation */}
      <ul className="vehicles-list">
        {vehicles.map((vehicle: Vehicle) => (
          <li className="vehicle-item" key={vehicle.id}>
            <div className="vehicle-info">
              <div className="vehicle-details">
                <h2>Vehicle Number: {vehicle.vehicleNumber}</h2>
                <p>Vehicle Type: {vehicle.vehicleType}</p>
              </div>
              <div className="certificates">
                <div className="certificate">
                  <h3>PUC Certificate</h3>
                  <img src={vehicle.puc_certificate} alt="PUC Certificate" />
                </div>
                <div className="certificate">
                  <h3>Insurance Certificate</h3>
                  <img src={vehicle.insurance_certificate} alt="Insurance Certificate" />
                </div>
              </div>
            </div>
            <div className="actions">
              <button className="edit-button" onClick={() => handleEditClick(vehicle.id)}>Edit</button>
              <button className="delete-button" onClick={() => handleDelete(vehicle.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Vehicles;
