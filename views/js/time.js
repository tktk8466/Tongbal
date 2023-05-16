module.exports = {
  timeString: () => {
    let today = new Date();

    let hours = ("0" + today.getHours()).slice(-2);
    let minutes = ("0" + today.getMinutes()).slice(-2);
    let seconds = ("0" + today.getSeconds()).slice(-2);
    let millisec = ("0" + today.getMilliseconds()).slice(-2);

    let time = hours + ":" + minutes + ":" + seconds + ":" + millisec + " ";
    return time;
  },

  getNow: () => {
    let now = new Date();
    now.setHours(now.getHours() + 9);
    return now;
  },

  nextQueryTime: (time) => {
    time.setSeconds(time.getSeconds() + 30);
    return time;
  },
};
