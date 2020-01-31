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

test('Finds violations for identical layer styles', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await testRule('./duplicate-layer-styles.sketch', 1)
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(`
    Array [
      "Expected no identical layer styles in the document, but found 2 matching this layer's style. Consider a shared style instead",
      "Expected no identical layer styles in the document, but found 2 matching this layer's style. Consider a shared style instead",
    ]
  `)
})

test('No violations when maxIdentical option is increased to allow up to 2 identical styles', async (): Promise<
  void
> => {
  expect.assertions(1)
  const violations = await testRule('./duplicate-layer-styles.sketch', 2)
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

test('No violations for text layers', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await testRule('./text-layers.sketch', 1)
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(
    `Array []`,
  )
})

test('No violations for shared style usage', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await testRule('./duplicate-shared-styles.sketch', 1)
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(
    `Array []`,
  )
})

test('No violations for groups with default styles', async (): Promise<
  void
> => {
  expect.assertions(1)
  const violations = await testRule('./groups.sketch', 1)
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(
    `Array []`,
  )
})
