import express from 'express';
import bodyParser from 'body-parser';
import productsRouter from './routes/products';
import customersRouter from './routes/customers';
import ordersRouter from './routes/orders';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.use(bodyParser.json());

app.use('/api/products', productsRouter);
app.use('/api/customers', customersRouter);
app.use('/api/orders', ordersRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
