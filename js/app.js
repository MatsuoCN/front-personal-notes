// app.js — orquestra eventos, estado e liga api.js + render.js

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const noteForm = document.getElementById("note-form");
const btnNewNote = document.getElementById("btn-new-note");
const btnCancel = document.getElementById("btn-cancel");
const btnLogout = document.getElementById("btn-logout");

// ---------- Autenticação ----------

document.getElementById("show-register").addEventListener("click", (e) => {
  e.preventDefault();
  showScreen("register");
});

document.getElementById("show-login").addEventListener("click", (e) => {
  e.preventDefault();
  showScreen("login");
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  showAuthError("login-error", "");

  const email = document.getElementById("login-email").value.trim();
  const senha = document.getElementById("login-senha").value;

  try {
    const token = await login({ email, senha });
    localStorage.setItem("token", token);
    await enterApp();
  } catch (error) {
    showAuthError("login-error", error.message);
  }
});

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  showAuthError("register-error", "");

  const nome = document.getElementById("register-nome").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const senha = document.getElementById("register-senha").value;

  try {
    await register({ nome, email, senha });
    showScreen("login");
    document.getElementById("login-email").value = email;
  } catch (error) {
    showAuthError("register-error", error.message);
  }
});

btnLogout.addEventListener("click", () => {
  localStorage.removeItem("token");
  showScreen("login");
});

/**
 * Entra no app principal e carrega as notas.
 */
async function enterApp() {
  showScreen("app");
  await loadNotes();
}

// ---------- Notas ----------

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
    handleAuthOrError(error, "Não foi possível carregar as notas.");
  }
}

/**
 * Trata a submissão do formulário (criação ou edição).
 */
async function handleSubmit(event) {
  event.preventDefault();

  const id = document.getElementById("note-id").value;
  const titulo = document.getElementById("note-titulo").value.trim();
  const conteudo = document.getElementById("note-conteudo").value.trim();

  if (!titulo) return;

  try {
    if (id) {
      await updateNote(id, { titulo, conteudo });
    } else {
      await createNote({ titulo, conteudo });
    }
    closeModal();
    await loadNotes();
  } catch (error) {
    handleAuthOrError(error, "Não foi possível salvar a nota.");
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
    handleAuthOrError(error, "Não foi possível excluir a nota.");
  }
}

/**
 * Centraliza o tratamento de erros: se for token expirado/inválido,
 * volta pra tela de login. Senão, mostra alerta genérico.
 */
function handleAuthOrError(error, fallbackMessage) {
  console.error(error);
  if (error.name === "AuthError") {
    localStorage.removeItem("token");
    showScreen("login");
    showAuthError("login-error", error.message);
  } else {
    alert(fallbackMessage);
  }
}

// Event listeners do app principal
btnNewNote.addEventListener("click", () => openModal());
btnCancel.addEventListener("click", closeModal);
noteForm.addEventListener("submit", handleSubmit);

document.getElementById("note-modal").addEventListener("click", (event) => {
  if (event.target.id === "note-modal") closeModal();
});

// ---------- Inicialização ----------

// Se já existe um token salvo, tenta entrar direto no app.
if (getToken()) {
  enterApp();
} else {
  showScreen("login");
}