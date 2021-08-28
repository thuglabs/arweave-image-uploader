import fs from "fs";
import path from "path";
import Arweave from "arweave";

const initOptions = {
  host: "arweave.net", // Hostname or IP address for a Arweave host
  port: 443, // Port
  protocol: "https", // Network protocol http or https
  timeout: 20000, // Network request timeouts in milliseconds
  logging: false, // Enable network request logging
};

// run
// npx @textury/arlocal
const initOptionsLocal = {
  host: "localhost", // Hostname or IP address for a Arweave host
  port: 1984, // Port
  protocol: "http", // Network protocol http or https
  timeout: 20000, // Network request timeouts in milliseconds
  // logging: false,     // Enable network request logging
};

const runUpload = async (fullPath) => {
  const arweave = Arweave.init(initOptions);

  const key = await arweave.wallets.generate();

  const data = fs.readFileSync(fullPath);

  const tx = await arweave.createTransaction({ data: data }, key);

  tx.addTag("Content-Type", "image/png");

  await arweave.transactions.sign(tx, key);

  const uploader = await arweave.transactions.getUploader(tx);

  while (!uploader.isComplete) {
    await uploader.uploadChunk();
    console.log(
      `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
    );
  }

  await arweave.transactions.post(tx);
  //   console.log("result", result);
//   console.log("tx", tx);
  console.log("url", `http://localhost:1984/${tx.id}`);
  console.log("url", `https://arweave.net/${tx.id}`);
  return tx;
};

const folder = "./public/images";
let imgWithUrl = {};

const iterateFolderFiles = async () => {
  try {
    // Get the files as an array
    const files = await fs.promises.readdir(folder);

    // Loop them all with the new for...of
    for (const file of files) {
      // Get the full paths
      const fullPath = path.join(folder, file);
      const fileName = file.replace(".png", "");
      console.log("file", file);
      console.log("fileName", fileName);
      console.log("fullPath", fullPath);
      //   console.log('data', data);
      const { id } = await runUpload(fullPath);
      const imageUrl = id ? `https://arweave.net/${id}` : undefined;
      imgWithUrl = {
        ...imgWithUrl,
        [fileName]: imageUrl,
      };
    } // End for...of

    // All images iterated
    // save imgWithUrl to json
    console.dir(imgWithUrl);
  } catch (e) {
    // Catch anything bad that happens
    console.error("We've thrown! Whoops!", e);
  }
};

iterateFolderFiles();
