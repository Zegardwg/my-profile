export function catalogErrorMessage(error: unknown) {
  if (!(error instanceof Error))
    return "Operasi gagal. Periksa izin dan ruang penyimpanan browser.";
  if (/QuotaExceeded/i.test(error.name))
    return "Penyimpanan browser penuh. Simpan cadangan JSON dan sediakan ruang sebelum mencoba lagi.";
  if (
    /Security|OpenFailed|MissingAPI|DatabaseClosed|Version|UnknownError/i.test(
      error.name,
    )
  )
    return "Penyimpanan lokal belum dapat digunakan. Periksa izin browser atau tutup tab Sales Kit lama, lalu coba lagi.";
  if (error.name === "ZodError")
    return "Data produk tidak valid. Periksa kolom dan status verifikasi sebelum menyimpan.";
  return error.message;
}
