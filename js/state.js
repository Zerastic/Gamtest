// js/state.js
export const SAVE_KEY = 'HybridIF_save';

export function initialState(){
  return {
    scene: 'prologue',
    flags: {},
    stats: { hp: 10, xp: 0 },
    inventory: []
  };
}

export function loadSave(){
  try{
    const data = localStorage.getItem(SAVE_KEY);
    return data ? JSON.parse(data) : null;
  }catch{ return null; }
}

export function save(state){
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}
