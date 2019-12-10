import {
  Rule,
  RuleModule,
  Node,
  ReportItem,
  RuleInvocationContext,
} from '@sketch-hq/sketch-lint-core'
import FileFormat from '@sketch-hq/sketch-file-format-ts'

const name = 'symbols-no-unused'

const rule: Rule = async (context: RuleInvocationContext): Promise<void> => {
  const { utils } = context
  const masters: Node[] = []
  const instances: Node[] = []
  await utils.walk({
    symbolMaster(node): void {
      masters.push(node)
    },
    symbolInstance(node): void {
      instances.push(node)
    },
  })
  const invalid: Node[] = masters.filter(
    master =>
      instances.findIndex(
        instance =>
          utils.nodeToObject<FileFormat.SymbolInstance>(instance).symbolID ===
          utils.nodeToObject<FileFormat.SymbolMaster>(master).symbolID,
      ) === -1,
  )
  utils.report(
    invalid.map(
      (node): ReportItem => ({
        message: 'Unexpected unused symbol',
        node,
      }),
    ),
  )
}

const ruleModule: RuleModule = {
  rule,
  name,
  title: 'No unused symbols',
  description:
    'Enable this rule to disallow symbols that have no corresponding usage anywhere in the document',
}

export { ruleModule }
