class TestClass {
  constructor(a, b) {
    this.a = a;
    this.b = b;
    TestClass.list[a] = this;
  }

  toString(){
    return "A: " + this.a + ", B: " + this.b + ".";
  }
}

TestClass.list = {};

module.exports = TestClass;
