const getArrayItemByRandom = (random, arr) => {
  return arr[Math.floor(random * arr.length)];
};

export default getArrayItemByRandom;
