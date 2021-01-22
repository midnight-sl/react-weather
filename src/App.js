import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './styles/App.css';
import WeatherTab from './components/WeatherTab'

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <WeatherTab />
        </Route>
      </Switch>

    </Router>
  );
}

