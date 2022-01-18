import type { Server } from 'net';
import { connect, connection, type ConnectOptions } from 'mongoose';
import type { MongooseConfig, MongooseConfigProtocol } from '../types';
import SSHTunnel from 'tunnel-ssh';
import { asBoolean } from '../libs/text-mod.lib';
import path from 'path';
import fs from 'fs-extra';
import { DEFAULT_VALUES } from '../helpers/schemas.helper';

export enum MongoConnectionState {
  disconnected = 0,
  connected = 1,
  connecting = 2,
  disconnecting = 3,
}

const MongooseDefaultConfig: Readonly<Required<MongooseConfig>> = {
  databaseName: process.env.DATABASE_NAME ?? DEFAULT_VALUES.DATABASE_NAME,
  protocol: (process.env.DATABASE_ACCESS_PROTOCOL ??
    DEFAULT_VALUES.DATABASE_ACCESS_PROTOCOL) as MongooseConfigProtocol,
  domain:
    process.env.DATABASE_ACCESS_DOMAIN ??
    DEFAULT_VALUES.DATABASE_ACCESS_DOMAIN,
  port:
    process.env.DATABASE_ACCESS_PORT ?? DEFAULT_VALUES.DATABASE_ACCESS_PORT
};

const SSHTunnelDefaultConfig: SSHTunnel.Config = {
  username:
    process.env.DATABASE_ACCESS_SSH_USER ??
    DEFAULT_VALUES.DATABASE_ACCESS_SSH_USER,
  host:
    process.env.DATABASE_ACCESS_SSH_HOSTNAME ??
    DEFAULT_VALUES.DATABASE_ACCESS_SSH_HOSTNAME,
  port: parseInt(
    process.env.DATABASE_ACCESS_SSH_PORT ??
      DEFAULT_VALUES.DATABASE_ACCESS_SSH_PORT
  ),
  privateKey: fs.readFileSync(
    path.resolve(
      process.cwd(),
      'private',
      DEFAULT_VALUES.DATABASE_ACCESS_SSH_KEY_FILE
    )
  ),
  dstHost:
    process.env.DATABASE_ACCESS_DOMAIN ??
    DEFAULT_VALUES.DATABASE_ACCESS_DOMAIN,
  dstPort: parseInt(
    process.env.DATABASE_ACCESS_PORT ??
    DEFAULT_VALUES.DATABASE_ACCESS_PORT
  ),
  localHost:
    process.env.DATABASE_ACCESS_DOMAIN ??
    DEFAULT_VALUES.DATABASE_ACCESS_DOMAIN,
  localPort: parseInt(
    process.env.DATABASE_ACCESS_SSH_TUNNEL_PORT ??
      DEFAULT_VALUES.DATABASE_ACCESS_SSH_TUNNEL_PORT
  )
};

export class SSHConnector {
  #tunnelConfig!: SSHTunnel.Config;
  #tunnel!: Server;

  constructor (
    private readonly tunnelConfig: SSHTunnel.Config
  ) {
    this.#tunnelConfig = this.tunnelConfig;
  }

  public createTunnel () {
    this.#tunnel = SSHTunnel(this.#tunnelConfig, (errorReason) => {
      if (errorReason) {
        throw errorReason;
      }
    });
    return this.#tunnel;
  }
}

export class MongoConnector {
  #connectionString!: string;
  #usingTunnel!: boolean;
  #tunnel!: Server | undefined;

  constructor (
    private readonly customConfiguration?: MongooseConfig
  ) {
    this.init();
  }

  private init () {
    this.#usingTunnel = asBoolean(process.env.DATABASE_ACCESS_USE_SSH_BRIDGE ?? DEFAULT_VALUES.DATABASE_ACCESS_USE_SSH_BRIDGE);
    if (this.#usingTunnel) {
      this.#tunnel = this.handleTunnelConnection();
      if (this.#tunnel) {
        this.#tunnel.on('error', (reason) => { throw reason; });
      }
    }
    this.generateConnectionString();
  }

  private handleTunnelConnection () {
    if (this.#usingTunnel) {
      let tunnelConfig: SSHTunnel.Config = SSHTunnelDefaultConfig;
      if (
        process.env.DATABASE_ACCESS_SSH_KEY_HAS_PASSWORD ??
        DEFAULT_VALUES.DATABASE_ACCESS_SSH_KEY_HAS_PASSWORD
      ) {
        tunnelConfig = Object.assign(tunnelConfig, {
          password:
            process.env.DATABASE_ACCESS_SSH_PASSWORD ??
            DEFAULT_VALUES.DATABASE_ACCESS_SSH_PASSWORD
        });
      }
      this.#tunnel = new SSHConnector(tunnelConfig).createTunnel();
    }
    return this.#tunnel;
  }

  private generateConnectionString () {
    const {
      databaseName,
      domain,
      protocol,
      port = MongooseDefaultConfig.port
    } = this.customConfiguration ?? MongooseDefaultConfig;

    const definitivePort = this.#usingTunnel
      ? SSHTunnelDefaultConfig.localPort
      : port;

    this.#connectionString = [
      protocol,
      domain
    ].join('://').concat(definitivePort ? ':'.concat(String(definitivePort)) : String()).concat('/'.concat(databaseName));
  }

  public async connect () {
    const connectionOptions: ConnectOptions | undefined = asBoolean(process.env.DATABASE_ACCESS_USE_CREDENTIALS ?? DEFAULT_VALUES.DATABASE_ACCESS_USE_CREDENTIALS)
      ? {
          authSource: process.env.DATABASE_ACCESS_AUTH_SOURCE ?? DEFAULT_VALUES.DATABASE_ACCESS_AUTH_SOURCE,
          user: process.env.DATABASE_ACCESS_USER ?? DEFAULT_VALUES.DATABASE_ACCESS_USER,
          pass: process.env.DATABASE_ACCESS_PASSWORD ?? DEFAULT_VALUES.DATABASE_ACCESS_PASSWORD
        }
      : undefined;
    await connect(this.#connectionString, connectionOptions);
    for (const state in MongoConnectionState) {
      const mappedState = parseInt(MongoConnectionState[state]);
      if (connection.readyState === mappedState) {
        return connection.readyState as MongoConnectionState;
      }
    }
    return undefined;
  }
}
