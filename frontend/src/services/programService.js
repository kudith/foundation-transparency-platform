import programsData from "../data/programs.json";

/**
 * Simulate API delay
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get all programs
 * @returns {Promise<Array>} List of programs
 */
export const getAllPrograms = async () => {
  await delay(500); // Simulate network delay
  return programsData.programs;
};

/**
 * Get program by ID
 * @param {number} id - Program ID
 * @returns {Promise<Object|null>} Program object or null
 */
export const getProgramById = async (id) => {
  await delay(300);
  const program = programsData.programs.find((p) => p.id === parseInt(id));
  return program || null;
};

/**
 * Get programs by category
 * @param {string} category - Program category
 * @returns {Promise<Array>} Filtered programs
 */
export const getProgramsByCategory = async (category) => {
  await delay(400);
  return programsData.programs.filter((p) => p.category === category);
};

/**
 * Get programs by status
 * @param {string} status - Program status
 * @returns {Promise<Array>} Filtered programs
 */
export const getProgramsByStatus = async (status) => {
  await delay(400);
  return programsData.programs.filter((p) => p.status === status);
};

/**
 * Get program statistics
 * @returns {Promise<Object>} Statistics object
 */
export const getProgramStatistics = async () => {
  await delay(200);
  return programsData.statistics;
};

/**
 * Search programs by keyword
 * @param {string} keyword - Search keyword
 * @returns {Promise<Array>} Matching programs
 */
export const searchPrograms = async (keyword) => {
  await delay(400);
  const lowerKeyword = keyword.toLowerCase();
  return programsData.programs.filter(
    (p) =>
      p.title.toLowerCase().includes(lowerKeyword) ||
      p.description.toLowerCase().includes(lowerKeyword) ||
      p.category.toLowerCase().includes(lowerKeyword)
  );
};

// When ready to connect to backend, replace above functions with:
/*
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const getAllPrograms = async () => {
  const response = await fetch(`${API_BASE_URL}/programs`);
  if (!response.ok) throw new Error('Failed to fetch programs');
  return response.json();
};

export const getProgramById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/programs/${id}`);
  if (!response.ok) throw new Error('Failed to fetch program');
  return response.json();
};

// ... and so on for other functions
*/
