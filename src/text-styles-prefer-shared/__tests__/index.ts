import { resolve } from 'path'
import {
  invokeRule,
  createDummyConfig,
  LintViolation,
} from '@sketch-hq/sketch-lint-core'

import { ruleModule } from '..'
import { ruleSet } from '../..'

const { name } = ruleModule

const testRule = async (
  fixture: string,
  maxIdentical: number,
): Promise<LintViolation[]> =>
  await invokeRule(
    resolve(__dirname, fixture),
    createDummyConfig({
      rules: {
        [name]: {
          active: true,
          maxIdentical,
        },
      },
    }),
    ruleSet,
    ruleModule,
  )

test('Finds violations for identical text styles', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await testRule('./duplicate-text-styles.sketch', 1)
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(`
    Array [
      "Expected no identical text styles in the document, but found 2 matching this layer's text style. Consider a shared text style instead",
      "Expected no identical text styles in the document, but found 2 matching this layer's text style. Consider a shared text style instead",
    ]
  `)
})

test('No violations when maxIdentical option is increased to allow up to 2 identical text styles', async (): Promise<
  void
> => {
  expect.assertions(1)
  const violations = await testRule('./duplicate-text-styles.sketch', 2)
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(
    `Array []`,
  )
})

test('No violations for artboards and pages', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await testRule('./artboards-and-pages.sketch', 1)
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(
    `Array []`,
  )
})

test('No violations for layer styles', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await testRule('./layer-styles.sketch', 1)
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(
    `Array []`,
  )
})

test('No violations for shared style usage', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await testRule('./duplicate-shared-text-styles.sketch', 1)
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(
    `Array []`,
  )
})
