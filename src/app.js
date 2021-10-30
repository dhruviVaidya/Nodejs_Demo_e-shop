const express = require('express')
require('../db/mongoose')
const userRouter = require('./route/user')
const CategoryRouter = require('../src/route/category')
const ProductRouter = require('../src/route/product')
const ProductLikeRouter = require('../src/route/productLike')
const ProductCommentRouter = require('../src/route/comments')
const app = express()

app.use(express.json())
app.use(userRouter)
app.use(CategoryRouter)
app.use(ProductRouter)
app.use(ProductLikeRouter)
app.use(ProductCommentRouter)
 console.log("hello")
module.exports = app