# Arweave NFT Metadata Uploaded

This package can be used to create metadata files on the Arweave network. It first uploads NFT image and then creates a metadata JSON file for this NFT using this image and default fields from file `uploader.js`.
It is created with an idea to be used with Solana blockchain and uses [Metaplex NFT Standard](https://docs.metaplex.com/nft-standard) but it isn't bound to Solana in any case and can be used with any other blockchain as well.

Prerequisites:

- all images need to be in PNG format
- all images need to be placed in `public/images/` folder
- CSV data need to be placed in `public/data.csv`

Then run:

```
node ./uploader.js

# or

node run upload
```

The result json file will be saved to `./public/arweave-images.json`. This files consists of arrays of NFT objects with name / uri fields


# TODO: More

There is React app to manually validate items. But it needs to be updated for better use.
