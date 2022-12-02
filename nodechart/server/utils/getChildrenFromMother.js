const path = require("path");
const Person = require("../models/Person");
const base64_encode = require("../utils/convertBase64");
async function getChildrenFromMother(listIdNodeFamily, idCouple, listResult) {
  const personFamily = await Person.find({
    idNode: { $in: listIdNodeFamily },
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
    .then(async (personFamily, i) => {
      // console.log("personFamily", personFamily);
      await personFamily.forEach(async (element, i) => {
        if (element.idNode.parent == idCouple) {
          //set parent equal id mother
          element.idNode.parent = element.idNode.mother;
          //convert image children
          const pathImageChildren = path.join(
            __dirname,
            "../public/img/",
            element.image
          );
          personFamily[i].image = await base64_encode(pathImageChildren);
          //idcouple of children
          const listIdCoupleChild = element.idNode.idCouple;
          // console.log("listIdCoupleChild", listIdCoupleChild);
          if (listIdCoupleChild.length > 0) {
            //convert image direction to base64
            let imageCouple =
              listIdCoupleChild[listIdCoupleChild.length - 1].id.idPerson.image;
            const pathImageCouple = path.join(
              __dirname,
              "../public/img/",
              imageCouple
            );
            // personFamily[i].idNode.idCouple[
            //   listIdCoupleChild.length - 1
            // ].id.idPerson.image = await base64_encode(pathImageCouple);
          }
          listResult.push(personFamily[i]);
        }
      });
      // console.log("123");
      // console.log("listResult 2", listResult);
      return listResult;
    })
    .catch((err) => {
      console.log("error getChildrenFromMother ", err);
    });
}

module.exports = getChildrenFromMother;
