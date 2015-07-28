var Faye_Engine_Memory = require('../../../javascript/engines/memory');

JS.ENV.Engine.MemorySpec = JS.Test.describe("Memory engine", function() { with(this) {
  before(function() {
    this.engineOpts = {type: Faye_Engine_Memory}
  })

  itShouldBehaveLike("faye engine")
}})
