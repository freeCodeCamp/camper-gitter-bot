function where(collection, source) {
  var arr = [];
  // What's in a name?
  k = Object.keys(source)[0]; // since we know only one 
  v = source[k];
  console.log("match for:", k, v);
  var arr = collection.filter(function(a){
    console.log(a);
    return (a[k] === v);
  });
  return arr;
}

res = where([{ first: 'Romeo', last: 'Montague' }, { first: 'Mercutio', last: null }, { first: 'Tybalt', last: 'Capulet' }], { last: 'Capulet' });
console.log(res);

// ["last"][0]
// 
// 