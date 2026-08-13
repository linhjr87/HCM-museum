export type RoomMeta = {
  number: '01' | '02' | '03' | '04';
  path: string;
  title: string;
  tagline: string;
};

export type Milestone = {
  year: string;
  place: string;
  event: string;
  meaning: string;
  source: string;
};

export type MapStop = {
  id: string;
  label: string;
  x: number;
  y: number;
  labelDx: number;
  labelDy: number;
  event: string;
  link: string;
  source: string;
};

export type PeopleFacet = {
  id: 'cua-dan' | 'do-dan' | 'vi-dan';
  title: string;
  short: string;
  detail: string;
  source: string;
};

export type UnityGroup = {
  id: string;
  name: string;
  message: string;
  source: string;
};
