const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const { auth, isAdmin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  const questions = await Question.find().sort({ createdAt: -1 });
  res.json(questions);
});

router.get('/:id', async (req, res) => {
  const question = await Question.findById(req.params.id);
  if (!question) return res.status(404).json({ msg: 'Not found' });
  res.json(question);
});

router.post('/', auth, async (req, res) => {
  const { title, description, tags } = req.body;
  const question = new Question({
    title,
    description,
    tags,
    author: req.user.username
  });
  await question.save();
  res.status(201).json(question);
});

router.delete('/:id', auth, isAdmin, async (req, res) => {
  const q = await Question.findByIdAndDelete(req.params.id);
  if (!q) return res.status(404).json({ msg: 'Not found' });
  res.json({ msg: 'Deleted' });
});

module.exports = router;