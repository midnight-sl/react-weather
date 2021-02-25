import axios from 'axios';

const accessKey = 'YOUR_PERSONAL_ACCESS_KEY';

const api = axios.create({
  baseURL: 'https://cors-anywhere.herokuapp.com/http://api.weatherstack.com/'
});

export const getCurrentWeather = async (query) => {
  const weatherResult = await api.get(`/current?access_key=${accessKey}&query=${query}`);
  // console.log(weatherResult.data, "ANY DATA IN API???")
  return weatherResult.data;
}

