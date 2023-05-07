import Modal from "@/components/shared/modal";
import { ofetch } from "ofetch";
import {
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
} from "react";
import Button from "./button";

const ProductsModal = ({
  showProductsModal,
  setShowProductsModal,
  products,
}: {
  showProductsModal: boolean;
  setShowProductsModal: Dispatch<SetStateAction<boolean>>;
  products: any;
}) => {
  const getCredits = async (productId: string) => {
    const checkoutData = await ofetch("/api/checkout", {
      query: { productId },
    });
    const checkoutUrl = checkoutData.link;
    if (checkoutUrl) window.open(checkoutUrl, "_blank");
  };

  return (
    <Modal showModal={showProductsModal} setShowModal={setShowProductsModal}>
      <div className="w-full overflow-hidden bg-white md:max-w-md md:rounded-2xl md:border md:border-gray-100 md:shadow-xl">
        <div className="flex flex-row items-center justify-center space-x-3 p-4">
          {products &&
            products.map((product: any) => (
              <div
                key={product.id}
                className="flex h-60 w-80 flex-col items-center justify-between rounded-lg bg-green-200 p-4"
              >
                <div className="flex flex-col space-y-1">
                  <span className="text-2xl font-bold">
                    {product.attributes.name}
                  </span>
                  <span className="text-xl">
                    {product.attributes.price_formatted}
                  </span>
                  <span className="mt-4">
                    {product.attributes.description
                      .replace("<p>", "")
                      .replace("</p>", "")}
                  </span>
                </div>
                <Button
                  type="button"
                  onClick={() => getCredits(product.id)}
                  className="h-10 w-full justify-center text-lg font-normal"
                >
                  Checkout
                </Button>
              </div>
            ))}
        </div>
      </div>
    </Modal>
  );
};

export function useProductsModal(products: any) {
  const [showProductsModal, setShowProductsModal] = useState(false);

  const ProductsModalCallback = useCallback(() => {
    return (
      <ProductsModal
        showProductsModal={showProductsModal}
        setShowProductsModal={setShowProductsModal}
        products={products}
      />
    );
  }, [showProductsModal, products]);

  return useMemo(
    () => ({ setShowProductsModal, ProductsModal: ProductsModalCallback }),
    [setShowProductsModal, ProductsModalCallback],
  );
}
