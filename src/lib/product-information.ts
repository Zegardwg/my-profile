import type { Product } from "@/types/product";
export function productInformationLabel(product: Product) {
  return product.informationStatus === "demo"
    ? "DATA DEMO - BUKAN PENAWARAN RESMI"
    : "DIPERIKSA PROMOTOR - BUKAN VERIFIKASI OPERATOR";
}
export function verifiedDescription(product: Product) {
  return product.informationStatus === "demo"
    ? "Informasi fiktif untuk demonstrasi."
    : "Diperiksa secara manual oleh promotor; aplikasi tidak memverifikasi keaslian atau harga operator.";
}
