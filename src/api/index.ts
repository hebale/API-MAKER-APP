export type MethodTypes = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export type ApiParam<T = undefined> = {
  path: string;
  key?: string | number;
  data?: T;
};

export type ApiData = {
  path: string;
  description: string;
  headers: Header[] | [];
  methods: { [key in MethodTypes]: Method } | {};
  pipeline: { [key in MethodTypes]: Pipeline } | {};
  response: any;
};

export type Header = {
  uuid: string;
  isActive: boolean;
  key: string;
  value: string;
};

export type Method = {
  delay: number;
  status: number;
};

export type Pipeline = {
  isActive: boolean;
  code: string;
};

export type Response = any;

export type Error = {
  status: number;
  message: string;
};

export * from './queries';
export * from './mutation';
