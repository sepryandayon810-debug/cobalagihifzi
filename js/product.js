const Product = {
  data: [],

  tambah(nama, harga) {
    this.data.push({ nama, harga: Number(harga) });
    UI.renderProduk();
    UI.renderProdukKasir();
  },

  hapus(index) {
    this.data.splice(index, 1);
    UI.renderProduk();
    UI.renderProdukKasir();
  },

  cari(keyword) {
    return this.data.filter(p =>
      p.nama.toLowerCase().includes(keyword.toLowerCase())
    );
  }
};
