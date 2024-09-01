import { ModalPropsInterface } from "@/interfaces/ModalInterface";
import { FormEvent, MutableRefObject, useCallback, useEffect, useRef } from "react";

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
}: ModalPropsInterface) {
  const localRef = useRef<HTMLDialogElement | null>(null);
  const modalRef = theRef ? (theRef as MutableRefObject<HTMLDialogElement | null>) : localRef;

  const handleClose = useCallback(
    (event?: MouseEvent | FormEvent) => {
      if (onClose) {
        onClose(event); // Ensure onClose is called with the correct event parameter
      }
      show=false
      modalRef.current?.close(); // Close the modal
    },
    [onClose, modalRef]
  );

  const handleOutsideClick = useCallback(
    (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose(event); // Close the modal when clicking outside
      }
    },
    [handleClose, modalRef]
  );

  useEffect(() => {
    const currentRef = modalRef.current;
    if (show) {
      document.addEventListener("mousedown", handleOutsideClick);
      currentRef?.showModal();
    } else {
      currentRef?.close();
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
    <dialog className={`modal ${scrollable ? "overflow-y-auto" : ""}`} ref={modalRef}>
      <div className={`modal-box ${useTCustomContentWidthClass||''} relative ${scrollable ? "max-h-[90%]" : ""}`}>
        <form method="dialog">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={handleClose}
          >
            ✕
          </button>
        </form>
        <div className="pt-8">{children}</div>
        <div className="flex flex-wrap gap-2 justify-end ">
          {actions && actions.map((action) => <div key={Date.now()} className="modal-action">{action}</div>)}
          {closeButton && (
            <div className="modal-action">
              <form method="dialog">
                <button type="button" className="btn btn-error" onClick={handleClose}>
                  Close
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
}
