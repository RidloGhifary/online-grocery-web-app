import convertRupiah from "./convertRupiah";

interface Props {
  price: number;
  product_discount: { discount: number; discount_type: string };
}

const calculatedDiscount = ({ price, product_discount }: Props) => {
  const originalPrice = price || 0;
  const discountInfo = product_discount;

  if (!discountInfo) {
    return convertRupiah(originalPrice);
  }

  const { discount, discount_type } = discountInfo;

  if (discount_type === "percentage") {
    const discountAmount = (originalPrice * discount) / 100;
    return convertRupiah(originalPrice - discountAmount);
  } else if (discount_type === "nominal") {
    return convertRupiah(originalPrice - discount);
  } else {
    return convertRupiah(originalPrice);
  }
};

export default calculatedDiscount;
