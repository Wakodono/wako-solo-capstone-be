import { body } from 'express-validator'

export const userPostValidation = [
    body("name").exists().isString().withMessage("First name is mandatory field"),
    body("surname").exists().isString().withMessage("Surname is mandatory field"),
    body("email").exists().isEmail().withMessage("Email is mandatory"),
    body("password").exists().isString().withMessage("Password is required for registration")
  ];