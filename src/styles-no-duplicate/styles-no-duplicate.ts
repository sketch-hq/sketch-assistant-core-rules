import {
  Rule,
  RuleModule,
  RuleInvocationContext,
} from '@sketch-hq/sketch-lint-core'
import FileFormat from '@sketch-hq/sketch-file-format-ts'
import { t } from '@lingui/macro'
import { _ } from '../i18n'

const rule: Rule = async (context: RuleInvocationContext): Promise<void> => {
  const { utils } = context
  const hashes: Set<string> = new Set()
  await utils.walk({
    $layers(node): void {
      const layer = utils.nodeToObject<FileFormat.AnyLayer>(node)
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
        utils.report({
          node,
          message: _(t`Unexpected duplicate style`),
        })
      }
      hashes.add(hash)
    },
  })
}

const ruleModule: RuleModule = {
  rule,
  name: 'styles-no-duplicate',
  title: _(t`No Duplicate Styles`),
  description: _(t`Disallow duplicate layer styles in favour of shared styles`),
}

export { ruleModule }
