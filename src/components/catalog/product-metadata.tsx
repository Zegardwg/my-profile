import type { Product } from "@/types/product";
export function ProductMetadata({ product }: { product: Product }) {
  return (
    <div className="space-y-1 text-[11px] leading-5">
      <p>
        Diperbarui:{" "}
        <time dateTime={product.updatedAt}>
          {product.updatedAt.slice(0, 10)}
        </time>
      </p>
      <p>
        Diverifikasi:{" "}
        {product.lastVerifiedAt ? (
          <time dateTime={product.lastVerifiedAt}>
            {product.lastVerifiedAt}
          </time>
        ) : (
          "Belum diperiksa"
        )}
      </p>
    </div>
  );
}
