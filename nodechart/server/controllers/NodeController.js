const Node = require("../models/Node");
const IdNumber = require("../models/IdNumber");
const {
  get_list_id_parent,
  get_list_id_children,
  get_all_list_children,
} = require("../utils/findParent");
const { swap2Varible } = require("../utils/serviceNumber");
const Person = require("../models/Person");
class NodeController {
  async addNodeChildren(req, res) {
    let { parent, mother } = req.body;
    const nodeid = await Node.findOne({ _id: req.body.parent }).exec();
    console.log("nodeid", nodeid);
    await Promise.all([
      Node.findOne({ _id: req.body.parent }).populate("idPerson"),
      Node.findOne({ _id: req.body.mother }).populate("idPerson"),
    ]).then(async ([nodeParent, nodeMother]) => {
      let level = nodeParent.level;
      if (nodeParent.idPerson.gender == "Female") {
        parent = swap2Varible(mother, parent)[0];
        mother = swap2Varible(mother, parent)[1];
        level = nodeMother.level;
      }

      const node = await Node.updateOne(
        { idPerson: req.params.id },
        {
          $set: {
            parent,
            mother,
            idNumber: res.locals.idNumber,
            level: level + 1,
          },
        }
      ).exec(function (err, node) {
        if (err) {
          console.log("update thất bại", err);
          res
            .status(500)
            .json({ success: false, message: "add node children fail!" });
        }
        console.log("update thành công", node);
        res.status(200).json({
          success: true,
          message: "add node children successfully!",
        });
      });
    });
  }

  deleteNode(req, res) {
    console.log("req.params.id", req.params.id);
    let listIdNode = [req.params.id];
    get_list_id_children(req.params.id).exec((err, result) => {
      result[0].temp.forEach((res) => {
        listIdNode.push(res.parentNode);
      });
      IdNumber.findOneAndUpdate(
        { id: "autoval" },
        { $inc: { idNumber: 1 } },
        { new: true },
        (err, cd) => {
          if (err) console.log(err);
          let idNumber = cd.idNumber;

          const bulkOps = listIdNode.map((element, index) => ({
            updateOne: {
              filter: { parentNode: element },
              update: {
                $set: {
                  parent: "",
                  level: 0,
                  idNumber: idNumber + index,
                },
              },
              upsert: true,
            },
          }));

          Node.collection
            .bulkWrite(bulkOps)
            .then((results) => {
              console.log(listIdNode.length);
              IdNumber.updateOne(
                { id: "autoval" },
                {
                  $inc: { idNumber: listIdNode.length - 1 },
                }
              ).exec({});
            })
            .catch((err) => next(err));
        }
      );
    });
  }

  updateNode(req, res) {
    let nodeResult = [];

    Node.find()
      .then((result) => {
        result.forEach((item) => {
          if (item.parent == "") {
            nodeResult.push(item._id);
          }
        });
        get_list_id_children(nodeResult[0].toString()).exec((err, dataList) => {
          if (err) throw err;
          console.log("dataList", dataList);
        });
        res.json("abc");
      })
      .catch((err) => {
        console.log("err", err);
      });
  }
}

module.exports = new NodeController();
