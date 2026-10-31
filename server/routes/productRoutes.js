const express = require('express');
const { body } = require('express-validator');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Validation rules for product creation
const productValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Product description is required'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a valid non-negative number'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  body('brand')
    .trim()
    .notEmpty()
    .withMessage('Brand is required'),
  body('variants')
    .optional()
    .isArray()
    .withMessage('Variants must be an array of objects'),
  body('variants.*.size')
    .optional()
    .notEmpty()
    .withMessage('Variant size cannot be empty'),
  body('variants.*.color')
    .optional()
    .notEmpty()
    .withMessage('Variant color cannot be empty'),
  body('variants.*.stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Variant stock must be a non-negative integer'),
];

// Validation rules for product updates
const productUpdateValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Product name cannot be empty'),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Product description cannot be empty'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a valid non-negative number'),
  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category cannot be empty'),
  body('brand')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Brand cannot be empty'),
  body('variants')
    .optional()
    .isArray()
    .withMessage('Variants must be an array of objects'),
];

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected Admin routes
router.post('/', protect, adminOnly, productValidation, createProduct);
router.put('/:id', protect, adminOnly, productUpdateValidation, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
