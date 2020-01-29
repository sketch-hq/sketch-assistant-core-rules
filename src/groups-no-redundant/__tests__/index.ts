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

test('No violations for non-redundant groups', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await testRule('./non-redundant-group.sketch')
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(
    `Array []`,
  )
})

test('No violations for styled redundant groups', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await testRule('./styled-redundant-group.sketch')
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(
    `Array []`,
  )
})

test('No violations for shared styled redundant groups', async (): Promise<
  void
> => {
  expect.assertions(1)
  const violations = await testRule('./shared-style-redundant-group.sketch')
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(
    `Array []`,
  )
})

test('Finds violations for empty groups', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await testRule('./redundant-group.sketch')
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(`
    Array [
      "Unexpected redundant group",
    ]
  `)
})
