import BorrowTransaction from "../models/borrowTransaction.js";
import Member from "../models/member.js";

import * as helper from "../helper.js";

export const index = async (req, res) => {
  try {
    let data = [];

    const members = await Member.find().sort("name");

    // for (let i = 0; i < members.length; i++) {
    //   if (members[i].penalized_expires) {
    //     const legal = helper.isPenalized(members[i].penalized_expires);

    //     if (legal) {
    //       await Member.findByIdAndUpdate(
    //         members[i]._id,
    //         {
    //           penalized: 0,
    //           penalized_expires: null,
    //         },
    //         {
    //           new: true,
    //         }
    //       );
    //     }
    //   }
    // }

    await Promise.all(
      members.map(async (row) => {
        if (row.penalized_expires) {
          const legal = helper.isPenalized(row.penalized_expires);

          if (legal) {
            await Member.findByIdAndUpdate(
              row._id,
              {
                penalized: 0,
                penalized_expires: null,
              },
              {
                new: true,
              }
            );
          }
        }

        let borrowed = [];

        if (row.borrowed > 0) {
          borrowed = await BorrowTransaction.find({
            member: row._id,
            $and: [
              {
                status: "active",
              },
            ],
          })
            .select("-_id book deadline status")
            .populate({
              path: "book",
              select: "title code author -_id",
            });
        }

        data.push({
          _id: row._id,
          name: row.name,
          buku_dipinjam: borrowed,
          status: row.penalized > 0 ? "pinalti" : "aktif",
          masa_pinalti: row.penalized_expires ?? "",
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        });
      })
    );

    helper.response(res, 200, "member list", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
