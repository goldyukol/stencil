import { Component, h, AttachInternals } from '@stencil/core';

@Component({
  tag: 'form-associated',
  formAssociated: true,
})
export class FormAssociatedCmp {
  @AttachInternals()
  internals: ElementInternals;

  handleChange(event: any) {
    console.log('Ive been called!');
    this.internals.setFormValue(event.target.value);
  }

  componentWillLoad() {
    this.internals.setFormValue('my default value');
  }

  render() {
    return <input type="text" onInput={(event) => this.handleChange(event)} />;
  }
}
