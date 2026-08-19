// app.js — orquestra eventos, estado e liga api.js + render.js

const noteForm = document.getElementById("note-form");
const btnNewNote = document.getElementById("btn-new-note");
const btnCancel = document.getElementById("btn-cancel");

/**
 * Recarrega a lista de notas a partir da API e renderiza na tela.
 */
async function loadNotes() {
  try {
    const notes = await getNotes();
    renderNotes(notes, {
      onEdit: (note) => openModal(note),
      onDelete: handleDelete,
    });
  } catch (error) {
    console.error(error);
    alert("Não foi possível carregar as notas. A API está rodando?");
  }
}

/**
 * Trata a submissão do formulário (criação ou edição).
 */
async function handleSubmit(event) {
  event.preventDefault();

  const id = document.getElementById("note-id").value;
  const title = document.getElementById("note-title").value.trim();
  const content = document.getElementById("note-content").value.trim();

  if (!title) return;

  try {
    if (id) {
      await updateNote(id, { title, content });
    } else {
      await createNote({ title, content });
    }
    closeModal();
    await loadNotes();
  } catch (error) {
    console.error(error);
    alert("Não foi possível salvar a nota.");
  }
}

/**
 * Trata a exclusão de uma nota, com confirmação simples.
 */
async function handleDelete(id) {
  const confirmed = confirm("Tem certeza que deseja excluir esta nota?");
  if (!confirmed) return;

  try {
    await deleteNote(id);
    await loadNotes();
  } catch (error) {
    console.error(error);
    alert("Não foi possível excluir a nota.");
  }
}

// Event listeners
btnNewNote.addEventListener("click", () => openModal());
btnCancel.addEventListener("click", closeModal);
noteForm.addEventListener("submit", handleSubmit);

// Fecha o modal clicando fora do conteúdo
document.getElementById("note-modal").addEventListener("click", (event) => {
  if (event.target.id === "note-modal") closeModal();
});

// Carrega as notas ao iniciar
loadNotes();