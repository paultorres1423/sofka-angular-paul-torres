import {ProductDomain, ProductProperties, ProductPropertiesUpdate} from './product.domain';

describe('ProductDomain', () => {
  const mockDate = new Date();
  const mockProductProperties: ProductProperties = {
    id: '1',
    name: 'Producto Test',
    description: 'Descripción Test',
    logo: 'Logo Test',
    date_release: mockDate,
    date_revision: mockDate
  };

  const mockProductPropertiesUpdate: ProductPropertiesUpdate = {
    name: 'Producto Actualizado',
    description: 'Descripción Actualizada',
    logo: 'Logo Actualizado',
    date_release: mockDate,
    date_revision: mockDate
  };

  let productDomain: ProductDomain;

  beforeEach(() => {
    productDomain = new ProductDomain(mockProductProperties);
  });

  it('should create an instance of ProductDomain', () => {
    expect(productDomain).toBeTruthy();
  });

  it('should return the correct properties', () => {
    const properties = productDomain.properties();
    expect(properties).toEqual(mockProductProperties);
  });

  it('should update the properties correctly', () => {
    productDomain.update(mockProductPropertiesUpdate);
    const updatedProperties = productDomain.properties();
    expect(updatedProperties.name).toBe(mockProductPropertiesUpdate.name);
    expect(updatedProperties.description).toBe(mockProductPropertiesUpdate.description);
    expect(updatedProperties.logo).toBe(mockProductPropertiesUpdate.logo);
    expect(updatedProperties.date_release).toBe(mockProductPropertiesUpdate.date_release);
    expect(updatedProperties.date_revision).toBe(mockProductPropertiesUpdate.date_revision);
  });
});
