"use strict";


function t1() {

    function Person(name){
      this.name = name;
    }

    Person.prototype.greet = function(otherName){
      return "Hi " + otherName + ", my name is " + this.name;
    };

    p = new Person("b")
    console.log(p.greet("a", "b"));

};


function steamroller(arr) {
  // I'm a steamroller, baby
  if (Array.isArray(arr)) {
    var res = streamroller(arr);
  }
  return arr[0];
}

console.log( steamroller([1, [2], [3, [[4]]]]) );

