import {
  FileFormat,
  RuleFunction,
  RuleContext,
  Node,
  ReportItem,
} from '@sketch-hq/sketch-assistant-utils'
import { t } from '@lingui/macro'

import { CreateRuleFunction } from '../..'

type GridSpec = {
  gridBlockSize: number
  thickLinesEvery: number
}

export const createRule: CreateRuleFunction = i18n => {
  const rule: RuleFunction = async (context: RuleContext): Promise<void> => {
    const { utils } = context
    const invalid: Node[] = []
    // Type safe code to extract relevant options from config
    const grids = utils.getOption('grids')
    if (!Array.isArray(grids) || grids.length === 0) return
    const specs: GridSpec[] = []
    for (let i = 0; i < grids.length; i++) {
      const grid = grids[i]
      if (typeof grid !== 'object') continue
      const { gridBlockSize, thickLinesEvery } = grid
      if (typeof gridBlockSize === 'number' && typeof thickLinesEvery === 'number') {
        specs.push({ gridBlockSize, thickLinesEvery })
      }
    }
    await utils.iterateCache({
      async artboard(node): Promise<void> {
        const { grid } = utils.nodeToObject<FileFormat.Artboard>(node)
        if (!grid) {
          invalid.push(node) // Treat artboards without grid settings as invalid
          return
        }
        // The artboard's grid much precisely match one of the grids defined in the
        // options in order to pass linting
        const gridValid = specs
          .map(
            spec =>
              grid.gridSize === spec.gridBlockSize && grid.thickGridTimes === spec.thickLinesEvery,
          )
          .includes(true)
        if (!gridValid) {
          invalid.push(node)
        }
      },
    })
    utils.report(
      invalid.map(
        (node): ReportItem => ({
          message: i18n._(t`Unexpected artboard grid settings`),
          node,
        }),
      ),
    )
  }

  return {
    rule,
    name: 'artboards-grid',
    title: i18n._(t`Artboard Grids`),
    description: i18n._(
      t`Define a list of allowable artboard grid settings. Each grid object reproduces the options found on the Grid Settings UI in Sketch`,
    ),
    getOptions(helpers) {
      return [
        helpers.objectArrayOption({
          name: 'grids',
          title: i18n._(t`Grids`),
          description: i18n._(t`List of valid grids`),
          props: [
            helpers.integerOption({
              name: 'gridBlockSize',
              title: i18n._(t`Grid Block Size`),
              description: i18n._(t`Grid block size in pixels`),
            }),
            helpers.integerOption({
              name: 'thickLinesEvery',
              title: i18n._(t`Thick Lines Every`),
              description: i18n._(t`Number of blocks between thick grid lines`),
            }),
          ],
        }),
      ]
    },
  }
}
