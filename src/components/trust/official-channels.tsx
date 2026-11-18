import { ExternalLink } from "lucide-react";
import { trustContent } from "@/config/customer-trust";
export function OfficialChannels() {
  return (
    <section
      aria-labelledby="channels-heading"
      className="mt-10 rounded-2xl border bg-white p-5 sm:p-7"
    >
      <p className="eyebrow mb-3 text-primary">Lanjut di tempat yang tepat</p>
      <h2 id="channels-heading" className="text-2xl font-bold">
        Kanal registrasi di luar aplikasi
      </h2>
      <p className="mt-3 mb-6 max-w-2xl text-sm leading-7 text-muted-foreground">
        Tautan XL dicocokkan dengan panduan resmi. Periksa alamat situs dan
        petunjuk operator sebelum menyerahkan data. Sales kit tidak membuka
        kamera atau memuat formulir operator di dalam halaman.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {trustContent.registrationChannels.map((channel) => (
          <article
            key={channel.brand}
            className="min-w-0 rounded-xl border bg-background p-5"
          >
            <h3 className="text-lg font-bold">{channel.brand}</h3>
            {channel.url ? (
              <>
                <p className="mt-3 text-sm break-words text-muted-foreground">
                  {channel.url}
                </p>
                <a
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-link mt-4 border bg-white px-3 text-primary"
                >
                  Buka kanal XL
                  <ExternalLink aria-hidden="true" className="size-4" />
                  <span className="sr-only"> (situs eksternal, tab baru)</span>
                </a>
              </>
            ) : (
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Tautan belum dikonfigurasi. Minta arahan melalui kanal operator
                yang diperiksa secara independen.
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
