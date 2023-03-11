const notesContainer = document.querySelector('.notes');
const form = document.querySelector('form');
const titleInput = document.querySelector('#title');
const contentInput = document.querySelector('#content');
let noteCount = 0;

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Create new note
  const note = document.createElement('div');
  note.classList.add('note');
  noteCount++;

  const noteTitle = document.createElement('h2');
  noteTitle.classList.add('note-title');
  noteTitle.innerText = titleInput.value;

  const noteTimestamp = document.createElement('div');
  noteTimestamp.classList.add('note-timestamp');
  noteTimestamp.innerText = formatDate(new Date());
  noteTitle.appendChild(noteTimestamp);

  note.appendChild(noteTitle);

  const noteContent = document.createElement('p');
  noteContent.classList.add('note-content');
  noteContent.innerText = contentInput.value;
  note.appendChild(noteContent);

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('note-delete');
  deleteButton.innerHTML = '<i class="icon-trash icon-large"></i>';
  deleteButton.addEventListener('click', () => {
    note.remove();
    noteCount--;
  });
  note.appendChild(deleteButton);

  // Insert note at the top of other notes
  notesContainer.insertBefore(note, notesContainer.firstChild);

  // Clear form inputs
  titleInput.value = '';
  contentInput.value = '';
});

function formatDate(date) {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
