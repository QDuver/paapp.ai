import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import useFetchData from './useFetchData';

const App = () => {

  const { fetchData, data, requestStatus, requestError } = useFetchData();

  useEffect(() => {
    fetchData('https://life-automation-api-1050310982145.europe-west2.run.app/todays-exercices', {
      method: 'GET',
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {JSON.stringify(data)}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

export default App;
