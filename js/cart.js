const Cart = {
  data: [],

  tambah(item) {
    this.data.push(item);
    UI.renderCart();
  },

  clear() {
    this.data = [];
    UI.renderCart();
  },

  total() {
    return this.data.reduce((t, i) => t + i.harga, 0);
  }
};
