import { REACTION_TYPE, Reaction, ConfigurationAny } from './types';

export function reaction<Config extends ConfigurationAny>(name: string, reaction: Reaction<Config>) {
  return {
    type: REACTION_TYPE,
    name,
    reaction,
  };
}
