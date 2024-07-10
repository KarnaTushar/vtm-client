// pages/editVehicle/[id].tsx
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { getVehicleById } from '../../services/api'; // Adjust the import path as necessary
import VehicleForm from '../../components/VehicleForm';

const EditVehiclePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [vehicle, setVehicle] = useState<any>(null); // Adjust the type based on your API response structure

  useEffect(() => {
    const fetchVehicle = async () => {
      if (id) {
        try {
          const vehicleData = await getVehicleById(Number(id));
          setVehicle(vehicleData);
        } catch (error) {
          console.error('Error fetching vehicle:', error);
        }
      }
    };

    fetchVehicle();
  }, [id]);

  if (!vehicle) {
    return <div>Loading...</div>;
  }

  const syncVehicleList = (updatedDriver: any) => {
    // handle the driver list update logic here
  };

  return (
    <VehicleForm vehicle={vehicle} type='edit' syncVehicleList={syncVehicleList}/>
  );
};

export default EditVehiclePage;
