import { Component, h, FormInternals } from '@stencil/core';

@Component({
  tag: 'form-associated',
  shadow: {
    formAssociated: true,
  },
})
export class FormAssociatedCmp {
  @FormInternals()
  internals: ElementInternals;

  componentWillLoad() {
    this.internals.setFormValue('my default value');
  }

  render() {
    return <span>hey!</span>;
  }
}
