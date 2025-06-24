import { TimeSetting } from '../types';

export const DEFAULT_TIME_CONTROLS: TimeSetting[] = [
  {
    name: 'Bullet (1+0)',
    baseMinutes: 1,
    incrementSeconds: 0,
  },
  {
    name: 'Blitz (3+2)',
    baseMinutes: 3,
    incrementSeconds: 2,
  },
  {
    name: 'Blitz (5+0)',
    baseMinutes: 5,
    incrementSeconds: 0,
  },
  {
    name: 'Rapid (10+0)',
    baseMinutes: 10,
    incrementSeconds: 0,
  },
  {
    name: 'Rapid (15+10)',
    baseMinutes: 15,
    incrementSeconds: 10,
  },
  {
    name: 'Classical (30+0)',
    baseMinutes: 30,
    incrementSeconds: 0,
  },
];

export const getTimeControlByName = (name: string): TimeSetting => {
  return DEFAULT_TIME_CONTROLS.find(tc => tc.name === name) || DEFAULT_TIME_CONTROLS[3];
};