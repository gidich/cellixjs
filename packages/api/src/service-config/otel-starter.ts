import { ServiceOtel } from '@ocom/service-otel';

const Otel = new ServiceOtel({
  exportToConsole: process.env['NODE_ENV'] === 'development',
  useSimpleProcessors: process.env['NODE_ENV'] === 'development',
});
Otel.startUp();

/*
export function initOtel():ServiceOtel {

  return Otel;
};
*/
