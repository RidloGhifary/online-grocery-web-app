import { ReactNode } from 'react';

export default function Radio({
  children,
  defaultChecked = false,
  value
}: {
  children?: ReactNode;
  defaultChecked?: boolean;
  value?: string
}) {
  return (
    <>
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">{children}</span>
          <input
            type="radio"
            name="radio-10"
            className="radio checked:bg-base-300"
            defaultChecked={defaultChecked}
            value={value??undefined}
          />
        </label>
      </div>
    </>
  );
}
