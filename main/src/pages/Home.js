import HomePage from './HomePage.js';

export default (main) => {
  const home = () => new HomePage(main);

  return {
    home,
  };
};
