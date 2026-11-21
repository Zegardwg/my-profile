import { formatPrice } from "@/lib/product-presentation";

export function SalePrice({
  price,
  originalPrice,
}: {
  price: number;
  originalPrice?: number;
}) {
  if (originalPrice === undefined || originalPrice <= price)
    return <>{formatPrice(price)}</>;

  return (
    <span className="inline-flex max-w-full flex-col items-start gap-1.5">
      <strong>
        <span className="sr-only">Harga promo </span>
        {formatPrice(price)}
      </strong>
      <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-md bg-white px-2 py-1 text-xs leading-5 font-medium tracking-normal text-slate-600">
        <span className="whitespace-nowrap">
          <span className="sr-only">Harga normal </span>
          <s className="decoration-red-600 decoration-2">
            {formatPrice(originalPrice)}
          </s>
        </span>
        <span className="whitespace-nowrap font-semibold text-red-700">
          Hemat {formatPrice(originalPrice - price)}
        </span>
      </span>
    </span>
  );
}
