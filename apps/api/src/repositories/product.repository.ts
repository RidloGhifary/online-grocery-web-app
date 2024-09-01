import searchFriendlyForLikeQuery from "@/utils/searchFriendlyForLikeQuery"

class ProductRepository {
  async publicProductList({
    category,
    search,
    order = 'ASC'
  }:{
    category?: string,
    search ?: string,
    order : 'ASC'|'DSC'  
  }) {
    const searchable = await searchFriendlyForLikeQuery(search!)
    try {
      
    } catch (error) {
      
    }
  }
}

export const productRepository = new ProductRepository