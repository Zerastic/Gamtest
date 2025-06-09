// js/main.js
import { initialState, loadSave, save } from './state.js';
import { render } from './ui.js';

const state = loadSave() || initialState();
let scenes = {};

async function loadData(){
  scenes = await (await fetch('data/scenes.json')).json();
  await fetch('data/characters.json');               // placeholder; expand as needed
  render(state, scenes);
}

function toggleModal(show){
  document.getElementById('settingsModal').style.display = show ? 'flex' : 'none';
}

document.getElementById('settingsBtn').onclick = () => toggleModal(true);

document.getElementById('modalClose').onclick = () => toggleModal(false);
document.getElementById('modalSave').onclick = () => { save(state); toggleModal(false); };
document.getElementById('modalLoad').onclick = () => {
  const s = loadSave();
  if(s){ Object.assign(state, s); render(state, scenes); }
  toggleModal(false);
};
document.getElementById('modalRestart').onclick = () => {
  Object.assign(state, initialState());
  render(state, scenes);
  toggleModal(false);
};
document.getElementById('modalQuit').onclick = () => location.reload();

window.addEventListener('beforeunload', ()=> save(state)); // autosave on tab close
loadData();
