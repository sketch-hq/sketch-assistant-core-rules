import { resolve } from 'path'
import {
  invokeRule,
  createDummyConfig,
  LintViolation,
} from '@sketch-hq/sketch-lint-core'

import { ruleModule } from '..'
import { ruleSet } from '../..'

const { name } = ruleModule

const testRule = async (fixture: string): Promise<LintViolation[]> =>
  await invokeRule(
    resolve(__dirname, fixture),
    createDummyConfig({
      rules: {
        [name]: {
          active: true,
          maxRatio: 2,
        },
      },
    }),
    ruleSet,
    ruleModule,
  )

test('No violations when a bitmap is used correctly at least once', async (): Promise<
  void
> => {
  expect.assertions(1)
  const violations = await testRule('./multi-use-bitmap.sketch')
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(
    `Array []`,
  )
})

test('Finds violations for outsized bitmap use', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await testRule('./outsized-bitmap.sketch')
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(`
    Array [
      "Unexpected oversized image used in image layer, must be no more than 2 times larger than the layer frame's width or height",
    ]
  `)
})

test('Finds violations for outsized bitmap fills in layer styles', async (): Promise<
  void
> => {
  expect.assertions(1)
  const violations = await testRule('./outsized-bitmap-fill.sketch')
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(`
    Array [
      "Unexpected oversized image used in layer style image fill, must be no more than 2 times larger than the layer frame's width or height",
    ]
  `)
})
