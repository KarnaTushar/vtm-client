import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getDrivers, deleteDriver} from '../services/api';
import DriverForm from '../components/DriverForm';

interface Driver {
  id: number;
  name: string;
  phone_number: string;
  profile_photo: string;
}

const Drivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const data = await getDrivers();
        setDrivers(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch drivers');
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const handleEditClick = (id: number) => {
    router.push(`/ediDriver/${id}`);
  };

  const handleAddClick = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleSyncDriverList = (driver: any) => {
    console.log("new Driver:- ", driver)
    drivers.push(driver)
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteDriver(id);
      if (response.status === 204) {
        setDrivers(prevDrivers => prevDrivers.filter(driver => driver.id !== id));
      } else {
        console.error('Failed to delete driver');
      }
    } catch (error) {
      console.error('Error deleting driver:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="drivers-page">
      <div className="header">
        <h1>Drivers</h1>
        <button className="add-button" onClick={handleAddClick}>Add New</button>
      </div>
      {showForm && <DriverForm onClose={handleCloseForm} type='add' syncDriverList={handleSyncDriverList} />}
      <ul className="drivers-list">
        {drivers.map((driver: Driver) => (
          <li className="driver-item" key={driver.id}>
          <div className="driver-info">
            <div className="profile-photo">
              {driver.profile_photo ? (
                <img id={driver.id.toString()} src={driver.profile_photo} alt={`${driver.name}`} />
              ) : (
                <img src="" alt="Default Avatar" className="default-avatar" />
              )}
            </div>
            <div>
              <h2>Name: {driver.name}</h2>
              <p>Phone: {driver.phone_number}</p>
            </div>
          </div>
          <button
            className="edit-button"
            onClick={() => {
              router.push(`/editDriver/${driver.id}`)
            }}
          >
            Edit
          </button>
          <button
            className="edit-button"
            onClick={async () => {
              handleDelete(driver.id)
            }}
          >
            Delete
          </button>
        </li>
        ))}
      </ul>
    </div>
  );
};

export default Drivers;
