import { ServiceOtel } from 'service-otel';



const Otel = new ServiceOtel({
  exportToConsole: process.env.NODE_ENV === "development" 
});
Otel.StartUp();

export default () => Otel;