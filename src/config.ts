import Conf from 'conf';

export const schema = {
  promptEnd: {
    default: '❯',
  },
  showExitCode: {
    default: true,
  },
  showCwd: {
    default: true,
  },
  showTime: {
    default: true,
  },
};

export default new Conf({ schema });
