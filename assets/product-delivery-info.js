import { ThemeEvents, VariantUpdateEvent } from '@theme/events';
import { morph } from '@theme/morph';

// Module loaded indicator for debugging
//console.log('[product-delivery-note] module loaded');

class ProductDeliveryInfo extends HTMLElement {
  connectedCallback() {
    const closestSection = this.closest('.shopify-section, dialog');
    closestSection?.addEventListener(ThemeEvents.variantUpdate, this.updateDeliveryInfo);
  }

  disconnectedCallback() {
    const closestSection = this.closest('.shopify-section, dialog');
    closestSection?.removeEventListener(ThemeEvents.variantUpdate, this.updateDeliveryInfo);
  }

  /**
   * Update the delivery info block when the variant changes.
   * Mirrors the pattern used in `product-price.js` and `product-inventory.js`.
   * @param {VariantUpdateEvent} event
   */

  updateDeliveryInfo = (event) => {
    try {

      // If a new product was loaded as part of the variant update (combined listing), update our dataset
      if (event.detail.data.newProduct) {
  this.dataset.productId = event.detail.data.newProduct.id;
      } else if (event.target instanceof HTMLElement && event.target.dataset.productId !== this.dataset.productId) {
        // Event is for a different product; ignore it
        return;
      }

      const newDeliveryInfo = event.detail.data?.html?.querySelector('product-delivery')
      if (!newDeliveryInfo) return;

      // Use childrenOnly to preserve any internal state or listeners on this element
      morph(this, newDeliveryInfo, { childrenOnly: true });
    } catch (err) {
      console.error('[product-delivery] updateDeliveryInfo error', err);
    }
  };
}

if (!customElements.get('product-delivery')) {
  customElements.define('product-delivery', ProductDeliveryInfo);
}
