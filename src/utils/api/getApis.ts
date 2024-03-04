const url = "https://open-weather13.p.rapidapi.com/city";
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "3da2767f2fmsh2f66bce08ff5212p16301bjsn6f207247ca93",
    "X-RapidAPI-Host": "open-weather13.p.rapidapi.com",
  },
};

export async function getWeatherByCity(city: string) {
  return await fetch(`${url}/${city}`, options);
}

export async function getWeatherByLatAndLog(city: string) {
  return await fetch(`${url}/${city}`, options);
}
