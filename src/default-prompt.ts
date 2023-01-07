import Prompt from 'zpr';

export default {
  left: new Prompt()
    .colorOpen('red')
    .text('[')
    .lastCommandStatus()
    .text('] ')
    .colorClose()
    .colorOpen('green')
    .cwdFromHome()
    .colorClose()
    .colorOpen('blue')
    .text(' ❯ ')
    .colorClose(),
  right: new Prompt()
    .time24Seconds(),
};
