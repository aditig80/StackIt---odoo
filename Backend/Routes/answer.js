const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const { auth } = require('../middleware/auth');

// Add answer
router.post('/:id', auth, async (req, res) => {
  const q = await Question.findById(req.params.id);
  if (!q) return res.status(404).json({ msg: 'Question not found' });

  const answer = {
    text: req.body.text,
    postedBy: req.user.username
  };

  q.answers.push(answer);
  await q.save();
  res.status(201).json(q);
});

// Accept answer
router.patch('/:id/accept/:index', auth, async (req, res) => {
  const q = await Question.findById(req.params.id);
  if (!q) return res.status(404).json({ msg: 'Not found' });

  q.answers.forEach((a, i) => a.accepted = i == req.params.index);
  await q.save();
  res.json(q);
});

// Vote answer
router.patch('/:id/vote/:index', auth, async (req, res) => {
  const { vote } = req.body; // +1 or -1
  const q = await Question.findById(req.params.id);
  if (!q) return res.status(404).json({ msg: 'Not found' });

  if (vote === 1) q.answers[req.params.index].upvotes++;
  else if (vote === -1) q.answers[req.params.index].downvotes++;

  await q.save();
  res.json(q);
});

module.exports = router;
