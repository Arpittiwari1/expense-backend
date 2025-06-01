const income = require("../models/Income");
const expense = require("../models/Expense");
const { isValidObjectId, Types } = require("mongoose");

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const userObjectId = new Types.ObjectId(userId);

    const totalIncome = await income.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, totalIncome: { $sum: "$amount" } } },
    ]);

    const totalExpense = await expense.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, totalExpense: { $sum: "$amount" } } },
    ]);

    const last60DaysIncomeTransactions = await income.find({
      userId,
      date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    const last30daysExpenseTransactions = await expense.find({
      userId,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    const incomelast60Days = last60DaysIncomeTransactions.reduce(
      (sum, txn) => sum + txn.amount,
      0
    );
    const expenseLast30Days = last30daysExpenseTransactions.reduce(
      (sum, txn) => sum + txn.amount,
      0
    );

    const recentTransactions = [
      ...(await income.find({ userId }).sort({ date: -1 }).limit(5)).map((txn) => ({
        ...txn.toObject(),
        type: "income"
      })),
      ...(await expense.find({ userId }).sort({ date: -1 }).limit(5)).map((txn) => ({
        ...txn.toObject(),
        type: "expense"
      }))
    ].sort((a, b) => b.date - a.date);

    res.json({
      totalBalance:
        (totalIncome[0]?.totalIncome || 0) - (totalExpense[0]?.totalExpense || 0),
      totalIncome: totalIncome[0]?.totalIncome || 0,
      totalExpense: totalExpense[0]?.totalExpense || 0,
      expenseLast30Days: {
        total: expenseLast30Days,
        transactions: last30daysExpenseTransactions,
      },
      incomeLast60Days: {
        total: incomelast60Days,
        transactions: last60DaysIncomeTransactions,
      },
      recentTransactions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
