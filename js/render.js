// render.js — funções responsáveis por manipular o DOM

const notesListEl = document.getElementById("notes-list");
const emptyStateEl = document.getElementById("empty-state");

/**
 * Converte uma data ISO (ex: note.createdAt) em texto relativo, tipo "há 2 dias".
 * @param {string} isoDate
 * @returns {string}
 */
function formatRelativeTime(isoDate) {
  if (!isoDate) return "";

  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "agora mesmo";
  if (diffMinutes < 60) return `há ${diffMinutes} min`;
  if (diffHours < 24) return `há ${diffHours}h`;
  if (diffDays === 1) return "há 1 dia";
  if (diffDays < 30) return `há ${diffDays} dias`;

  return new Date(isoDate).toLocaleDateString("pt-BR");
}

/**
 * Renderiza a lista completa de notas.
 * @param {Array} notes - notas vindas da API (cada uma com _id, titulo, conteudo)
 * @param {{onEdit: Function, onDelete: Function}} handlers
 */
function renderNotes(notes, { onEdit, onDelete }) {
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
    title.textContent = note.titulo;

    const content = document.createElement("p");
    content.textContent = note.conteudo || "";

    const date = document.createElement("span");
    date.className = "note-date";
    date.textContent = formatRelativeTime(note.createdAt);

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
    card.append(title, content, date, actions);
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
  const tituloInput = document.getElementById("note-titulo");
  const conteudoInput = document.getElementById("note-conteudo");

  if (note) {
    modalTitle.textContent = "Editar nota";
    idInput.value = note._id;
    tituloInput.value = note.titulo;
    conteudoInput.value = note.conteudo || "";
  } else {
    modalTitle.textContent = "Nova nota";
    idInput.value = "";
    tituloInput.value = "";
    conteudoInput.value = "";
  }

  modal.classList.remove("hidden");
  tituloInput.focus();
}

function closeModal() {
  document.getElementById("note-modal").classList.add("hidden");
}

/**
 * Alterna entre as telas de login, registro e app principal.
 * @param {"login"|"register"|"app"} screen
 */
function showScreen(screen) {
  document.getElementById("login-screen").classList.toggle("hidden", screen !== "login");
  document.getElementById("register-screen").classList.toggle("hidden", screen !== "register");
  document.getElementById("app").classList.toggle("hidden", screen !== "app");
}

/**
 * Exibe uma mensagem de erro em um elemento específico.
 */
function showAuthError(elementId, message) {
  const el = document.getElementById(elementId);
  el.textContent = message;
}