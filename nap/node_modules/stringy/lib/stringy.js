function filter(item) {
  return (function() {
    var i = 0
    
    return function(key, value) {
      if(i !== 0 && typeof(item) === 'object' && typeof(value) == 'object' && item == value) 
        return '[Circular]'
      
      if(i >= 29) // seems to be a harded maximum of 30 serialized objects?
        return '[Unknown]'
      
      ++i // so we know we aren't using the original object anymore
      
      return value
    }
  })(item)
}

function stringify(item, censor, space) {
  return JSON.stringify(item, censor ? censor : filter(item), space)
}

exports.stringify = stringify