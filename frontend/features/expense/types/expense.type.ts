export type ExpenseProfile = {
  id: number;
  userId: string;
  displayName: string;
  image: string | null;
};

export type ExpenseTripMember = {
  id: string;
  userId: string;
  role: "OWNER" | "MEMBER";
  joinedAt: string;
  profile: ExpenseProfile | null;
};

export type Expense = {
  id: string;
  tripId: string;
  paidByMemberId: string;
  title: string;
  price: number;
  currency: string | null;
  splitType: "EQUAL" | "CUSTOM";
  note: string | null;
  createdAt: string;
  updatedAt: string;
  paidByMember: ExpenseTripMember;
  splits: Array<{
    id: number;
    tripMemberId: string;
    owedAmount: number;
    createdAt: string;
    updatedAt: string;
    tripMember: ExpenseTripMember;
  }>;
};

export type CreateExpenseInput = {
  title: string;
  price: number;
  currency?: string;
  paidByMemberId: string;
  splitType: "EQUAL" | "CUSTOM";
  note?: string;
  splits: Array<{ tripMemberId: string; owedAmount: number }>;
};

export type ExpenseTripData = {
  trip: { title: string; startDate: string | null; endDate: string | null };
  members: ExpenseTripMember[];
};
