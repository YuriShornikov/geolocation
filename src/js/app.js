import { validateCoordinates } from './validate';

const inp = document.querySelector('.print');
const log = document.querySelector('.log');
const btnContainer = document.querySelector('.btn-container');

let savedLatitude = null;
let savedLongitude = null;

inp.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();

    if (savedLatitude !== null && savedLongitude !== null) {

      // Если координаты уже сохранены, используйте их
      createMessage(savedLatitude, savedLongitude);
    } else {

      // Получение координат
      geolocation(
        (coords) => {
          savedLatitude = coords.latitude;
          savedLongitude = coords.longitude;
          createMessage(coords.latitude, coords.longitude);
        },
        () => {

          // Отсутствие геоданных
          const important = document.createElement('div');
          important.className = 'important';

          important.innerHTML = `
            <div class="text-imp">
              Что-то пошло не так<br>
              К сожалению, нам не удалось определить ваше<br>
              местоположение, пожалуйста, дайте разрешение на<br>
              использование геолокации, либо введите координаты<br>
              вручную.<br><br>
              Широта и долгота через запятую</div>
            <input type="text" class="print-imp">
            <div class="btn-block">
              <button class="cancel">Отмена</button>
              <button class="agreed">ОК</button>
            </div>
          `;

          log.insertBefore(important, log.firstChild);

          const cancel = document.querySelector('.cancel');
          const agreed = document.querySelector('.agreed');
          const inpImp = document.querySelector('.print-imp');

          cancel.addEventListener('click', () => {
            important.remove();
          });

          agreed.addEventListener('click', () => {
            try {
              const { latitude, longitude } = validateCoordinates(inpImp.value);
                  
              savedLatitude = latitude;
              savedLongitude = longitude;
              createMessage(latitude, longitude);
              important.remove();
            } catch(error) {
              alert(error.message);
              inpImp.classList.add('invalid');
            }
          });

          inpImp.addEventListener('input', () => {
            inpImp.classList.remove('invalid');
          });
        }
      );
    }
  }
});

function geolocation(successCallback, errorCallback) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (data) {
        const { latitude, longitude } = data.coords;
        successCallback({ latitude, longitude });
      },
      function (err) {
        errorCallback();
        console.log(err);
      },
      { enableHighAccuracy: true }
    );
  } else {
    errorCallback();
  }
}

function createMessage(latitude, longitude) {
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
  geoDiv.textContent = `${latitude}, ${longitude}`;

  // Собираем разметку
  formDiv.appendChild(textDiv);
  formDiv.appendChild(dateDiv);
  sendDiv.appendChild(formDiv);
  sendDiv.appendChild(geoDiv);

  // Добавляем новую разметку в начало блока log
  log.insertBefore(sendDiv, log.firstChild);

  inp.value = '';
}

const btnMicro = document.querySelector('.btn.microphon');

btnMicro.addEventListener('click', async () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert('API записи аудио недоступно в вашем браузере.');
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audio = document.createElement('div');
    audio.className = 'audio';
    const btnAgreed = document.createElement('button');
    btnAgreed.className = 'btn';
    const timer = document.createElement('div');
    timer.className = 'timer';
    const btnCancel = document.createElement('button');
    btnCancel.className = 'btn';
    btnContainer.style.display = 'none';

    inp.appendChild(audio);
    audio.appendChild(btnAgreed);
    audio.appendChild(timer);
    audio.appendChild(btnCancel);

    // startRecording();
  } catch(error) {
    alert('Доступ к микрофону не предоставлен или API записи аудио недоступно.');
  }
})