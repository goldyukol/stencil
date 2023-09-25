import { setupDomTests, waitForChanges } from '../util';

describe('form associated', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/form-associated/index.html', 500);
  });
  afterEach(tearDownDom);

  it('should render without errors', async () => {
    const elm = app.querySelector('form-associated');
    expect(elm).not.toBeNull();
  });

  // it('should link up to the surrounding form', async () => {
  //   const formEl = app.querySelector("form");
  //   await waitForChanges();
  //   const formData = new FormData(formEl);
  //   expect(formData.get("test-input")).toBe("my default value");
  // });
});
