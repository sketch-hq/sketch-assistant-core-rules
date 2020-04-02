import { Assistant, RuleDefinition } from '@sketch-hq/sketch-assistant-types'
import { I18n, setupI18n } from '@lingui/core'
import { t } from '@lingui/macro'

import * as artboardsGrid from './rules/artboards-grid'
import * as artboardsLayout from './rules/artboards-layout'
import * as artboardsMaxUngroupedLayers from './rules/artboards-max-ungrouped-layers'
import * as bordersNoDisabled from './rules/borders-no-disabled'
import * as debugAllOptions from './rules/debug-all-options'
import * as debugI18n from './rules/debug-i18n'
import * as debugThrowsError from './rules/debug-throws-error'
import * as exportedLayerNoBlendMode from './rules/exported-layers-no-blend-mode'
import * as fillsNoDisabled from './rules/fills-no-disabled'
import * as groupsMaxLayers from './rules/groups-max-layers'
import * as groupsNoEmpty from './rules/groups-no-empty'
import * as groupsNoRedundant from './rules/groups-no-redundant'
import * as imagesNoOutsized from './rules/images-no-outsized'
import * as innerShadowsNoDisabled from './rules/inner-shadows-no-disabled'
import * as layersNoHidden from './rules/layers-no-hidden'
import * as layersNoLoose from './rules/layers-no-loose'
import * as layersSubpixelPositioning from './rules/layers-subpixel-positioning'
import * as layerStylesNoDirty from './rules/layer-styles-no-dirty'
import * as layerStylesPreferShared from './rules/layer-styles-prefer-shared'
import * as namePatternArtboards from './rules/name-pattern-artboards'
import * as namePatternGroups from './rules/name-pattern-groups'
import * as namePatternImages from './rules/name-pattern-images'
import * as namePatternPages from './rules/name-pattern-pages'
import * as namePatternShapes from './rules/name-pattern-shapes'
import * as namePatternSymbols from './rules/name-pattern-symbols'
import * as namePatternText from './rules/name-pattern-text'
import * as resultMessagesInclude from './rules/result-messages-include'
import * as shadowsNoDisabled from './rules/shadows-no-disabled'
import * as sharedStylesNoUnused from './rules/shared-styles-no-unused'
import * as symbolsNoUnused from './rules/symbols-no-unused'
import * as textStylesNoDirty from './rules/text-styles-no-dirty'
import * as textStylesPreferShared from './rules/text-styles-prefer-shared'

import enMessages from './locale/en/messages'
import zhHansMessages from './locale/zh-Hans/messages'

export type CreateRuleFunction = (i18n: I18n) => RuleDefinition

const SUPPORTED_LOCALES = ['en', 'zh-Hans']
const FALLBACK_LOCALE = 'en'
const pkgName = '@sketch-hq/sketch-assistant-core-rules'

const assistant: Assistant = async (env) => {
  const i18n: I18n = setupI18n({
    language: SUPPORTED_LOCALES.includes(env.locale!) ? env.locale : FALLBACK_LOCALE,
    catalogs: {
      en: enMessages,
      'zh-Hans': zhHansMessages,
    },
  })

  return {
    name: pkgName,
    title: i18n._(t`Sketch Assistant Core Rules`),
    description: i18n._(t`Official Sketch Assistant containing the core rule set`),
    rules: [
      artboardsGrid,
      artboardsLayout,
      artboardsMaxUngroupedLayers,
      bordersNoDisabled,
      debugAllOptions,
      debugI18n,
      debugThrowsError,
      exportedLayerNoBlendMode,
      fillsNoDisabled,
      groupsMaxLayers,
      groupsNoEmpty,
      groupsNoRedundant,
      imagesNoOutsized,
      innerShadowsNoDisabled,
      layersNoHidden,
      layersNoLoose,
      layersSubpixelPositioning,
      layerStylesNoDirty,
      layerStylesPreferShared,
      namePatternArtboards,
      namePatternGroups,
      namePatternImages,
      namePatternPages,
      namePatternShapes,
      namePatternSymbols,
      namePatternText,
      resultMessagesInclude,
      shadowsNoDisabled,
      sharedStylesNoUnused,
      symbolsNoUnused,
      textStylesNoDirty,
      textStylesPreferShared,
    ].map((mod) => {
      const rule = mod.createRule(i18n)
      return { ...rule, name: `${pkgName}/${rule.name}` }
    }),
    config: { rules: {} },
  }
}

export default assistant
