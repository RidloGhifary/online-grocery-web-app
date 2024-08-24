import { productsCategories } from '@/mocks/productCategory';
import Radio from '../../ui/Radio';

export default function CategoryFilter() {
  return (
    <>
      <Radio defaultChecked={true} value={'all'}>
        All
      </Radio>
      {productsCategories.map((e) => {
        return <Radio value={e.name}>{e.display_name}</Radio>;
      })}
    </>
  );
}
