const socket = io();
const productSection = document.getElementById("product-list");
const addProduct = document.getElementById("addProduct");
const form = document.getElementById("form");

socket.on("inicio", (products, mensaje) => {
  mensaje && console.log(mensaje);
  productSection.innerHTML = "";
  products.forEach((product) => {
    productSection.innerHTML += `
    <div class="grid">
    <p>${product.title}</p>
    <p>${product.description}</p>
    <p>$${product.price}</p>
    <p>${product.stock}</p>
    <button id=btn-${product.id}>Eliminar</button>
    <div>
    `;
  });
  agregarButton(products);
});

function agregarButton(array) {
  array.forEach((item) => {
    document.getElementById(`btn-${item.id}`).addEventListener("click", () => {
      socket.emit("deleteProduct", item.id);
    });
  });
}

addProduct.onclick = () => {
  form.classList.toggle("hidden");
};

form.onsubmit = (e) => {
  e.preventDefault();
  const newProduct = {
    title: e.target[0].value,
    description: e.target[1].value,
    price: parseInt(e.target[2].value),
    thumbnail: [e.target[3].value],
    code: e.target[4].value,
    stock: parseInt(e.target[5].value),
    status: e.target[6].value === "true" ? true : false,
    category: e.target[7].value,
  };
  socket.emit("addProduct", newProduct);
};
