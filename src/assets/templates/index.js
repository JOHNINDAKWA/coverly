import sleek from './sleek';
import genius from './genius';
import modern from './modern';
import classic from './classic';
import celestial from './celestial';
import innova from './innova'; 
import aurora from './aurora'; 
import folio from './folio'; 

const registry = { sleek, modern, classic, celestial, innova, genius, aurora, folio };

export function renderTemplate({ templateId, docType, profile, body }) {
  const tpl = registry[templateId] || registry.sleek;
  return tpl({ docType, profile, body });
}

export { registry };
