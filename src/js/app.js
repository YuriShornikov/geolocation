const inp = document.querySelector('.print');
const message = document.querySelector('.message');
const log = document.querySelector('.log');

inp.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();

    

      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleString();

      // Создаем новые элементы разметки
      const sendDiv = document.createElement('div');
      sendDiv.className = 'send';

      const formDiv = document.createElement('div');
      formDiv.className = 'form';

      const textDiv = document.createElement('div');
      textDiv.className = 'text';
      textDiv.textContent = inp.value;

      const dateDiv = document.createElement('div');
      dateDiv.className = 'date';
      dateDiv.textContent = formattedDate;

      const geoDiv = document.createElement('div');
      geoDiv.className = 'geolocation';
      geolocation(geoDiv);
      

      // Собираем разметку
      formDiv.appendChild(textDiv);
      formDiv.appendChild(dateDiv);

      sendDiv.appendChild(formDiv);
      sendDiv.appendChild(geoDiv);

      // Добавляем новую разметку в начало блока log
      log.insertBefore(sendDiv, log.firstChild);

      inp.value = '';
    
  }

})

function geolocation(geoDiv) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (data) {
        const { latitude, longitude } = data.coords;
          
        lat = latitude;
        long = longitude;
        geoDiv.textContent = `${lat}, ${long}`

    
        console.log("lat " + lat);
        console.log("long " + long);
    
      },
      function (err) {
        const important = document.createElement('div');
        important.className = 'important';
        geoDiv.appendChild(important);

        console.log(err);
      },
      { enableHighAccuracy: true }
    );
  }
}

