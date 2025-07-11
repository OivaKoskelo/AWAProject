declare namespace M {
  interface DropdownOptions {
    alignment?: string;
    autoTrigger?: boolean;
    constrainWidth?: boolean;
    container?: Element;
    coverTrigger?: boolean;
    closeOnClick?: boolean;
    hover?: boolean;
    inDuration?: number;
    outDuration?: number;
  }

  interface Dropdown {
    init: (elements: Element | NodeListOf<Element>, options?: DropdownOptions) => void;
  }

  const Dropdown: Dropdown;
  
  interface ModalOptions {
    opacity?: number;
    inDuration?: number;
    outDuration?: number;
    onOpenStart?: () => void;
    onCloseEnd?: () => void;
  }

  interface ModalInstance {
    open: () => void;
    close: () => void;
    destroy: () => void;
  }

  interface Modal {
    init: (elements: Element | NodeListOf<Element>, options?: ModalOptions) => void;
    getInstance: (element: Element) => ModalInstance;
  }

  const Modal: Modal;
  
}




