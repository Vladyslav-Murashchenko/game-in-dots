import { useEffect } from 'react';
import * as api from '../../api';
import formatDate from '../../utils/formatDate';

const usePostWinner = (winner) => {
  useEffect(() => {
    if (!winner) {
      return;
    }

    api.postWinner(winner, formatDate(new Date()));
  }, [winner]);
};

export default usePostWinner;
