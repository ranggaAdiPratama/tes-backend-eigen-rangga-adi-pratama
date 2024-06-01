import dotenv from "dotenv";
import { id_ID, Faker } from "@faker-js/faker";
import mongoose from "mongoose";

import Book from "./models/book.js";
import BorrowTransaction from "./models/borrowTransaction.js";
import Member from "./models/member.js";
import RefreshToken from "./models/refreshToken.js";
import TokenBlackList from "./models/tokenBlackList.js";
import User from "./models/user.js";
import * as helper from "./helper.js";

dotenv.config();

const env = process.env;

export const faker = new Faker({
  locale: [id_ID],
});

mongoose
  .set("strictQuery", false)
  .connect(env.MONGO_DB_URL)
  .then(() => console.log("Connection Open"))
  .catch((err) => console.log(`DB error => ${err}`));

const seed = async () => {
  await BorrowTransaction.deleteMany({});
  await Member.deleteMany({});
  await Book.deleteMany({});
  await TokenBlackList.deleteMany({});
  await RefreshToken.deleteMany({});
  await User.deleteMany({});

  await User.create({
    name: `${faker.person.firstName("male")} ${faker.person.lastName("male")}`,
    email: "admin@mail.com",
    password: await helper.hashPassword("12345678"),
    username: "admin",
  });

  await Book.create({
    code: faker.string.alphanumeric(8),
    author: `${faker.person.firstName("male")} ${faker.person.lastName(
      "male"
    )}`,
    title: "The Treasure Hunt Chronicles",
    stock: 10,
  });

  await Book.create({
    code: faker.string.alphanumeric(8),
    author: `${faker.person.firstName("female")} ${faker.person.lastName(
      "female"
    )}`,
    title: "Journey to the Unknown",
    stock: 10,
  });

  await Book.create({
    code: faker.string.alphanumeric(8),
    author: `${faker.person.firstName("male")} ${faker.person.lastName(
      "male"
    )}`,
    title: "Exploring New Realms",
    stock: 10,
  });

  await Book.create({
    code: faker.string.alphanumeric(8),
    author: `${faker.person.firstName("male")} ${faker.person.lastName(
      "male"
    )}`,
    title: "The Quest for the Lost City",
    stock: 10,
  });

  await Book.create({
    code: faker.string.alphanumeric(8),
    author: `${faker.person.firstName("female")} ${faker.person.lastName(
      "female"
    )}`,
    title: "Adventures Across Dimensions",
    stock: 10,
  });

  for (let i = 0; i < 5; i++) {
    await Member.create({
      code: faker.string.alphanumeric(10),
      name: `${faker.person.firstName("male")} ${faker.person.lastName(
        "male"
      )}`,
    });

    await Member.create({
      code: faker.string.alphanumeric(10),
      name: `${faker.person.firstName("female")} ${faker.person.lastName(
        "female"
      )}`,
    });
  }
};

seed().then(() => {
  console.log("Seeder running ...");
  mongoose.connection.close();
  console.log("Connection Close");
});
