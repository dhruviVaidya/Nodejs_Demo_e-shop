const express = require('express')
const Category = require('../models/category')
const auth = require('../middleware/auth')
const router = new express.Router()


router.post('/category', auth, async (req, res) => {
    const oldCategory = await Category.findOne({ name : req.body.name });

    if (oldCategory) {
      return res.status(409).send("Category Already Exist.");
    }
    console.log(req.user._id)
    const category = new Category({
        ...req.body,
        owner: req.user._id
    })

    try {
        await category.save()
        res.status(201).send(category)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get(`/getcategory`,auth, async (req,res) => {
    const categotyList = await Category.find();

    if(!categotyList){
        res.status(500).json({success: false})
    }

    res.status(200).send(categotyList)
})


module.exports = router