type Product = {
  productId: number;
  productName: string;
};

class ProductFetcher {
  static async operator(productId: number): Promise<Product[] | null> {
    try {
      const response = await fetch(`/shop/productId=${productId}`);
      return await response.json(); // Response 객체는 Product[] 타입이라고 가정
    } catch (e) {
      return null;
    }
  }
}
