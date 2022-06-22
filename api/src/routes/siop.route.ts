import SIOPController from '@controllers/siop.controller';
import { Routes } from '@interfaces/routes.interface';
import { Router } from 'express';

class SIOPRoute implements Routes {
  public path = '/';
  public router = Router();
  public siopController = new SIOPController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}request`, this.siopController.request);
    this.router.post(`${this.path}callback`, this.siopController.callback);
  }
}

export default SIOPRoute;
