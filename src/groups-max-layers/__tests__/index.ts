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
          maxLayers: 10,
        },
      },
    }),
    ruleSet,
    ruleModule,
  )

test('No violations for groups with valid layer counts', async (): Promise<
  void
> => {
  expect.assertions(1)
  const violations = await testRule('./valid-layer-count.sketch')
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(
    `Array []`,
  )
})

test('Finds violations for groups with too many layers', async (): Promise<
  void
> => {
  expect.assertions(1)
  const violations = await testRule('./invalid-layer-count.sketch')
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(`
    Array [
      "Expected 10 or less layers on group, found 11",
    ]
  `)
})

test('No violations for high layer counts in shape groups', async (): Promise<
  void
> => {
  expect.assertions(1)
  const violations = await testRule('./shape-group.sketch')
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(
    `Array []`,
  )
})
