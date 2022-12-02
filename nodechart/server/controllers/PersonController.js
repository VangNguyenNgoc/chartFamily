const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcrypt");
//model
const Person = require("../models/Person");
const Node = require("../models/Node");
const IdNumber = require("../models/IdNumber");
const IdFamily = require("../models/IdFamily");
const Account = require("../models/Account");
//utils
const base64_encode = require("../utils/convertBase64");
const getChildrenFromMother = require("../utils/getChildrenFromMother");
const {
  getListID,
  swap2Varible,
  getListWithCondition,
} = require("../utils/serviceNumber");
const {
  get_list_id_children,
  get_all_list_children,
} = require("../utils/findParent");
const getDataCouple = require("../utils/getDataCouple");
class PersonController {
  async createPerson(req, res) {
    let { username, password } = req.body; // create account
    let { name, gender, birthday, deathday } = req.body; // create person
    let { parent, mother } = req.body; // create node
    const image = req.file.filename;
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    IdNumber.findOneAndUpdate(
      { id: "autoval" },
      { $inc: { idNumber: 1 } },
      { new: true },
      async (err, cd) => {
        if (err) console.log("error", err);
        let idNumber;
        // console.log("Cd", cd);
        if (cd == null) {
          const newIdNum = new IdNumber({
            id: "autoval",
            idNumber: 1,
          }).save();
          idNumber = 1;
        } else {
          idNumber = cd.idNumber;
        }
        //create  new person
        const newPerson = await new Person({
          name,
          gender,
          birthday,
          deathday,
          image,
          filenameImage: image,
        });
        newPerson.save();
        //create new account
        const newAccount = await Account.create({
          username,
          password,
          idPerson: newPerson._id,
        });
        newAccount.save();
        Promise.all([
          Node.findOne({ parentNode: parent }).populate("idPerson"),
          Node.findOne({ parentNode: mother }).populate("idPerson"),
        ]).then(async ([nodeParent, nodeMother]) => {
          console.log("nodeParent", nodeParent);
          console.log("nodeMother", nodeMother);
          //set variable defaut
          let idFamily = -1;
          let level = 0;
          //get data from node parent which it exist
          if (nodeParent != undefined) {
            idFamily =
              nodeParent.idCouple[nodeParent.idCouple.length - 1].idFamily;
            if (nodeParent.idPerson.gender == "Female") {
              //swap if node parent is mother -> mother = parent, parent = mother
              let swap = swap2Varible(parent, mother);
              parent = swap[0];
              mother = swap[1];
              level = nodeMother.level + 1;
              //set level equal 0 or level+1
              idNumber = nodeMother.idNumber;
            } else {
              level = nodeParent.level + 1;
              //set level equal 0 or level+1
              idNumber = nodeParent.idNumber;
            }
          }

          //create new node
          const newNode = await Node.create({
            parent,
            mother,
            idNumber,
            idFamily,
            level,
            idPerson: newPerson._id,
          });
          newNode.save();
          //update foreign key
          await Promise.all([
            Node.updateOne(
              { _id: newNode._id },
              {
                parentNode: newNode._id,
              }
            ),
            Person.updateOne(
              { _id: newPerson._id },
              {
                idNode: newNode._id,
                idAccount: newAccount._id,
              }
            ),
          ]).then(() => {});
        });

        return res.status(201).json({
          success: true,
          message: "New person created successfully",
          Person: newPerson,
        });
      }
    );
  }
  //get person with account
  async getPerson(req, res) {}

  //get add data with idNumber
  async getAllPerson(req, res) {
    const person = res.locals.person;

    //get list NODE in family from account login -> (level - 2 < level < level + 2)
    const listNodeNumber = await Node.find({
      idNumber: res.locals.idNumber,
      $and: [
        { level: { $gte: parseInt(person.idNode.level) - 2 } },
        { level: { $lte: parseInt(person.idNode.level) + 2 } },
      ],
    })
      .populate("idCouple.id")
      .exec();

    //push list id node in variable listIdNode from function getListID
    let listIdNode = await getListID(listNodeNumber);
    let newPerson = await Person.find({
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
      .exec();
    let listPerson = newPerson;
    let listQuery = [];
    await newPerson.forEach(async (el, index) => {
      const pathImage = path.join(__dirname, "../public/img/", el.image);
      newPerson[index].image = base64_encode(pathImage);
      //couple
      const listIdCouple = el.idNode.idCouple;

      if (listIdCouple.length > 0) {
        //get data couple and convert image to base64
        await getDataCouple(el.idNode.idCouple, newPerson[index]);
        //get list id children of family via idFamily
        let idNodesFamily = await getListWithCondition(
          listIdCouple,
          "idFamily"
        );
        console.log("idNodesFamily", idNodesFamily);
        if (idNodesFamily.length > 0) {
          //get list id children of mother
          listQuery.push(
            await Node.find({
              idFamily: { $in: idNodesFamily },
            })
          );
        }
      }
      // console.log("newPerson", listPerson);
      try {
        await Promise.all(listQuery).then(async (result) => {
          console.log("result", result);

          let listIdNodeFamily = await getListID(result[0]);
          // //get list children of mother
          // console.log("listIdCouple", listIdCouple[index]);
          // // console.log(listIdCouple[index]);
          if (typeof listIdCouple[index].id._id.toString() != undefined) {
            await getChildrenFromMother(
              listIdNodeFamily,
              listIdCouple[index].id._id.toString(),
              listPerson
            );
          }
          return await new Promise((resolve, reject) => {
            if (resolve) {
              resolve("resolve");

              res.status(200).json({
                success: true,
                Person: listPerson,
              });
            }
            if (reject) {
              reject("reject");
              res.status(500).json({
                success: false,
                message: "Server error. Please try again.",
                error: error.message,
              });
            }
          });
        });
      } catch (error) {
        console.log(error, error);
      }
    });
  }
  async getPersonByName(req, res) {}
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
              // dataList[i].temp.forEach((data) => {
              //   listID.push(data._id.toString());
              // });
              getListID(dataList[i].temp, listID);
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
      // result[0].temp.forEach((res) => {
      //   listIdNode.push(res.parentNode);
      // });
      getListWithCondition(result[0].temp, "parentNode", listIdNod);
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
        person.forEach((element) => {
          if (
            element.idCouple.length == 0 ||
            element.idCouple[element.idCouple.length - 1].status == false
          ) {
            const pathImageDataResult = path.join(
              __dirname,
              "../public/img/",
              element.idPerson.image
            );
            element.idPerson.image = base64_encode(pathImageDataResult);
            listDataPeople.push(element.idPerson);
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
    // const idFamily = createNumberFamily();
    // console.log(idFamily);
    const idFamilyNumber = IdFamily.findOneAndUpdate(
      { idAutoVal: "autoval" },
      { $inc: { idFamily: 1 } },
      { new: true },
      (err, cd) => {
        if (err) console.log(err);
        let idFamily;
        if (cd == null) {
          const newIdNum = new IdFamily({
            idAutoVal: "autoval",
            idFamily: 1,
          }).save();
          idFamily = 1;
        } else {
          idFamily = cd.idFamily;
        }

        const dataCouple = Node.findOne({ idPerson: idCouple }).then(
          (dataCouple) => {
            console.log("dataCouple", dataCouple.parentNode);
            Node.collection
              .bulkWrite([
                {
                  updateOne: {
                    filter: { parentNode: idParams },
                    update: {
                      $push: {
                        idCouple: {
                          id: dataCouple.parentNode,
                          idFamily,
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
                          idFamily,
                          status: true,
                        },
                      },
                    },
                    upsert: true,
                  },
                },
              ])
              .then(() => {
                res.status(200).json({ success: true });
              })
              .catch((err) => {
                console.log(err);
                res.status(400).json({ success: false, message: err });
              });
          }
        );
      }
    );
  }

  divorce(req, res) {
    Promise.all([
      Node.findOne({ parentNode: req.params.id }).populate("idCouple.id"),
      Node.findOne({ idPerson: req.body.idCouple }).populate("idCouple.id"),
    ]).then(([person, couple]) => {
      // console.log("person", person);
      // console.log("couple", couple);

      Promise.all([
        Node.updateOne(
          { parentNode: person._id },
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
      ])
        .then((nodeItem) => {
          // let lenIdCouple = nodeItem.idCouple.length - 1;
          console.log("thành công");
          res.status(200).json({
            success: true,
          });
        })
        .catch((err) => {
          res.status(400).json({
            success: false,
            error: error,
          });
        });
    });
  }
}

module.exports = new PersonController();
