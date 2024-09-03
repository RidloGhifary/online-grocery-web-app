import { MouseEventHandler, ReactNode } from "react";

export default function ({
  action,
  eventType = 'onClick',
  id,
  name,
  replaceTWClass,
  btnSizeTWClass = 'btn-sm',
  colorTWClass = 'btn-primary',
  extraTWClass,
  children
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
}) {
  // Combine Tailwind CSS classes
  const combinedClass = replaceTWClass || `btn ${colorTWClass} ${btnSizeTWClass} ${extraTWClass || ''}`;

  // Create the event handler object dynamically
  const eventHandlers = {
    [eventType]: action,
  };

  return (
    <button
      id={id ? String(id) : undefined}
      name={name}
      className={combinedClass}
      {...eventHandlers}
    >
      {children || 'Button'}
    </button>
  );
}
