// render.js — funções responsáveis por manipular o DOM

const notesListEl = document.getElementById("notes-list");
const emptyStateEl = document.getElementById("empty-state");

/**
 * Renderiza a lista completa de notas.
 * @param {Array} notes - notas vindas da API (cada uma com _id, title, content)
 * @param {{onEdit: Function, onDelete: Function}} handlers
 */
function renderNotes(notes, { onEdit, onDelete }) {
  // Limpa apenas os cards, mantendo o empty-state no DOM
  notesListEl.querySelectorAll(".note-card").forEach((el) => el.remove());

  if (!notes || notes.length === 0) {
    emptyStateEl.style.display = "block";
    return;
  }

  emptyStateEl.style.display = "none";

  notes.forEach((note) => {
    const card = document.createElement("div");
    card.className = "note-card";
    card.dataset.id = note._id;

    const title = document.createElement("h3");
    title.textContent = note.title;

    const content = document.createElement("p");
    content.textContent = note.content || "";

    const actions = document.createElement("div");
    actions.className = "note-actions";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Editar";
    editBtn.addEventListener("click", () => onEdit(note));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Excluir";
    deleteBtn.className = "delete";
    deleteBtn.addEventListener("click", () => onDelete(note._id));

    actions.append(editBtn, deleteBtn);
    card.append(title, content, actions);
    notesListEl.appendChild(card);
  });
}

/**
 * Abre o modal, opcionalmente preenchido com os dados de uma nota (edição).
 * @param {Object|null} note
 */
function openModal(note = null) {
  const modal = document.getElementById("note-modal");
  const modalTitle = document.getElementById("modal-title");
  const idInput = document.getElementById("note-id");
  const titleInput = document.getElementById("note-title");
  const contentInput = document.getElementById("note-content");

  if (note) {
    modalTitle.textContent = "Editar nota";
    idInput.value = note._id;
    titleInput.value = note.title;
    contentInput.value = note.content || "";
  } else {
    modalTitle.textContent = "Nova nota";
    idInput.value = "";
    titleInput.value = "";
    contentInput.value = "";
  }

  modal.classList.remove("hidden");
  titleInput.focus();
}

function closeModal() {
  document.getElementById("note-modal").classList.add("hidden");
}