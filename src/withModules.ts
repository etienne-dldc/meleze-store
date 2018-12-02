import { toArray, validateReactions, isPlainObject, getIn, setIn } from "./utils"
import { reaction } from "./reaction"

export function withModules(config = {}) {
  const conf = {
    setup: toArray(config.setup),
    reactions: toArray(config.reactions),
    mutations: config.mutations || {},
    actions: config.actions || {},
    state: config.state || {},
    statics: config.statics || {},
    modules: config.modules || {}
  }

  const state = {}
  const actions = {}
  const mutations = {}
  const setup = conf.setup
  const reactions = validateReactions([...conf.reactions], [])
  const statics = {}

  function initModuleActions(theAction, modulePath) {
    if (isPlainObject(theAction)) {
      return Object.keys(theAction).reduce((acc, key) => {
        acc[key] = initModuleActions(theAction[key], modulePath)
        return acc
      }, {})
    }
    return ctx => {
      const moduleActions = getIn(ctx.actions, modulePath)
      const moduleMutations = getIn(ctx.mutations, modulePath)
      const moduleState = getIn(ctx.state, modulePath)
      const getModuleState = () => getIn(ctx.getState(), modulePath)
      const moduleStatics = getIn(ctx.statics, modulePath)
      const getModuleStatic = () => getIn(ctx.getStatics(), modulePath)

      return theAction({
        ...ctx,
        moduleState,
        moduleActions,
        getModuleState,
        moduleMutations,
        moduleStatics,
        getModuleStatic
      })
    }
  }

  function initModuleMutations(theMutation, modulePath) {
    if (isPlainObject(theMutation)) {
      return Object.keys(theMutation).reduce((acc, key) => {
        acc[key] = initModuleMutations(theMutation[key], modulePath)
        return acc
      }, {})
    }
    return ctx => {
      const moduleState = getIn(ctx.state, modulePath)
      return theMutation({ ...ctx, moduleState })
    }
  }

  function initModuleReactions(reactions, modulePath) {
    return reactions.map(theReaction => {
      return reaction([...modulePath, theReaction.name].join("."), ctx => {
        const moduleActions = getIn(ctx.actions, modulePath)
        const moduleMutations = getIn(ctx.mutations, modulePath)
        const moduleState = getIn(ctx.state, modulePath)
        const getModuleState = () => getIn(ctx.getState(), modulePath)
        const moduleStatics = getIn(ctx.statics, modulePath)
        const getModuleStatic = () => getIn(ctx.getStatics(), modulePath)
        return theReaction.reaction({
          ...ctx,
          moduleState,
          moduleActions,
          getModuleState,
          moduleMutations,
          moduleStatics,
          getModuleStatic
        })
      })
    })
  }

  function initModuleSetups(setups, modulePath) {
    return setups.map(theSetup => {
      return ctx => {
        const moduleState = getIn(ctx.state, modulePath)
        const getModuleState = () => getIn(ctx.getState(), modulePath)
        const moduleStatics = getIn(ctx.statics, modulePath)
        const getModuleStatic = () => getIn(ctx.getStatics(), modulePath)
        const moduleActions = getIn(ctx.actions, modulePath)
        const moduleMutations = getIn(ctx.mutations, modulePath)
        return theSetup({
          ...ctx,
          moduleState,
          getModuleState,
          moduleActions,
          moduleMutations,
          moduleStatics,
          getModuleStatic
        })
      }
    })
  }

  function initModule(module, path) {
    if (isPlainObject(module)) {
      Object.keys(module).forEach(moduleKey => {
        initModule(module[moduleKey], [...path, moduleKey])
      })
      return
    }
    if (typeof module === "function") {
      const moduleConfig = module(path)
      if (moduleConfig.state) {
        setIn(state, path, moduleConfig.state)
      }
      if (moduleConfig.statics) {
        setIn(statics, path, moduleConfig.statics)
      }
      if (moduleConfig.actions) {
        setIn(actions, path, initModuleActions(moduleConfig.actions, path))
      }
      if (moduleConfig.mutations) {
        setIn(mutations, path, initModuleMutations(moduleConfig.mutations, path))
      }
      if (moduleConfig.setup) {
        setup.push(...initModuleSetups(toArray(moduleConfig.setup), path))
      }
      if (moduleConfig.reactions) {
        reactions.push(...initModuleReactions(validateReactions(toArray(moduleConfig.reactions), path), path))
      }
      return
    }
    throw new Error(`module must be a function`)
  }

  if (typeof modules === "function") {
    throw new Error(`modules must be an object`)
  }

  initModule(conf.modules, [])

  Object.assign(actions, conf.actions)
  Object.assign(mutations, conf.mutations)
  Object.assign(state, conf.state)
  Object.assign(statics, conf.statics)

  return { ...config, state, statics, actions, mutations, setup, reactions }
}
