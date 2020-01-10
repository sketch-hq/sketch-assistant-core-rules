import {
  Rule,
  Node,
  RuleModule,
  ReportItem,
  RuleInvocationContext,
} from '@sketch-hq/sketch-lint-core'

const name = 'groups-max-layers'

const rule: Rule = async (context: RuleInvocationContext): Promise<void> => {
  const { utils } = context
  const maxLayers = utils.getOption('maxLayers')
  const invalid: Node[] = []
  if (typeof maxLayers !== 'number') return
  await utils.walk({
    $groups(node): void {
      const group = utils.nodeToObject(node)
      if (!('layers' in group)) return // Narrow type to layer's with layer props, i.e. groups
      if (group._class === 'shapeGroup') return // Skip counting layers in shapeGroups
      if (group.layers.length > maxLayers) {
        invalid.push(node)
      }
    },
  })
  utils.report(
    invalid.map(
      (node): ReportItem => ({
        message: `Expected ${maxLayers} or less layers, found ${'layers' in
          node &&
          node.layers &&
          node.layers.length}`,
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
        name: 'maxLayers',
        title: 'Maximum layers',
        defaultValue: 50,
        description: 'Maximum layers in a group',
        minimum: 1,
      }),
    ]
  },
  title: 'Maximum layers in a group',
  description:
    'Enable this rule to restrict layers to a maximum number of groups',
}

export { ruleModule }
