# Run

Prerequisites:

- all images need to be in PNG format
- all images need to be placed in `public/images/` folder
- CSV data need to be placed in `public/birdzp-data.csv`
- !!! You need replace all `;` with `,` in CSV file for proper parsing.

Then run:

```
node ./uploader.js

# or

node run upload
```

The result json file will be saved to `./public/arweave-images.json`.


# More

There is React app to manually validate items. But it needs to be updated for use.
