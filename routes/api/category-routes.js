const router = require('express').Router();
const { Category, Product, Tag } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categories = await Category.findAll({
      include: [Product]
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json(`Error Ocurred: ${error.message}`);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const category = await Category.findOne({
      where: { id: req.params.id },
      include: [Product]
    });
    if (!category) return res.status(404).json('Category Was not Found');
    res.json(category);
  } catch (error) {
    res.status(500).json(`Error Ocurred: ${error.message}`);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const category_input = req.body.category_name;
    if (!category_input || category_input === "") return res.status(400).json("Invalid Category Name");
    const newCategory = await Category.create({ category_name: category_input });
    res.json(newCategory);
  } catch (error) {
    res.status(500).json(`Error Ocurred: ${error.message}`);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const category_input = req.body.category_name;
    if (!category_input || category_input === "") return res.status(400).json("Invalid Category Name");
    const updatedCategory = await Category.update({ category_name: category_input }, {
      where: {
        id: req.params.id
      }
    });
    if (!updatedCategory[0]) return res.status(404).json('Category Was not Found or Same Category Name');
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json(`Error Ocurred: ${error.message}`);
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const categoryToDelete = await Category.destroy({
      where: { id: req.params.id }
    });
    if (!categoryToDelete) return res.json('Category Was not Found');
    res.json(categoryToDelete);
  } catch (error) {
    res.status(500).json(`Error Ocurred: ${error.message}`);
  }
});

module.exports = router;
