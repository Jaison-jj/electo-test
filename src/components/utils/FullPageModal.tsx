import { X } from 'lucide-react';
import React from 'react';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '54%',
    bottom: '50px',
    left: '50%',
    right: 'auto',
    height: '79%',
    width: '100%',
    // maxWidth: '400px',
    // maxHeight: '70%',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    zIndex: '999',
    backgroundColor: 'white',
    padding: '0',
  },
};

interface FullPageModalProps {
  children: any;
  renderTrigger: React.ReactNode | string;
  styles?: object;
}

const FullPageModal = (props: FullPageModalProps) => {
  const { children, renderTrigger, styles = customStyles } = props;

  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  function onClickClose() {
    setIsOpen(false);
  }

  return (
    <div>
      <button onClick={openModal}>{renderTrigger}</button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={styles}
        contentLabel='Example Modal'
        className='relative bg-white'
      >
        <button
          onClick={onClickClose}
          className='absolute top-[3px] right-[10px] w-8 h-8 z-50'
        >
          <X className='w-6 h-6 ' />
        </button>
        {children}
      </Modal>
    </div>
  );
};

export default FullPageModal;
