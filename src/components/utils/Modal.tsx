'use client';

import React, { Dispatch, FC, ReactNode, SetStateAction } from 'react';

import { Dialog, DialogContent } from '@/components/ui/dialog';

type TModalProps = {
  renderContent: ReactNode;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  preventOutsideClick?: boolean;
  contentClassName?: string;
};

const Modal: FC<TModalProps> = (props) => {
  const {
    renderContent,
    isOpen,
    setIsOpen,
    preventOutsideClick,
    contentClassName,
  } = props;

  /**
   * The shadCn modal overlay imposes pointerEvents none which prevents reCaptcha image clicks
   * workaround
   */
  React.useEffect(() => {
    setTimeout(() => {
      document.body.style.pointerEvents = 'auto';
    }, 1000);
  }, []);

  return (
    <div className='shadCnModal' style={{ pointerEvents: 'all' }}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className={contentClassName}
          onInteractOutside={
            preventOutsideClick ? (e) => e.preventDefault() : () => null
          }
        >
          {renderContent}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Modal;
