// pages/editDriver/[id].tsx
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { getDriverById } from '../../services/api';
import DriverForm from '../../components/DriverForm'; // Adjust the import path as necessary

const EditDriverPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [driver, setDriver] = useState(null);

  useEffect(() => {
    const fetchDriver = async () => {
      if (id) {
        try {
          const driverData = await getDriverById(Number(id));
          setDriver(driverData);
        } catch (error) {
          console.error('Error fetching driver:', error);
        }
      }
    };

    fetchDriver();
  }, [id]);

  if (!driver) {
    return <div>Loading...</div>;
  }

  const syncDriverList = (updatedDriver: any) => {
    // handle the driver list update logic here
  };

  return (
    <DriverForm driver={driver} type='edit' syncDriverList={syncDriverList} />
  );
};

export default EditDriverPage;
