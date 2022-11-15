import express from 'express';
const app = express();
import data from './data.js';

const PORT = process.env.PORT || 5000;

app.get('/api/products', (req, res) => {
  res.send(data.products);
});

app.get('/api/products/slug/:slug', (req, res) => {
  const { slug } = req.params;
  const product = data.products.find((product) => product.slug === slug);
  if (product) res.send(product);
  else res.status(404).send({ message: 'Product not found' });
});

app.listen(PORT, () => {
  console.log(`Server Started on: http://localhost:${PORT}`);
});
