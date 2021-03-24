import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { subscribe, disconnect } from "./utils/events";

function App() {
  const [temp, setTemp] = useState(false);
  const [humidity, setHumidity] = useState(0);
  const [pressure, setPressure] = useState(0);
  const [deviceId, setDeviceId] = useState(0);
  //set up event hub listener
  const callback = (evtType, result) => {
    console.log("got camera heartbeat from event hub", result);
    console.log(result);
    if (result.messageSource === "Telemetry") {
      debugger
      setDeviceId(result.deviceId);
      console.log(result.iotData);
      if(result.iotData.temp)
        setTemp(result.iotData.temp);
      setHumidity(result.iotData.humidity);
      setPressure(result.iotData.pressure);
    }
  };

  useEffect(() => {
    subscribe(callback);
    return () => {
      disconnect()
    }
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <h2>{deviceId}</h2>
        <h3>{`Temperature: ${((temp * (9/5)) + 32).toFixed(2)}°F`}</h3>
        <h3>{`Hunidity: ${humidity}%`}</h3>
        <h3>{`Pressure: ${pressure}`}</h3>
      </header>
      <iframe src="http://96.230.190.210:8099/"></iframe>
    </div>
  );
}

export default App;
