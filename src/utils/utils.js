const TYPE_NUMBER = 'Number'
const TYPE_STRING = 'String'
const TYPE_BOOLEAN = 'Boolean'
const TYPE_ARRAY = 'Array'
const TYPE_MAP = 'Map'
const TYPE_NULL = 'null'

const ACTION_DEL = 'Del'
const ACTION_ADD = 'Add'
const ACTION_COPY = 'Copy'

function nullValue (type) {
  if (type === TYPE_NUMBER) {
    return 0
  } else if (type === TYPE_STRING) {
    return ''
  } else if (type === TYPE_BOOLEAN) {
    return false
  } else if (type === TYPE_ARRAY) {
    return []
  } else if (type === TYPE_MAP) {
    return {}
  } else if (type === TYPE_NULL) {
    return null
  }
}

function size (obj) {
  let count = 0
  for (let i in obj) {
    if (obj.hasOwnProperty(i)) {
      count++
    }
  }
  return count
}

function dataType (item) {
  if (item instanceof Array) {
    return TYPE_ARRAY
  } else if (typeof item === 'string') {
    return TYPE_STRING
  } else if (typeof item === 'boolean') {
    return TYPE_BOOLEAN
  } else if (typeof item === 'number') {
    return TYPE_NUMBER
  } else if (item === null) {
    return TYPE_NULL
  } else {
    return TYPE_MAP
  }
}

function toString (value) {
  if (value === undefined) {
    return JSON.stringify(null)
  } else {
    return JSON.stringify(value)
  }
}

function equal (a, b) {
  if (a !== null && b !== null) {
    let ta = dataType(a)
    let tb = dataType(b)
    if (ta !== tb) {
      return false
    }

    if (ta === TYPE_STRING || ta === TYPE_NUMBER || ta === TYPE_BOOLEAN || ta === TYPE_NULL) {
      return a === b
    }

    if (ta === TYPE_ARRAY) {
      if (a.length !== b.length) {
        return false
      }
    } else if (size(a) !== size(b)) {
      return false
    }

    for (var v in a) {
      if (!equal(a[v], b[v])) {
        return false
      }
    }

    return true
  }
  return false
}

const TYPES = {TYPE_NUMBER, TYPE_STRING, TYPE_BOOLEAN, TYPE_ARRAY, TYPE_MAP, TYPE_NULL}
const ACTIONS = {ACTION_ADD, ACTION_DEL, ACTION_COPY}

export {TYPES, ACTIONS, nullValue, size, dataType, toString, equal}
