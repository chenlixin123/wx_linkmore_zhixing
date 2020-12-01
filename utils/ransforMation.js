function BaiduToTencent(pref) {
  let x_pi = 3.14159265358979324;
  let x = pref.longitude - 0.0065,
    y = pref.latitude - 0.006;
  let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
  let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
  let tx_lon = z * Math.cos(theta);
  let tx_lat = z * Math.sin(theta);
  pref.longitude = tx_lon;
  pref.latitude = tx_lat;
  return pref;
}
module.exports = {
  BaiduToTencent
}