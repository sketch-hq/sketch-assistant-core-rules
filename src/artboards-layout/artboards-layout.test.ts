import { resolve } from 'path'
import { invokeRule, createDummyConfig } from '@sketch-hq/sketch-lint-core'

import { ruleModule } from '.'
import { ruleSet } from '..'

const { name } = ruleModule

test('Generates violations correctly', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await invokeRule(
    resolve(__dirname, '../../fixtures/artboards-layout.sketch'),
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
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(`
    Array [
      "Unexpected artboard layout settings",
    ]
  `)
})

test('Does not generate false negatives', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await invokeRule(
    resolve(__dirname, '../../fixtures/empty.sketch'),
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
  expect(violations).toHaveLength(0)
})
