let notesContainer = document.querySelector('.notes');
let form = document.querySelector('form');
let titleInput = document.querySelector('#title');
let noteCount = 0;
const exportBtn = document.getElementById('export-btn');

// Load notes from localStorage
let notes = JSON.parse(localStorage.getItem('notes')) || [];

// Render notes to the page
notes.forEach(noteData => {
  const note = createNoteElement(noteData);
  notesContainer.appendChild(note);
});

// Initialize Quill editor
let quill = new Quill('#content', {
  theme: 'snow'
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Create new note
  const noteData = {
    id: Date.now(),
    title: titleInput.value,
    content: quill.root.innerHTML,
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
  quill.setText('');
});

exportBtn.addEventListener('click', () => {
  // Create CSV string
  let csv = 'Title,Content,Timestamp\n';
  notes.forEach(note => {
    csv += `${note.title},${note.content},${note.timestamp}\n`;
  });

  // Download CSV file
  const downloadLink = document.createElement('a');
  downloadLink.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
  downloadLink.setAttribute('download', 'notes.csv');
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
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

  const noteContent = document.createElement('div');
  noteContent.classList.add('note-content');
  note.appendChild(noteContent);

  const editor = document.createElement('div');
  editor.classList.add('editor');
  noteContent.appendChild(editor);

  const toolbar = document.createElement('div');
  toolbar.classList.add('toolbar');
  editor.appendChild(toolbar);

  const qlBold = document.createElement('button');
  qlBold.classList.add('ql-bold');
  qlBold.innerText = 'B';
  toolbar.appendChild(qlBold);

  const qlItalic = document.createElement('button');
  qlItalic.classList.add('ql-italic');
  qlItalic.innerText = 'I';
  toolbar.appendChild(qlItalic);

  const qlUnderline = document.createElement('button');
  qlUnderline.classList.add('ql-underline');
  qlUnderline.innerText = 'U';
  toolbar.appendChild(qlUnderline);

  const qlStrike = document.createElement('button');
  qlStrike.classList.add('ql-strike');
  qlStrike.innerText = 'S';
  toolbar.appendChild(qlStrike);

  const qlList = document.createElement('button');
  qlList.classList.add('ql-list');
  qlList.innerHTML = '<i class="icon-list"></i>';
  toolbar.appendChild(qlList);

  const qlLink = document.createElement('button');
  qlLink.classList.add('ql-link');
  qlLink.innerHTML = 'L';
  toolbar.appendChild(qlLink);
  
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
