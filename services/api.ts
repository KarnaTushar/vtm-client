import axios from 'axios';
import { exportTraceState } from 'next/dist/trace';

const api = axios.create({
  baseURL: 'http://localhost:3001', // Your backend API URL
});

// export const getDrivers = () => api.get('/drivers/list');

export const getDrivers = async () => {
  try {
    const response = await api.get('/drivers/list');
    return response.data; // Assuming API returns a list of drivers
  } catch (error) {
    console.error('Error fetching drivers:', error);
    throw error; // Handle or propagate the error as needed
  }
};

export const deleteDriver = async (id: number) => {
  try {
    const response = await api.delete(`/drivers/delete/${id}`);
    return response;
  } catch (error) {
    console.error("error while deleteing driver", error);
    throw error;
  }
}

export const getDriverById = async (id: number) => {
  try {
    const response = await api.get(`/drivers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching driver with id ${id}:`, error);
    throw error; // Handle or propagate the error as needed
  }
};

export const updateDriver = async (driverData: FormData, id: number) => {
  try {
    const response = await api.put(`/drivers/edit/${id}`, driverData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Ensure proper content type for FormData
      },
    });
  } catch (error) {
    console.error("Error updating driver: ", error);
    throw error;
  }
}


export const addDriver = async (driverData: FormData) => {
  try {
    const response = await api.post('/drivers/create', driverData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Ensure proper content type for FormData
      },
    });
    return response.data; // Assuming API returns data
  } catch (error) {
    console.error('Error adding driver:', error);
    throw error; // Handle or propagate the error as needed
  }
};

export const getVehicles = async () => {
  try {
    const response = await api.get('/vehicles/list');
    return response.data; // Assuming API returns a list of vehicles
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    throw error; // Handle or propagate the error as needed
  }
};

export const deleteVehicle = async (id: number) => {
  try {
    const response = await api.delete(`/vehicles/delete/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    throw error;
  }
};

export const getVehicleById = async (id: number) => {
  try {
    const response = await api.get(`/vehicles/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching vehicle with id ${id}:`, error);
    throw error; // Handle or propagate the error as needed
  }
};

export const updateVehicle = async (vehicleData: FormData, id: number) => {
  try {
    const response = await api.put(`/vehicles/edit/${id}`, vehicleData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Ensure proper content type for FormData
      },
    });
    return response.data; // Assuming API returns updated data
  } catch (error) {
    console.error('Error updating vehicle:', error);
    throw error;
  }
};

export const addVehicle = async (vehicleData: FormData) => {
  try {
    const response = await api.post('/vehicles/create', vehicleData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Ensure proper content type for FormData
      },
    });
    return response.data; // Assuming API returns created vehicle data
  } catch (error) {
    console.error('Error adding vehicle:', error);
    throw error;
  }
};


export const transferVehicle = async (fromDriverId: number | null, toDriverId: number | null, vehicleId: number | null) => {
  try {
    const response = await api.post('/transfers/transfer', {
      fromDriverId,
      toDriverId,
      vehicleId,
    });
    return response.data;
  } catch (error) {
    console.error('Error transferring vehicle:', error);
    throw error;
  }
};

export const getTransferHistory = async (vehicleId: number) => {
  try {
    const response = await api.get(`/transfers/${vehicleId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transfer history:', error);
    throw error;
  }
};

export const listTransfers = async () => {
  try {
    const response = await api.get('/transfers/list');
    return response.data;
  } catch (error) {
    console.error('Error fetching transfer list:', error);
    throw error;
  }
};

export const getTransferDetails = async (transferId: number) => {
  try {
    const response = await api.get(`/transfers/transferDetails/${transferId}`);
    return response.data;
  } catch (error) {
    console.log("Error fetching transfer details: ", error);
    throw error;
  }
}

export const getActiveVehiclesForDriver = async (vehicleNumber: string) => {
  try {
    const response = await api.get(`/driver/${vehicleNumber}/vehicles`);
    return response.data;
  } catch (error) {
    console.error('Error fetching active vehicles for driver:', error);
    throw error;
  }
};

export const getDriverForVehicle = async (vehicleId: string) => {
  try {
    const response = await api.get(`/transfers/vehicle/${vehicleId}/driver`);
    return response.data;
  } catch (error) {
    console.error('Error fetching driver for vehicle:', error);
    throw error;
  }
};