import axios, { CreateAxiosDefaults } from 'axios';

const defaultConfigs: CreateAxiosDefaults = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const instance = axios.create(defaultConfigs);

export * from 'axios';
export default instance;
