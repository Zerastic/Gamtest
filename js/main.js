// js/main.js
import { initialState, loadSave, save } from './state.js';
import { render } from './ui.js';

const state = loadSave() || initialState();
let scenes = {};
let characters = {};
let items = {};
let metadata = {};

async function loadData(){
  scenes = await (await fetch('data/scenes.json')).json();
  characters = await (await fetch('data/characters.json')).json();
  metadata = await (await fetch('data/metadata.json')).json();
  items = await (await fetch('data/items.json')).json();
  render(state, scenes, characters, items, metadata);
}

function toggleModal(show){
  document.getElementById('settingsModal').style.display = show ? 'flex' : 'none';
}

document.getElementById('settingsBtn').onclick = () => toggleModal(true);

document.getElementById('modalClose').onclick = () => toggleModal(false);
document.getElementById('modalSave').onclick = () => { save(state); toggleModal(false); };
document.getElementById('modalLoad').onclick = () => {
  const s = loadSave();
  if(s){ Object.assign(state, s); render(state, scenes, characters, items, metadata); }
  toggleModal(false);
};
document.getElementById('modalRestart').onclick = () => {
  Object.assign(state, initialState());
  render(state, scenes, characters, items, metadata);
  toggleModal(false);
};
document.getElementById('modalQuit').onclick = () => location.reload();

document.getElementById('actionSave').onclick = () => save(state);
document.getElementById('actionLoad').onclick = () => {
  const s = loadSave();
  if(s){ Object.assign(state, s); render(state, scenes, characters, items, metadata); }
};
document.getElementById('actionSettings').onclick = () => toggleModal(true);

document.getElementById('toggleSidebar').onclick = () => {
  document.body.classList.toggle('sidebar-closed');
};

window.addEventListener('beforeunload', ()=> save(state)); // autosave on tab close
loadData();
