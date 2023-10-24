import useModalStore from "@/store/features/modal"
import { Modal } from "semantic-ui-react";

const ModalContainer = () => {
  const { isOpen, body, closeModal} = useModalStore();

  return (
    <Modal open={isOpen} onClose={closeModal} size="mini">
      <Modal.Content>
        {body}
      </Modal.Content>
    </Modal>
  )
}

export default ModalContainer