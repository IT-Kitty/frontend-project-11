import i18next from 'i18next'
import { setLocale } from 'yup'
import ru from './locales/ru.js'

const initI18n = () => i18next.init({
  lng: 'ru',
  fallbackLng: 'ru',
  resources: {
    ru,
  },
}).then(() => {
  setLocale({
    mixed: {
      required: 'errors.required',
    },
    string: {
      url: 'errors.invalidUrl',
    },
  })

  return i18next
})

export default initI18n
