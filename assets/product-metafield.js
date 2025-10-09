import { ThemeEvents } from '@theme/events';
import { morph } from '@theme/morph';

class ProductMetafield extends HTMLElement {
  connectedCallback() {
    const closestSection = this.closest('.shopify-section, dialog');
    closestSection?.addEventListener(ThemeEvents.variantUpdate, this.#onVariantUpdate);
  }

  disconnectedCallback() {
    const closestSection = this.closest('.shopify-section, dialog');
    closestSection?.removeEventListener(ThemeEvents.variantUpdate, this.#onVariantUpdate);
  }

  /** @param {any} event */
  #onVariantUpdate = (event) => {
    try {
      if (event.detail.data.newProduct) {
        this.dataset.productId = event.detail.data.newProduct.id;
      } else if (event.target instanceof HTMLElement && event.target.dataset.productId !== this.dataset.productId) {
        return;
      }

      // Build a selector that uniquely identifies this block in the returned HTML.
      // We rely on the server-rendered block to include the same data attributes (namespace/key/output)
      const namespace = this.dataset.metafieldNamespace;
      const key = this.dataset.metafieldKey;
      const output = this.dataset.metafieldOutput;

      let selector = 'product-metafield';
      if (namespace) selector += `[data-metafield-namespace="${namespace}"]`;
      if (key) selector += `[data-metafield-key="${key}"]`;
      if (output) selector += `[data-metafield-output="${output}"]`;

      const newNode = event.detail.data?.html?.querySelector(selector);
      if (!newNode) return;

      morph(this, newNode, { childrenOnly: true });
    } catch (err) {
      console.error('[product-metafield] onVariantUpdate error', err);
    }
  };
}

if (!customElements.get('product-metafield')) {
  customElements.define('product-metafield', ProductMetafield);
}
