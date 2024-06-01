import Book from "../models/book.js";
import BorrowTransaction from "../models/borrowTransaction.js";
import Member from "../models/member.js";

import * as helper from "../helper.js";

export const index = async (req, res) => {
  try {
    let data = await Book.find().sort("title");

    return helper.response(res, 200, "book list", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};

export const borrow = async (req, res) => {
  try {
    const { member, book } = req.body;

    switch (true) {
      case !member:
        return helper.response(res, 400, "member is required");
      case !book:
        return helper.response(res, 400, "book is required");
      case book.length == 0:
        return helper.response(res, 400, "book can't be empty");
      case book.length > 2:
        return helper.response(res, 400, "max book can be borrowed is 2");
    }

    const memberExists = await Member.findById(member);

    if (!memberExists) {
      return helper.response(res, 400, "member not found");
    } else if (memberExists.penalized == 1) {
      return helper.response(res, 400, "member is being penalized");
    } else if (memberExists.borrowed > 0) {
      return helper.response(res, 400, "member has borrowed some books");
    }

    let identic = false;

    if (book.length == 2) {
      if (book[0] == book[1]) {
        identic = true;
      }
    }

    if (identic) {
      const bookExists = await Book.findById(book[0]);

      if (!bookExists) {
        return helper.response(res, 400, "book not found");
      } else if (bookExists.stock < 2) {
        return helper.response(res, 400, "book is out of stock");
      }

      const beingBorrowed = await BorrowTransaction.findOne({
        member,
        $and: [
          {
            book: book[0],
          },
          {
            status: "active",
          },
        ],
      });

      if (beingBorrowed) {
        return helper.response(
          res,
          400,
          `book ${bookExists.title} is already borrowed`
        );
      }
    } else {
      for (let i = 0; i < book.length; i++) {
        const bookExists = await Book.findById(book[i]);

        if (!bookExists) {
          return helper.response(res, 400, "book not found");
        } else if (bookExists.stock == 0) {
          return helper.response(res, 400, "book is out of stock");
        }

        const beingBorrowed = await BorrowTransaction.findOne({
          member,
          $and: [
            {
              book: book[i],
            },
            {
              status: "active",
            },
          ],
        });

        if (beingBorrowed) {
          return helper.response(
            res,
            400,
            `book ${bookExists.title} is already borrowed`
          );
        }
      }
    }

    for (let i = 0; i < book.length; i++) {
      const bookExists = await Book.findById(book[i]);

      await BorrowTransaction.create({
        member,
        book: book[i],
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      await Book.findByIdAndUpdate(
        book[i],
        {
          stock: bookExists.stock - 1,
        },
        { new: true }
      );
    }

    await Member.findByIdAndUpdate(
      member,
      {
        borrowed: book.length,
      },
      {
        new: true,
      }
    );

    const data = await BorrowTransaction.find({
      member,
      $and: [
        {
          status: "active",
        },
      ],
    });

    return helper.response(res, 200, "success", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};

export const returnBook = async (req, res) => {
  try {
    const { member, book } = req.body;

    switch (true) {
      case !member:
        return helper.response(res, 400, "member is required");
      case !book:
        return helper.response(res, 400, "book is required");
    }

    const memberExists = await Member.findById(member);

    if (!memberExists) {
      return helper.response(res, 400, "member not found");
    }

    const bookExists = await Book.findById(book);

    if (!bookExists) {
      return helper.response(res, 400, "book not found");
    }

    const legal = await BorrowTransaction.findOne({
      member,
      $and: [
        {
          book,
        },
        {
          status: "active",
        },
      ],
    });

    if (!legal) {
      return helper.response(res, 400, "boom is not borrowed by member");
    }

    const overdue = helper.isPenalized(legal.deadline);

    let message = "return success";

    if (overdue) {
      message = "return success, member is penalized due to late returning";

      await Member.findByIdAndUpdate(
        member,
        {
          borrowed: memberExists.borrowed - 1,
          penalized: 1,
          penalized_expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        },
        {
          new: true,
        }
      );
    } else {
      await Member.findByIdAndUpdate(
        member,
        {
          borrowed: memberExists.borrowed - 1,
        },
        {
          new: true,
        }
      );
    }

    await Book.findByIdAndUpdate(
      book,
      {
        stock: bookExists.stock + 1,
      },
      { new: true }
    );

    const data = await BorrowTransaction.findByIdAndUpdate(legal._id, {
      status: "done",
    });

    return helper.response(res, 200, message, data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
