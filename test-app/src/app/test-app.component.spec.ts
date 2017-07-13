import {
  beforeEachProviders,
  describe,
  expect,
  it,
  inject
} from '@angular/core/testing';
import { TestAppAppComponent } from '../app/test-app.component';

beforeEachProviders(() => [TestAppAppComponent]);

describe('App: TestApp', () => {
  it('should create the app',
      inject([TestAppAppComponent], (app: TestAppAppComponent) => {
    expect(app).toBeTruthy();
  }));

  it('should have as title \'test-app works!\'',
      inject([TestAppAppComponent], (app: TestAppAppComponent) => {
    expect(app.title).toEqual('test-app works!');
  }));
});
