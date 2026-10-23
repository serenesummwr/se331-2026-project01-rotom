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