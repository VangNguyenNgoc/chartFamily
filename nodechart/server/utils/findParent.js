const Person = require("../models/Person");
const Node = require("../models/Node");
const mongoose = require("mongoose");

module.exports = {
  get_list_id_parent: function (id) {
    // .aggregate([ { $match: { _id: { $in: ["63296b0558b55787a840b553"], }, }, }, { $graphLookup: { from: "person", startWith: "_id", connectFromField: "parent", connectToField: "_id", as: "temp", }, } ])
    return Node.aggregate([
      {
        $graphLookup: {
          from: "node",
          startWith: "$parentNode",
          connectFromField: "parent",
          connectToField: "parentNode",
          as: "temp",
        },
      },
    ]);
  },

  //get all list children of all parent
  get_all_list_children: function () {
    return Node.aggregate([
      {
        $graphLookup: {
          from: "node",
          startWith: "$parentNode",
          connectFromField: "parentNode",
          connectToField: "parent",
          as: "temp",
        },
      },
    ]);
  },

  //get list id children of id parameter parent
  get_list_id_children: function (id) {
    return Node.aggregate([
      { $match: { parentNode: id } },
      {
        $graphLookup: {
          from: "node",
          startWith: "$parentNode",
          connectFromField: "parentNode",
          connectToField: "parent",
          as: "temp",
        },
      },
    ]);
  },
};
//.aggregate([{$match: {"parentNode":"632ab19c14e1693605434aa8"}}, { $graphLookup: { from: "person", startWith: "$parentNode", connectFromField: "parentNode", connectToField: "parent", as: "temp", }, } ])
