const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const products = await Product.findAll({
      include: [Category, Tag]
    });
    res.json(products);
  } catch (error) {
    res.status(500).json(`Error Ocurred: ${error.message}`);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const product = await Product.findOne({
      where: { id: req.params.id },
      include: [Category, Tag]
    });
    if (!product) return res.status(404).json('Product Was not Found');
    res.json(product);
  } catch (error) {
    res.status(500).json(`Error Ocurred: ${error.message}`);
  }
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  // Product.create(req.body)
  //   .then((product) => {
  //     // if there's product tags, we need to create pairings to bulk create in the ProductTag model
  //     if (req.body.tagIds.length) {
  //       const productTagIdArr = req.body.tagIds.map((tag_id) => {
  //         return {
  //           product_id: product.id,
  //           tag_id,
  //         };
  //       });
  //       return ProductTag.bulkCreate(productTagIdArr);
  //     }
  //     // if no product tags, just respond
  //     res.status(200).json(product);
  //   })
  //   .then((productTagIds) => res.status(200).json(productTagIds))
  //   .catch((err) => {
  //     console.log(err);
  //     res.status(400).json(err);
  //   });

  try {

    // Capture the User Inputs
    const { product_name, price, stock, tagIds, category_id } = req.body;
    // Simple Validation -- Stock has Default / tagIds are optional / Category is Optional also
    if (!product_name || !price) return res.status(400).json('Invalid Inputs or Bad Request');
    // Create The New Product from inputs
    const newProduct = await Product.create({
      product_name, price, stock, category_id
    });
    // Then Add tagId if Provided
    if (tagIds && tagIds.length) {
      const productTagIdArr = tagIds.map(tagId => {
        return {
          product_id: newProduct.id,
          tag_id: tagId
        }
      });
      const tags = await ProductTag.bulkCreate(productTagIdArr);
      newProduct.tags = tags;
    }
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json(`Error Ocurred: ${error.message}`);
  }
});

// update product
router.put('/:id', async (req, res) => {
  // // update product data
  // Product.update(req.body, {
  //   where: {
  //     id: req.params.id,
  //   },
  // })
  //   .then((product) => {
  //     // find all associated tags from ProductTag
  //     return ProductTag.findAll({ where: { product_id: req.params.id } });
  //   })
  //   .then((productTags) => {
  //     // get list of current tag_ids
  //     const productTagIds = productTags.map(({ tag_id }) => tag_id);
  //     // create filtered list of new tag_ids
  //     const newProductTags = req.body.tagIds
  //       .filter((tag_id) => !productTagIds.includes(tag_id))
  //       .map((tag_id) => {
  //         return {
  //           product_id: req.params.id,
  //           tag_id,
  //         };
  //       });
  //     // figure out which ones to remove
  //     const productTagsToRemove = productTags
  //       .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
  //       .map(({ id }) => id);

  //     // run both actions
  //     return Promise.all([
  //       ProductTag.destroy({ where: { id: productTagsToRemove } }),
  //       ProductTag.bulkCreate(newProductTags),
  //     ]);
  //   })
  //   .then((updatedProductTags) => res.json(updatedProductTags))
  //   .catch((err) => {
  //     // console.log(err);
  //     res.status(400).json(err);
  //   });
  try {
    const updatedProduct = await Product.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updatedProduct[0]) return res.status(404).json('Product Was not Found or Same Product Values')
    if (req.body.tagIds && req.body.tagIds.length) {
      // Destroy all Old Tags
      await ProductTag.destroy({ where: { product_id: req.params.id } });
      // Create the new Tags
      const productTagIdArr = req.body.tagIds.map(tagId => {
        return {
          product_id: req.params.id,
          tag_id: tagId
        }
      });
      await ProductTag.bulkCreate(productTagIdArr);
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json(`Error Ocurred: ${error.message}`);
  }
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const productToDelete = await Product.destroy({ where: { id: req.params.id } });
    if (!productToDelete) return res.status(404).json("Product Was not Found");
    res.json(productToDelete);
  } catch (error) {
    res.status(500).json(`Error Ocurred: ${error.message}`);
  }
});

module.exports = router;
