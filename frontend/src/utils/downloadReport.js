import axiosInstance from '../shared/api/axiosInstance';

// Downloads an excel report from the API and saves it with the given file name.
export const downloadReport = async (apiPath, fileName) => {
  const response = await axiosInstance.get(apiPath, { responseType: 'blob' });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(url);
};
