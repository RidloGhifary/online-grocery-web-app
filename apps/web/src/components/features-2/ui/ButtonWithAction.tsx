import { MouseEventHandler, ReactNode } from "react";

export default function Button({
  action,
  eventType,
  id,
  name,
  replaceTWClass,
  btnSizeTWClass = 'btn-sm',
  colorTWClass = 'btn-primary',
  extraTWClass,
  children,
  type = 'button'
}: {
  action?: MouseEventHandler<HTMLButtonElement>;
  eventType?: 'onClick' | 'onSubmit';
  id?: string | number;
  name?: string;
  replaceTWClass?: string;
  btnSizeTWClass?: string;
  colorTWClass?: string;
  extraTWClass?: string;
  children?: ReactNode;
  type?: 'button' | 'submit';
}) {
  // Combine Tailwind CSS classes
  const combinedClass = replaceTWClass || `btn ${colorTWClass} ${btnSizeTWClass} ${extraTWClass || ''}`;

  // Create an object for event handlers if eventType is provided
  const eventHandlers = eventType && action ? { [eventType]: action } : {};

  return (
    <button
      id={id ? String(id) : undefined}
      name={name}
      className={combinedClass}
      type={type}
      {...eventHandlers}
    >
      {children || 'Button'}
    </button>
  );
}
