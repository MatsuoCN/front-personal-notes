// api.js — centraliza todas as chamadas HTTP para a API (auth + notas)

const API_ROOT = "http://127.0.0.1:3000/api";
const AUTH_URL = `${API_ROOT}/auth`;
const NOTAS_URL = `${API_ROOT}/notas`;

/**
 * Recupera o token JWT salvo localmente (após login).
 * @returns {string|null}
 */
function getToken() {
  return localStorage.getItem("token");
}

/**
 * Monta os headers padrão, incluindo Authorization quando há token.
 */
function authHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Faz login e retorna o token (não salva sozinho — quem chama decide salvar).
 * @param {{email: string, senha: string}} credentials
 */
async function login({ email, senha }) {
  const response = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Erro ao fazer login");
  }
  return data.token;
}

/**
 * Registra um novo usuário.
 * @param {{nome: string, email: string, senha: string}} userData
 */
async function register({ nome, email, senha }) {
  const response = await fetch(`${AUTH_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Erro ao registrar usuário");
  }
  return data;
}

/**
 * Busca todas as notas do usuário autenticado.
 * @returns {Promise<Array>}
 */
async function getNotes() {
  const response = await fetch(NOTAS_URL, {
    headers: authHeaders(),
  });
  if (response.status === 401) throw new AuthError();
  if (!response.ok) {
    throw new Error(`Erro ao buscar notas: ${response.status}`);
  }
  return response.json();
}

/**
 * Cria uma nova nota.
 * @param {{titulo: string, conteudo: string}} note
 */
async function createNote(note) {
  const response = await fetch(NOTAS_URL, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(note),
  });
  if (response.status === 401) throw new AuthError();
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Erro ao criar nota");
  }
  return data.nota;
}

/**
 * Atualiza uma nota existente.
 * @param {string} id
 * @param {{titulo: string, conteudo: string}} note
 */
async function updateNote(id, note) {
  const response = await fetch(`${NOTAS_URL}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(note),
  });
  if (response.status === 401) throw new AuthError();
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Erro ao atualizar nota");
  }
  return data.nota;
}

/**
 * Remove uma nota.
 * @param {string} id
 */
async function deleteNote(id) {
  const response = await fetch(`${NOTAS_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (response.status === 401) throw new AuthError();
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Erro ao deletar nota");
  }
}

/**
 * Erro específico para sessão expirada/token inválido (401).
 */
class AuthError extends Error {
  constructor() {
    super("Sessão expirada. Faça login novamente.");
    this.name = "AuthError";
  }
}