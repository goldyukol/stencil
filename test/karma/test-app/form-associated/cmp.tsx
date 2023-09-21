import { Component, h, FormInternals } from '@stencil/core';

@Component({
  tag: 'form-associated',
  shadow: { formAssociated: true },
})
export class FormAssociatedCmp {
  @FormInternals()
  internals: ElementInternals;

  handleChange(event: any) {
    this.internals.setFormValue(event.target.value);
  }

  render() {
    return (
      <input
        type="text"
        onInput={(event) => this.handleChange(event)}
      />
    )
  }
}
