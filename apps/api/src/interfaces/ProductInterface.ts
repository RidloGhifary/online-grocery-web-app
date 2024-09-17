export interface UpdateProductInputInterface {
  id?: number;
  sku?: string;
  name?: string;
  slug?: string | null;
  product_category_id?: number;
  description?: string | null;
  unit?: string;
  price?: number;
  image?: string | null;
  unit_in_gram?: number | null;
}
