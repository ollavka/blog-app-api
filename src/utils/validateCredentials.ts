import isEmail from 'validator/lib/isEmail';
import passwordValidator from 'password-validator';
import { UserCredentials } from '../types';

const validate: Record<keyof UserCredentials, (value: string) => any> = {
  email: (email: string) => {
    if (!email.trim()) {
      return 'Email is required';
    };
  
    const isValidEmail = isEmail(email);
  
    if (!isValidEmail) {
      return 'Email is invalid';
    }
  
    return null;
  },
  password: (password: string) => {
    if (!password.trim()) {
      return 'Password is required';
    }
  
    const schema = new passwordValidator();
  
    schema
      .min(6, 'Must have at least 6 characters')
      .max(20, 'Maximum length 20')
      .digits(1, 'Must have at least 1 digit')
      .has()
      .not()
      .spaces(0, 'Should not have spaces')
      .has()
      .letters(1, 'Must have at least 1 letter')
  
    const validateDetails = schema.validate(password, { details: true }) as {
      message: string;
    }[];
  
    const [errorMessage] = validateDetails.map(details => details.message);
  
    return errorMessage || null;
  },
  username: (username: string) => {
    if (!username.trim()) {
      return 'Username is required';
    };
  
    return null;
  },
};

type Errors = Record<keyof UserCredentials, string>;

export const validateCredentials = (credentials: Partial<UserCredentials>) => {
  const errors = Object.entries(credentials).reduce((acc, [key, value]) => {
    const credentialKey = key as keyof UserCredentials;

    const validatedValue = validate[credentialKey](value);

    if (validatedValue) {
      acc[credentialKey] = validatedValue;
    }

    return acc;
  }, {} as Errors);

  const hasError = Object.keys(errors).length > 0;

  return { errors, hasError };
};
