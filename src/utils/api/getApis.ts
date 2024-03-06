const URL = "https://api.openweathermap.org/data/2.5/weather?";
const APIKEY = "46a9246bebba16d42b36aac3fc3ba8af";

export async function getWeatherByCity(city: string) {
  return await fetch(`${URL}q=${city.replace(/\s+/g, "")}&appid=${APIKEY}`);
}

export async function getWeatherByLatAndLog(lat: number, lon: number) {
  return await fetch(`${URL}lat=${lat}&lon=${lon}&appid=${APIKEY}`);
}
