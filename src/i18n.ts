import { I18n, setupI18n } from '@lingui/core'
// @ts-ignore
import enMessages from '../locale/en/messages'
// @ts-ignore
import zhHansMessages from '../locale/zh-Hans/messages'

const supportedLangs = ['en', 'zh-Hans']
const defaultLang = 'en'
const activeLang =
  process && process.env && process.env.LANG
    ? process.env.LANG
    : typeof LANG === 'string'
    ? LANG
    : defaultLang

const i18n: I18n = setupI18n({
  language: supportedLangs.includes(activeLang) ? activeLang : defaultLang,
  catalogs: {
    en: enMessages,
    'zh-Hans': zhHansMessages,
  },
})

const _ = i18n._.bind(i18n)

export { i18n, _ }
