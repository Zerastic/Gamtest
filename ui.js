// js/ui.js
export function render(state, scenes){
  const d = document.getElementById('dialog');
  const c = document.getElementById('choices');
  const s = scenes[state.scene];

  d.innerHTML = s.text.join('<br>');
  c.innerHTML = '';

  s.choices.forEach(ch=>{
    const btn = document.createElement('button');
    btn.textContent = ch.label;
    btn.onclick = ch.action ? () => { ch.action(state); render(state, scenes);} :
                              () => { state.scene = ch.goto; render(state, scenes); };
    c.appendChild(btn);
  });
}
