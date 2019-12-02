import {
  Rule,
  RuleModule,
  RuleInvocationContext,
  Node,
  ReportItem,
} from '@sketch-hq/sketch-lint-core'

const name = 'images-no-outsized'

const rule: Rule = async (context: RuleInvocationContext): Promise<void> => {
  const { utils } = context
  const maxRatio = utils.getOption('maxRatio') || Infinity
  if (typeof maxRatio !== 'number') return
  const invalid: Node[] = []
  await utils.walk({
    async bitmap(node): Promise<void> {
      if ('image' in node && 'frame' in node && node.image && node.frame) {
        const { width, height } = await utils.getImageMetadata(node.image._ref)
        const { frame } = node
        const isWidthOversized = frame.width * maxRatio < width
        const isHeightOversized = frame.height * maxRatio < height
        if (isWidthOversized || isHeightOversized) {
          invalid.push(node)
        }
      }
    },
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
