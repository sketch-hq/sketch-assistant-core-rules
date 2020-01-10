import {
  Rule,
  RuleModule,
  Node,
  ReportItem,
  RuleInvocationContext,
} from '@sketch-hq/sketch-lint-core'

const INCREMENTS: { [key: string]: string[] } = {
  '@1x': ['0.00'],
  '@2x': ['0.00', '0.50'],
  '@3x': ['0.00', '0.33', '0.67'],
}

const rule: Rule = async (context: RuleInvocationContext): Promise<void> => {
  const { utils } = context
  const invalid: Node[] = []
  // Type safe code to extract option from config
  const scaleFactors = utils.getOption('scaleFactors')
  if (!Array.isArray(scaleFactors) || scaleFactors.length === 0) return
  let validIncrements: string[] = []
  for (let i = 0; i < scaleFactors.length; i++) {
    const scaleFactor = scaleFactors[i]
    if (typeof scaleFactor === 'string') {
      const increments = INCREMENTS[scaleFactor]
      if (Array.isArray(increments)) {
        validIncrements = [...validIncrements, ...increments]
      }
    }
  }
  await utils.walk({
    $layers(node): void {
      const layer = utils.nodeToObject(node)
      if (!('frame' in layer)) return // Narrow type to layers with a `frame` prop
      const { x, y } = layer.frame
      const xValid = validIncrements.includes(Math.abs(x % 1).toFixed(2))
      const yValid = validIncrements.includes(Math.abs(y % 1).toFixed(2))
      if (!xValid || !yValid) {
        invalid.push(node)
      }
    },
  })
  utils.report(
    invalid.map(
      (node): ReportItem => ({
        message: 'Unexpected subpixel positioning',
        node,
      }),
    ),
  )
}

const ruleModule: RuleModule = {
  rule,
  name: 'layers-subpixel-positioning',
  title: 'Subpixel positioning',
  description:
    'Enable this rule to enforce layer positioning with respect to subpixels',
  getOptions(helpers) {
    return [
      helpers.stringArrayOption({
        name: 'scaleFactors',
        title: 'Scale factors',
        description:
          'Array of supported scale factors in the document. Accepts elements with values "@1x", "@2x" and "@3x" only, which map to allowing whole pixel positions, 0.5 increments and 0.33 increments respectively',
        minLength: 1,
        maxLength: 3,
        pattern: '^@[1-3]x$',
      }),
    ]
  },
}

export { ruleModule }
