import styles from "./App.module.css";
import { WorldMap } from "react-svg-worldmap";
import { useState, useEffect } from "react";
import getCountryISO2 from "country-iso-3-to-2";

function App() {
  const [loading, setLoading] = useState(false);
  const [rawData, setRawData] = useState(null);
  const [data, setData] = useState([]);

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
        var ISO2 = getCountryISO2(item.attributes.ISO3);
        if (ISO2 != undefined || ISO2 != null) {
          confirmedData.push({
            country: ISO2,
            value: item.attributes.Confirmed,
          });
          deathsData.push({
            country: ISO2,
            value: item.attributes.Deaths,
          });
          activeData.push({
            country: ISO2,
            value: item.attributes.Active,
          });
          recoveredData.push({
            country: ISO2,
            value: item.attributes.recovered,
          });
        }
        console.log(item.attributes);
      });

      setData(confirmedData);
    }
    Fetch();
  }, []);

  return (
    <div>
      <div className={styles.buttons}>
        <div>
          <button>CASES </button>
        </div>
        <div>
          <button>DEATHS </button>
        </div>
        <div>
          <button>RECOVERED </button>
        </div>
        <div>
          <button>ACTIVE </button>
        </div>
      </div>
      <div>
        {loading ? (
          <h1>loading...</h1>
        ) : (
          <div className={styles.map}>
            <WorldMap size="responsive" data={data} color="orange" />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
