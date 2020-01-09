import {
  Rule,
  RuleModule,
  Node,
  ReportItem,
  RuleInvocationContext,
} from '@sketch-hq/sketch-lint-core'

const name = 'styles-no-duplicate'

const rule: Rule = async (context: RuleInvocationContext): Promise<void> => {
  const { utils } = context
  const hashes: Set<string> = new Set()
  const invalid: Node[] = []
  await utils.walk({
    $layers(node): void {
      const layer = utils.nodeToObject(node)
      // Despite having style props in the file format, artboard and page styles
      // are not user editable via the inspector so ignore them
      if (layer._class === 'artboard' || layer._class === 'page') return
      if (!('style' in layer)) return // Narrow type to layers with a `style` prop
      if (!layer.style) return // Narrow type to truthy `style` prop
      if (typeof layer.sharedStyleID === 'string') return // Ignore layers using a shared style
      // Get an md5 hash of the style object. Only consider a subset of style
      // object properties when computing the hash, can revisit this to make the
      // check looser or stricter
      const hash = utils.objectHash({
        borders: layer.style.borders,
        borderOptions: layer.style.borderOptions,
        blur: layer.style.blur,
        fills: layer.style.fills,
        shadows: layer.style.shadows,
        innerShadows: layer.style.innerShadows,
      })
      // If hash already seen in a previous style object then consider it invalid
      if (hashes.has(hash)) {
        invalid.push(node)
      }
      hashes.add(hash)
    },
  })
  utils.report(
    invalid.map(
      (node): ReportItem => ({
        message: 'Unexpected duplicate style',
        node,
      }),
    ),
  )
}

const ruleModule: RuleModule = {
  rule,
  name,
  title: 'No duplicate styles',
  description: 'Enable this rule to disallow duplicate styles',
}

export { ruleModule }
