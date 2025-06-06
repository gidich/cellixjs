import { ServiceOtel } from '@ocom/service-otel';

export default () =>{
  const Otel = new ServiceOtel({
    exportToConsole: process.env['NODE_ENV'] === "development",
    useSimpleProcessors: process.env['NODE_ENV'] === "development",
  });
  Otel.startUp();
  return Otel;
};