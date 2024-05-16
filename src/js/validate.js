function validateCoordinates(inputValue) {
  const manualCoords = inputValue.split(',');
  if (manualCoords.length !== 2) {
    throw new Error('Введите данные в формате "широта, долгота".');
  }

  const latitude = parseFloat(manualCoords[0].trim());
  const longitude = parseFloat(manualCoords[1].trim());

  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error('Введите корректные координаты.');
  }

  return { latitude, longitude };
}

export { validateCoordinates };