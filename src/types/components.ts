/**
 * ApiListItem
 */
export type Header = {
  uuid: string;
  isActive: boolean;
  key: string;
  value: string;
};

export type Methods = {
  [key in 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE']: {
    delay: number;
    status: number;
    callback: {
      isActive: boolean;
      code: string | null;
    };
  };
};

export type Pipeline = {
  [key in 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE']: {
    isActive: boolean;
    value: string;
  };
};

export type ApiData = {
  path: string;
  description: string;
  headers: Header[];
  methods: Methods;
  response: any;
  searchText?: string;
};
