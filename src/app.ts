import 'express-async-errors';
import express from "express";
import swaggerDocs from "./swagger.json";
import swaggerUi from "swagger-ui-express";
import ClientRouter from './modules/clientes/router';
import ProductRouter from './modules/produtos/router';

export class App{
  public server: express.Application;

  constructor(){
    this.server = express();
    this.middleware();
    this.router();
    this.documentation();
    this.exceptionMiddleware();
  }

  private middleware(){
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));
  }

  private documentation(){
    this.server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  }

  private async exceptionMiddleware(){
    this.server.use((error: any, request: any, response: any, next: any) => {
      if (error instanceof Error) return response.status(400).json({ message: error?.message || error });
      return response.status(500).send();
    });
  };

  private router(){
    this.server.use('/clientes', ClientRouter);
    this.server.use('/produtos', ProductRouter);
  }
}