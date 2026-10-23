import * as yup from 'yup'

export const loginSchema = yup.object({
  username: yup
    .string()
    .trim()
    .required('Please enter your username.')
    .max(64, 'Username must not exceed 64 characters.'),

  password: yup
    .string()
    .required('Please enter your password.')
    .test(
      'not-blank',
      'Please enter your password.',
      (value) => !value || value.trim().length > 0,
    )
    .test(
      'password-bytes',
      'Password must not exceed 72 UTF-8 bytes.',
      (value) =>
        !value || new TextEncoder().encode(value).length <= 72,
    ),
})

export const registerSchema = yup.object({
  username: yup
    .string()
    .trim()
    .required('Choose a username.')
    .min(3, 'Username must contain at least 3 characters.')
    .max(32, 'Username must not exceed 32 characters.')
    .matches(
      /^[a-zA-Z0-9._-]+$/,
      'Use letters, numbers, dots, dashes or underscores.',
    ),

  firstName: yup
    .string()
    .trim()
    .required('First name is required.')
    .max(100, 'First name must not exceed 100 characters.'),

  lastName: yup
    .string()
    .trim()
    .required('Last name is required.')
    .max(100, 'Last name must not exceed 100 characters.'),

  email: yup
    .string()
    .trim()
    .required('Email is required.')
    .email('Enter a valid email address.')
    .max(254, 'Email must not exceed 254 characters.'),

  phone: yup
    .string()
    .trim()
    .required('Phone number is required.')
    .max(30, 'Phone number must not exceed 30 characters.')
    .matches(
      /^[0-9\s-]+$/,
      'Use numbers, spaces or dashes.',
    )
    .test(
      'phone-digits',
      'Phone number must contain exactly 10 digits.',
      (value) =>
        !value || value.replace(/\D/g, '').length === 10,
    ),

  province: yup
    .string()
    .trim()
    .required('Pick a province.')
    .max(100, 'Province must not exceed 100 characters.'),

  password: yup
    .string()
    .required('Password is required.')
    .min(6, 'Use at least 6 characters.')
    .test(
      'not-blank',
      'Password must not contain only spaces.',
      (value) => !value || value.trim().length > 0,
    )
    .test(
      'password-bytes',
      'Password must not exceed 72 UTF-8 bytes.',
      (value) =>
        !value || new TextEncoder().encode(value).length <= 72,
    ),

  confirmPassword: yup
    .string()
    .required('Please confirm your password.')
    .oneOf(
      [yup.ref('password')],
      'The passwords do not match.',
    ),

  bio: yup
    .string()
    .trim()
    .max(1000, 'About you must not exceed 1000 characters.')
    .default(''),
})

export type RegisterFormValues =
  yup.InferType<typeof registerSchema>