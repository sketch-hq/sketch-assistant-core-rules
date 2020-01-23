import { t, plural } from '@lingui/macro'
import { i18n, _ } from './i18n'

test('i18n', () => {
  // Basic
  expect(_(t`Hello world`)).toMatchInlineSnapshot(`"Hello world"`)
  // Interpolation
  const count = 5
  expect(_(t`The current count is ${count}`)).toMatchInlineSnapshot(
    `"The current count is 5"`,
  )
  // Plural
  expect(
    _(plural({ value: 1, one: '# thing', other: '# things' })),
  ).toMatchInlineSnapshot(`"1 thing"`)
  expect(
    _(plural({ value: 2, one: '# thing', other: '# things' })),
  ).toMatchInlineSnapshot(`"2 things"`)
  // Chinese
  const zh = i18n.use('zh-Hans')
  expect(zh._(t`Hello world`)).toMatchInlineSnapshot(`"世界你好"`)
})
