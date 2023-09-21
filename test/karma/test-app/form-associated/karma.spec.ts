import { setupDomTests } from '../util';

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

  it('should echo a value out to the form', async () => {
    const formEl = app.querySelector("form");
    const face = app.querySelector('form-associated');

    // @ts-ignore
    face.shadowRoot.querySelector('input').value = "setting a form value!";
    const formData = new FormData(formEl);
    expect(formData.get("test-input")).toBe("setting a form value!");
  });
});
