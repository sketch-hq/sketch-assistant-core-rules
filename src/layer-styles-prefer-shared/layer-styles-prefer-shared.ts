import {
  Rule,
  RuleModule,
  RuleInvocationContext,
  Node,
} from '@sketch-hq/sketch-lint-core'
import FileFormat from '@sketch-hq/sketch-file-format-ts'
import { t, plural } from '@lingui/macro'
import { _ } from '../i18n'

function assertMaxIdentical(val: unknown): asserts val is number {
  if (typeof val !== 'number') {
    throw new Error()
  }
}

const rule: Rule = async (context: RuleInvocationContext): Promise<void> => {
  const { utils } = context
  // Gather option value and assert its type
  const maxIdentical = utils.getOption('maxIdentical')
  assertMaxIdentical(maxIdentical)
  const results: Map<string, Node[]> = new Map()
  await utils.iterateCache({
    $layers(node): void {
      const layer = utils.nodeToObject<FileFormat.AnyLayer>(node)
      if (layer._class === 'artboard' || layer._class === 'page') return // Ignore artboards and pages
      if (layer._class === 'text') return // Ignore text layers entirely
      if (!layer.style) return // Narrow type to truthy `style` prop
      if (!('style' in layer)) return // Narrow type to layers with a `style` prop
      if (layer._class === 'group' && !layer.style?.shadows?.length) return // Ignore groups with default styles (i.e. no shadows)
      if (typeof layer.sharedStyleID === 'string') return // Ignore layers using a shared style
      // Get an md5 hash of the style object. Only consider a subset of style
      // object properties when computing the hash (can revisit this to make the
      // check looser or stricter)
      const hash = utils.objectHash({
        borders: layer.style?.borders,
        borderOptions: layer.style?.borderOptions,
        blur: layer.style?.blur,
        fills: layer.style?.fills,
        shadows: layer.style?.shadows,
        innerShadows: layer.style?.innerShadows,
      })
      // Add the style object hash and current node to the result set
      if (results.has(hash)) {
        const nodes = results.get(hash)
        nodes?.push(node)
      } else {
        results.set(hash, [node])
      }
    },
  })
  // Loop the results, generating violations as needed
  for (const [, nodes] of results) {
    const numIdentical = nodes.length
    if (numIdentical > maxIdentical) {
      utils.report(
        nodes.map(node => ({
          node,
          message: _(
            plural({
              value: maxIdentical,
              one: `Expected no identical layer styles in the document, but found ${numIdentical} matching this layer's style. Consider a shared style instead`,
              other: `Expected a maximum of # identical layer styles in the document, but found ${numIdentical} instances of this layer's style. Consider a shared style instead`,
            }),
          ),
        })),
      )
    }
  }
}

const ruleModule: RuleModule = {
  rule,
  name: 'layer-styles-prefer-shared',
  title: _(t`Prefer Shared Styles`),
  description: _(t`Disallow identical layer styles in favour of shared styles`),
  getOptions: helpers => [
    helpers.integerOption({
      name: 'maxIdentical',
      title: _(t`Max Identical`),
      description: _(
        t`Maximum number of identical layer styles allowable in the document`,
      ),
      minimum: 1,
      defaultValue: 1,
    }),
  ],
}

export { ruleModule }
