import { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

import Arweave from "arweave";

const initOptions = {
  host: 'arweave.net',// Hostname or IP address for a Arweave host
  port: 443,          // Port
  protocol: 'https',  // Network protocol http or https
  timeout: 20000,     // Network request timeouts in milliseconds
  logging: false,     // Enable network request logging
}

const initOptionsLocal = {
  host: 'localhost',// Hostname or IP address for a Arweave host
  port: 1984,          // Port
  protocol: 'http',  // Network protocol http or https
  timeout: 20000,     // Network request timeouts in milliseconds
  // logging: false,     // Enable network request logging
}

window.addEventListener("arweaveWalletLoaded", () => {
  console.log('arweaveWalletLoaded');
  /** Handle ArConnect load event **/
});

function App() {
  useEffect(() => {
    const doArweaveStuff = async () => {

      const imageResponse = await fetch('images/0.png');
      // const image = await imageResponse.json();
      const blob = await imageResponse.blob();
      const imageBuffer = blob;
      const arrayBuffer = await new Response(blob).arrayBuffer();
      const image = new Uint8Array(imageBuffer);
      console.log('image', image)

      const arweave = Arweave.init(initOptionsLocal);
      console.log("arweave", arweave);
      // arweave.wallets.getBalance('H10jaICIKCRgCer2JIUgMmJFDtjJB49W3kXRH6Adk-I')
      //   .then((balance) => {
      //     let winston = balance;
      //     let ar = arweave.ar.winstonToAr(balance);
      //     // console.log('hello', winston)
      //     console.log('winston', winston);
      //     //125213858712

      //     console.log('ar', ar);
      //     //0.125213858712
      //   }
      // );
      // let key = await arweave.wallets.generate();

      // Plain text
      let tx = await arweave.createTransaction(
        {
          data: image,
        }
      );

      console.log("tx", tx);
      tx.addTag('Content-Type', 'image/png');
      // tx.addTag('Content-Type', 'png');

      await arweave.transactions.sign(tx);
      const result = await arweave.transactions.post(tx);
      console.log('result', result)

      // console.log(`https://arweave.net/tx/${tx.id}/data`);
      //www.arweave.net/aQmNwDsDgo7i2LOAdOQjMu9_V-VsN4UcYsFZ-ZWWLqE?ext=png",

      arweave.transactions.getStatus(tx.id).then(res => {
        console.log('res', res);
        // {
        //  status: 200,
        //  confirmed: {
        //    block_height: 140151,
        //    block_indep_hash: 'OR1wue3oBSg3XWvH0GBlauAtAjBICVs2F_8YLYQ3aoAR7q6_3fFeuBOw7d-JTEdR',
        //    number_of_confirmations: 20
        //  }
        //}
    })

      // const result = await arweave.api.get(tx.id);
      // const data = await result.json();
      // console.log("data", data);

      // Buffer
      // let transactionB = await arweave.createTransaction(
      //   {
      //     data: Buffer.from("Some data", "utf8"),
      //   },
      //   key
      // );

      // console.log('transactionB', transactionB);
    };

    doArweaveStuff();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        {/* <img src="images/0.png" /> */}
      </header>
    </div>
  );
}

export default App;
