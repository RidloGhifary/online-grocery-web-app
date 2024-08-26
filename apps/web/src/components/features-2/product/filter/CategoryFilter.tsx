import { productsCategories } from '@/mocks/productCategory';
import Radio from '../../ui/Radio';

export default function CategoryFilter() {
  return (
    <>
      <h1 className="my-2 font-bold">Category</h1>
      
      <Radio defaultChecked value={'all'}>
        All
      </Radio>
      {productsCategories.map((e, i) => {
        return (
          <Radio key={i} value={e.name}>
            {e.display_name}
          </Radio>
        );
      })}
     
    </>
  );
}
