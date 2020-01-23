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
          grids: [{ gridBlockSize: 5, thickLinesEvery: 10 }],
        },
      },
    }),
    ruleSet,
    ruleModule,
  )

test('No violations for artboards with valid grids', async (): Promise<
  void
> => {
  expect.assertions(1)
  const violations = await testRule('./valid-grid-settings.sketch')
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(
    `Array []`,
  )
})

test('Finds violations for artboards with no grids', async (): Promise<
  void
> => {
  expect.assertions(1)
  const violations = await testRule('./missing-grid-settings.sketch')
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(`
    Array [
      "Unexpected artboard grid settings",
    ]
  `)
})

test('Finds violations for artboards with invalid grids', async (): Promise<
  void
> => {
  expect.assertions(1)
  const violations = await testRule('./invalid-grid-settings.sketch')
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(`
    Array [
      "Unexpected artboard grid settings",
    ]
  `)
})
