import { useEffect } from 'react';
import * as api from '../../api';
import { dateFormatter } from '../../utils';

const usePostWinner = (winner) => {
  useEffect(() => {
    if (!winner) {
      return;
    }

    const date = dateFormatter.format(new Date());

    api.postWinner(winner, date);
  }, [winner]);
};

export default usePostWinner;
