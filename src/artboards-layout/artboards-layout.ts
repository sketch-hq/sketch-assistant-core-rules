import {
  Rule,
  RuleModule,
  Node,
  ReportItem,
  RuleInvocationContext,
} from '@sketch-hq/sketch-lint-core'
import FileFormat from '@sketch-hq/sketch-file-format-ts'

type LayoutSpec = {
  drawVertical: boolean
  drawHorizontal: boolean
  columns?: {
    gutterWidth: number
    columnWidth: number
    guttersOutside: boolean
    horizontalOffset: number
    numberOfColumns: number
    totalWidth: number
  }
  rows?: {
    gutterHeight: number
    drawHorizontalLines: boolean
    rowHeightMultiplication: number
  }
}

const rule: Rule = async (context: RuleInvocationContext): Promise<void> => {
  const { utils } = context
  const invalid: Node[] = []
  // Type safe code to extract relevant options from config
  const layouts = utils.getOption('layouts')
  if (!Array.isArray(layouts) || layouts.length === 0) return
  const specs: LayoutSpec[] = []
  for (let i = 0; i < layouts.length; i++) {
    const layout = layouts[i]
    if (typeof layout !== 'object') continue
    const spec: LayoutSpec = {
      drawVertical: !!layout.drawVertical,
      drawHorizontal: !!layout.drawHorizontal,
    }
    const {
      gutterWidth,
      columnWidth,
      guttersOutside,
      horizontalOffset,
      numberOfColumns,
      totalWidth,
    } = layout
    if (
      spec.drawVertical &&
      typeof gutterWidth === 'number' &&
      typeof columnWidth === 'number' &&
      typeof guttersOutside === 'boolean' &&
      typeof horizontalOffset === 'number' &&
      typeof numberOfColumns === 'number' &&
      typeof totalWidth === 'number'
    ) {
      spec.columns = {
        gutterWidth,
        columnWidth,
        guttersOutside,
        horizontalOffset,
        numberOfColumns,
        totalWidth,
      }
    }
    const {
      gutterHeight,
      rowHeightMultiplication,
      drawHorizontalLines,
    } = layout
    if (
      spec.drawHorizontal &&
      typeof gutterHeight === 'number' &&
      typeof rowHeightMultiplication === 'number' &&
      typeof drawHorizontalLines === 'boolean'
    ) {
      spec.rows = {
        gutterHeight,
        rowHeightMultiplication,
        drawHorizontalLines,
      }
    }
    specs.push(spec)
  }
  await utils.walk({
    artboard(node): void {
      const { layout } = utils.nodeToObject<FileFormat.Artboard>(node)
      if (!layout || !layout.isEnabled) {
        invalid.push(node) // Treat artboards without grid settings as invalid
        return
      }
      // The artboard's layout much match one of the layouts defined in the
      // options in order to pass linting
      const columnsValid = specs
        .map(spec => {
          if (spec.drawVertical === false) {
            // Treat artboard columns as valid and return early if
            // drawVertical set to false, i.e. columns checkbox in layout
            // UI unchecked.
            return true
          }
          return (
            typeof spec.columns === 'object' &&
            spec.columns.gutterWidth === layout.gutterWidth &&
            spec.columns.columnWidth === layout.columnWidth &&
            spec.columns.guttersOutside === layout.guttersOutside &&
            spec.columns.horizontalOffset === layout.horizontalOffset &&
            spec.columns.numberOfColumns === layout.numberOfColumns &&
            spec.columns.totalWidth === layout.totalWidth
          )
        })
        .includes(true)
      const rowsValid = specs
        .map(spec => {
          if (spec.drawHorizontal === false) {
            // Treat artboard rows as valid and return early if
            // drawHorizontal set to false, i.e. rows checkbox in layout
            // UI unchecked.
            return true
          }
          return (
            typeof spec.rows === 'object' &&
            spec.rows.gutterHeight === layout.gutterHeight &&
            spec.rows.rowHeightMultiplication ===
              layout.rowHeightMultiplication &&
            spec.rows.drawHorizontalLines === layout.drawHorizontalLines
          )
        })
        .includes(true)
      if (!rowsValid || !columnsValid) {
        invalid.push(node)
      }
    },
  })
  utils.report(
    invalid.map(
      (node): ReportItem => ({
        message: 'Unexpected artboard layout settings',
        node,
      }),
    ),
  )
}

const ruleModule: RuleModule = {
  rule,
  name: 'artboards-layout',
  title: 'Artboards layout',
  description: 'Enable this rule to enforce artboard layout settings',
  getOptions(helpers) {
    return [
      helpers.objectArrayOption({
        name: 'layouts',
        title: 'Layouts',
        description: 'List of valid layouts',
        props: [
          helpers.booleanOption({
            name: 'drawVertical',
            title: 'Draw vertical',
            description: 'Enables drawing columns',
          }),
          helpers.numberOption({
            name: 'totalWidth',
            title: 'Total width',
            description: 'Total width of layout',
          }),
          helpers.numberOption({
            name: 'horizontalOffset',
            title: 'Horizontal offset',
            description: 'Horizontal offset of layout',
          }),
          helpers.numberOption({
            name: 'numberOfColumns',
            title: 'Number of columns',
            description: 'Number of columns in the layout',
          }),
          helpers.booleanOption({
            name: 'guttersOutside',
            title: 'Gutters outside',
            description: 'Draw gutters on the outside',
          }),
          helpers.numberOption({
            name: 'gutterWidth',
            title: 'Gutter width',
            description: 'Gutter width in layout',
          }),
          helpers.numberOption({
            name: 'columnWidth',
            title: 'Column width',
            description: 'Layout column widths',
          }),
          helpers.booleanOption({
            name: 'drawHorizontal',
            title: 'Draw horizontal',
            description: 'Enables drawing rows',
          }),
          helpers.numberOption({
            name: 'gutterHeight',
            title: 'Gutter height',
            description: 'Draw vertical columns',
          }),
          helpers.numberOption({
            name: 'rowHeightMultiplication',
            title: 'Row height multiplication',
            description: 'Row height multiplication',
          }),
          helpers.booleanOption({
            name: 'drawHorizontalLines',
            title: 'Draw horizontal lines',
            description: 'Draw all horizontal lines',
          }),
        ],
      }),
    ]
  },
}

export { ruleModule }
