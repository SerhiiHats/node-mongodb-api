require('dotenv').config();
const express = require('express');
const ProductModel = require('./models/product.model');
const FileService = require('./fileService.js');
const connectDB = require('./connectMongo');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(fileUpload({}));
app.use(express.static("static"));

connectDB();

app.get("/", (req, res) => res.send('Use API: <strong><em>How can you use this API:</em></strong> <br/><hr>\n     ' +
  '1. <strong>GET</strong> request on url: "./*name_file.jpg" you can get a static product image file<br/>\n     ' +
  '2. <strong>POST</strong> request on url: "./api/v1/products" you can create a product that is passed in the body of the request<br/> \n     ' +
  '3. <strong>GET</strong> request on url: "./api/v1/products" you can get all products<br/>\n     ' +
  '4. <strong>GET</strong> request on url: "./api/v1/products/id" you can get the product by ID<br/>\n     ' +
  '5. <strong>PUT</strong> request on url: "./api/v1/products" you can update the product passed in the request body<br/>\n     ' +
  '6. <strong>DELETE</strong> request on url: "./api/v1/products/id" you can remove the product by ID'));

app.get('/api/v1/products', async (req, res) => {
  try {
    const products = await ProductModel.find();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json(error.message);
  }
})

app.get('/api/v1/products/:id', async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);

    if (product) {
      return res.status(200).json(product);
    }

    return res.status(404).json({
      msg: 'Not Found',
    })
  } catch (error) {
    return res.status(500).json(error.message);
  }
})

app.post('/api/v1/products', async (req, res) => {
  try {
    const fileName = FileService.saveFile(req.files.image);
    const product = await ProductModel.create({...req.body, image: fileName});
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

app.put('/api/v1/products', async (req, res) => {
  try {
    const product = req.body;
    if (!product._id) {
      throw new Error("Id не указан")
    }
    const updatedProduct = await ProductModel.findByIdAndUpdate(product._id, product, {new: true});

    return res.status(200).json(updatedProduct);
  } catch (error) {
    return res.status(500).json(error.message);
  }
})

app.delete('/api/v1/products/:id', async (req, res) => {
  try {
    if (!req.params.id) {
      throw new Error("Id не указан");
    }
    const deletedProduct = await ProductModel.findByIdAndDelete(req.params.id);
    return res.status(200).json(deletedProduct);
  } catch (error) {
    return res.status(500).json(error.message);
  }
})

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
})