const UI = {

  init() {
    this.bindEvents();
    this.renderProdukKasir();
  },

  bindEvents() {
    window.login = () => Auth.login();
    window.logout = () => Auth.logout();

    window.showPage = (p) => this.showPage(p);

    window.tambahProduk = () => {
      const nama = document.getElementById("namaProduk").value;
      const harga = document.getElementById("hargaProduk").value;
      Product.tambah(nama, harga);

      document.getElementById("namaProduk").value = "";
      document.getElementById("hargaProduk").value = "";
    };

    window.hapusProduk = (i) => Product.hapus(i);

    window.tambahCart = (i) => Cart.tambah(Product.data[i]);

    window.checkout = () => {
      alert("Transaksi berhasil!");
      Cart.clear();
    };

    window.cariProduk = (val) => this.renderProdukKasir(val);
  },

  showPage(page) {
    document.getElementById("kasirPage").style.display = "none";
    document.getElementById("produkPage").style.display = "none";

    if (page === "kasir") {
      document.getElementById("kasirPage").style.display = "block";
      document.getElementById("pageTitle").innerText = "Kasir";
    }

    if (page === "produk") {
      document.getElementById("produkPage").style.display = "block";
      document.getElementById("pageTitle").innerText = "Produk";
      this.renderProduk();
    }
  },

  renderProduk() {
    const el = document.getElementById("daftarProduk");
    el.innerHTML = "";

    Product.data.forEach((p, i) => {
      el.innerHTML += `
        <div class="card">
          ${p.nama} - Rp ${p.harga}
          <button class="button-danger" onclick="hapusProduk(${i})">Hapus</button>
        </div>
      `;
    });
  },

  renderProdukKasir(keyword = "") {
    const el = document.getElementById("produkList");
    el.innerHTML = "";

    let list = keyword ? Product.cari(keyword) : Product.data;

    list.forEach((p, i) => {
      el.innerHTML += `
        <div class="card" onclick="tambahCart(${i})">
          ${p.nama}<br>Rp ${p.harga}
        </div>
      `;
    });
  },

  renderCart() {
    const el = document.getElementById("cart");
    el.innerHTML = "";

    Cart.data.forEach(item => {
      el.innerHTML += `<div>${item.nama} - Rp ${item.harga}</div>`;
    });

    document.getElementById("total").innerText = Cart.total();
  }
};
