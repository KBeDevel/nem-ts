import express, { Application, urlencoded } from 'express';
import dotenv from 'dotenv';
import favicon from 'serve-favicon';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import https from 'https';
import fs from 'fs-extra';
import net from 'net';
import prompts from 'prompts';
import { APIRouter, PATH_BASE } from './router';
import { PORT } from './config/deploy.config';
import {
  ALLOWED_DOMAINS,
  ALLOWED_HEADERS,
  ALLOWED_METHODS,
  BANNED_ORIGINS,
  DEFAULT_DEPLOY_PARAMS,
  MESSAGES
} from './helpers/schemas.helper';
import { allowCrossDomainMiddleware, createBlockedListMiddleware } from 'cors-helper';
import RequestErrorsHelper from './helpers/errors.helper';
import { ExecutionContext } from './libs/exec-context.lib';
import { MongoConnectionState, MongoConnector } from './utils/mongo-connector';
import { ConsoleFormat } from './libs/console-format.lib';
import { capitalize } from './libs/text-mod.lib';
import { HTTPClient } from './utils/http-client';

/**
 * Change the initial settings or the default configuration
 */
export interface ServerConfig {
  application?: Application;
  port?: typeof PORT;
  maxBodySize?: {
    size: number;
    unit: 'mb';
  };
}

/**
 * Global controller to deploy the API
 * To launch, generate an instance of this class and then call the `bootstrap()` method
 */
export class ServerApplication {
  #application!: Application;
  #port!: typeof PORT;

  constructor (
    private readonly customConfig?: ServerConfig
  ) {
    const dotEnvConfig = dotenv.config({
      path: path.join(
        path.resolve(process.cwd()),
        `.env.${process.env.NODE_ENV}`
      )
    });
    if (dotEnvConfig.error) {
      throw dotEnvConfig.error;
    }
    this.#application = this.customConfig?.application ?? express();
    this.#port = this.customConfig?.port ?? PORT;
  }

  private async config () {
    HTTPClient.setupDefaultBehavior();

    // Specify the express view/template handlers
    this.#application.set('title', DEFAULT_DEPLOY_PARAMS.DEFAULT_VIEW_TITLE);
    this.#application.set('view engine', DEFAULT_DEPLOY_PARAMS.DEFAULT_VIEW_ENGINE);
    this.#application.set('views', path.resolve(__dirname, 'templates'));

    // Add express plugins, extensions and handlers
    this.#application.use(
      favicon(path.join(__dirname, '..', 'public', 'favicon.ico')),
      express.json({
        limit: this.customConfig?.maxBodySize
          ? this.customConfig.maxBodySize.size + this.customConfig.maxBodySize.unit
          : '10mb'
      }),
      urlencoded({ extended: true }),
      helmet({
        contentSecurityPolicy: {
          directives: {
            'default-src': ALLOWED_DOMAINS,
            'font-src': ALLOWED_DOMAINS,
            'img-src': ALLOWED_DOMAINS,
            'script-src': ALLOWED_DOMAINS,
            'style-src': ALLOWED_DOMAINS,
            'frame-src': '\'self\''
          }
        },
        noSniff: true,
        xssFilter: true,
        hidePoweredBy: true
      }),
      cors(Object.assign({
        allowedHeaders: ALLOWED_HEADERS,
        methods: ALLOWED_METHODS
      }, createBlockedListMiddleware(BANNED_ORIGINS))),
      morgan(ExecutionContext.isProductionMode() ? 'combined' : 'dev'),
      RequestErrorsHelper.generic
    );

    if (process.env.NODE_ENV === 'development') {
      this.#application.use(allowCrossDomainMiddleware);
    }

    this.#application.use(PATH_BASE, APIRouter); // Use the default application router
    this.#application.use(RequestErrorsHelper.resourceNotFound); // Error 404 handler
    // Do NOT declare and/or call any route handler after the above implementation
    // Any handler implemented will be IGNORED by the application
    // To add additional routes, please modify the router.ts file and/or generate a new router dependency
  }

  private async findAvailablePort (): Promise<boolean> {
    const checkPort = async (port = this.#port) => {
      return new Promise<boolean>(resolve => {
        net.connect({ port: parseInt(port) })
          .on('error', () => {
            resolve(true);
          })
          .on('close', (hasErrors) => {
            resolve(!!hasErrors);
          }).end();
      });
    };
    let isPortAvailable = await checkPort();
    while (!isPortAvailable) {
      const PromptResult = await prompts({
        type: 'number',
        name: 'providedPort',
        message: `The port ${this.#port} is being used by another application. Please provide a valid port:`,
        validate: async providedPort => await checkPort(providedPort)
      });
      if (PromptResult.providedPort) {
        this.#port = PromptResult.providedPort;
        isPortAvailable = await checkPort();
      }
    }
    return isPortAvailable;
  }

  async bootstrap () {
    await this.config();

    const mongoConnection = await new MongoConnector().connect();

    if (mongoConnection !== MongoConnectionState.connected) {
      throw new Error(MESSAGES.CONSOLE.CONNECTION_ERROR);
    }

    let applicationToUse: Application | https.Server = this.#application;

    const sslDir = path.resolve(__dirname, '..', '.ssl');

    if (await this.findAvailablePort()) {
      if (ExecutionContext.isSSLMode()) {
        const certFilePath = path.join(sslDir, 'cert.pem');
        const keyFilePath = path.join(sslDir, 'key.pem');

        const certFileExists = await fs.stat(certFilePath);

        if (!certFileExists.isFile()) {
          throw new Error(MESSAGES.CONSOLE.SSL_CERT_NOT_FOUND_ERROR);
        }

        const keyFileExists = await fs.stat(keyFilePath);

        if (!keyFileExists.isFile()) {
          throw new Error(MESSAGES.CONSOLE.SSL_KEY_NOT_FOUND_ERROR);
        }

        try {
          applicationToUse = https.createServer({
            cert: await fs.readFile(certFilePath),
            key: await fs.readFile(keyFilePath)
          }, this.#application);
        } catch (reason) {
          throw new Error(MESSAGES.CONSOLE.SSL_DEPLOY_ERROR + '. Error stack: ' + reason);
        }
      }
    }

    await new Promise<void>(
      resolve => {
        console.log('\n');
        console.clear();
        console.log(
          // eslint-disable-next-line security-node/detect-crlf
          MESSAGES.CONSOLE.DEPLOY_ALERT,
          PORT
        );
        applicationToUse
          .listen(this.#port, () => {
            resolve();
          }) // Start the application listener
          .on('error', (reason) => {
            throw new Error(`[${reason.name}]: ${reason.message}`);
          })
          .on('listening', () => {
            console.clear();
            console.log(
              // eslint-disable-next-line security-node/detect-crlf
              ConsoleFormat.make(
                MESSAGES.DEPLOYMENT.START_REPORT,
                {
                  textColor: 'blue',
                  textFormat: 'bright',
                  addLineBreak: true
                }
              )
            );
            console.log(
              // eslint-disable-next-line security-node/detect-crlf
              MESSAGES.DEPLOYMENT.SSL_REPORT,
              ExecutionContext.isSSLMode()
                ? ConsoleFormat.make('Yes', { textColor: 'green', textFormat: 'bright' })
                : ConsoleFormat.make('No', { textColor: 'red', textFormat: 'bright' })
            );
            console.log(
              // eslint-disable-next-line security-node/detect-crlf
              MESSAGES.DEPLOYMENT.ENVIRONMENT_REPORT,
              ConsoleFormat.make(capitalize(String(process.env.NODE_ENV)), { textColor: 'yellow', textFormat: 'bright' })
            );
            console.log(
              // eslint-disable-next-line security-node/detect-crlf
              MESSAGES.DEPLOYMENT.PLATFORM_REPORT,
              ConsoleFormat.make(
                capitalize(process.platform), { textColor: 'magenta', textFormat: 'bright' }
              )
            );
            console.log(
              // eslint-disable-next-line security-node/detect-crlf
              MESSAGES.DEPLOYMENT.MONGO_CONNEcTION_STATUS,
              ConsoleFormat.make(
                capitalize('connected'), { textColor: 'cyan', textFormat: 'bright', addLineBreak: true }
              )
            );
            console.log(
              // eslint-disable-next-line security-node/detect-crlf
              MESSAGES.DEPLOYMENT.PORT_LISTENING_REPORT,
              ConsoleFormat.make(this.#port, { textFormat: 'bright', addLineBreak: true })
            );
            console.log(
              // eslint-disable-next-line security-node/detect-crlf
              ConsoleFormat.make(MESSAGES.DEPLOYMENT.LOGGING_ALERT_REPORT, { addLineBreak: true })
            );
          });
      }
    );
  }
}
