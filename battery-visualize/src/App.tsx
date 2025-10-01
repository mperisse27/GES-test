import React, { useEffect, useState } from 'react';
import './App.css';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { BatteryList, Measurement } from './types';
import axios from 'axios';

function App() {
  const [batteries, setBatteries] = useState<BatteryList>();
  const [displayedMeasures, setDisplayedMeasures] = useState<Measurement[]>([]);
  const [displayedValue, setDisplayedValue] = useState<'chargeLevel' | 'temperature'>('chargeLevel');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<BatteryList>('http://localhost:8000/batteries', {
          headers: {
            Authorization: 'token123',
            Accept: 'application/json',
          },
        });
        setBatteries(response.data);
        setDisplayedMeasures(response.data.batteries[0].measurements);
      } catch (error) {
        console.error('Error fetching batteries:', error);
      }
    };

    fetchData();
  }, []);

  const toggleDisplayedValue = () => {
    setDisplayedValue(prev => prev === 'chargeLevel' ? 'temperature' : 'chargeLevel');
  }

  return (
    <div className="app-container">
      <aside className="battery-list">
        {
          batteries?.batteries.map((battery, index) => (
            <button key={index}
              onClick={() => setDisplayedMeasures(battery.measurements)}
            >
              <strong>{battery.serialNumber}</strong>
            </button>
          )) ?? <p>Loading batteries...</p>
        }
      </aside>
      <main className="main-content">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={displayedMeasures}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              label={{ value: 'Date', position: 'insideBottom', offset: -5 }}
            />
            <YAxis label={{ value: displayedValue === 'chargeLevel' ? 'Charge Level (%)' : 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            { displayedValue === 'chargeLevel' && <Line type="monotone" dataKey="chargeLevel" stroke="#8884d8" name="Charge (%)" strokeWidth={2} />}
            { displayedValue === 'temperature' && <Line type="monotone" dataKey="temperature" stroke="#8884d8" name="Température (°C)" strokeWidth={2} />}
          </LineChart>
        </ResponsiveContainer>
        <div>
          {
            displayedValue === 'chargeLevel' ?
            <p>
              Max: {displayedMeasures.map(measure => measure.chargeLevel).reduce((a, b) => Math.max(a, b), 0)}% |
              Min: {displayedMeasures.map(measure => measure.chargeLevel).reduce((a, b) => Math.min(a, b), 100)}% |
              Avg: { (displayedMeasures.map(measure => measure.chargeLevel).reduce((a, b) => a + b, 0) / displayedMeasures.length).toFixed(2)}%
            </p> :
            <p>
              Max: {displayedMeasures.map(measure => measure.temperature).reduce((a, b) => Math.max(a, b), -Infinity)}°C |
              Min: {displayedMeasures.map(measure => measure.temperature).reduce((a, b) => Math.min(a, b), Infinity)}°C |
              Avg: { (displayedMeasures.map(measure => measure.temperature).reduce((a, b) => a + b, 0) / displayedMeasures.length).toFixed(2)}°C
            </p>
          }
          
        </div>
        <button className='display-button'
          onClick={toggleDisplayedValue}
        >
          Display {displayedValue === 'chargeLevel' ? 'Temperature' : 'Charge Level'}
        </button>
      </main>
    </div>
  );
}

export default App;
