import { getCurrentUser } from './auth.js';

const questions = JSON.parse(localStorage.getItem('questions') || '[]');
const listEl = document.getElementById('questionList');

const searchInput = document.getElementById('searchInput');
const tagCheckboxes = document.querySelectorAll('.tag-filters input[type="checkbox"]');

searchInput.addEventListener('input', filterQuestions);
tagCheckboxes.forEach(cb => cb.addEventListener('change', filterQuestions));

function filterQuestions() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedTags = Array.from(tagCheckboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  const filtered = questions.filter(q => {
    const titleMatch = q.title.toLowerCase().includes(searchTerm);
    const descMatch = q.description.toLowerCase().includes(searchTerm);
    const tagMatch = selectedTags.length === 0 || q.tags.some(tag => selectedTags.includes(tag));

    return (titleMatch || descMatch) && tagMatch;
  });

  renderQuestions(filtered);
}

function renderQuestions(arr) {
  const me = getCurrentUser();
  
  if (arr.length === 0) {
    listEl.innerHTML = "<p>No matching questions found.</p>";
    return;
  }

  listEl.innerHTML = arr.map(q => `
    <div class="question-card">
      <a href="question.html?id=${q.id}"><h3>${q.title}</h3></a>
      <div class="tags">${q.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}</div>
      ${me?.role === 'Admin' ? `<button onclick="deleteQuestion('${q.id}')">🗑 Delete</button>` : ''}
    </div>
  `).join('');
}
window.deleteQuestion = function (id) {
  if (!confirm("Are you sure you want to delete this question?")) return;

  const updated = questions.filter(q => q.id !== id);
  localStorage.setItem('questions', JSON.stringify(updated));
  location.reload();
};


// Initial render
renderQuestions(questions);
