import { resolve } from 'path'
import { invokeRule, createDummyConfig } from '@sketch-hq/sketch-lint-core'

import { ruleModule } from '.'
import { ruleSet } from '..'

const { name } = ruleModule

test('Generates violations correctly', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await invokeRule(
    resolve(__dirname, '../../fixtures/artboard-grid.sketch'),
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
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(`
    Array [
      "Unexpected artboard grid settings",
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
          grids: [{ gridBlockSize: 5, thickLinesEvery: 10 }],
        },
      },
    }),
    ruleSet,
    ruleModule,
  )
  expect(violations).toHaveLength(0)
})
