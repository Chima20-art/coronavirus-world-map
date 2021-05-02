import styles from "./App.module.css";
import { WorldMap } from "react-svg-worldmap";
import { useState, useEffect } from "react";
import getCountryISO2 from "country-iso-3-to-2";

function App() {
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState(null);
  const [confirmedData, setConfirmedData] = useState([]);
  const [deathsData, setDeathsData] = useState([]);
  const [activeData, setActiveData] = useState([]);
  const [recoveredData, setRecoveredData] = useState([]);
  const [clickedButton, setClickedButton] = useState(
    "Coronavirus World Map: Cases"
  );
  const [timeStamp, setTimeStamp] = useState(null);

  useEffect(() => {
    async function Fetch() {
      var response = await fetch(
        "https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases2_v1/FeatureServer/2/query?where=1%3D1&outFields=OBJECTID,Country_Region,Last_Update,Confirmed,Deaths,Recovered,Active,People_Tested,ISO3&outSR=4326&f=json"
      );
      response = await response.json();
      const confirmedData = [];
      const deathsData = [];
      const activeData = [];
      const recoveredData = [];

      response.features.forEach((item) => {
        setTimeStamp(new Date(item.attributes.Last_Update).toLocaleString());
        var ISO2 = getCountryISO2(item.attributes.ISO3);
        if (ISO2 != undefined || ISO2 != null) {
          confirmedData.push({
            country: ISO2,
            value: item?.attributes?.Confirmed ? item.attributes.Confirmed : -1,
          });
          deathsData.push({
            country: ISO2,
            value: item?.attributes?.Deaths ? item.attributes.Deaths : -1,
          });
          activeData.push({
            country: ISO2,
            value: item?.attributes?.Active ? item.attributes.Active : -1,
          });
          recoveredData.push({
            country: ISO2,
            value: item?.attributes?.Recovered ? item.attributes.Recovered : -1,
          });
        }
      });

      setData(confirmedData);
      setConfirmedData(confirmedData);
      setDeathsData(deathsData);
      setActiveData(activeData);
      setRecoveredData(recoveredData);
      setLoading(false);
    }
    Fetch();
  }, []);

  const onCases = () => {
    setData(confirmedData);
    setClickedButton("Coronavirus World Map: Cases");
  };

  const onDeaths = () => {
    setData(deathsData);
    setClickedButton("Coronavirus World Map: Deaths");
  };

  const onRecovered = () => {
    setData(recoveredData);
    setClickedButton("Coronavirus World Map: Recovered");
  };

  const onActive = () => {
    setData(activeData);
    setClickedButton("Coronavirus World Map: Active");
  };
  console.log(timeStamp);

  const generateLabel = (country, isoCode, value, prefix, suffix) => {
    if (value == -1) {
      return "No Data";
    }
    if (clickedButton === "Coronavirus World Map: Cases") {
      return country + " has " + value + " Cases";
    }
    if (clickedButton === "Coronavirus World Map: Deaths") {
      return country + " has " + value + " Deaths ";
    }
    if (clickedButton === "Coronavirus World Map: Recovered") {
      return country + "has" + value + " Recovered  ";
    }
    if (clickedButton === "Coronavirus World Map: Active") {
      return country + " has " + value + " Active cases";
    }
    //return country + " has " + value + " " + clickedButton + " Cases";
  };

  return (
    <div>
      <div>
        {loading ? (
          <h1>loading...</h1>
        ) : (
          <div className={styles.body}>
            <div className={styles.map}>
              <WorldMap
                size="responsive"
                data={data}
                color="pink"
                tooltipTextFunction={generateLabel}
                title={clickedButton}
              />
            </div>
            <div className={styles.update}>
              By Chaimae Michich, last update : {timeStamp}
            </div>

            <div className={styles.buttons}>
              <div className={styles.button}>
                <button
                  style={{
                    width: "17vw",
                    height: "50px",
                    borderRadius: "5px",
                    backgroundColor:
                      clickedButton === "Coronavirus World Map: Cases"
                        ? "black"
                        : "unset",
                    color:
                      clickedButton === "Coronavirus World Map: Cases"
                        ? "white"
                        : "unset",
                  }}
                  onClick={onCases}
                >
                  CASES{" "}
                </button>
              </div>
              <div className={styles.button}>
                <button
                  style={{
                    width: "17vw",
                    height: "50px",
                    borderRadius: "5px",
                    backgroundColor:
                      clickedButton === "Coronavirus World Map: Deaths"
                        ? "black"
                        : "unset",
                    color:
                      clickedButton === "Coronavirus World Map: Deaths"
                        ? "white"
                        : "unset",
                  }}
                  onClick={onDeaths}
                >
                  DEATHS{" "}
                </button>
              </div>
              <div className={styles.button}>
                <button
                  style={{
                    width: "17vw",
                    height: "50px",
                    borderRadius: "5px",
                    backgroundColor:
                      clickedButton === "Coronavirus World Map: Recovered"
                        ? "black"
                        : "unset",
                    color:
                      clickedButton === "Coronavirus World Map: Recovered"
                        ? "white"
                        : "unset",
                  }}
                  onClick={onRecovered}
                >
                  RECOVERED{" "}
                </button>
              </div>
              <div className={styles.button}>
                <button
                  style={{
                    width: "17vw",
                    height: "50px",
                    borderRadius: "5px",
                    backgroundColor:
                      clickedButton === "Coronavirus World Map: Active"
                        ? "black"
                        : "unset",
                    color:
                      clickedButton === "Coronavirus World Map: Active"
                        ? "white"
                        : "unset",
                  }}
                  onClick={onActive}
                >
                  ACTIVE{" "}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
