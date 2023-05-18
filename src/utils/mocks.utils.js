import { faker } from "@faker-js/faker";

//faker.setLocale("es");

function generateProduct() {
  return {
    _id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseInt(faker.commerce.price()),
    thumbnail: [faker.image.url()],
    code: faker.location.zipCode(),
    stock: faker.number.int(300),
    status: faker.datatype.boolean(),
    category: faker.commerce.department(),
  };
}

export function generateProducts(quantity) {
  const products = [];
  for (let i = 0; i < quantity; i++) {
    const product = generateProduct();
    products.push(product);
  }
  return products;
}
