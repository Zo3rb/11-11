const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tags = await Tag.findAll({
      include: [Product]
    });
    res.json(tags);
  } catch (error) {
    res.status(500).json(`Error Ocurred: ${error.message}`);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tag = await Tag.findOne({
      where: { id: req.params.id },
      include: [Product]
    });
    if (!tag) return res.status(404).json('Tag Was not Found');
    res.json(tag);
  } catch (error) {
    res.status(500).json(`Error Ocurred: ${error.message}`);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const userInput = req.body.tag_name;
    if (!userInput || userInput === "") return res.status(400).json('No or Invalid Tag Name');
    const newTag = await Tag.create({ tag_name: userInput });
    res.json(newTag);
  } catch (error) {
    res.status(500).json(`Error Ocurred: ${error.message}`);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const userInput = req.body.tag_name;
    if (!userInput || userInput === "") return res.status(400).json('No or Invalid Tag Name');
    const updatedTag = await Tag.update({ tag_name: userInput }, { where: { id: req.params.id } });
    if (!updatedTag[0]) return res.status(404).json("Tag was not found or Same Data Provided");
    res.json(updatedTag);
  } catch (error) {
    res.status(500).json(`Error Ocurred: ${error.message}`);
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tagToDelete = await Tag.destroy({ where: { id: req.params.id } });
    if (!tagToDelete) return res.status(404).json("Tag Was not Found");
    res.json(tagToDelete);
  } catch (error) {
    res.status(500).json(`Error Ocurred: ${error.message}`);
  }
});

module.exports = router;
