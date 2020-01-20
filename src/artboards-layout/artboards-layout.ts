import {
  Rule,
  RuleModule,
  Node,
  ReportItem,
  RuleInvocationContext,
} from '@sketch-hq/sketch-lint-core'
import FileFormat from '@sketch-hq/sketch-file-format-ts'
import { t } from '@lingui/macro'
import { _ } from '../i18n'

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
        message: _(t`Unexpected artboard layout settings`),
        node,
      }),
    ),
  )
}

const ruleModule: RuleModule = {
  rule,
  name: 'artboards-layout',
  title: _(t`Artboard Layout`),
  description: _(t`Define a list of allowable artboard layout settings`),
  getOptions(helpers) {
    return [
      helpers.objectArrayOption({
        name: 'layouts',
        title: _(t`Layouts`),
        description: _(
          t`List of valid layouts. Each layout object reproduces the options found on the Layout Settings UI in Sketch`,
        ),
        props: [
          helpers.booleanOption({
            name: 'drawVertical',
            title: _(t`Draw Vertical`),
            description: _(t`Enables drawing columns`),
          }),
          helpers.numberOption({
            name: 'totalWidth',
            title: _(t`Total Width`),
            description: _(t`Total width of layout`),
          }),
          helpers.numberOption({
            name: 'horizontalOffset',
            title: _(t`Horizontal Offset`),
            description: _(t`Horizontal offset of layout`),
          }),
          helpers.numberOption({
            name: 'numberOfColumns',
            title: _(t`Number of Columns`),
            description: _(t`Number of columns in the layout`),
          }),
          helpers.booleanOption({
            name: 'guttersOutside',
            title: _(t`Gutters Outside`),
            description: _(t`Draw gutters on the outside`),
          }),
          helpers.numberOption({
            name: 'gutterWidth',
            title: _(t`Gutter Width`),
            description: _(t`Gutter width in layout`),
          }),
          helpers.numberOption({
            name: 'columnWidth',
            title: _(t`Column Width`),
            description: _(t`Layout column widths`),
          }),
          helpers.booleanOption({
            name: 'drawHorizontal',
            title: _(t`Draw Horizontal`),
            description: _(t`Enables drawing rows`),
          }),
          helpers.numberOption({
            name: 'gutterHeight',
            title: _(t`Gutter Height`),
            description: _(t`Layout gutter height`),
          }),
          helpers.numberOption({
            name: 'rowHeightMultiplication',
            title: _(t`Row Height Multiplication`),
            description: 'Row height multiplication',
          }),
          helpers.booleanOption({
            name: 'drawHorizontalLines',
            title: _(t`Draw Horizontal Lines`),
            description: _(t`Draw all horizontal lines`),
          }),
        ],
      }),
    ]
  },
}

export { ruleModule }
