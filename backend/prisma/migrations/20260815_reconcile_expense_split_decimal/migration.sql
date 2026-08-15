ALTER TABLE "expense_splits"
ALTER COLUMN "owed_amount" TYPE DECIMAL(12, 2)
USING "owed_amount"::DECIMAL(12, 2);