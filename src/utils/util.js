export const fileNameWithoutExtension = fullFileName => {
  return fullFileName?.substring(0, fullFileName?.lastIndexOf('.'));
};

export const getFilePath = fullPath => {
  return fullPath?.substring(0, fullPath?.lastIndexOf('/'));
};
