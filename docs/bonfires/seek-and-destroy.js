function destroyer(arr) {
  // Remove all the values
  src = arr[0];
  rest = arguments.slice(1, arr.length); // rename
  console.log(src, rest);
  return arr;
  res = src.filter(function(elem) {
    for(var i=0; i<rest.length;i++) {
      console.log(test);
    }
  });
  
}

destroyer([1, 2, 3, 1, 2, 3], 2, 3);
