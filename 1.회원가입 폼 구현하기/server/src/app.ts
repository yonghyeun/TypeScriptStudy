import express, { Request, Response } from 'express';

const app = express();

app.set('port', 3000);

app.get('/', (req: Request, res: Response) => {
  res.send('hi~!');
});
