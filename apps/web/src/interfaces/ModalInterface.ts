import { FormEvent, MutableRefObject, ReactNode } from "react";

export interface ModalInterface {
  show: boolean;
  content: ReactNode | null | undefined;
  actions: ReactNode[] | null;
}

export interface ModalPropsInterface {
  show?: boolean;
  onClose?:
    | ((e?: MouseEvent | FormEvent | undefined | null) => void)
    | undefined;
  children?: ReactNode | undefined;
  closeButton?: boolean;
  scrollable?: boolean;
  actions?: ReactNode[] | undefined;
  theRef?: MutableRefObject<HTMLDialogElement | null> | undefined | null;
  useTCustomContentWidthClass?: string;
  hideCloseButton?: Boolean;
}
