import axios from "axios";
import geoip from "geoip-lite";

export async function getIpCountryByIpApi(ip) {
  try {
    const { data } = await axios.get(`https://ipapi.co/${ip}/json/`);
    return data;
  } catch (error) {
    console.log(error);
  }
}

export function getIpCountryyGeoIpLite(ip) {
  return geoip.lookup(ip);
}
