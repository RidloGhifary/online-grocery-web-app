import { ModalPropsInterface } from "@/interfaces/ModalInterface";
import {
  FormEvent,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
} from "react";

// Function to calculate full width considering scrollbar
const getScrollbarWidth = () => {
  // Create a temporary element to measure scrollbar width
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll'; // forcing scrollbars
  outer.style.width = '50px';
  outer.style.height = '50px';
  document.body.appendChild(outer);

  const inner = document.createElement('div');
  outer.appendChild(inner);

  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

  document.body.removeChild(outer);

  return scrollbarWidth;
};

const getFullWidthRespectingScrollbarInVw = () => {
  const scrollbarWidth = getScrollbarWidth();
  return scrollbarWidth > 0
    ? `calc(100% - ${scrollbarWidth}px)`
    : '100%'; // Use 100% if no scrollbar detected
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
  const hasWindow = typeof window !== 'undefined';
  const hasDocs = typeof document !== 'undefined';
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
    const setModalWidth = () => {
      if (modalRef.current && hasWindow && hasDocs) {
        const width = getFullWidthRespectingScrollbarInVw();
        modalRef.current!.style.width = width;
        // console.log('Modal width set to:', width);
      }
    };

    // Set the width when component mounts
    setModalWidth();

    // Set the width on window resize
    window.addEventListener('resize', setModalWidth);

    // Clean up resize event listener
    return () => {
      window.removeEventListener('resize', setModalWidth);
    };
  }, [modalRef, hasWindow, hasDocs]);

  // Recalculate width on window load
  useEffect(() => {
    if (hasWindow && hasDocs) {
      window.addEventListener('load', () => {
        if (modalRef.current) {
          modalRef.current.style.width = getFullWidthRespectingScrollbarInVw();
          // console.log('Modal width recalculated on load:', getFullWidthRespectingScrollbarInVw());
        }
      });
    }
  }, [hasWindow, hasDocs]);

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
