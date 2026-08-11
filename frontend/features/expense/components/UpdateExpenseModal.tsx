import AddExpenseModal from "./AddExpenseModal";
import {
  CreateExpenseInput,
  Expense,
  ExpenseTripMember,
} from "../types/expense.type";

type Props = {
  expense: Expense;
  visible: boolean;
  members: ExpenseTripMember[];
  onClose: () => void;
  onUpdate: (input: CreateExpenseInput) => Promise<void>;
};

const UpdateExpenseModal = ({
  expense,
  visible,
  members,
  onClose,
  onUpdate,
}: Props) => (
  <AddExpenseModal
    visible={visible}
    members={members}
    onClose={onClose}
    onCreate={onUpdate}
    expense={expense}
    mode="update"
  />
);

export default UpdateExpenseModal;
