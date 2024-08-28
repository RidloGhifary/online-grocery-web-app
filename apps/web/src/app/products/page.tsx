'use client';
import Drawer from '@/components/features-2/layouts/Drawer';
import SidePanel from '@/components/features-2/layouts/SidePanel';
import ProductFilter from '@/components/features-2/product/filter/ProductFilter';
import PublicProductList from '@/components/features-2/product/PublicProductList';
import { Modal } from '@/components/features-2/ui/Modal';
import SearchBar from '@/components/features-2/ui/SearchBar';
import { useState } from 'react';

export default function Page() {
  const [modalActive, setModalActive] =useState<boolean>(false)
  
  return (
    <>
      <Drawer
        sidePanel={
          <SidePanel>
            <ProductFilter />
          </SidePanel>
        }
      >
        <div className="flex flex-row max-w-full items-center justify-start mx-5 my-5">
          <div className="grow mr-2 lg:mr-0">
            <SearchBar />
          </div>
          <button onClick={(e)=> {setModalActive(true)} } className="btn lg:hidden " >Filter</button>
        </div>
        {/* <Card/> */}
        <PublicProductList />
      </Drawer>
      <Modal show={modalActive} onClose={e=>{setModalActive(false)}}>
        <ProductFilter />
      </Modal>
    </>
  );
}
