// js/main.js
import { initialState, loadSave, save } from './state.js';
import { render } from './ui.js';

const state = loadSave() || initialState();
let scenes = {};
let characters = {};
let items = {};
let metadata = {};
const actions = {
  train(state){
    state.stats.xp += 10;
    state.flags.hasKey = true;
  },
  openChest(state){
    if(state.flags.hasKey){
      state.scene = 'chestOpened';
    } else {
      alert('The chest is locked.');
    }
  },
  takeDagger(state){
    if(!state.inventory.includes('dagger')){
      state.inventory.push('dagger');
    }
    state.flags.chestOpened = true;
    state.scene = 'bedroom';
  }
};

async function loadData(){
  scenes = await (await fetch('data/scenes.json')).json();
  characters = await (await fetch('data/characters.json')).json();
  metadata = await (await fetch('data/metadata.json')).json();
  items = await (await fetch('data/items.json')).json();
  // convert action strings to functions
  Object.values(scenes).forEach(sc=>{
    (sc.choices||[]).forEach(ch=>{
      if(typeof ch.action === 'string' && actions[ch.action]){
        ch.action = actions[ch.action];
      }
    });
  });
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

document.getElementById('toggleSidebar').onclick = () => {
  document.body.classList.toggle('sidebar-closed');
};

window.addEventListener('beforeunload', ()=> save(state)); // autosave on tab close
loadData();
