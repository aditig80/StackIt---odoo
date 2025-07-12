import { getCurrentUser } from './auth.js';
function submitAnswer() {
  const me = getCurrentUser();
  if (!me) { alert('Login to answer'); window.location.href = 'login.html'; return; }
}
const me = getCurrentUser();
if (!me) return alert('Please login to answer.');

const newAnswer = {
  text: answerText,
  upvotes: 0,
  downvotes: 0,
  accepted: false
};

question.answers.push(newAnswer);

// Trigger notification to question owner
const allNotifs = JSON.parse(localStorage.getItem('stackit_notifications') || '[]');
allNotifs.push({
  id: Date.now(),
  to: question.author || "admin", // fallback
  message: `${me.username} answered your question.`,
  read: false
});
localStorage.setItem('stackit_notifications', JSON.stringify(allNotifs));
const mentionMatch = answerText.match(/@(\w+)/);
if (mentionMatch) {
  const mentionedUser = mentionMatch[1];
  allNotifs.push({
    id: Date.now() + 1,
    to: mentionedUser,
    message: `${me.username} mentioned you in an answer.`,
    read: false
  });
}


// Get query param from URL
const urlParams = new URLSearchParams(window.location.search);
const questionId = urlParams.get('id');

const questionContainer = document.getElementById('question-container');
const questions = JSON.parse(localStorage.getItem('questions') || '[]');
const question = questions.find(q => q.id === questionId);

if (!question) {
  questionContainer.innerHTML = `<p>❌ Question not found.</p>`;
} else {
  renderQuestion(question);
}

function renderAnswer(answer, index) {
  const me = getCurrentUser();
  const deleteBtn = me?.role === 'Admin'
    ? `<button onclick="deleteAnswer(${index})">🗑 Delete</button>` : '';

  return `
    <div class="answer-card">
      <div class="answer-body">${answer.text}</div>
      <div class="answer-actions">
        <button onclick="vote(${index}, 1)">👍 ${answer.upvotes || 0}</button>
        <button onclick="vote(${index}, -1)">👎 ${answer.downvotes || 0}</button>
        <button onclick="accept(${index})" ${answer.accepted ? 'style="color:green;"' : ''}>
          ✅ ${answer.accepted ? 'Accepted' : 'Accept Answer'}
        </button>
        ${deleteBtn}
      </div>
    </div>
  `;
}
window.deleteAnswer = function (index) {
  if (!confirm("Delete this answer?")) return;
  question.answers.splice(index, 1);

  const updated = questions.map(q => q.id === questionId ? question : q);
  localStorage.setItem('questions', JSON.stringify(updated));
  location.reload();
};


function renderAnswer(answer, index) {
  return `
    <div class="answer-card">
      <div class="answer-body">${answer.text}</div>
      <div class="answer-actions">
        <button onclick="vote(${index}, 1)">👍 ${answer.upvotes || 0}</button>
        <button onclick="vote(${index}, -1)">👎 ${answer.downvotes || 0}</button>
        <button onclick="accept(${index})" ${answer.accepted ? 'style="color:green;"' : ''}>
          ✅ ${answer.accepted ? 'Accepted' : 'Accept Answer'}
        </button>
      </div>
    </div>
  `;
}

let quill;
function initEditor() {
  quill = new Quill('#editor', {
    theme: 'snow',
    placeholder: 'Write your answer here...',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['link', 'image'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['clean']
      ]
    }
  });
}

function submitAnswer() {
  const answerText = quill.root.innerHTML;
  if (answerText.trim() === "<p><br></p>") {
    document.getElementById('status').innerText = "Please write an answer.";
    return;
  }

  const newAnswer = {
    text: answerText,
    upvotes: 0,
    downvotes: 0,
    accepted: false
  };

  question.answers.push(newAnswer);
  const updated = questions.map(q => q.id === questionId ? question : q);
  localStorage.setItem('questions', JSON.stringify(updated));
  location.reload();
}

function vote(index, change) {
  const a = question.answers[index];
  if (change === 1) a.upvotes = (a.upvotes || 0) + 1;
  else a.downvotes = (a.downvotes || 0) + 1;

  const updated = questions.map(q => q.id === questionId ? question : q);
  localStorage.setItem('questions', JSON.stringify(updated));
  location.reload();
}

function accept(index) {
  question.answers.forEach(a => a.accepted = false);
  question.answers[index].accepted = true;

  const updated = questions.map(q => q.id === questionId ? question : q);
  localStorage.setItem('questions', JSON.stringify(updated));
  location.reload();
}
