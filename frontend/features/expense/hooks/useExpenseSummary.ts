import { Expense } from "../types/expense.type";

type ExpenseSummary = {
  totalTripCost: number;
  youOwe: number;
  areOwed: number;
};

export const useExpenseSummary = (
  expenses: Expense[],
  currentUserId: string | undefined,
): ExpenseSummary => {
  const summary: ExpenseSummary = {
    totalTripCost: 0,
    youOwe: 0,
    areOwed: 0,
  };

  for (const expense of expenses) {
    summary.totalTripCost += expense.price;

    const currentUserSplit = expense.splits.find(
      (split) => split.tripMember.userId === currentUserId,
    );

    if (currentUserSplit && expense.paidByMember.userId !== currentUserId) {
      summary.youOwe += currentUserSplit.owedAmount;
    }

    if (expense.paidByMember.userId === currentUserId) {
      for (const split of expense.splits) {
        if (split.tripMember.userId !== currentUserId) {
          summary.areOwed += split.owedAmount;
        }
      }
    }
  }

  return summary;
};
