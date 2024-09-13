import { ModalPropsInterface } from "@/interfaces/ModalInterface";
import {
  FormEvent,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { ToastContainer } from "react-toastify";

const getFullWidthRespectingScrollbarInVw = () => {
  const viewportWidth = window.innerWidth;
  const scrollbarWidth = viewportWidth - document.documentElement.clientWidth;
  return `calc(100% - ${scrollbarWidth <= 1 ? 0 : scrollbarWidth}px)`;
};

export function Modal({
  children,
  actions,
  closeButton = true,
  scrollable = false,
  show = false,
  theRef,
  useTCustomContentWidthClass,
  onClose,
  toasterContainer,
  hideCloseButton = false,
}: ModalPropsInterface) {
  const localRef = useRef<HTMLDialogElement | null>(null);
  const modalRef = theRef
    ? (theRef as MutableRefObject<HTMLDialogElement | null>)
    : localRef;
  const modalContentRef = useRef<HTMLDivElement | null>(null);

  const handleClose = useCallback(
    (event?: MouseEvent | FormEvent) => {
      if (onClose) {
        onClose(event);
      }
    },
    [onClose],
  );

  const handleOutsideClick = useCallback(
    (event: MouseEvent) => {
      if (
        modalRef.current &&
        modalRef.current.contains(event.target as Node) &&
        !modalContentRef.current?.contains(event.target as Node)
      ) {
        handleClose(event); // Close the modal when clicking outside
      }
    },
    [handleClose, modalRef],
  );

  useEffect(() => {
    const currentRef = modalRef.current;
    if (show) {
      document.addEventListener("mousedown", handleOutsideClick);
      currentRef?.showModal();
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
      currentRef?.close();
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [show, handleOutsideClick]);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.style.width = getFullWidthRespectingScrollbarInVw();
    }
  }, [modalRef]);

  return (
    <>
      <dialog
        className={`modal ${scrollable ? "overflow-y-auto" : ""}`}
        ref={modalRef}
      >
        <div
          className={`modal-box ${useTCustomContentWidthClass || ""} relative ${scrollable ? "max-h-[90%]" : ""}`}
          ref={modalContentRef}
        >
          <button
            type="button"
            className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
            onClick={handleClose}
          >
            ✕
          </button>
          <div className="pt-2">{children}</div>
          <div className="flex flex-wrap justify-end gap-2">
            {actions &&
              actions.map((action, index) => (
                <div key={index} className="modal-action">
                  {action}
                </div>
              ))}
            {closeButton && (
              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-error"
                  onClick={handleClose}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={handleClose}>
            close
          </button>
        </form>
        {toasterContainer}
      </dialog>
    </>
  );
}
