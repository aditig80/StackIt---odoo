// Initialize Quill Rich Text Editor
const quill = new Quill('#editor', {
  theme: 'snow',
  placeholder: 'Write your question details here...',
  modules: {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['link', 'image'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['clean']
    ]
  }
});

// Form submit handler
document.getElementById('askForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const description = quill.root.innerHTML;
  const tagsSelect = document.getElementById('tags');
  const tags = Array.from(tagsSelect.selectedOptions).map(option => option.value);

  if (!title || !description || tags.length === 0) {
    document.getElementById('status').innerText = "Please fill all fields.";
    return;
  }

  // Save mock question to localStorage (simulate DB)
  const oldData = JSON.parse(localStorage.getItem('questions') || '[]');
  const newQuestion = {
    id: Date.now().toString(),
    title,
    description,
    tags,
    answers: []
  };

  localStorage.setItem('questions', JSON.stringify([newQuestion, ...oldData]));
  document.getElementById('status').innerText = "✅ Question posted! Go to homepage to view it.";
  this.reset();
  quill.setText('');
});
