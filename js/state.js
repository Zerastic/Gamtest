// js/state.js
export const SAVE_KEY = 'HybridIF_save';

export function initialState(){
  return {
    scene: 'prologue',
    flags: { time: 'Day 1 - Morning' },
    stats: { hp: 100, xp: 0, gold: 5, affection: 50 },
    inventory: ['potion']
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
