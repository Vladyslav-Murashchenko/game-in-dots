/**
 * @descripition
 * This util allows defining all possible transitions for state.status.
 * Specifying transitions behavior explicitly useful to make impossible transitions impossible,
 * better understand when an action for a particular case reducer can be called in code, and specify a range of possible output statuses for case reducer
 * @readmore
 * https://redux.js.org/style-guide/style-guide#treat-reducers-as-state-machines
 * @example
 *  const whenStatus = defineStatusTransitions({
 *    [LOADING]: [LOADED],
 *    [LOADED]: [LOADED, NEED_FETCH],
 *    [NEED_FETCH]: [LOADING],
 *  });
 *
 *  const whenLoaded = whenStatus(LOADED);
 *  const whenLoading = whenStatus(LOADING);
 *  const whenAllowedFetch = whenStatus([NEED_FETCH, LOADED]);
 *
 *  const plpSlice = createSlice({
 *    name: "plp",
 *    initialState: initialPLPState,
 *    reducers: {
 *      changePriceRange: whenLoaded((state, action) => {
 *        // ...some code
 *        state.status = NEED_FETCH;
 *      }),
 *      // ...other reducers
 *    },
 *    extraReducers: {
 *      [fetchProductListData.pending]: whenAllowedFetch((state) => {
 *        // ...some code
 *        state.status = LOADING;
 *      }),
 *      [fetchProductListData.fulfilled]: whenLoading((state, action) => {
 *        // ...some code
 *        state.status = LOADED;
 *      }),
 *    },
 *  });
 */
const defineStatusTransitions = (statusGraph) => (statusToRunReducer) => {
  return (reducer) => (state, action) => {
    const { status } = state;

    if (
      typeof statusToRunReducer === 'string' &&
      statusToRunReducer !== status
    ) {
      return state;
    }

    if (
      Array.isArray(statusToRunReducer) &&
      !statusToRunReducer.includes(status)
    ) {
      return state;
    }

    const result = reducer(state, action);

    if (process.env.NODE_ENV === 'development') {
      const posibleNextStatuses = statusGraph[status] ?? [];
      const newStatus = result === undefined ? state.status : result.status;

      if (!posibleNextStatuses.includes(newStatus)) {
        console.error(`
          Status received after reducer call is not correct
          reducer: 
          ${reducer}
          prevStatus: ${status}
          newStatus: ${newStatus}
          posibleNextStatuses: ${posibleNextStatuses.join(', ')}
        `);
      }
    }

    return result;
  };
};

export default defineStatusTransitions;
