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
  scaleFactors: string[],
): Promise<LintViolation[]> =>
  await invokeRule(
    resolve(__dirname, fixture),
    createDummyConfig({
      rules: {
        [name]: {
          active: true,
          scaleFactors,
        },
      },
    }),
    ruleSet,
    ruleModule,
  )

test('No violations for whitelisted whole pixels', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await testRule('./whole-pixels.sketch', ['@1x'])
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(
    `Array []`,
  )
})

test('No violations for whitelisted half pixels', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await testRule('./half-pixels.sketch', ['@2x'])
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(
    `Array []`,
  )
})

test('No violations for whitelisted third pixels', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await testRule('./third-pixels.sketch', ['@3x'])
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(
    `Array []`,
  )
})

test('Finds violations for illegal @2x positioning', async (): Promise<
  void
> => {
  expect.assertions(1)
  const violations = await testRule('./half-pixels.sketch', ['@1x'])
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(`
    Array [
      "Unexpected subpixel positioning (0.5,145)",
    ]
  `)
})

test('Finds violations for illegal @3x positioning', async (): Promise<
  void
> => {
  expect.assertions(1)
  const violations = await testRule('./third-pixels.sketch', ['@1x', '@2x'])
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(`
    Array [
      "Unexpected subpixel positioning (0.33,125)",
      "Unexpected subpixel positioning (0.67,250)",
    ]
  `)
})
