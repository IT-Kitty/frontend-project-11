import * as yup from 'yup'

const createSchema = existingUrls => yup
  .string()
  .trim()
  .required()
  .url()
  .test(
    'not-duplicate',
    'errors.duplicate',
    value => Promise.resolve(!existingUrls.includes(value)),
  )

const validateUrl = (url, existingUrls) => createSchema(existingUrls).validate(url)

export default validateUrl
