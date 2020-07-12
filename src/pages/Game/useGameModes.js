import { useState, useEffect } from 'react';
import { titleCase } from 'change-case';
import * as R from 'ramda';

import * as api from '../../api';

const mapSettingsToGameModes = R.pipe(
  R.toPairs,
  R.map(([modeName, modeOptions]) => {
    const { field, delay } = modeOptions;

    return {
      delay,
      lineLength: field,
      cellsCount: field ** 2,
      value: modeName,
      label: titleCase(modeName),
    };
  }),
);

const useGameModes = () => {
  const [gameModes, setGameModes] = useState(null);
  const [selectedGameMode, setSelectedGameMode] = useState(null);

  useEffect(() => {
    api
      .fetchGameSettings()
      .then(mapSettingsToGameModes)
      .then((modes) => {
        setGameModes(modes);
        setSelectedGameMode(R.head(modes));
      });
  }, []);

  return {
    selectedGameMode,
    setSelectedGameMode,
    gameModes,
  };
};

export default useGameModes;
