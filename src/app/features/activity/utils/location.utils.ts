export function getDistanceBetweenCoordinatesInKm(latitude1: number, longitude1: number, latitude2: number, longitude2: number): number {
  const earthRadiusInKm = 6371;

  const deltaLatitudeInRadians = convertDegreesToRadians(latitude2 - latitude1);
  const deltaLongitudeInRadians = convertDegreesToRadians(longitude2 - longitude1);

  const latitude1InRadians = convertDegreesToRadians(latitude1);
  const latitude2InRadians = convertDegreesToRadians(latitude2);

  const haversineFormula =
    Math.sin(deltaLatitudeInRadians / 2) * Math.sin(deltaLatitudeInRadians / 2) +
    Math.cos(latitude1InRadians) * Math.cos(latitude2InRadians) * Math.sin(deltaLongitudeInRadians / 2) * Math.sin(deltaLongitudeInRadians / 2);

  const angularDistanceInRadians = 2 * Math.atan2(Math.sqrt(haversineFormula), Math.sqrt(1 - haversineFormula));
  const distanceInKm = earthRadiusInKm * angularDistanceInRadians;

  return distanceInKm;
}

function convertDegreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
