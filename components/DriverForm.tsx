import React, { useState, useEffect } from 'react';
import { addDriver, updateDriver } from '../services/api';
import { useRouter } from 'next/router';

interface DriverFormProps {
  driver?: {
    id: number;
    name: string;
    phone_number: string;
    profile_photo: string;
  };
  onClose?: () => void;
  type: 'add' | 'edit';
  syncDriverList: (driver: any) => void;
}

const DriverForm: React.FC<DriverFormProps> = ({ driver, onClose, type, syncDriverList }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);

  const router = useRouter();
  useEffect(() => {
    if (driver) {
      setName(driver.name);
      setPhoneNumber(driver.phone_number);
    }
  }, [driver]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone_number', phoneNumber);
    if (profilePhoto) {
      formData.append('profile_photo', profilePhoto);
    }

    try {
      if (driver) {
        await updateDriver(formData, driver.id);
        router.push('/drivers');
      } else {
        const response = await addDriver(formData);
        console.log(response)
        syncDriverList(response)
      }
      if (onClose) onClose();
    } catch (error) {
      console.error('Error saving driver:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setProfilePhoto(file);
    }
  };

  return (
    <div className="driver-form-card">
      <form onSubmit={handleSubmit}>
        <label>
          Driver Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Driver Name"
            required
          />
        </label>
        <label>
          Phone Number:
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone Number"
          />
        </label>
        <label>
          Profile Photo:
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
          />
        </label>
        <button type="submit">{driver ? 'Update Driver' : 'Add Driver'}</button>
        {onClose && <button type="button" onClick={onClose}>Cancel</button>}
        {type === "edit" ? <button type="button" onClick={() =>{router.push('/drivers')}}>Cancel</button> : null}
      </form>
    </div>
  );
};

export default DriverForm;
