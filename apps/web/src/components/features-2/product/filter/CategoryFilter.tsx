import { productsCategories } from '@/mocks/productCategory';
import Radio from '../../ui/Radio';

export default function CategoryFilter() {
  return (
    <>
      
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
