const express = require('express');
const path = require('path');
const ProductService = require('../services');
const receipt = '../assets/receipt.pdf'

const platziStore = (app) => {
  const router = express.Router();
  app.use('/api/', router);

  const productService = new ProductService();

  router.get('/', (req, res) => {
    res.send(`API v2`);
  });

  router.get('/receipts', (req, res, next) => {
    let file = path.join(__dirname, receipt);
    res.sendFile(file);
  });

  router.get('/products', async (req, res, next) => {
    try {
      const products = await productService.getProducts()
      res.status(200).json({
        data: products,
        message: 'Products listed'
      });
    } catch (error) {
      next(error);
    }
  });

  router.get('/products/:productId', async (req, res, next) => {
    try {
      const { productId } = req.params;
      const product = await productService.getProduct({ productId })
      res.status(200).json({
        data: product,
        message: 'Product retrieved'
      });
    } catch (error) {
      next(error);
    }
  });

  router.post('/products', async (req, res, next) => {
    try {
      const { body: product } = req;
      const createdProductId = await productService.createProduct({ product })
      res.status(200).json({
        data: createdProductId,
        message: 'Product created'
      });
    } catch (error) {
      next(error);
    }
  });

  router.put('/products/:productId', async (req, res, next) => {
    try {
      const { body: product } = req;
      const { productId } = req.params;
      const updatedProductId = await productService.updateProduct({ productId, product })
      res.status(200).json({
        data: updatedProductId,
        message: 'Product updated'
      });
    } catch (error) {
      next(error);
    }
  });

  router.delete('/products/:productId', async (req, res, next) => {
    try {
      const { productId } = req.params;
      const deletedProductId = await productService.deleteProduct({ productId })
      res.status(200).json({
        data: deletedProductId,
        message: 'Product deleted'
      });
    } catch (error) {
      next(error);
    }
  });

  router.get('*', (req, res) => {
    res.status(404).send('Error 404');
  });
}

module.exports = platziStore;