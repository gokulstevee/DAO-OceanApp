const { max } = require('moment');
const { createGlobalState } = require('react-hooks-global-state');

const { setGlobalState, useGlobalState, getGlobalState } = createGlobalState({
  createModal: 'scale-0',
  connectedAccount: '',
  contract: null,
  proposals: [],
  isStakeholder: false,
  balance: 0,
  myBalance: 0,
});

const truncate = (text, startChars, endChars, maxLength) => {
  if (text.length > maxLength) {
    let start = text.substring(0, startChars);
    let end = text.substring(text.length - endChars, text.length);
    while (start.length + end.length < max.length) {
      start = start + '.';
    }
    return start + end;
  }
  return text;
};

const daysRemaining = () => {
  const todaysDate = moment();
  days = Number((days + '000').slice(0));
  console.log('days' + days);
  days = moment(days).format('YYYY-MM-DD');
  days = moment(days);
  days = days.diff(todaysDate, 'days');
  return days == 1 ? '1 day' : days + 'days';
};

export {
  truncate,
  daysRemaining,
  setGlobalState,
  useGlobalState,
  getGlobalState,
};
