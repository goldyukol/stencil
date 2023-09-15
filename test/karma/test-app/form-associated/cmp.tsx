import { Component, h, FormInternals } from '@stencil/core';

@Component({
  tag: 'form-associated',
  shadow: { formAssociated: true },
})
export class FormAssociatedCmp {
  @FormInternals()
  internals: ElementInternals;

  constructor() {
    console.error(this);
  }

  render() {
    return <span>hey!</span>;
  }
}
