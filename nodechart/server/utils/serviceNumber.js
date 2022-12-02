function getListID(array, listIdNode = []) {
  // let listIdNode = [];
  // console.log("array", array);
  array.forEach((item) => {
    listIdNode.push(item._id.toString());
  });
  return listIdNode;
}

function getListWithCondition(array, condition, listIdNode = []) {
  // let listIdNode = [];
  console.log("listIdNode", listIdNode);
  array.forEach((item) => {
    console.log(item[condition]);
    listIdNode.push(item[condition]);
  });
  return listIdNode;
}

function swap2Varible(a, b) {
  return [b, a];
}

module.exports = { getListID, swap2Varible, getListWithCondition };
