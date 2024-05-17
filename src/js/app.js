import { validateCoordinates } from './validate';
import { geolocation } from './geolocation';
import { createMessage } from './createMessage';

const inp = document.querySelector('.print');
const log = document.querySelector('.log');
const btnContainer = document.querySelector('.btn-container');
const message = document.querySelector('.message');

let savedLatitude = null;
let savedLongitude = null;

inp.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    const inpText = inp.value.toString();
    

    if (savedLatitude !== null && savedLongitude !== null) {

      // Если координаты уже сохранены, используйте их
      createMessage(savedLatitude, savedLongitude, inpText);
      inp.value = '';
    } else {

      // Получение координат
      geolocation(
        (coords) => {
          savedLatitude = coords.latitude;
          savedLongitude = coords.longitude;
          createMessage(coords.latitude, coords.longitude, inpText);
          inp.value = '';
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
              createMessage(latitude, longitude, inp.value);
              inp.value = '';

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




const btnMicro = document.querySelector('.btn.microphon');

let mediaRecorder;
let audioChunks = [];
let timerInterval;
let startTime;
let recordingCancelled = false;


btnMicro.addEventListener('click', async () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert('API записи аудио недоступно в вашем браузере.');
    return;
  }

  if (savedLatitude !== null && savedLongitude !== null) {
    // Если координаты уже сохранены, начинаем запись
    startAudioRecording();
  } else {
    // Получение координат перед началом записи
    geolocation(
      (coords) => {
        savedLatitude = coords.latitude;
        savedLongitude = coords.longitude;
        startAudioRecording();
      },
      () => {
        // Обработка отсутствия геоданных
        alert('Геолокация недоступна. Пожалуйста, введите координаты вручную.');
      }
    );
  }
});

async function startAudioRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      if (!recordingCancelled) {
        audioChunks.push(event.data);
      }
    }
    
    mediaRecorder.onstop = async () => {
      if (!recordingCancelled) {
        const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioElement = document.createElement('audio');
        audioElement.controls = true;
        audioElement.src = audioUrl;

        console.log(audioElement)
        
        createMessage(savedLatitude, savedLongitude, audioElement);
      } else {
      audioChunks = [];
      }
    }

    startRecording(savedLatitude, savedLongitude);
  } catch(error) {
    alert('Доступ к микрофону не предоставлен или API записи аудио недоступно.');
  }
}

function startRecording() {
  recordingCancelled = false;
  mediaRecorder.start();
  audioChunks = [];
  btnContainer.style.display = 'none';

  const audioControls = document.createElement('div');
  audioControls.className = 'audio-controls';

  const btnAgreed = document.createElement('button');
  btnAgreed.className = 'btn';
  btnAgreed.textContent = '\u2714';

  const timer = document.createElement('div');
  timer.className = 'timer';
  timer.textContent = '00:00';

  const btnCancel = document.createElement('button');
  btnCancel.className = 'btn';
  btnCancel.textContent = '\u2716';

  audioControls.appendChild(btnAgreed);
  audioControls.appendChild(timer);
  audioControls.appendChild(btnCancel);
  message.appendChild(audioControls);

  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, '0');
    const seconds = String(elapsedTime % 60).padStart(2, '0');
    timer.textContent = `${minutes}:${seconds}`;
  }, 1000);

  btnAgreed.addEventListener('click', () => stopRecording(false));

  btnCancel.addEventListener('click', () => stopRecording(true));
}

function stopRecording(cancelled) {
  clearInterval(timerInterval);
  recordingCancelled = cancelled;
  mediaRecorder.stop();
  const audioControls = document.querySelector('.audio-controls');
  audioControls.remove();
  btnContainer.style.display = 'flex';
}
