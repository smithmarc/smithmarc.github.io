const notesContainer = document.querySelector('.notes');
const form = document.querySelector('form');
const titleInput = document.querySelector('#title');
const contentInput = document.querySelector('#content');
let noteCount = 0;

// Load notes from localStorage
const notes = JSON.parse(localStorage.getItem('notes')) || [];

// Render notes to the page
notes.forEach(noteData => {
  const note = createNoteElement(noteData);
  notesContainer.appendChild(note);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Create new note
  const noteData = {
    id: Date.now(),
    title: titleInput.value,
    content: contentInput.value,
    timestamp: new Date().toISOString(),
  };

  const note = createNoteElement(noteData);
  notesContainer.insertBefore(note, notesContainer.firstChild);

  // Add note data to notes array
  notes.unshift(noteData);

  // Save notes to localStorage
  localStorage.setItem('notes', JSON.stringify(notes));

  // Clear form inputs
  titleInput.value = '';
  contentInput.value = '';
});

function createNoteElement(noteData) {
  const note = document.createElement('div');
  note.classList.add('note');
  noteCount++;

  const noteTitle = document.createElement('h2');
  noteTitle.classList.add('note-title');
  noteTitle.innerText = noteData.title;

  const noteTimestamp = document.createElement('div');
  noteTimestamp.classList.add('note-timestamp');
  noteTimestamp.innerText = formatDate(new Date(noteData.timestamp));
  noteTitle.appendChild(noteTimestamp);

  note.appendChild(noteTitle);

  const noteContent = document.createElement('p');
  noteContent.classList.add('note-content');
  noteContent.innerText = noteData.content;
  note.appendChild(noteContent);

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('note-delete');
  deleteButton.innerHTML = '<i class="icon-trash icon-large"></i>';
  deleteButton.addEventListener('click', () => {
  note.remove();

    // Remove note data from notes array
    notes = notes.filter(n => n.id !== noteData.id);

    // Save notes to localStorage
    localStorage.setItem('notes', JSON.stringify(notes));

    // Delete note from localStorage
    const index = notes.findIndex(n => n.id === noteData.id);
    if (index !== -1) {
      notes.splice(index, 1);
      localStorage.setItem('notes', JSON.stringify(notes));
    }
  });

  note.appendChild(deleteButton);

  return note;
}

function formatDate(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${formattedHours}:${minutes} ${ampm}`;
}
