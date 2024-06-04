import { validateCoordinates } from "./validate";

function geolocationByHand(savedLatitude, savedLongitude) {
  // Отсутствие геоданных
  const log = document.querySelector(".log");
  const important = document.createElement("div");
  important.className = "important";

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

  const cancel = document.querySelector(".cancel");
  const agreed = document.querySelector(".agreed");
  const inpImp = document.querySelector(".print-imp");

  return new Promise((resolve, reject) => {
    cancel.addEventListener("click", () => {
      important.remove();
      reject({ latitude: savedLatitude, longitude: savedLongitude });
    });

    agreed.addEventListener("click", () => {
      try {
        const { latitude, longitude } = validateCoordinates(inpImp.value);

        important.remove();
        resolve({ latitude, longitude });
      } catch (error) {
        alert(error.message);
        inpImp.classList.add("invalid");
      }
    });

    inpImp.addEventListener("input", () => {
      inpImp.classList.remove("invalid");
    });
  });
}

export { geolocationByHand };
