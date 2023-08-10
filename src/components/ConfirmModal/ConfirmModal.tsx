import {
  ActionIcon,
  Alert,
  Button,
  Modal,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconArrowBack,
  IconCheck,
  IconTrash,
} from "@tabler/icons-react";

interface IConfirmModal {
  opened: boolean;
  onClose: () => void;
  actionDescription: string | React.ReactNode;
  action: () => void;
}

const ConfirmModal: React.FC<IConfirmModal> = ({
  action,
  actionDescription,
  opened,
  onClose,
}) => {
  return (
    <Modal withCloseButton={false} opened={opened} onClose={onClose} centered>
      <div className="flex flex-col items-center justify-center">
        <Text className="mb-5 font-bold">
          Are you sure you want to do this?
        </Text>
        <IconTrash size={"5rem"} className="mb-5" />
        <Alert
          icon={<IconAlertCircle />}
          title="This action is permanent"
          color="red"
          className="mb-5"
        >
          {actionDescription}
        </Alert>
        <div className="flex w-1/2 flex-row items-center justify-between">
          <ActionIcon variant="subtle" onClick={onClose}>
            <IconArrowBack />
          </ActionIcon>
          <Button color="red" variant="subtle" onClick={action}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
