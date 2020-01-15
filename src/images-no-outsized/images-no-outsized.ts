import {
  Rule,
  RuleModule,
  RuleInvocationContext,
  Node,
  ReportItem,
} from '@sketch-hq/sketch-lint-core'
import FileFormat from '@sketch-hq/sketch-file-format-ts'

const name = 'images-no-outsized'

const rule: Rule = async (context: RuleInvocationContext): Promise<void> => {
  const { utils } = context
  const maxRatio = utils.getOption('maxRatio')
  if (typeof maxRatio !== 'number') return
  const nodes: Node[] = [] // All bitmap nodes encountered in doc
  const usages = new Set<[string, boolean]>() // Record image ref usages alongside a bool representing their size validity
  await utils.walk({
    async bitmap(node): Promise<void> {
      nodes.push(node)
      const bitmap = utils.nodeToObject<FileFormat.Bitmap>(node)
      const { frame, image } = bitmap
      if (image._class === 'MSJSONOriginalDataReference') return // Only interested in images that are file references
      const { width, height } = await utils.getImageMetadata(bitmap.image._ref)
      const isWidthOversized = frame.width * maxRatio < width
      const isHeightOversized = frame.height * maxRatio < height
      const valid = !isWidthOversized && !isHeightOversized
      usages.add([image._ref, valid])
    },
  })
  // Only consider a bitmap layer invalid if all usages of its image ref are invalid
  const invalid = nodes.filter(node => {
    const bitmap = utils.nodeToObject<FileFormat.Bitmap>(node)
    const results: boolean[] = []
    for (let value of usages.values()) {
      if (value[0] === bitmap.image._ref) {
        results.push(value[1])
      }
    }
    return !results.includes(true)
  })
  utils.report(
    invalid.map(
      (node): ReportItem => ({
        message: `Unexpected x${maxRatio} oversized image`,
        node,
      }),
    ),
  )
}

const ruleModule: RuleModule = {
  rule,
  name,
  getOptions(helpers) {
    return [
      helpers.numberOption({
        name: 'maxRatio',
        title: 'Maxium ratio',
        defaultValue: 1,
        description: 'How much larger an image can be than its frame',
        minimum: 1,
      }),
    ]
  },
  title: 'No outsized images',
  description:
    'Enable this rule to disallow images that are larger than their frame',
}

export { ruleModule }
