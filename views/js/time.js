exports.timeString = function () {
  var today = new Date();

  var hours = ("0" + today.getHours()).slice(-2);
  var minutes = ("0" + today.getMinutes()).slice(-2);
  var seconds = ("0" + today.getSeconds()).slice(-2);
  var millisec = ("0" + today.getMilliseconds()).slice(-2);

  var time = hours + ":" + minutes + ":" + seconds + ":" + millisec + " ";
  return time;
};
