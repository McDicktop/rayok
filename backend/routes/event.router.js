const Router = require("express");
const router = new Router();
const { controller } = require("../controllers/eventController.js");
const { upload, multerErrorHandler } = require("../utils/multer.js");

const uploadFields = multerErrorHandler(
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "gallery", maxCount: 5 },
  ]),
);

router.get("/event/files", controller.getFiles); //листинг s3-бакета

router.get("/event", controller.getEvents);
router.post("/event", uploadFields, controller.postEvent);
router.put("/event/:id", uploadFields, controller.updateEvent);
router.delete("/event/:id", controller.deleteEvent);
router.post("/event/status/:id", controller.changeEventStatus);

router.get("/event/category", controller.getCategories);
router.post("/event/category", controller.postCategory);
router.delete("/event/category/:id", controller.deleteCategory);
router.put("/event/category/:id", controller.changeCategory);

module.exports = router;
