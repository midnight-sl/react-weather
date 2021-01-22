import React, { useEffect, useState } from 'react';
import { getCurrentWeather } from '../helpers/api';
import '../styles/Weather.css'


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
          };
        });
    } else {
      alert("Sorry location is not available! Choose the city manually!");
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(() => {
    sessionStorage.setItem(`${city}-weather`, JSON.stringify(currentWeather));
    //eslint-disable-next-line react-hooks/exhaustive-deps
  },[currentWeather])

  const handleErrors = (err) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  const handleSuccess = async (pos) => {
    const crd = pos.coords;

    setLatitude(crd.latitude);
    setLongitude(crd.longitude);

    const coords = latitude + ',' + longitude;

    if (latitude && longitude) {
      if( window.confirm('Proceed and show weather for your current location?' )) {
        const weather = await getCoordinatesWeather(coords);
        setCurrentWeather(weather.current);
        setCity(`${weather.location.name}, ${weather.location.country}`);
      }
    }
    
  }

  const handleShowWeather = async(event) => {
    event.preventDefault();
    if (!!city.trim()) {

      const weatherFromStorage =  JSON.parse(sessionStorage.getItem(`${city}-weather`));
      if (!!weatherFromStorage) {
        setCurrentWeather(weatherFromStorage);

      } else {
        const weather = await getCityWeather();
        setCurrentWeather(weather.current);
        return weather;
      }
      
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
      const feelTemp = currentWeather.feelslike;
      const humidity = currentWeather.humidity;
      const description = currentWeather.weather_descriptions[0];
      const iconLocationString = currentWeather.weather_icons[0];
      const wind = currentWeather.wind_dir;
      const windSpeed = currentWeather.wind_speed;

      let windToShow;
      switch (wind) {
        case 'N':
          windToShow = 'North';
          break;
        case 'NE':
          windToShow = 'Northeast';
          break;
        case 'E':
          windToShow = 'East';
          break;
        case 'SE':
          windToShow = 'Southeast';
          break;
        case 'S':
          windToShow = 'South';
          break;
        case 'SW':
          windToShow = 'Southwest';
          break;
        case 'W':
          windToShow = 'West';
          break;
        case 'NW':
          windToShow = 'Northwest';
          break;
        default:
          windToShow ='absent';
      }
      

      return <div className='weather-block'>
        <img src={iconLocationString} alt='weather icon'/>
        <p className='description'>Current weather in {city} is {temp} degrees and {description.toLowerCase()}. Feels like {feelTemp} degrees.</p><p className='description'> Humidity is {humidity}%. Wind is {wind.length === 3 ? wind : windToShow}, {windSpeed} km/hour</p>
      </div>
    } else {
      return <p>Enter name of the city to show the weather</p>
    }
  }

  return (
    <div className="weather page">
      <div className='weather-header'>
        <h2>Current Weather</h2>
      </div>
      <div className="choose-city">
        <form>
          <input type="text" name="city" value={city} onChange={event => setCity(event.target.value)} />
          <button type="submit" onClick={handleShowWeather}>Show Weather</button>
        </form>
      {renderWeatherBlock()}
      </div>
    </div>
  );
}
