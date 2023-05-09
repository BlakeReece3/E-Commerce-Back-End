const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [
        {
          model: Product,
          through: ProductTag,
          as: 'products',
        },
      ],
    });
    res.status(200).json(tagData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: Product,
          through: ProductTag,
        },
      ],
    });
    if (!tagData) {
      res.status(404).json({ message: `No tag found with id ${req.params.id}` });
      return;
    }
    res.json(tagData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const newTag = await Tag.create(req.body);
    res.status(200).json(newTag);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedTag = await Tag.update(
      { tag_name: req.body.tag_name },
      { where: { id: req.params.id } }
    );
    res.json(updatedTag);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);

    if (!tag) {
      return res.status(404).json({ message: 'No tag found' });
    }

    await ProductTag.destroy({ where: { tag_id: tag.id } });

    await tag.destroy();

    res.json({ message: 'Tag deleted!' });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
