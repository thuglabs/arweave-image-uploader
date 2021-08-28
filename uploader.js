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

// run localy
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

  //   Do we need to post with uploader?
  await arweave.transactions.post(tx);

  //   console.log("url", `http://localhost:1984/${tx.id}`);
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
      console.log("file", file);

      //   skip any file other than PNG
      if (file.includes(".png")) {
        const fileName = file.replace(".png", "");
        //   console.log("fileName", fileName);
        //   console.log("fullPath", fullPath);
        let newItem = {};

        try {
          const { id } = await runUpload(fullPath);
          const imageUrl = id ? `https://arweave.net/${id}` : undefined;
          newItem = {
            [fileName]: imageUrl,
          };
        } catch (error) {
          newItem = {
            [fileName]: undefined,
          };
        }

        imgWithUrl = {
          ...imgWithUrl,
          ...newItem,
        };
      } else {
          console.log('skipped.');
      }
    }

    // All images iterated
    console.dir(imgWithUrl);

    // Save data to json in /public/
    const data = JSON.stringify(imgWithUrl);
    fs.writeFileSync("./public/arweave-images.json", data);
  } catch (e) {
    // Catch anything bad that happens
    console.error("We've thrown! Whoops!", e);
  }
};

iterateFolderFiles();
