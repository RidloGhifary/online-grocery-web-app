import { HTMLAttributes } from 'react';

export default function Card({
  extraCardCSSClassName,
  baseSizeClassName
}: {
  extraCardCSSClassName?: HTMLAttributes<HTMLDivElement>['className'];
  baseSizeClassName?: HTMLAttributes<HTMLDivElement>['className'];
}) {
  return (
    <>
      <div className={`card bg-base-300 ${baseSizeClassName??'w-64'} shadow-xl ${extraCardCSSClassName}`}>
        <figure>
          <img
            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            alt="Shoes"
          />
        </figure>
        <div className="card-body p-3">
          <h2 className="card-title ">Shoes!</h2>
          <p>If a dog chews shoes whose shoes does he choose?</p>
          {/* <div className="card-actions justify-end">
            <button className="btn btn-primary">Buy Now</button>
          </div> */}
        </div>
      </div>
    </>
  );
}
