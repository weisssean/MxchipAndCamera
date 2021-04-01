import { useEffect, useState } from "react";
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
      // debugger
      setDeviceId(result.deviceId);
      console.log(result.iotData);
      if (result.iotData.temp) setTemp(result.iotData.temp);
      setHumidity(result.iotData.humidity);
      setPressure(result.iotData.pressure);
    }
  };
  useEffect(() => {
    subscribe(callback);
    return () => {
      
      disconnect();
    };
  }, []);
  return (
    <>
    {/* <iframe className="iframe" src={`${process.env.REACT_APP_DEVICE_IP_ADDRESS}:8088/`}  scrolling="yes" height="100%" width="100%" ></iframe> */}
    <div className="App-body">
      <h2 className="title">Greenroom 1</h2>
      <iframe className="iframe" id="frm"  src={`http://${window.location.hostname}:8088`}  scrolling="yes" height="100%" width="100%" ></iframe>
      <div className="app">
        <div class="row">
          {/* <div class="column">
            <h3>{deviceId}</h3>
          </div> */}
          <div class="column">
            <h1>{`Temperature: ${(temp * (9 / 5) + 32).toFixed(2)}°F`}</h1>
          </div>
          <div class="column">
            <h1>{`Hunidity: ${humidity}%`}</h1>
          </div>
          {/* <div class="column">
            {" "}
            <h3>{`Pressure: ${pressure}`}</h3>
          </div> */}
        </div>
        {/* <h2>{deviceId}</h2>
        <h3>{`Temperature: ${(temp * (9 / 5) + 32).toFixed(2)}°F`}</h3>
        <h3>{`Hunidity: ${humidity}%`}</h3>
        <h3>{`Pressure: ${pressure}`}</h3> */}
      </div>
      </div>
    </>
  );
}

export default App;
