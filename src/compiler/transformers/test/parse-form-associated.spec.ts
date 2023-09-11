import { transpileModule } from './transpile';

describe('parse form associated', function () {
  it('should set formAssociated if passed to decorator', async () => {
    const t = transpileModule(`
    @Component({
      tag: 'cmp-a',
      shadow: { formAssociated: true }
    })
    export class CmpA {
    }
    `);
    expect(t.cmp.formAssociated).toBe(true);
    // the formInternalsProp should be null since the `@FormInternals` decorator
    // isn't used
    expect(t.cmp.formInternalsProp).toBe(null);
  });

  it('should set formInternalsProp and formAssociated when both set', async () => {
    const t = transpileModule(`
    @Component({
      tag: 'cmp-a',
      shadow: { formAssociated: true }
    })
    export class CmpA {
      @FormInternals()
      myProp;
    }
    `);
    expect(t.cmp.formAssociated).toBe(true);
    expect(t.cmp.formInternalsProp).toBe('myProp');
  });

  it('should not set formInternalsProp if not also formAssociated', async () => {
    const t = transpileModule(`
    @Component({
      tag: 'cmp-a',
    })
    export class CmpA {
      @FormInternals()
      myProp;
    }
    `);
    expect(t.cmp.formAssociated).toBe(false);
    expect(t.cmp.formInternalsProp).toBe(null);
  });

  it('should not set formInternalsProp or formAssociated if neither set', async () => {
    const t = transpileModule(`
    @Component({
      tag: 'cmp-a',
    })
    export class CmpA {
    }
    `);
    expect(t.cmp.formAssociated).toBe(false);
    expect(t.cmp.formInternalsProp).toBe(null);
  });
});
