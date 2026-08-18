import { Expense, ExpenseTripMember } from "../types/expense.type";

export type Settlement = {
  from: ExpenseTripMember;
  to: ExpenseTripMember;
  amount: number;
};

type MemberBalance = { member: ExpenseTripMember; amountInCents: number };

const toCents = (amount: number) => Math.round(amount * 100);

const createSettlementsForGroup = (balances: MemberBalance[]): Settlement[] => {
  const debtors = balances
    .filter((balance) => balance.amountInCents < 0)
    .map((balance) => ({ ...balance, amountInCents: -balance.amountInCents }));
  const creditors = balances
    .filter((balance) => balance.amountInCents > 0)
    .map((balance) => ({ ...balance }));
  const settlements: Settlement[] = [];
  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];
    const amountInCents = Math.min(
      debtor.amountInCents,
      creditor.amountInCents,
    );

    settlements.push({
      from: debtor.member,
      to: creditor.member,
      amount: amountInCents / 100,
    });

    debtor.amountInCents -= amountInCents;
    creditor.amountInCents -= amountInCents;

    if (debtor.amountInCents === 0) debtorIndex += 1;
    if (creditor.amountInCents === 0) creditorIndex += 1;
  }

  return settlements;
};

export const calculateSettlements = (
  expenses: Expense[],
  members: ExpenseTripMember[],
): Settlement[] => {
  const balances = new Map(
    members.map((member) => [member.id, { member, amountInCents: 0 }]),
  );

  for (const expense of expenses) {
    const payer = balances.get(expense.paidByMemberId);
    if (payer) payer.amountInCents += toCents(expense.price);

    for (const split of expense.splits) {
      const debtor = balances.get(split.tripMemberId);
      if (debtor) debtor.amountInCents -= toCents(split.owedAmount);
    }
  }

  const activeBalances = [...balances.values()].filter(
    (balance) => balance.amountInCents !== 0,
  );

  if (activeBalances.length === 0) {
    return [];
  }

  return createSettlementsForGroup(activeBalances);
};
