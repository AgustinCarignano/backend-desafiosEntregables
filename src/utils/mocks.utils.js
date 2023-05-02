import { faker } from "@faker-js/faker";

faker.setLocale("es");

function generateProduct() {
  return {
    _id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseInt(faker.commerce.price()),
    thumbnail: [faker.image.imageUrl()],
    code: faker.address.zipCode(),
    stock: faker.datatype.number(300),
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
