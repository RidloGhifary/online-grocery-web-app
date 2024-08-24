import Drawer from '@/components/features-2/layouts/Drawer';
import SidePanel from '@/components/features-2/layouts/SidePanel';
import ProductSideFilter from '@/components/features-2/product/side-filter/ProductSideFilter';
import PublicProductList from '@/components/features-2/product/PublicProductList';

export default function Page() {
  return (
    <>
      <Drawer
        sidePanel={
          <SidePanel>
            <ProductSideFilter />
          </SidePanel>
        }
      >
        <h1>hello</h1>
        {/* <Card/> */}
        <PublicProductList />
      </Drawer>
    </>
  );
}
