import axios from 'axios';

const accessKey = 'a4ccf188a535d74355cc5968008e34df';

const api = axios.create({
  baseURL: 'http://api.weatherstack.com/'
});

export const getCurrentWeather = async (query) => {
  const weatherResult = await api.get(`/current?access_key=${accessKey}&query=${query}`);
  // console.log(weatherResult.data, "ANY DATA IN API???")
  return weatherResult.data;
}

