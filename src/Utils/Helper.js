function Queue() {
  var collection = [];
  this.print = function () {
    console.log(collection);
  };
  this.enqueue = function (element) {
    collection.push(element);
  };
  this.dequeue = function () {
    return collection.shift();
  };
  this.front = function () {
    return collection[0];
  };

  this.isEmpty = function () {
    return collection.length === 0;
  };
  this.size = function () {
    return collection.length;
  };
}

function MySet() {
  var collection = [];
  this.has = function (element) {
    return collection.indexOf(element) !== -1;
  };
  this.values = function () {
    return collection;
  };
  this.size = function () {
    return collection.length;
  };
  this.add = function (element) {
    if (!this.has(element)) {
      collection.push(element);
      return true;
    }
    return false;
  };
  this.remove = function (element) {
    if (this.has(element)) {
      let index = collection.indexOf(element);
      collection.splice(index, 1);
      return true;
    }
    return false;
  };
  this.union = function (otherSet) {
    var unionSet = new MySet();
    var firstSet = this.values();
    var secondSet = otherSet.values();
    firstSet.forEach(function (e) {
      unionSet.add(e);
    });
    secondSet.forEach(function (e) {
      unionSet.add(e);
    });
    return unionSet;
  };
  this.intersection = function (otherSet) {
    var intersectionSet = new MySet();
    var firstSet = this.values();
    firstSet.forEach(function (e) {
      if (otherSet.has(e)) {
        intersectionSet.add(e);
      }
    });
    return intersectionSet;
  };
  this.difference = function (otherSet) {
    var differenceSet = new MySet();
    var firstSet = this.values();
    firstSet.forEach(function (e) {
      if (!otherSet.has(e)) {
        differenceSet.add(e);
      }
    });
    return differenceSet;
  };
  this.subset = function (otherSet) {
    var firstSet = this.values();
    return firstSet.every(function (value) {
      return otherSet.has(value);
    });
  };
}

//console.log(SolveAndPrint([3, 4, 8, 7, 12], 700));

export default function SolveAndPrint(numbers, targetValue) {
  let targetKey = (targetValue << numbers.length) + (1 << numbers.length) - 1;
  //console.log(targetKey);

  let solvedKeys = new MySet();
  let keyToLeftParent = new Object();
  let keyToRightParent = new Object();
  let keyToOperator = new Object();
  var queue = new Queue();

  for (let i = 0; i < numbers.length; i++) {
    let key = (numbers[i] << numbers.length) + (1 << i);
    solvedKeys.add(key);
    queue.enqueue(key);
  }

  while (queue.size() > 0 && !solvedKeys.has(targetKey)) {
    let curKey = queue.dequeue();

    let curMask = curKey & ((1 << numbers.length) - 1);
    let curValue = curKey >> numbers.length;

    let keys = [];

    keys = solvedKeys.values().slice();

    for (let i = 0; i < keys.length; i++) {
      let mask = keys[i] & ((1 << numbers.length) - 1);
      let value = keys[i] >> numbers.length;

      if ((mask & curMask) == 0) {
        for (let op = 0; op < 6; op++) {
          let opSign = "";
          let newValue = 0;

          switch (op) {
            case 0:
              newValue = curValue + value;
              opSign = "+";
              break;

            case 1:
              newValue = curValue - value;
              opSign = "-";
              break;

            case 2:
              newValue = value - curValue;
              opSign = "-";
              break;

            case 3:
              newValue = curValue * value;
              opSign = "*";
              break;

            case 4:
              newValue = -1;
              if (value != 0 && curValue % value == 0) {
                newValue = curValue / value;
              }
              opSign = "/";
              break;

            case 5:
              newValue = -1;
              if (curValue != 0 && value % curValue == 0) {
                newValue = value / curValue;
              }
              opSign = "/";
              break;
          }

          if (newValue >= 0) {
            let newMask = curMask | mask;

            let newKey = (newValue << numbers.length) + newMask;

            if (!solvedKeys.has(newKey)) {
              solvedKeys.add(newKey);

              if (op == 2 || op == 5) {
                keyToLeftParent[newKey] = keys[i];
                keyToRightParent[newKey] = curKey;
              } else {
                keyToLeftParent[newKey] = curKey;
                keyToRightParent[newKey] = keys[i];
              }

              keyToOperator[newKey] = opSign;

              solvedKeys.add(newKey);
              queue.enqueue(newKey);
            }
          }
        }
      }
    }
  }

  if (!solvedKeys.has(targetKey)) {
    return "Solution has not been found.";
  } else {
    let expressionObj = new Object();
    expressionObj["exp"] = "";

    OutletCalculatedExpression(
      keyToLeftParent,
      keyToRightParent,
      keyToOperator,
      targetKey,
      numbers.length,
      expressionObj
    );

    return expressionObj["exp"];
  }
}

function OutletCalculatedExpression(
  keyToLeftParent,
  keyToRightParent,
  keyToOperator,
  key,
  numbersCount,
  expressionObj
) {
  //let expression = "";

  if (keyToOperator[key] === undefined) {
    //console.log(key >> numbersCount);
    expressionObj["exp"] =
      expressionObj["exp"] + (key >> numbersCount).toString();
  } else {
    //console.log("(");
    expressionObj["exp"] = expressionObj["exp"] + "(";
    OutletCalculatedExpression(
      keyToLeftParent,
      keyToRightParent,
      keyToOperator,
      keyToLeftParent[key],
      numbersCount,
      expressionObj
    );

    // console.log(keyToOperator[key]);
    expressionObj["exp"] = expressionObj["exp"] + keyToOperator[key].toString();

    OutletCalculatedExpression(
      keyToLeftParent,
      keyToRightParent,
      keyToOperator,
      keyToRightParent[key],
      numbersCount,
      expressionObj
    );

    //console.log(")");
    expressionObj["exp"] = expressionObj["exp"] + ")";
  }
}
