const screens = {
  landing: document.getElementById('landing'),
  designer: document.getElementById('designer'),
  game: document.getElementById('game'),
  ending: document.getElementById('ending')
};

const ui = {
  startBtn: document.getElementById('start-btn'),
  beginGameBtn: document.getElementById('begin-game'),
  puppyName: document.getElementById('puppy-name'),
  breedSelect: document.getElementById('breed-select'),
  accessoryChecks: Array.from(document.querySelectorAll('fieldset input[type="checkbox"]')),
  previewName: document.getElementById('preview-name'),
  previewBreed: document.getElementById('preview-breed'),
  previewAccessories: document.getElementById('preview-accessories'),
  levelLabel: document.getElementById('level-label'),
  scoreLabel: document.getElementById('score-label'),
  missionText: document.getElementById('mission-text'),
  levelArea: document.getElementById('level-area'),
  hintBtn: document.getElementById('hint-btn'),
  hintText: document.getElementById('hint-text'),
  endingMessage: document.getElementById('ending-message')
};

const levels = [
  { name: 'Sunny Pet Village', bg: 'linear-gradient(180deg, #b9f6ff, #e4ffd8)', hint: 'Near the toy shop sign.' },
  { name: 'Jungle River Trail', bg: 'linear-gradient(180deg, #8cf7c5, #5cc38f)', hint: 'Look close to the waterfall.' },
  { name: 'Snowy Paw Mountain', bg: 'linear-gradient(180deg, #dbf0ff, #e8f4ff)', hint: 'Somewhere by the cozy cabin.' },
  { name: 'Rainbow Carnival', bg: 'linear-gradient(180deg, #ffd6f9, #ffeabf)', hint: 'Check around the balloon stand.' },
  { name: 'Moonlight Park', bg: 'linear-gradient(180deg, #7585ff, #4a4aa0)', hint: 'Look under the twinkly tree.' }
];

const sceneDecor = ['🌳', '🏠', '🌼', '🧸', '🦋', '🎈', '🌴', '⭐', '🪵', '🍄', '🪁', '🦜'];

const state = {
  level: 0,
  score: 0,
  puppyName: 'Mystery Pup',
  breed: 'Golden Retriever',
  accessories: []
};

function showScreen(screenKey) {
  Object.values(screens).forEach((screen) => screen.classList.remove('active'));
  screens[screenKey].classList.add('active');
}

function updatePreview() {
  state.puppyName = ui.puppyName.value.trim() || 'Mystery Pup';
  state.breed = ui.breedSelect.value;
  state.accessories = ui.accessoryChecks.filter((box) => box.checked).map((box) => box.value);

  ui.previewName.textContent = `Name: ${state.puppyName}`;
  ui.previewBreed.textContent = `Breed: ${state.breed}`;
  ui.previewAccessories.textContent = `Accessories: ${state.accessories.join(', ') || 'None yet'}`;
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function spawnLevel(index) {
  const level = levels[index];
  ui.levelArea.innerHTML = '';
  ui.levelArea.style.background = level.bg;
  ui.hintText.textContent = '';

  for (let i = 0; i < 17; i += 1) {
    const deco = document.createElement('span');
    deco.className = 'scene-item';
    deco.textContent = sceneDecor[i % sceneDecor.length];
    deco.style.left = `${randomBetween(3, 94)}%`;
    deco.style.top = `${randomBetween(4, 90)}%`;
    ui.levelArea.appendChild(deco);
  }

  const puppy = document.createElement('button');
  puppy.className = 'hidden-puppy';
  puppy.style.left = `${randomBetween(6, 88)}%`;
  puppy.style.top = `${randomBetween(8, 82)}%`;
  puppy.style.background = 'rgba(255, 255, 255, 0.01)';
  puppy.title = 'Found puppy!';
  puppy.setAttribute('aria-label', 'Hidden puppy');
  puppy.textContent = '🐶';

  puppy.addEventListener('click', () => {
    state.score += 100;
    ui.scoreLabel.textContent = `Score: ${state.score}`;

    if (state.level === levels.length - 1) {
      finishGame();
      return;
    }

    state.level += 1;
    renderGame();
  });

  ui.hintBtn.onclick = () => {
    puppy.classList.add('hint-ring');
    ui.hintText.textContent = `Hint: ${level.hint}`;
  };

  ui.levelArea.appendChild(puppy);
}

function renderGame() {
  const levelNumber = state.level + 1;
  ui.levelLabel.textContent = `Level ${levelNumber} / ${levels.length}`;
  ui.missionText.textContent = `Find ${state.puppyName} the ${state.breed} in ${levels[state.level].name}! +100 points when you do.`;
  spawnLevel(state.level);
}

function finishGame() {
  ui.endingMessage.textContent = `${state.puppyName} nailed every level with ${state.score} points! Time for a puppy disco! 🥳`;
  showScreen('ending');
}

ui.startBtn.addEventListener('click', () => showScreen('designer'));
ui.beginGameBtn.addEventListener('click', () => {
  updatePreview();
  state.level = 0;
  state.score = 0;
  ui.scoreLabel.textContent = 'Score: 0';
  showScreen('game');
  renderGame();
});

ui.puppyName.addEventListener('input', updatePreview);
ui.breedSelect.addEventListener('change', updatePreview);
ui.accessoryChecks.forEach((box) => box.addEventListener('change', updatePreview));

updatePreview();
