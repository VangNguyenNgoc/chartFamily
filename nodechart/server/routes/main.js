const personRouter = require("./person");
const authenRouter = require("./authen");
const nodeRouter = require("./node");

function router(app) {
  app.use("/api", authenRouter);
  app.use("/api/person", personRouter);
  app.use("/api/node", nodeRouter);
}
module.exports = router;
