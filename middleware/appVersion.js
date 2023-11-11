function verifyAppVersion(req, res, next) {
  // if (
  //   req.query.version ||
  //   req?.query?.version !== process.env.LATEST_APP_VERSION
  // ) {
  //   console.log("Update Available");
  //   return res.status(200).json({
  //     title: "Update Needed",
  //     message: "Please update the app to continue using it.",
  //   });
  // }
  // console.log(req.query);
  next();
}

module.exports = verifyAppVersion;
