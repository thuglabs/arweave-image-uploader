import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [imgJson, setImgJson] = useState({});

  useEffect(() => {
    const fetchJson = async () => {
      const result = await fetch("./arweave-images.json");
      const json = await result.json();
      setImgJson(json);
    };

    fetchJson();
  }, []);

  console.log("imgJson", imgJson);

  return (
    <div className="App">
      <header className="App-header">
        <p>Here is list of uploaded images</p>

        <div className="container">
          {Object.keys(imgJson).map((key) => {
            return (
              <a
                className="img-link"
                href={imgJson[key].uri}
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* <img className="img" src={imgJson[key]} /> */}
                <span>{key}</span>
              </a>
            );
          })}
        </div>

        {/* <img src="images/0.png" /> */}
      </header>
    </div>
  );
}

export default App;
