import * as React from 'react';

import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  // DrawerClose,
  // DrawerDescription,
  // DrawerFooter,
  // DrawerHeader,
  // DrawerTitle,
} from '@/components/ui/drawer';

interface MobileDrawerProps {
  renderTrigger: React.ReactNode;
  children?: React.ReactNode;
}

const MobileDrawer = (props: MobileDrawerProps) => {
  const { renderTrigger, children } = props;

  return (
    <Drawer>
      <DrawerTrigger asChild>{renderTrigger}</DrawerTrigger>
      <DrawerContent className='h-[95%]'>{children}</DrawerContent>
    </Drawer>
  );
};

export default MobileDrawer;
