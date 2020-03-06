import { resolve } from 'path'
import * as utils from '@sketch-hq/sketch-assistant-utils'

import pkg from './package.json'
import assistant from './index'
import { AssistantEnv } from '@sketch-hq/sketch-assistant-utils'

export const testRule = async (
  dirname: string,
  fixture: string,
  ruleId: string,
  config: utils.RuleConfig = { active: true },
  env?: AssistantEnv,
): Promise<utils.RunResult> =>
  await utils.testRule(
    resolve(dirname, fixture),
    { [`${pkg.name}/${ruleId}`]: config },
    assistant,
    env,
  )
