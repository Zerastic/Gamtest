// js/main.js
import { initialState, loadSave, save, SAVE_KEY } from './state.js';
import { render } from './ui.js';

const state = loadSave() || initialState();
let scenes = {};

async function loadData(){
  scenes = await (await fetch('data/scenes.json')).json();
  await fetch('data/characters.json');               // placeholder; expand as needed
  render(state, scenes);
}

document.getElementById('settingsBtn').onclick = () =>{
  if(confirm('Save game?')) save(state);
};

window.addEventListener('beforeunload', ()=> save(state)); // autosave on tab close
loadData();
