const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcrypt");
const Person = require("../models/Person");
const Node = require("../models/Node");
const IdNumber = require("../models/IdNumber");
const Account = require("../models/Account");
const base64_encode = require("../utils/convertBase64");
const {
  get_list_id_parent,
  get_list_id_children,
  get_all_list_children,
} = require("../utils/findParent");
const { notEqual } = require("assert");
// const upload = require("../middlewares/multer").single("formAddImage");
class PersonController {
  async createPerson(req, res) {
    let { username, password } = req.body; // create account
    let { name, gender, birthday, deathday } = req.body; // create person
    let { parent } = req.body; // create node
    const image = req.file.filename;
    const salt = await bcrypt.genSalt(10);
    let idNumberParent;
    password = await bcrypt.hash(password, salt);
    console.log("parent 1", parent);
    //set varible parent if it blank because findOne not find null, _id need 12 characters
    if (parent == "") {
      parent = "123456789012";
    }
    const nodeParent = Node.findOne({ parentNode: parent })
      .then((nodeParent) => {
        //set level equal 0 or level+1
        const level =
          nodeParent != undefined || null ? nodeParent.level + 1 : 0;
        if (parent != "123456789012") {
          idNumberParent = nodeParent.idNumber;
        }

        if (parent == "123456789012") {
          parent = "";
        }
        IdNumber.findOneAndUpdate(
          { id: "autoval" },
          { $inc: { idNumber: 1 } },
          { new: true },
          (err, cd) => {
            if (err) console.log(err);
            let idNumber;
            if (cd == null) {
              const newIdNum = new IdNumber({
                id: "autoval",
                idNumber: 1,
              }).save();
              idNumber = 1;
            } else {
              idNumber = cd.idNumber;
            }
            if (typeof idNumberParent !== "undefined") {
              idNumber = idNumberParent;
            }
            const newPerson = new Person({
              name,
              gender,
              birthday,
              deathday,
              image,
              filenameImage: image,
            })
              .save()
              .then(async (newPerson) => {
                const newAccount = await Account.create({
                  username,
                  password,
                  idPerson: newPerson._id,
                });
                newAccount
                  .save()
                  .then(() => {
                    console.log("create account successfully!");
                  })
                  .catch((err) => {
                    console.log("error create acccount: ", err);
                  });
                const newNode = await Node.create({
                  parent,
                  idNumber,
                  level,
                  idPerson: newPerson._id,
                });
                newNode
                  .save()
                  .then((newNode) => {
                    Node.updateOne(
                      { _id: newNode._id },
                      {
                        parentNode: newNode._id,
                      }
                    )
                      .then(() => {
                        console.log("create new node successfully!");
                      })
                      .catch((err) => {
                        console.log("err create new node", err);
                      });
                  })
                  .catch((err) => console.log("error create node", err));
                Person.updateOne(
                  { _id: newPerson._id },
                  {
                    idNode: newNode._id,
                    idAccount: newAccount._id,
                  }
                )
                  .then(() => {
                    console.log("Update id node and id account successfully!");
                  })
                  .catch((err) => {
                    console.log("Update id node and id account fail! ", err);
                  });
                return res.status(201).json({
                  success: true,
                  message: "New person created successfully",
                  Person: newPerson,
                });
              })
              .catch((err) => {
                console.log("errorrrrr findOneAndUpdate", err);
                return res.status(200).json({
                  success: false,
                  message: "username is already in use",
                });
              });
          }
        );
      })
      .catch((err) => {
        console.log("lỗi tìm rồi", err);
      });
  }
  //get add data with idNumber
  async getAllPerson(req, res) {
    let listIdNode = [];
    await Node.find({ idNumber: res.locals.idNumber }) //res.locals.idNumber
      .populate("idCouple.id")
      .then((result) => {
        result.forEach((item) => {
          listIdNode.push(item._id.toString());
        });

        Person.find({
          idNode: { $in: listIdNode },
        })
          .populate([
            {
              path: "idNode",
              populate: {
                path: "idCouple.id",
                model: "node",
                populate: {
                  path: "idPerson",
                  model: "person",
                },
              },
            },
          ])
          .then((newPerson) => {
            newPerson.forEach((el, index) => {
              const pathImage = path.join(
                __dirname,
                "../public/img/",
                el.image
              );
              newPerson[index].image = base64_encode(pathImage);
              //couple
              const idCoupleLength = el.idNode.idCouple.length;
              if (idCoupleLength > 0) {
                let imageCouple =
                  el.idNode.idCouple[idCoupleLength - 1].id.idPerson.image;
                const pathImageCouple = path.join(
                  __dirname,
                  "../public/img/",
                  imageCouple
                );
                newPerson[index].idNode.idCouple[
                  idCoupleLength - 1
                ].id.idPerson.image = base64_encode(pathImageCouple);
              }
            });
            return res.status(200).json({
              success: true,
              Person: newPerson,
            });
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({
              success: false,
              message: "Server error. Please try again.",
              error: error.message,
            });
          });
      })
      .catch((err) => {
        console.log("err node", err);
      });
  }
  getPersonByName(req, res) {
    return Person.find({ name: req.query.name })
      .then((newPerson) => {
        return res.status(200).json({
          success: true,
          Person: newPerson,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          success: false,
          message: "Server error. Please try again.",
          error: error.message,
        });
      });
  }
  getPersonById(req, res) {
    let listID = [];
    // let dataResult = [];
    Node.findOne({ _id: req.params.id })
      .populate("idPerson")
      .then((node) => {
        listID.push(node.parentNode);
        listID.push(node.parent);
        get_list_id_children(req.params.id)
          .sort({ level: -1 })
          .exec((err, dataList) => {
            if (err) throw err;
            for (var i = 0; i < dataList.length; i++) {
              dataList[i].temp.forEach((data) => {
                listID.push(data._id.toString());
              });
            }
            Node.find({
              _id: {
                $nin: listID,
              },
            })
              .populate("idPerson")
              .then(async (result) => {
                const pathImage = path.join(
                  __dirname,
                  "../public/img/",
                  node.idPerson.image
                );
                node.idPerson.image = base64_encode(pathImage);

                result.forEach((img) => {
                  console.log(img);
                  const pathImageDataResult = path.join(
                    __dirname,
                    "../public/img/",
                    img.idPerson.image
                  );
                  img.idPerson.image = base64_encode(pathImageDataResult);
                });
                return res.status(200).json({
                  success: true,
                  Node: node,
                  dataResult: result,
                });
              })
              .catch((error) => {
                console.log(error);
                res.status(500).json({
                  success: false,
                  message: "Server error. Please try again.",
                  error: error.message,
                });
              });
          });
      })
      .catch((err) => {
        console.log("lỗi rồi", err);
      });
  }
  //get all node data if it isn'n children
  getPersonNotChild(req, res) {
    let listData = [];
    get_all_list_children().exec((err, dataList) => {
      if (err) console.log("err get list not children: ", err);
      dataList.forEach((data) => {
        if (data.level == 0 && data.temp.length == 0 && data.parent == "") {
          listData.push(data._id);
        }
      });
      Person.find({
        $or: [
          {
            idNode: listData,
          },
        ],
      })
        .then((person) => {
          person.forEach((img) => {
            const pathImageDataResult = path.join(
              __dirname,
              "../public/img/",
              img.image
            );
            img.image = base64_encode(pathImageDataResult);
          });
          return res.status(200).json({
            success: true,
            data: person,
          });
        })
        .catch((err) => {
          console.log("err add node ", err);
        });
    });
  }
  getDataFromNode(req, res) {
    const idNode = req.params.id;
    Person.findOne({ _id: idNode })
      .then((person) => {
        console.log(person);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  updatePerson(req, res) {
    const updateObject = req.body;
    if (req.file) {
      const image = req.file.filename;
      updateObject.image = image;
    }
    return Person.updateOne({ _id: req.params.id }, { $set: updateObject })
      .exec()
      .then(() => {
        return res.status(200).json({
          success: true,
          UpdatePerson: updateObject,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          success: false,
          message: "Server error. Please try again.",
          error: error.message,
        });
      });
  }
  /////////////////////Chua lam xong
  deletePerson(req, res) {
    let listIdNode = [req.params.id];
    get_list_id_children(req.params.id).exec((err, result) => {
      result[0].temp.forEach((res) => {
        listIdNode.push(res.parentNode);
      });

      return Person.deleteMany({
        $or: [{ _id: listIdNode }],
      })
        .then(() => {
          return res.status(200).json({
            success: true,
            message: "Delete successfully!",
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({
            success: false,
            message: "Server error. Please try again.",
            error: error.message,
          });
        });
    });
  }

  async listPersonCanWedding(req, res) {
    let listDataPeople = [];
    await Node.find({ idNumber: { $nin: res.locals.idNumber } })
      .populate("idPerson")
      .then((person) => {
        person.forEach((img) => {
          if (
            img.idCouple.length == 0 ||
            img.idCouple[img.idCouple.length - 1].status == false
          ) {
            const pathImageDataResult = path.join(
              __dirname,
              "../public/img/",
              img.idPerson.image
            );
            img.idPerson.image = base64_encode(pathImageDataResult);
            listDataPeople.push(img.idPerson);
          }
        });
        return res.status(200).json({
          success: true,
          data: listDataPeople,
        });
      })
      .catch((err) => {
        console.log("err add node ", err);
      });
  }
  async wedding(req, res) {
    let idParams = req.params.id;
    let idCouple = req.body.dataWedding; //id person

    const dataCouple = await Node.findOne({ idPerson: idCouple }).then(
      (dataCouple) => {
        console.log("dataCouple.parentNode", dataCouple.parentNode);
        Node.collection
          .bulkWrite([
            {
              updateOne: {
                filter: { parentNode: idParams },
                update: {
                  $push: {
                    idCouple: {
                      id: dataCouple.parentNode,
                      status: true,
                    },
                  },
                },
                upsert: true,
              },
            },
            {
              updateOne: {
                filter: { parentNode: dataCouple.parentNode },
                update: {
                  $push: {
                    idCouple: {
                      id: idParams,
                      status: true,
                    },
                  },
                },
                upsert: true,
              },
            },
          ])
          .then((results) => {
            console.log("this is results", results);
            res.json(results);
          })
          .catch((err) => console.log(err));
      }
    );
  }

  divorce(req, res) {
    Promise.all([
      Node.findOne({ parentNode: req.params.id }).populate("idCouple.id"),
      Node.findOne({ idPerson: req.body.idCouple }).populate("idCouple.id"),
    ]).then(([person, couple]) => {
      console.log("person", person);
      console.log("couple", couple);

      Promise.all([
        Node.updateOne(
          { parentNode: req.params.id },
          {
            "idCouple.$[].status": false,
          }
        ),
        Node.updateOne(
          { parentNode: couple._id },
          {
            "idCouple.$[].status": false,
          }
        ),
      ]).then((nodeItem) => {
        // let lenIdCouple = nodeItem.idCouple.length - 1;
        console.log("thành công");
      });
    });
  }
}

module.exports = new PersonController();
