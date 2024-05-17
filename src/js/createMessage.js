function createMessage(latitude, longitude, message) {

  const log = document.querySelector('.log');
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString();

  // Создаем новые элементы разметки
  const sendDiv = document.createElement('div');
  sendDiv.className = 'send';

  const formDiv = document.createElement('div');
  formDiv.className = 'form';
  

  if (typeof message === 'string') {
    const textDiv = document.createElement('div');
    textDiv.className = 'text';
    textDiv.textContent = message;
    formDiv.appendChild(textDiv);
  } else {
    formDiv.appendChild(message);
  }

  const dateDiv = document.createElement('div');
  dateDiv.className = 'date';
  dateDiv.textContent = formattedDate;

  const geoDiv = document.createElement('div');
  geoDiv.className = 'geolocation';
  geoDiv.textContent = `${latitude}, ${longitude}`;

  // Собираем разметку
  
  formDiv.appendChild(dateDiv);
  sendDiv.appendChild(formDiv);
  sendDiv.appendChild(geoDiv);

  // Добавляем новую разметку в начало блока log
  log.insertBefore(sendDiv, log.firstChild);

  // inp.value = '';
}

export { createMessage };