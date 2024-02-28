const express=require("express");
const { getAllTransaction, price, CategoryCount,combine, saleData } = require("../Controllers/transactionController");
const router=express.Router();
router.route("/getAll").get(getAllTransaction);
router.route("/statics").get(saleData);
router.route("/price").get(price);
router.route("/category").get(CategoryCount);
router.route("/graphData").get(combine);


module.exports=router;