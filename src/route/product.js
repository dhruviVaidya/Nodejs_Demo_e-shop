const express = require("express");
const Category = require("../models/category");
const Product = require("../models/product");
const auth = require("../middleware/auth");
const router = new express.Router();
const multer = require("multer");


const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/upload");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

router.post(
  "/postproducts",
  auth,
  uploadOptions.single("image"),
  async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category)
      return res
        .status(400)
        .json({ success: false, message: "category is invalid " });

    const oldproduct = await Product.findOne({ name: req.body.name });

    if (oldproduct) {
      return res.status(409).send("Product Already Exist.");
    }

    const file = req.file;
    if (!file) return res.status(400).send("No image in the request");

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/upload/`;

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      image: `${basePath}${fileName}`,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      owner: req.user._id,
    });

    try {
      await product.save();
      res.status(201).send(product);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

router.patch("/product/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "name",
    "description",
    "image",
    "price",
    "category",
    "countInStock",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const product = await Product.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!product) {
      return res.status(404).send({ error: "Invalid User.Please Login" });
    }

    updates.forEach((update) => (product[update] = req.body[update]));
    await product.save();
    res.send(product);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/product/:id", auth, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!product) {
      res.status(404).send({ error: "Invalid User.Please Login" });
    }

    res.send({ message: "deleted" });
  } catch (e) {
    res.status(500).send();
  }
});

router.get(`/getproduct`, auth, async (req, res) => {
  const product = await Product.find();

  if (!Product) {
    res.status(500).json({ success: false });
  }

  res.status(200).send(product);
});

router.get(`/getProductByTypes`, async (req, res) => {
  try {
    let filter = {};
    if (req.query.categories) {
      filter.categories = { category: req.query.categories.split(",") };
    }

    const productList = await Product.find(filter.categories).populate(
      "category"
    );
    if (!filter.categories) {
      res.status(500).json({ success: false, message: "change in url " });
    }

    if (!productList) {
      res.status(500).json({ success: false, message: "category is invalid " });
    }
    res.send(productList);
  } catch (e) {
    res.status(500).json({ success: false });
  }
});

router.get(`/recent/product`, async (req, res) => {
    const recentProduct = await Product.find().sort({ dateCreated: -1 }).limit(3);
    console.log(recentProduct);
    res.send(recentProduct);
  });

  router.get("/get/totallikes/", async (req, res) => {
    const likecount = await Product.aggregate([
      {
        $project: {
          name : 1,
          LikesCount: {
            $size: { $ifNull: ["$isLiked", []] },
          },
        },
      },
    ]);
    if (likecount !== 0) {
      const mostLiked = likecount.sort((a, b) => b.LikesCount - a.LikesCount);
      res.send(mostLiked);
      
    }
    else{
      res.status(500).json({ success: false ,message : 'Product no found'});
    }
    
  });
module.exports = router;
