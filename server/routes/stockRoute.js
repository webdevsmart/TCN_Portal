const express = require('express');
const productCategoryCtrl = require('../controller/stock/productCategoryCtrl');
const productCtrl = require('../controller/stock/productCtrl');
const router = express.Router();

// product category
router.post('/productCategory/addCategory', productCategoryCtrl.addCategory);
router.post('/productCategory/getCategoryList', productCategoryCtrl.getCategoryList);
router.get('/productCategory/getTotalCategory', productCategoryCtrl.getTotalCategory);
router.post('/productCategory/getCategoryById', productCategoryCtrl.getCategoryById);
router.post('/productCategory/deleteCategory', productCategoryCtrl.deleteCategory);
router.post('/productCategory/uploadSheet', productCategoryCtrl.uploadSheet);
router.get('/productCategory/downloadSheet', productCategoryCtrl.downloadSheet);

// product
router.post('/product/getProduct', productCtrl.getProduct);
router.post('/product/getProductList', productCtrl.getProductList);
router.post('/product/uploadProductImage', productCtrl.uploadProductImage);
router.post('/product/addProduct', productCtrl.addProduct);
router.post('/product/getProductByCategory', productCtrl.getProductByCategory);
router.post('/product/getProductById', productCtrl.getProductById);
router.post('/product/deleteProduct', productCtrl.deleteProduct);
router.post('/product/uploadSheet', productCtrl.uploadSheet);
router.get('/product/downloadSheet', productCtrl.downloadSheet);

module.exports = router;
