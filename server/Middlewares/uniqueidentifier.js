const generateUniqueIdentifier = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

module.exports = {
  generateUniqueIdentifier,
};
