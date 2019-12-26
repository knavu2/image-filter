import bodyParser from 'body-parser';
import express, {Request, Response} from 'express';
import {filterImageFromURL, deleteLocalFiles, fileExists} from './util/util';

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Root Endpoint
  // Displays a simple message to the user
  app.get('/', async (req: Request, res: Response) => {
    res.status(200).send('HELLO, WORLD!');
  });

  app.get('/filteredimage', async (req: Request, res: Response) => {
    const {image_url} = req.query;

    if (!image_url) {
      return res.status(404).send('image url required');
    }

    const filteredPath = await filterImageFromURL(image_url);
    res.status(200).sendFile(filteredPath, err => {
      if (err) {
        console.error(err);
        return;
      }

      if (fileExists(filteredPath)) {
        console.log('FILE EXISTS ', filteredPath);
        deleteLocalFiles([filteredPath]);
      }
    });
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
