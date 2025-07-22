// utils/mappers.ts
import type { Firsat } from '../services/firsatService'
import type { Product }    from '../types/product'

export const mapFirsatToOpportunity = (f: Firsat) => ({
  id: f.id,
  title: f.baslik,
  customerName: f.musteri?.isim ?? null,
  value: f.deger,
  stage: f.asama,
  note: f.aciklama,
  probability: f.olasilik,
  expectedCloseDate: f.beklenen_kapanis_tarihi,
})

export const mapProduct = (p: any): Product => {
  /* Kategori string’ini üret */
  const category =
    p.kategori && typeof p.kategori === 'object'
      ? p.kategori.ad                          // eager-loaded obje
      : typeof p.kategori === 'string'
        ? p.kategori                           // sadece ad string’i
        : undefined;                           // null / undefined

  return {
    /* Front-end’de name kullanıyorsanız: */
    id:           p.id,
    ad:         p.ad,                        // <-- AD → NAME
    description:  p.aciklama ?? '',
    sku:          p.sku,
    category,                                 // string | undefined
    categoryId:   p.kategori_id ?? undefined,

    price:        Number(p.fiyat)    || 0,
    cost:         p.maliyet ? Number(p.maliyet) : undefined,
    stock:        Number(p.stok)     || 0,
    minStock:     Number(p.min_stok) || 0,

    /* ‘out_of_stock’ mantığı */
    status:
      Number(p.stok) === 0
        ? 'out_of_stock'
        : (p.durum as Product['status']) ?? 'active',

    image:        Array.isArray(p.resimler) ? p.resimler[0] : undefined,
    tags:         p.etiketler ?? undefined,
    customFields: p.ozel_alanlar ?? undefined,

    createdAt:    p.created_at,
    updatedAt:    p.updated_at,
  }
}