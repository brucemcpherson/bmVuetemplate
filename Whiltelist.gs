/**
 * this should contain a list of all the functions authorized
 * to be run from the client 
 * for V8, it's important that it's a namespace ief to ensure its parsed in the correct order
 * and is available throughout the project on initialization
 */
const WhitelistedActions = (()=> {
 const ks = new Map()
 // whitelist everything that can be run
 ks.set('poll-update', (...args)=>Server.poller(...args));;
 return ks
})();


/**
 * run something from the whitelist
 * will generall be invoked by google.script.run
 * @param {string} name the key of the action to run in the whilelistedActions store
 * @param {...*} args any arguments for the action
 * @return {*} the result
 */
const runWhitelist = (name, ...args) => {
  // get what to run from the store
  const action = WhitelistedActions.get(name)
  if(!action) {
    throw new Error(`${name} is not in the list of actions that can be run from the client`)
  }
  return action (...args)
}
