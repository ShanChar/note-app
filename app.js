const notesListElement = document.getElementById('notesList');
const addNoteBtnElement = document.getElementById('addNoteBtn');
const searchInputElement = document.getElementById('searchInput');
const noteModalElement = document.getElementById('noteModal');
const modalTitleElement = document.getElementById('modalTitle');
const modalContentElement = document.getElementById('modalContent');
const saveNoteBtnElement = document.getElementById('saveNoteBtn');
const closeModalElement = document.getElementById('closeModal');

let notes = [];
let editingNoteId = null;

function fetchNotes() {
    fetch('fetch_notes.php')
        .then(response => response.json())
        .then(data => {
            notes = data;
            renderNotes();
        })
        .catch(error => console.error('Error:', error));
}

function saveNote() {
    const noteTitle = modalTitleElement.value.trim();
    const noteContent = modalContentElement.value.trim();

    if (noteTitle || noteContent) {
        const formData = new FormData();
        formData.append('title', noteTitle);
        formData.append('content', noteContent);
        if (editingNoteId !== null) {
            formData.append('id', editingNoteId);
        }

        fetch('save_note.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetchNotes();
                closeNoteModal();
            } else {
                alert('An error occurred while saving the note.');
                console.error('Error:', data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    } else {
        closeNoteModal();
    }
}

function renderNotes() {
    notesListElement.innerHTML = '';
    const filteredNotes = searchInputElement.value
        ? notes.filter(note => note.title.toLowerCase().includes(searchInputElement.value.toLowerCase()) || note.content.toLowerCase().includes(searchInputElement.value.toLowerCase()))
        : notes;

    filteredNotes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.classList.add('note');
        noteElement.innerHTML = `
        <div class="note-content">
            <h3 class="note-title">${note.title}</h3>
            <p class="note-text">${note.content.length > 200 ? `${note.content.substring(0, 200)}...` : note.content}</p>
            <button class="delete-btn">-</button>
        </div>
    `;

        const noteTitle = noteElement.querySelector('.note-title');
        const noteText = noteElement.querySelector('.note-text');
        const searchTerm = searchInputElement.value.toLowerCase();

        if (searchTerm) {
            const highlightedTitle = note.title.replace(new RegExp(searchTerm, 'gi'), `<span class="highlight">$&</span>`);
            const highlightedText = note.content.replace(new RegExp(searchTerm, 'gi'), `<span class="highlight">$&</span>`);
            noteTitle.innerHTML = highlightedTitle;
            noteText.innerHTML = highlightedText;
        }

        noteElement.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            confirmDeleteNote(note.id);
        });
        noteElement.querySelector('.note-content').addEventListener('click', () => openNoteModal(note));
        notesListElement.appendChild(noteElement);
    });
}

function openNoteModal(note = null) {
    modalTitleElement.value = note ? note.title : '';
    modalContentElement.value = note ? note.content : '';
    noteModalElement.style.display = 'flex';
    if (note) {
        editingNoteId = note.id;
    } else {
        editingNoteId = null;
    }
}

function closeNoteModal() {
        noteModalElement.style.display = 'none';
        modalTitleElement.value = '';
        modalContentElement.value = '';
        editingNoteId = null;
    }

function confirmDeleteNote(noteId) {
    if (confirm('Are you sure you want to delete this note?')) {
        fetch(`delete_note.php?id=${noteId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    fetchNotes();
                } else {
                    alert('An error occurred while deleting the note.');
                    console.error('Error:', data.error);
                }
            })
            .catch(error => console.error('Error:', error));
    }
}

addNoteBtnElement.addEventListener('click', () => openNoteModal());
saveNoteBtnElement.addEventListener('click', saveNote);
closeModalElement.addEventListener('click', closeNoteModal);
searchInputElement.addEventListener('input', renderNotes);

fetchNotes();