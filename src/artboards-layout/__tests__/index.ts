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
          layouts: [
            {
              columnWidth: 10,
              drawHorizontal: true,
              drawHorizontalLines: true,
              drawVertical: true,
              gutterHeight: 10,
              gutterWidth: 10,
              guttersOutside: true,
              horizontalOffset: 0,
              numberOfColumns: 10,
              rowHeightMultiplication: 5,
              totalWidth: 200,
            },
          ],
        },
      },
    }),
    ruleSet,
    ruleModule,
  )

test('No violations for artboards with valid layouts', async (): Promise<
  void
> => {
  expect.assertions(1)
  const violations = await testRule('./valid-layout-settings.sketch')
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(
    `Array []`,
  )
})

test('Finds violations for artboards with no layouts', async (): Promise<
  void
> => {
  expect.assertions(1)
  const violations = await testRule('./missing-layout-settings.sketch')
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(`
    Array [
      "Unexpected artboard layout settings",
    ]
  `)
})

test('Finds violations for artboards with invalid layouts', async (): Promise<
  void
> => {
  expect.assertions(1)
  const violations = await testRule('./invalid-layout-settings.sketch')
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(`
    Array [
      "Unexpected artboard layout settings",
    ]
  `)
})
