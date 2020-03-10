import { resolve } from 'path'
import * as utils from '@sketch-hq/sketch-assistant-utils'

import assistant from './index'

export const testRule = async (
  dirname: string,
  fixture: string,
  ruleId: string,
  config: utils.RuleConfig = { active: true },
  env?: utils.AssistantEnv,
): Promise<utils.RunResult> =>
  await utils.testRule(
    resolve(dirname, fixture),
    { [`@sketch-hq/sketch-assistant-core-rules/${ruleId}`]: config },
    assistant,
    env,
  )
