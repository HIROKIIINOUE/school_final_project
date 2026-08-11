import { supabase } from "@/lib/supabaseClient";
import {
  CreateExpenseInput,
  Expense,
  ExpenseTripData,
} from "../types/expense.type";

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

if (!backendUrl) {
  throw new Error("EXPO_PUBLIC_BACKEND_URL is not configured");
}

async function getAuthorizationHeader() {
  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session?.access_token) {
    throw new Error("Access token not found");
  }

  return { Authorization: `Bearer ${data.session.access_token}` };
}

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message ?? data.message ?? "Request failed");
  }

  return data.data as T;
}

export async function fetchExpenses(tripId: string): Promise<Expense[]> {
  const authorization = await getAuthorizationHeader();
  const response = await fetch(`${backendUrl}/api/expenses/${tripId}`, {
    headers: { "Content-Type": "application/json", ...authorization },
  });

  return parseResponse<Expense[]>(response);
}

export async function fetchExpense(
  tripId: string,
  expenseId: string,
): Promise<Expense> {
  const authorization = await getAuthorizationHeader();
  const response = await fetch(
    `${backendUrl}/api/expenses/${tripId}/${expenseId}`,
    { headers: { "Content-Type": "application/json", ...authorization } },
  );

  return parseResponse<Expense>(response);
}

export async function fetchExpenseTripData(
  tripId: string,
): Promise<ExpenseTripData> {
  const authorization = await getAuthorizationHeader();
  const response = await fetch(`${backendUrl}/api/expenses/${tripId}/members`, {
    headers: { "Content-Type": "application/json", ...authorization },
  });

  return parseResponse<ExpenseTripData>(response);
}

export async function createExpense(
  tripId: string,
  input: CreateExpenseInput,
): Promise<Expense> {
  const authorization = await getAuthorizationHeader();
  const response = await fetch(`${backendUrl}/api/expenses/${tripId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authorization },
    body: JSON.stringify(input),
  });

  return parseResponse<Expense>(response);
}

export async function deleteExpense(
  tripId: string,
  expenseId: string,
): Promise<void> {
  const authorization = await getAuthorizationHeader();
  const response = await fetch(
    `${backendUrl}/api/expenses/${tripId}/${expenseId}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json", ...authorization },
    },
  );

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error?.message ?? data?.message ?? "Failed to delete expense");
  }
}

export async function updateExpense(
  tripId: string,
  expenseId: string,
  input: CreateExpenseInput,
): Promise<Expense> {
  const authorization = await getAuthorizationHeader();
  const response = await fetch(
    `${backendUrl}/api/expenses/${tripId}/${expenseId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authorization },
      body: JSON.stringify(input),
    },
  );

  return parseResponse<Expense>(response);
}
