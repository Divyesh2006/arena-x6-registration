/**
 * Input Validation Middleware
 * Uses express-validator for comprehensive input validation
 */

const { body, validationResult } = require('express-validator');

/**
 * Validation rules for team registration
 */
const validateRegistration = [
  body('team_name')
    .trim()
    .notEmpty().withMessage('Team name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Team name must be between 3 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-]+$/).withMessage('Team name can only contain letters, numbers, spaces, and hyphens'),
  
  body('student1_name')
    .trim()
    .notEmpty().withMessage('Student 1 name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),
  
  body('student1_regno')
    .trim()
    .notEmpty().withMessage('Student 1 registration number is required')
    .isLength({ min: 5, max: 20 }).withMessage('Registration number must be between 5 and 20 characters')
    .matches(/^[A-Z0-9]+$/).withMessage('Registration number must be uppercase alphanumeric'),
  
  body('student2_name')
    .trim()
    .notEmpty().withMessage('Student 2 name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),
  
  body('student2_regno')
    .trim()
    .notEmpty().withMessage('Student 2 registration number is required')
    .isLength({ min: 5, max: 20 }).withMessage('Registration number must be between 5 and 20 characters')
    .matches(/^[A-Z0-9]+$/).withMessage('Registration number must be uppercase alphanumeric'),
  
  body('year')
    .trim()
    .notEmpty().withMessage('Academic year is required')
    .isIn(['1st Year', '2nd Year', '3rd Year', '4th Year']).withMessage('Invalid year selection')
];

/**
 * Validation rules for admin login
 */
const validateLogin = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

/**
 * Middleware to check validation results
 */
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  
  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  checkValidation
};
