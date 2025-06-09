// js/ui.js
let gScenes, gCharacters, gItems, gMetadata;

function typeText(el, text){
  return new Promise(resolve => {
    const plain = text.replace(/<[^>]+>/g, '');
    el.textContent = '';
    let i = 0;
    const timer = setInterval(()=>{
      el.textContent += plain[i];
      i++;
      if(i >= plain.length){
        clearInterval(timer);
        el.innerHTML = text;
        resolve();
      }
    }, 30);
    function skip(){
      clearInterval(timer);
      el.innerHTML = text;
      el.removeEventListener('click', skip);
      document.removeEventListener('keydown', keySkip);
      resolve();
    }
    function keySkip(e){ if(e.code === 'Space'){ skip(); }}
    el.addEventListener('click', skip);
    document.addEventListener('keydown', keySkip);
  });
}


function updateInventory(state, items, container){
  container.innerHTML = '';
  if(!state.inventory || state.inventory.length===0){
    const li = document.createElement('li');
    li.textContent = 'None';
    container.appendChild(li);
    return;
  }
  state.inventory.forEach(id=>{
    const info = items[id] || {name:id, icon:'', desc:''};
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = info.icon;
    li.appendChild(span);
    li.append(info.name);
    li.title = info.desc;
    container.appendChild(li);
  });
}

function updateStats(state, container){
  container.innerHTML = '';
  Object.entries(state.stats).forEach(([k,v])=>{
    const row = document.createElement('div');
    row.className = 'row';
    const name = document.createElement('span');
    name.textContent = k.toUpperCase();
    const bar = document.createElement('div');
    bar.className = 'bar';
    const fill = document.createElement('div');
    fill.className = 'fill';
    fill.style.width = Math.max(0, Math.min(v, 100)) + '%';
    if(v < 25) fill.classList.add('danger');
    else if(v < 50) fill.classList.add('warning');
    else fill.classList.add('good');
    bar.appendChild(fill);
    row.appendChild(name);
    row.appendChild(bar);
    container.appendChild(row);
  });
}

export async function render(state, scenes, characters={}, items={}, metadata={}){
  gScenes = scenes; gCharacters = characters; gItems = items; gMetadata = metadata;
  document.getElementById('gameTitle').textContent = metadata.title || '';

  const invEl = document.getElementById('inventory');
  updateInventory(state, items, invEl);
  const statsEl = document.getElementById('stats');
  updateStats(state, statsEl);
  const clockEl = document.getElementById('clock');
  clockEl.textContent = state.flags.time || '';

  const s = scenes[state.scene];
  const nameBar = document.getElementById('nameBar');
  const textEl = document.getElementById('text');
  const portrait = document.getElementById('portrait');
  const continueHint = document.getElementById('continueHint');
  continueHint.style.opacity = '0';

  // naive speaker detection
  let speaker = '';
  if(s.text.length && s.text[0].includes(':')){
    speaker = s.text[0].split(':')[0].replace(/<[^>]+>/g,'');
  }
  nameBar.textContent = speaker;
  if(characters[speaker]){
    portrait.style.backgroundImage = `url(${characters[speaker].portrait})`;
  }else{
    portrait.style.backgroundImage = '';
  }

  await typeText(textEl, s.text.join(' '));
  continueHint.style.opacity = '1';

  const choicesEl = document.getElementById('choices');
  choicesEl.innerHTML = '';
  s.choices.forEach((ch,i)=>{
    const btn = document.createElement('button');
    btn.textContent = ch.label;
    btn.style.transitionDelay = `${i*200}ms`;
    btn.onclick = ch.action ? () => { ch.action(state); render(state, scenes, characters, items, metadata); } :
                             () => { state.scene = ch.goto; render(state, scenes, characters, items, metadata); };
    choicesEl.appendChild(btn);
  });
}

