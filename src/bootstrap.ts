import { ServerApplication, type ServerConfig } from './server';

const customConfig: ServerConfig = { }; // <- Here you can add a custom config

((async (config: ServerConfig) => await new ServerApplication(config).bootstrap())(customConfig));
