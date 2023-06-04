import supertest from "supertest";

export const requester = supertest("http://localhost:8080");

export const helpers = {
  credentials: {
    admin: {
      email: "adminCoder@coder.com",
      password: "adminCod3r123",
    },
    user: {
      email: "Brody94@yahoo.com",
      password: "eANDPo2sgydOKn3",
    },
    premium: {
      email: "Malcolm_Johnson34@yahoo.com",
      password: "0gjhYKEvv2iQL5z",
    },
    owner: {
      email: "Luis67@yahoo.com",
      password: "86wpddRNcT4ZDAa",
    },
  },
  products: {
    getAllKeys: [
      "status",
      "payload",
      "totalPages",
      "prevPage",
      "nextPage",
      "page",
      "hasPrevPage",
      "hasNextPage",
      "prevLink",
      "nextLink",
    ],
    productTypeKeys: [
      "_id",
      "title",
      "description",
      "price",
      "thumbnail",
      "code",
      "stock",
      "status",
      "category",
      "owner",
    ],
    existingId: "6460ee25d5a231b20a35fc2d",
    testProduct: {
      title: "test product",
      description: "testing",
      price: 100,
      thumbnail: ["testing"],
      code: "abcTesting",
      stock: 5,
      status: true,
      category: "testing",
    },
  },
  carts: {
    LuisProduct: "6460ee25d5a231b20a35fc27",
  },
  sessions: {
    userKeys: ["fullName", "email", "role", "cart"],
  },
  login: async (rol) => {
    return requester.post("/api/auth/jwtLogin").send(helpers.credentials[rol]);
  },
};
