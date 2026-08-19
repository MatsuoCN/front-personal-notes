// api.js — centraliza todas as chamadas HTTP para a API de notas

const API_BASE_URL = "http://localhost:3000/notes";

/**
 * Busca todas as notas.
 * @returns {Promise<Array>}
 */
async function getNotes() {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error(`Erro ao buscar notas: ${response.status}`);
  }
  return response.json();
}

/**
 * Cria uma nova nota.
 * @param {{title: string, content: string}} note
 * @returns {Promise<Object>}
 */
async function createNote(note) {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  if (!response.ok) {
    throw new Error(`Erro ao criar nota: ${response.status}`);
  }
  return response.json();
}

/**
 * Atualiza uma nota existente.
 * @param {string} id
 * @param {{title: string, content: string}} note
 * @returns {Promise<Object>}
 */
async function updateNote(id, note) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  if (!response.ok) {
    throw new Error(`Erro ao atualizar nota: ${response.status}`);
  }
  return response.json();
}

/**
 * Remove uma nota.
 * @param {string} id
 * @returns {Promise<void>}
 */
async function deleteNote(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Erro ao deletar nota: ${response.status}`);
  }
}