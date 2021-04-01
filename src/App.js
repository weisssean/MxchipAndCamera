import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { subscribe, disconnect } from "./utils/events";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper, ThemeProvider } from "@material-ui/core";
import { createMuiTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: "100%",
  },
  iframe: {
    width: "100%",
    height: "100%",
  },
  grid: {
    width: "100%",
    height: "100%",
  },
}));

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

function App() {
  const classes = useStyles();

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
    <ThemeProvider theme={darkTheme}>
    <div className="App" className={classes.root}>
      <Grid container spacing={0} className={classes.grid}>
        <Grid item xs={12} sm={8}>
            <iframe
              className={classes.iframe}
              src="http://96.230.190.210:8099/"
            ></iframe>
        </Grid>
        <Grid item xs={12} sm={4}>
          <div className={classes.paper}>
            <Grid item xs={12}>
              <h2>{deviceId}</h2>
            </Grid>
            <Grid item xs={12}>
              <h3>{`Temperature: ${(temp * (9 / 5) + 32).toFixed(2)}°F`}</h3>
            </Grid>
            <Grid item xs={12}>
              <h3>{`Hunidity: ${humidity}%`}</h3>
            </Grid>
            <Grid item xs={12}>
              <h3>{`Pressure: ${pressure}`}</h3>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </div>
    </ThemeProvider>
  );
}

export default App;
