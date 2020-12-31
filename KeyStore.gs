/**
 * this is  a handy store, 
 * esp for dealing with things that might otherwise need to be in global like user states
 */
class KeyStore {

  constructor () {
    this.clear()
  }

  clear () {
    this._storeMap = new Map()
    this._startedAt = new Date().getTime()
  }


  /**
   * 
   * @param {*} key a map key
   * @param {*} [seed] an optional value to set if there's no existing key - it can also be a function
   * @return {*} the value
   */
  getStore (key,seed)  {
    if (seed === null && !this.hasStore(key))throw 'store key not found ' + key
    return this.hasStore(key) 
      ? this.storeMap.get(key) 
      : (this.setStore(key,typeof seed === 'function' ? seed(key) : seed))
  }

  /**
   * check if a key exists
   * @param {*} key 
   * @return {*} the value 
   */
  hasStore (key) {
    return this.storeMap.has(key)
  }

  /**
   * (over) write a value to store
   * @param {*} key 
   * @return {*} the value 
   */
  setStore  (key, value) {
    this.storeMap.set(key,value)
    return this.getStore(key)
  }

  /**
   * get an array of the all the keys in the store
   * @return {*[]}
   */
  get keys () {
    return Array.from(this.storeMap.keys())
  }

  /**
   * get how many items in the store
   */
  get size () {
    return this.storeMap.size
  }

  /**
   * this is the map to hold all the entries
   */
  get storeMap () {
    return this._storeMap
  }
}

