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
        },
      },
    }),
    ruleSet,
    ruleModule,
  )

test('No violations for duplicate shared style usage', async (): Promise<
  void
> => {
  expect.assertions(1)
  const violations = await testRule('./duplicate-shared-styles.sketch')
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(
    `Array []`,
  )
})

test('No violations for multiple artboards', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await testRule('./multiple-artboards.sketch')
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(
    `Array []`,
  )
})

test('No violations for multiple pages', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await testRule('./multiple-pages.sketch')
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(
    `Array []`,
  )
})

test('Finds violations for 2 or more identical layer styles', async (): Promise<
  void
> => {
  expect.assertions(1)
  const violations = await testRule('./duplicate-layer-styles.sketch')
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(`
    Array [
      "Unexpected duplicate style",
    ]
  `)
})
