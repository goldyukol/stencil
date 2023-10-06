import { transpileModule } from './transpile';

describe('parse form associated', function () {
  it('should set formAssociated if passed to decorator', async () => {
    const t = transpileModule(`
    @Component({
      tag: 'cmp-a',
      formAssociated: true
    })
    export class CmpA {
    }
    `);
    expect(t.cmp!.formAssociated).toBe(true);
    // the formInternalsMemberName should be null since the `@FormInternals` decorator
    // isn't used
    expect(t.cmp!.formInternalsMemberName).toBe(null);
  });

  it('should set formInternalsMemberName and formAssociated when both set', async () => {
    const t = transpileModule(`
    @Component({
      tag: 'cmp-a',
      formAssociated: true
    })
    export class CmpA {
      @FormInternals()
      myProp;
    }
    `);
    expect(t.cmp!.formAssociated).toBe(true);
    expect(t.cmp!.formInternalsMemberName).toBe('myProp');
  });

  it('should not set formInternalsMemberName or formAssociated if neither set', async () => {
    const t = transpileModule(`
    @Component({
      tag: 'cmp-a',
    })
    export class CmpA {
    }
    `);
    expect(t.cmp!.formAssociated).toBe(false);
    expect(t.cmp!.formInternalsMemberName).toBe(null);
  });

  it('should not set formInternalsMemberName or formAssociated if neither set and scoped', async () => {
    const t = transpileModule(`
    @Component({
      tag: 'cmp-a',
      scoped: true,
    })
    export class CmpA {
    }
    `);
    expect(t.cmp!.formAssociated).toBe(false);
    expect(t.cmp!.formInternalsMemberName).toBe(null);
  });
});
