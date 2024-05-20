import { validateCoordinates } from "../js/validate";

describe("testing validate geolocation", () => {
  test("error by format", () => {
    expect(() => validateCoordinates("")).toThrow(
      'Введите данные в формате "широта, долгота".',
    );
    expect(() => validateCoordinates("123")).toThrow(
      'Введите данные в формате "широта, долгота".',
    );
    expect(() => validateCoordinates("123,456,789")).toThrow(
      'Введите данные в формате "широта, долгота".',
    );
  });

  test("error by correct numbers", () => {
    expect(() => validateCoordinates(",")).toThrow(
      "Введите корректные координаты",
    );
    expect(() => validateCoordinates("abc,123")).toThrow(
      "Введите корректные координаты.",
    );
    expect(() => validateCoordinates("123,defasda")).toThrow(
      "Введите корректные координаты.",
    );
    expect(() => validateCoordinates("415.678,")).toThrow(
      "Введите корректные координаты.",
    );
    expect(() => validateCoordinates(",6117.89")).toThrow(
      "Введите корректные координаты.",
    );
  });

  test("return geolocation", () => {
    expect(validateCoordinates("12.345, 67.890")).toEqual({
      latitude: 12.345,
      longitude: 67.89,
    });
    expect(validateCoordinates("  89.012,34.567  ")).toEqual({
      latitude: 89.012,
      longitude: 34.567,
    });
  });
});
