import axios from 'axios';

const API_URL = 'http://localhost:8080/api/medical';

export const uploadMedicalReport = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`${API_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};