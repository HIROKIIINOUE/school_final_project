import AddExpenseModal from "./AddExpenseModal";
import {
  CreateExpenseInput,
  ExpenseTripMember,
} from "../types/expense.type";

type Props = {
  visible: boolean;
  members: ExpenseTripMember[];
  onClose: () => void;
  onUpdate: (input: CreateExpenseInput) => Promise<void>;
};

const UpdateExpenseModal = ({
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
    mode="update"
  />
);

export default UpdateExpenseModal;
