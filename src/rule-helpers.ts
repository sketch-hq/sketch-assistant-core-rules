import {
  RuleFunction,
  RuleContext,
  Maybe,
  RuleOption,
  SketchClass,
  Node,
  NodeCacheVisitor,
} from '@sketch-hq/sketch-assistant-types'
import { I18n } from '@lingui/core'
import { t } from '@lingui/macro'

/**
 * Abstracts the creation of a name-pattern-* rule function. All these rules have identical logic,
 * and only differ based on the Sketch layer classes they're interested in.
 *
 * @param i18n I18n instance passed in during normal rule creation
 * @param classes Array of file format `_class` values indicating the types of layers to scan
 */
const createNamePatternRuleFunction = (i18n: I18n, classes: SketchClass[]): RuleFunction => {
  function assertOption(value: Maybe<RuleOption>): asserts value is string[] {
    if (!Array.isArray(value)) {
      throw new Error('Option value is not an array')
    }
    for (let i = 0; i < value.length; i++) {
      if (typeof value[i] !== 'string') {
        throw new Error('Option array element is not a string')
      }
    }
  }

  // This function returns a RuleFunction:
  return async (context: RuleContext) => {
    const { utils } = context

    // Gather options
    const allowed = utils.getOption('allowed')
    const forbidden = utils.getOption('forbidden')
    assertOption(allowed)
    assertOption(forbidden)
    const allowedPatterns = allowed.map((pattern) => new RegExp(pattern))
    const forbiddenPatterns = forbidden.map((pattern) => new RegExp(pattern))

    // Define a generic vistor function
    const visitor: NodeCacheVisitor = async (node: Node): Promise<void> => {
      if (!('name' in node)) return // Not interested in Sketch objects without a `name`

      // Name is allowed if zero patterns supplied, or name matches _at least one_ of the allowed patterns
      const isAllowed =
        allowedPatterns.length === 0 ||
        allowedPatterns.map((regex) => regex.test(node.name)).includes(true)

      // Name is forbidden if it matches _any_ of the forbidden patterns
      const isForbidden = forbiddenPatterns.map((regex) => regex.test(node.name)).includes(true)

      if (isForbidden) {
        utils.report({
          node,
          message: i18n._(t`Layer name matches one of the forbidden patterns`),
        })
        return // Return after reporting a name as forbidden, i.e. once a name is forbidden we don't care about the allowed status
      }

      if (!isAllowed) {
        utils.report({
          node,
          message: i18n._(t`Layer name does not match any of the allowed patterns`),
        })
      }
    }

    await utils.iterateCache(classes.reduce((acc, _class) => ({ ...acc, [_class]: visitor }), {}))
  }
}

export { createNamePatternRuleFunction }
