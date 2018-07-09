exports = class QueryResult {
  constructor(){
    this.groups = {};
    this.status = QueryResult.OK;
    this.msg = "OK";
  }

  addGroup(name){
    if (typeof name != 'string') throw new Error("QueryResult: addGroup(String::name) expects name to be a String, got '" + name.constructor.name + "'.");
    this.groups[name] = [];
  }

  insertResult(group, result){
    if (typeof group != 'string') throw new Error("QueryResult: insertResult(String::group, mixed::result) expects group to be a String, got '" + group.constructor.name + "'.");
    if (Object.keys(this.groups).includes(group)){
      this.groups[group].push(result);
    } else {
      throw new Error("QueryResult: Attempted to add result to non-existant group, ' " + group + " '. You can register a group on the result using the addGroup(String name) method.")
    }
  }

  getGroup(group) {
    if (typeof group != 'string') throw new Error("QueryResult: getGroup(String::group) expects group to be a String, got '" + group.constructor.name + "'.");
    if (Object.keys(this.groups).includes(group)) {
      return this.groups[group];
    } else {
      return null;
    }
  }

  error(msg){
    this.status = QueryResult.ERROR;
    this.msg = msg;
  }

  finalise(){
    Object.freeze(this.groups);
    for (let group in this.groups){
      if(Array.isArray(this.groups[group]) && this.groups[group].length > 0) return;
    }
    this.status = QueryResult.NONE;
    this.msg = "Empty";
  }
}

Object.defineProperty(QueryResult, 'OK', {
  value: 0,
  writable: false
});

Object.defineProperty(QueryResult, 'NONE', {
  value: 1,
  writable: false
});

Object.defineProperty(QueryResult, 'ERROR', {
  value: 255,
  writable: false
});

// QueryResult.OK = 0;
// QueryResult.NONE = 1;
// QueryResult.ERROR = 255;
