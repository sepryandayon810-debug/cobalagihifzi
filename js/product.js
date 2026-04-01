const Product = {
  data: [],

  init() {
    this.load();
  },

  simpan() {
    localStorage.setItem("produk", JSON.stringify(this.data));
  },

  load() {
    const data = localStorage.getItem("produk");
    this.data = data ? JSON.parse(data) : [];
  },

  tambah(nama, harga) {
    this.data.push({ nama, harga: Number(harga) });
    this.simpan();
    UI.renderProduk();
    UI.renderProdukKasir();
  },

  hapus(index) {
    this.data.splice(index, 1);
    this.simpan();
    UI.renderProduk();
    UI.renderProdukKasir();
  },

  cari(keyword) {
    return this.data.filter(p =>
      p.nama.toLowerCase().includes(keyword.toLowerCase())
    );
  }
};
