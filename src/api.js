const apiUrl = 'https://starnavi-frontend-test-task.herokuapp.com';

export const fetchGameSettings = () => (
  fetch(`${apiUrl}/game-settings`)
    .then((res) => res.json())
);

export const fetchWinners = () => (
  fetch(`${apiUrl}/winners`)
    .then((res) => res.json())
);