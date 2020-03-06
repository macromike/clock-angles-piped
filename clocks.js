const pipe = (...functions) => args =>
  functions.reduce((arg, fn) => fn(arg), args);

// clock angles
const getHourAngle = h => h * 30;
const getHourMinuteAngle = m => m * 0.5;
const getMinuteAngle = m => m * 6;
const getClockAngle = ({ h, m }) => Math.abs(getHourMinuteAngle(m) + getHourAngle(h % 12) - getMinuteAngle(m));

// time offset
const getChicagoTimeOffset = times => {
  const offset = -1;
  return times.map(time => {
    time.h = (time.h + offset === -1) ? 23 : time.h + offset;
    time.a = getClockAngle({ h: time.h, m: time.m });
    return time;
  });
};

// time array generator
const generateTime = times => {
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m++) {
      times.push({ h: h, m: m, a: getClockAngle({ h, m }) });
    }
  }
  return times;
};

// piped methods
const getLocalTime = state => {
  state.localTime = pipe(generateTime)([]);
  return state;
};

const getChicagoTime = state => {
  state.chicagoTime = pipe(generateTime, getChicagoTimeOffset)([]);
  return state;
};

const getMatchingAngles = state => {
  state.matchingAngles = state.localTime.filter((time, index) => {
    if (time.a === state.chicagoTime[index].a) {
      time.chicagoTime = `h: ${state.chicagoTime[index].h} m: ${state.chicagoTime[index].m} a: ${state.chicagoTime[index].a}`;
      return time;
    }
  });
  return state;
};

const matchingAngleTimes = pipe(
  getLocalTime,
  getChicagoTime,
  getMatchingAngles
)({});

console.table(matchingAngleTimes.matchingAngles);