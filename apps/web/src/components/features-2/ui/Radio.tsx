import { MouseEventHandler, ReactNode } from 'react';

export default function Radio({
  children,
  defaultChecked = false,
  value,
  action
}: {
  children?: ReactNode;
  defaultChecked?: boolean;
  value?: string;
  action?: MouseEventHandler<HTMLInputElement>
}) {
  
  return (
    <>
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">{children}</span>
          <input
            type="radio"
            name='category'
            className="radio checked:bg-base-300"
            defaultChecked={defaultChecked}
            // defaultChecked={true}
            value={value??undefined}
            onClick={action}
          />
        </label>
      </div>
    </>
  );
}
