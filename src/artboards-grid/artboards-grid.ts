import {
  Rule,
  RuleModule,
  Node,
  ReportItem,
  RuleInvocationContext,
} from '@sketch-hq/sketch-lint-core'
import FileFormat from '@sketch-hq/sketch-file-format-ts'

type GridSpec = {
  gridBlockSize: number
  thickLinesEvery: number
}

const rule: Rule = async (context: RuleInvocationContext): Promise<void> => {
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
    if (
      typeof gridBlockSize === 'number' &&
      typeof thickLinesEvery === 'number'
    ) {
      specs.push({ gridBlockSize, thickLinesEvery })
    }
  }
  await utils.walk({
    artboard(node): void {
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
            grid.gridSize === spec.gridBlockSize &&
            grid.thickGridTimes === spec.thickLinesEvery,
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
      helpers.objectArrayOption({
        name: 'grids',
        title: 'Grids',
        description: 'List of valid grids',
        props: [
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
        ],
      }),
    ]
  },
}

export { ruleModule }
