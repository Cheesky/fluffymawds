let current = null;

const slotAmy      = document.getElementById('slot-amy');
const slotCheesky  = document.getElementById('slot-cheesky');
const infoAmy      = document.getElementById('info-amy');
const infoCheesky  = document.getElementById('info-cheesky');

function reset() {
  slotAmy.classList.remove('active', 'inactive');
  slotCheesky.classList.remove('active', 'inactive');
  infoAmy.classList.remove('visible');
  infoCheesky.classList.remove('visible');
  current = null;
}

function selectChar(id) {
  if (current === id) {
    reset();
    return;
  }

  current = id;

  if (id === 'amy') {
    slotAmy.classList.add('active');
    slotAmy.classList.remove('inactive');
    slotCheesky.classList.add('inactive');
    slotCheesky.classList.remove('active');
    infoAmy.classList.add('visible');
    infoCheesky.classList.remove('visible');
  } else {
    slotCheesky.classList.add('active');
    slotCheesky.classList.remove('inactive');
    slotAmy.classList.add('inactive');
    slotAmy.classList.remove('active');
    infoCheesky.classList.add('visible');
    infoAmy.classList.remove('visible');
  }
}

slotAmy.addEventListener('click', () => selectChar('amy'));
slotCheesky.addEventListener('click', () => selectChar('cheesky'));