import {ProductInfrastructure} from './pages/infrastructure/product.infrastructure';
import {ProductApplication} from './pages/application/product.application';

export class AppProviders {
  static getProviders() {
    return [
      ProductInfrastructure,
      ProductApplication,
    ];
  }
}
