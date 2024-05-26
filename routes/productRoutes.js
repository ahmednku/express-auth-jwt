import express from "express";
import {
  add,
  update,
  deleteProduct,
  getProducts,
  getProduct,
} from "../controllers/productController.js";
const router = express.Router();

router.post("/add", add);
router.put("/update/:id", update);
router.delete("/delete/:id", deleteProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);

export default router;
