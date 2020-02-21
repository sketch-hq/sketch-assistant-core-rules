import { RuleSet } from '@sketch-hq/sketch-lint-core'
import { t } from '@lingui/macro'

import { i18n } from './i18n'
import { ruleModule as debugAllOptions } from './debug-all-options'
import { ruleModule as debugThrowsError } from './debug-throws-error'
import { ruleModule as groupsMaxLayers } from './groups-max-layers'
import { ruleModule as imagesNoOutsized } from './images-no-outsized'
import { ruleModule as layersNoHidden } from './layers-no-hidden'
import { ruleModule as symbolsNoUnused } from './symbols-no-unused'
import { ruleModule as layerNamesPatternAllowed } from './layer-names-pattern-allowed'
import { ruleModule as layerNamesPatternDisallowed } from './layer-names-pattern-disallowed'
import { ruleModule as layerStylesPreferShared } from './layer-styles-prefer-shared'
import { ruleModule as artboardsGrid } from './artboards-grid'
import { ruleModule as groupsNoRedundant } from './groups-no-redundant'
import { ruleModule as bordersNoDisabled } from './borders-no-disabled'
import { ruleModule as groupsNoEmpty } from './groups-no-empty'
import { ruleModule as artboardsLayout } from './artboards-layout'
import { ruleModule as layersSubpixelPositioning } from './layers-subpixel-positioning'
import { ruleModule as stylesNoUnused } from './styles-no-unused'
import { ruleModule as textStylesPreferShared } from './text-styles-prefer-shared'
import { ruleModule as debugI18n } from './debug-i18n'

const ruleSet: RuleSet = {
  name: '@sketch-hq/sketch-lint-ruleset-core',
  title: i18n._(t`Core Ruleset`),
  description: i18n._(t`The core sketch-lint ruleset`),
  rules: [
    debugAllOptions,
    debugThrowsError,
    groupsMaxLayers,
    imagesNoOutsized,
    layersNoHidden,
    symbolsNoUnused,
    layerNamesPatternAllowed,
    layerNamesPatternDisallowed,
    layerStylesPreferShared,
    artboardsGrid,
    groupsNoRedundant,
    bordersNoDisabled,
    groupsNoEmpty,
    artboardsLayout,
    layersSubpixelPositioning,
    stylesNoUnused,
    textStylesPreferShared,
    debugI18n,
  ],
}

export { ruleSet }
