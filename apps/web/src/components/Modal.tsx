import { ModalPropsInterface } from "@/interfaces/modal";
import {
  FormEvent,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
} from "react";

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
  onClose,
}: ModalPropsInterface) {
  const localRef = useRef<HTMLDialogElement | null>(null);
  const modalRef = theRef
    ? (theRef as MutableRefObject<HTMLDialogElement | null>)
    : localRef;

  const handleClose = useCallback(
    (event?: MouseEvent | FormEvent) => {
      if (onClose) {
        onClose(event); // Ensure onClose is called with the correct event parameter
      }
      show = false;
      modalRef.current?.close(); // Close the modal
    },
    [onClose, modalRef],
  );

  const handleOutsideClick = useCallback(
    (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
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
      // currentRef?.close();
      document.removeEventListener("mousedown", handleOutsideClick);
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
    <dialog
      className={`modal ${scrollable ? "overflow-y-auto" : ""}`}
      ref={modalRef}
    >
      <div className={`modal-box relative ${scrollable ? "max-h-[90%]" : ""}`}>
        <form method="dialog">
          <button
            type="button"
            className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
            onClick={handleClose}
          >
            ✕
          </button>
        </form>
        <div className="py-8">{children}</div>
        <div className="flex flex-wrap justify-end gap-2">
          {actions &&
            actions.map((action) => (
              <div key={Date.now()} className="modal-action">
                {action}
              </div>
            ))}
          {closeButton && (
            <div className="modal-action">
              <form method="dialog">
                <button
                  type="button"
                  className="btn btn-error text-white"
                  onClick={handleClose}
                >
                  Close
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={handleClose}>
          close
        </button>
      </form>
    </dialog>
  );
}
