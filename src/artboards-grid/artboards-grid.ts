import {
  Rule,
  RuleModule,
  Node,
  ReportItem,
  RuleInvocationContext,
} from '@sketch-hq/sketch-lint-core'
import FileFormat from '@sketch-hq/sketch-file-format-ts'

const rule: Rule = async (context: RuleInvocationContext): Promise<void> => {
  const { utils } = context
  const invalid: Node[] = []
  const gridBlockSize = utils.getOption('gridBlockSize')
  const thickLinesEvery = utils.getOption('thickLinesEvery')
  if (typeof gridBlockSize !== 'number' || typeof thickLinesEvery !== 'number')
    return
  await utils.walk({
    artboard(node): void {
      const artboard = utils.nodeToObject<FileFormat.Artboard>(node)
      if (!artboard.grid) {
        invalid.push(node) // Treat artboards without grid settings as invalid
        return
      }
      if (
        artboard.grid.gridSize !== gridBlockSize ||
        artboard.grid.thickGridTimes !== thickLinesEvery
      ) {
        invalid.push(node)
      }
    },
  })
  utils.report(
    invalid.map(
      (node): ReportItem => ({
        message: 'Unexpected artboard grid settings',
        node,
      }),
    ),
  )
}

const ruleModule: RuleModule = {
  rule,
  name: 'artboards-grid',
  title: 'Artboards grid',
  description: 'Enable this rule to enforce artboard grid settings',
  getOptions(helpers) {
    return [
      helpers.integerOption({
        name: 'gridBlockSize',
        title: 'Grid block size',
        description: 'Grid block size in pixels',
      }),
      helpers.integerOption({
        name: 'thickLinesEvery',
        title: 'Thick lines every',
        description: 'Number of blocks between thick grid lines',
      }),
    ]
  },
}

export { ruleModule }
