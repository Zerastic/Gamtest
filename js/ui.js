// js/ui.js
let historyList = [];
let gScenes, gCharacters, gItems, gMetadata;

function typeText(el, text){
  return new Promise(resolve => {
    el.textContent = '';
    let i = 0;
    const timer = setInterval(()=>{
      el.textContent += text[i];
      i++;
      if(i >= text.length){
        clearInterval(timer);
        resolve();
      }
    }, 30);
    function skip(){
      clearInterval(timer);
      el.textContent = text;
      el.removeEventListener('click', skip);
      document.removeEventListener('keydown', keySkip);
      resolve();
    }
    function keySkip(e){ if(e.code === 'Space'){ skip(); }}
    el.addEventListener('click', skip);
    document.addEventListener('keydown', keySkip);
  });
}

function updateHistory(state, scenes, container, allow){
  if(historyList[historyList.length-1] !== state.scene){
    historyList.push(state.scene);
  }
  container.innerHTML = '';
  historyList.forEach(sceneName =>{
    const a = document.createElement('a');
    a.textContent = sceneName;
    if(allow){
      a.onclick = () => { state.scene = sceneName; historyList=[]; render(state, gScenes, gCharacters, gItems, gMetadata); };
    }else{
      a.style.pointerEvents = 'none';
      a.style.opacity = '0.5';
    }
    container.appendChild(a);
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
    const val = document.createElement('span');
    val.textContent = v;
    if(v < 25) val.classList.add('danger');
    else if(v < 50) val.classList.add('warning');
    else val.classList.add('good');
    row.appendChild(name); row.appendChild(val);
    container.appendChild(row);
  });
}

export async function render(state, scenes, characters={}, items={}, metadata={}){
  gScenes = scenes; gCharacters = characters; gItems = items; gMetadata = metadata;
  document.getElementById('gameTitle').textContent = metadata.title || '';

  const historyEl = document.getElementById('history');
  updateHistory(state, scenes, historyEl, false);
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
  updateHistory(state, scenes, historyEl, true);

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

