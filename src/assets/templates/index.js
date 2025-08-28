// src/templates/registry.js
import sleek from './sleek';
import modern from './modern';
import classic from './classic';
import celestial from './celestial'; // <-- Import the new template

const registry = { sleek, modern, classic, celestial }; // <-- Add it to the registry

export function renderTemplate({ templateId, docType, profile, body }) {
  const tpl = registry[templateId] || registry.sleek;
  return tpl({ docType, profile, body });
}

export { registry };