const Cart = {
  data: [],

  init() {
    this.load();
  },

  simpan() {
    localStorage.setItem("cart", JSON.stringify(this.data));
  },

  load() {
    const data = localStorage.getItem("cart");
    this.data = data ? JSON.parse(data) : [];
  },

  tambah(item) {
    this.data.push(item);
    this.simpan();
    UI.renderCart();
  },

  clear() {
    this.data = [];
    this.simpan();
    UI.renderCart();
  },

  total() {
    return this.data.reduce((t, i) => t + i.harga, 0);
  }
};
