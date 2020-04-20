import { t } from '@lingui/macro'
import { RuleContext, RuleFunction, FileFormat } from '@sketch-hq/sketch-assistant-types'

import { CreateRuleFunction } from '../..'

const isBlended = (
  styles: (FileFormat.Fill | FileFormat.Border | FileFormat.Shadow | FileFormat.InnerShadow)[] = [],
): boolean => {
  return !!styles.find((item) => item.contextSettings.blendMode !== FileFormat.BlendMode.Normal)
}

export const createRule: CreateRuleFunction = (i18n) => {
  const rule: RuleFunction = async (context: RuleContext): Promise<void> => {
    const { utils } = context
    await utils.iterateCache({
      async $layers(node): Promise<void> {
        const layer = utils.nodeToObject<FileFormat.AnyLayer>(node)
        if (layer._class === 'artboard' || layer._class === 'page') return
        if (layer.exportOptions.exportFormats.length === 0) return
        if (layer.style?.contextSettings?.blendMode !== FileFormat.BlendMode.Normal) {
          utils.report({
            node,
            message: i18n._(
              t`Unexpected blend mode found on exported layer, consider flattening the blend mode for consistent export results.`,
            ),
          })
          return
        }
        if (
          isBlended(layer.style?.fills) ||
          isBlended(layer.style?.borders) ||
          isBlended(layer.style?.shadows) ||
          isBlended(layer.style?.innerShadows)
        ) {
          utils.report({
            node,
            message: i18n._(
              t`Unexpected style with blend mode found on exported layer, consider flattening the blend modes for consistent export results.`,
            ),
          })
        }
      },
    })
  }

  return {
    rule,
    name: 'exported-layers-normal-blend-mode',
    title: i18n._(t`No Blend Modes on Exported Layers`),
    description: i18n._(
      t`Flags blend modes applied to exported layers, since the effects are not reliably reproducable in exported assets`,
    ),
  }
}