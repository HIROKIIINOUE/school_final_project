import { AppError } from "../lib/appError";
import { prisma } from "../lib/prisma";
import {
  ExpenseInput,
  ExpenseSplitInput,
  ExpenseSplitUpdateInput,
} from "../schemas/expenses.schema";

type ExpenseWithRelations = {
  id: string;
  tripId: string;
  paidByMemberId: string;
  title: string;
  price: { toString(): string };
  currency: string | null;
  splitType: "EQUAL" | "CUSTOM";
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
  paidByMember: {
    id: string;
    userId: string;
    role: "OWNER" | "MEMBER";
  };
  splits: Array<{
    id: number;
    tripMemberId: string;
    owedAmount: { toString(): string };
    createdAt: Date;
    updatedAt: Date;
    tripMember: { id: string; userId: string; role: "OWNER" | "MEMBER" };
  }>;
};

const expenseInclude = {
  paidByMember: { select: { id: true, userId: true, role: true } },
  splits: {
    select: {
      id: true,
      tripMemberId: true,
      owedAmount: true,
      createdAt: true,
      updatedAt: true,
      tripMember: { select: { id: true, userId: true, role: true } },
    },
    orderBy: { id: "asc" },
  },
} as const;

// check if the user exist in the specific trip
const assertTripAccess = async (tripId: string, userId: string) => {
  const membership = await prisma.tripMember.findUnique({
    where: { tripId_userId: { tripId, userId } },
    select: { id: true },
  });

  if (!membership) {
    throw new AppError(404, "TRIP_NOT_FOUND", "Trip was not found.");
  }
};
// check if all members match exactly with trip members
const assertTripMembers = async (tripId: string, memberIds: string[]) => {
  const uniqueMemberIds = [...new Set(memberIds)];
  const members = await prisma.tripMember.findMany({
    where: { tripId, id: { in: uniqueMemberIds } },
    select: { id: true },
  });

  if (members.length !== uniqueMemberIds.length) {
    throw new AppError(
      400,
      "INVALID_TRIP_MEMBER",
      "All paid and split members must belong to this trip.",
    );
  }
};

const assertSplitTotal = (input: ExpenseInput) => {
  const priceInCents = Math.round(input.price * 100);
  const splitTotalInCents = input.splits.reduce(
    (total, split) => total + Math.round(split.owedAmount * 100),
    0,
  );

  if (splitTotalInCents !== priceInCents) {
    throw new AppError(
      400,
      "INVALID_SPLIT_TOTAL",
      "The total owed amount must equal the expense price.",
    );
  }
};

const serializeExpense = async (expense: ExpenseWithRelations) => {
  const userIds = [
    expense.paidByMember.userId,
    ...expense.splits.map((split) => split.tripMember.userId),
  ];
  const profiles = await prisma.profile.findMany({
    where: { userId: { in: [...new Set(userIds)] } },
    select: { id: true, userId: true, displayName: true, image: true },
  });
  const profilesByUserId = new Map(
    profiles.map((profile) => [profile.userId, profile]),
  );

  return {
    ...expense,
    price: Number(expense.price),
    paidByMember: {
      ...expense.paidByMember,
      profile: profilesByUserId.get(expense.paidByMember.userId) ?? null,
    },
    splits: expense.splits.map((split) => ({
      ...split,
      owedAmount: Number(split.owedAmount),
      tripMember: {
        ...split.tripMember,
        profile: profilesByUserId.get(split.tripMember.userId) ?? null,
      },
    })),
  };
};

const findExpense = async (tripId: string, expenseId: string) => {
  const expense = await prisma.expense.findFirst({
    where: { id: expenseId, tripId },
    include: expenseInclude,
  });

  if (!expense) {
    throw new AppError(404, "EXPENSE_NOT_FOUND", "Expense was not found.");
  }

  return expense as ExpenseWithRelations;
};

const getExpenses = async ({
  tripId,
  userId,
}: {
  tripId: string;
  userId: string;
}) => {
  await assertTripAccess(tripId, userId);
  const expenses = await prisma.expense.findMany({
    where: { tripId },
    include: expenseInclude,
    orderBy: { createdAt: "desc" },
  });

  return Promise.all(
    expenses.map((expense) =>
      serializeExpense(expense as ExpenseWithRelations),
    ),
  );
};

const getExpense = async ({
  tripId,
  expenseId,
  userId,
}: {
  tripId: string;
  expenseId: string;
  userId: string;
}) => {
  await assertTripAccess(tripId, userId);
  return serializeExpense(await findExpense(tripId, expenseId));
};

const createExpense = async ({
  tripId,
  userId,
  input,
}: {
  tripId: string;
  userId: string;
  input: ExpenseInput;
}) => {
  await assertTripAccess(tripId, userId);
  assertSplitTotal(input);
  await assertTripMembers(tripId, [
    input.paidByMemberId,
    ...input.splits.map((split) => split.tripMemberId),
  ]);

  const expense = await prisma.expense.create({
    data: {
      tripId,
      paidByMemberId: input.paidByMemberId,
      title: input.title,
      price: input.price,
      currency: input.currency ?? null,
      splitType: input.splitType,
      note: input.note ?? null,
      splits: { create: input.splits },
    },
    include: expenseInclude,
  });

  return serializeExpense(expense as ExpenseWithRelations);
};

const updateExpense = async ({
  tripId,
  expenseId,
  userId,
  input,
}: {
  tripId: string;
  expenseId: string;
  userId: string;
  input: ExpenseInput;
}) => {
  await assertTripAccess(tripId, userId);
  await findExpense(tripId, expenseId);
  assertSplitTotal(input);
  await assertTripMembers(tripId, [
    input.paidByMemberId,
    ...input.splits.map((split) => split.tripMemberId),
  ]);

  const expense = await prisma.expense.update({
    where: { id: expenseId },
    data: {
      paidByMemberId: input.paidByMemberId,
      title: input.title,
      price: input.price,
      currency: input.currency ?? null,
      splitType: input.splitType,
      note: input.note ?? null,
      splits: { deleteMany: {}, create: input.splits },
    },
    include: expenseInclude,
  });

  return serializeExpense(expense as ExpenseWithRelations);
};

const deleteExpense = async ({
  tripId,
  expenseId,
  userId,
}: {
  tripId: string;
  expenseId: string;
  userId: string;
}) => {
  await assertTripAccess(tripId, userId);
  await findExpense(tripId, expenseId);
  await prisma.expense.delete({ where: { id: expenseId } });
};

const getExpenseSplits = async ({
  tripId,
  expenseId,
  userId,
}: {
  tripId: string;
  expenseId: string;
  userId: string;
}) => {
  const expense = await getExpense({ tripId, expenseId, userId });
  return expense.splits;
};

const createExpenseSplit = async ({
  tripId,
  expenseId,
  userId,
  input,
}: {
  tripId: string;
  expenseId: string;
  userId: string;
  input: ExpenseSplitInput;
}) => {
  await assertTripAccess(tripId, userId);
  await findExpense(tripId, expenseId);
  await assertTripMembers(tripId, [input.tripMemberId]);

  try {
    const split = await prisma.expenseSplit.create({
      data: { expenseId, ...input },
    });
    return { ...split, owedAmount: Number(split.owedAmount) };
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      throw new AppError(
        409,
        "EXPENSE_SPLIT_ALREADY_EXISTS",
        "This member already has a split for the expense.",
      );
    }
    throw error;
  }
};

const updateExpenseSplit = async ({
  tripId,
  expenseId,
  splitId,
  userId,
  input,
}: {
  tripId: string;
  expenseId: string;
  splitId: number;
  userId: string;
  input: ExpenseSplitUpdateInput;
}) => {
  await assertTripAccess(tripId, userId);
  const split = await prisma.expenseSplit.findFirst({
    where: { id: splitId, expenseId },
  });
  if (!split)
    throw new AppError(
      404,
      "EXPENSE_SPLIT_NOT_FOUND",
      "Expense split was not found.",
    );
  const updatedSplit = await prisma.expenseSplit.update({
    where: { id: splitId },
    data: input,
  });
  return { ...updatedSplit, owedAmount: Number(updatedSplit.owedAmount) };
};

const deleteExpenseSplit = async ({
  tripId,
  expenseId,
  splitId,
  userId,
}: {
  tripId: string;
  expenseId: string;
  splitId: number;
  userId: string;
}) => {
  await assertTripAccess(tripId, userId);
  const split = await prisma.expenseSplit.findFirst({
    where: { id: splitId, expenseId },
    select: { id: true },
  });
  if (!split)
    throw new AppError(
      404,
      "EXPENSE_SPLIT_NOT_FOUND",
      "Expense split was not found.",
    );
  await prisma.expenseSplit.delete({ where: { id: splitId } });
};

export {
  createExpense,
  createExpenseSplit,
  deleteExpense,
  deleteExpenseSplit,
  getExpense,
  getExpenses,
  getExpenseSplits,
  updateExpense,
  updateExpenseSplit,
};
