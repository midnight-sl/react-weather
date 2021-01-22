import React, { useEffect, useState } from 'react';
import { getCurrentWeather } from '../helpers/api'


export default function WeatherTab() {

  const [city, setCity] = useState('');
  const [currentWeather,  setCurrentWeather] = useState(null);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');


  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state === "granted") {
            navigator.geolocation.getCurrentPosition(handleSuccess);

          } else if (result.state === "prompt") {
            navigator.geolocation.getCurrentPosition(handleSuccess, handleErrors);

          } else if (result.state === "denied") {
            alert("Allow the browser to use your location or choose the city manually!");
          }
          result.onchange = function () {
            console.log(result.state);
          };
        });
    } else {
      alert("Sorry location is not available! Choose the city manually!");
    }
  },[]);

  const handleErrors = (err) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  const handleSuccess = async (pos) => {
    const crd = pos.coords;

    setLatitude(crd.latitude);
    setLongitude(crd.longitude);

    const coords = latitude + ',' + longitude;
    const weather = await getCoordinatesWeather(coords);
    setCurrentWeather(weather.current);
    
    console.log('current city weather', weather);
    setCity(`${weather.location.name}, ${weather.location.country}`);
  }

  const handleShowWeather = async(event) => {
    event.preventDefault();
    if (!!city.trim()) {
      const weather = await getCityWeather();
      console.log(weather, "OK???");
      setCurrentWeather(weather.current);
      return weather;
    } else {
      alert('Write correct city')
    }
  }

  
  const getCityWeather = async() => {
    const current = await getCurrentWeather(city);
    return current;
  }
  const getCoordinatesWeather = async(coords) => {
    const current = await getCurrentWeather(coords);
    return current;
  }

  const renderWeatherBlock = () => {
    if (currentWeather){
      const temp = currentWeather.temperature;
      const feelTemp = currentWeather.feelsLike;
      const humidity = currentWeather.humidity;
      const description = currentWeather.weather_descriptions[0];
      const iconLocationString = currentWeather.weather_icons[0];
      const wind = currentWeather.wind_dir;
      const windSpeed = currentWeather.wind_speed;

      return <div>
        <img src={iconLocationString} alt='weather icon'/>
        <p>Current weather in {city} is {temp} and {description.toLowerCase()}. Feels like {feelTemp} degrees. Humidity is {humidity}%. Wind is {wind}, {windSpeed} km/hour</p>
      </div>
    } else {
      return <p>Please wait. Still loading...</p>
    }
  }

  return (
    <div className="weather page">
      <div className='weather-header'>
        <h2>Current Weather</h2>
      </div>
      <div className="choose-city">
        <form>
          <input type="text" name="city" placeholder="City" onChange={event => setCity(event.target.value)} />
          <button type="submit" onClick={handleShowWeather}>Show Weather</button>
        </form>
      <div>
        {renderWeatherBlock()}
      </div>
      </div>
    </div>
  );
}