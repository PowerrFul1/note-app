const notesContainer = document.querySelector('.notes-container');
const createBtn = document.querySelector('.btn');

function updateStorage() {
    localStorage.setItem('notes', notesContainer.innerHTML);
}

function createNoteElement(initialHtml = '') {
    const p = document.createElement('p');
    p.className = 'input-box';
    p.setAttribute('contenteditable', 'true');
    p.innerHTML = initialHtml || ''; 

   
    let img = p.querySelector('img.delete-btn');
    if (!img) {
        img = document.createElement('img');
        img.className = 'delete-btn';
        img.src = 'images/delete.png';
        img.alt = 'Delete note';
        p.appendChild(img);
    }

  
    p.addEventListener('input', updateStorage);

    
    p.addEventListener('click', () => p.focus());

    return p;
}

function ensureAllNotesHaveDelete() {
    const notes = notesContainer.querySelectorAll('.input-box');
    notes.forEach(note => {
        if (!note.querySelector('img.delete-btn')) {
            const img = document.createElement('img');
            img.className = 'delete-btn';
            img.src = 'images/delete.png';
            img.alt = 'Delete note';
            note.appendChild(img);
        }
        if (!note._hasInputListener) {
            note.addEventListener('input', updateStorage);
            note._hasInputListener = true;
        }
        note.setAttribute('contenteditable', 'true');
    });
}

function showNotes() {
    notesContainer.innerHTML = localStorage.getItem('notes') || '';
    ensureAllNotesHaveDelete();
}

showNotes();

createBtn.addEventListener('click', () => {
    const newNote = createNoteElement('');
    notesContainer.appendChild(newNote);
    newNote.focus();
    updateStorage();
});

notesContainer.addEventListener('click', (e) => {
    const del = e.target.closest('img.delete-btn');
    if (del) {
        const note = del.closest('.input-box');
        if (note) {
            note.remove();
            updateStorage();
        }
        return;
    }
    const note = e.target.closest('.input-box');
    if (note) note.focus();
});

document.addEventListener('keydown', (event) => {
    const note = event.target.closest && event.target.closest('.input-box');
    if (!note) return;
    if (event.key === 'Enter') {
        document.execCommand('insertLineBreak');
        event.preventDefault();
        updateStorage();
    }
});

const mo = new MutationObserver(() => {
    ensureAllNotesHaveDelete();
    updateStorage();
});
mo.observe(notesContainer, { childList: true, subtree: true });
