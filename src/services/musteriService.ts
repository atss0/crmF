import axios from '../utils/axios' // token'lı axios instance
import qs from 'qs'

export type Musteri = {
  id: number
  isim: string
  eposta: string
  telefon: string
  sirket: string
  adres: string
  durum: 'aktif' | 'pasif' | 'vip'
  etiketler: string[]
  toplam_deger: number
  son_iletisim: string | null
  created_at: string
  updated_at: string
}

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  pages: number
}

// ✅ Tüm müşterileri getir
export const getMusteriler = async (params = {}): Promise<{
    musteriler: Musteri[]
    sayfa_bilgisi: PaginationMeta
    musteri_sayisi: number
  }> => {
    const res = await axios.get('/musteriler', {
      params,
      paramsSerializer: (p) => qs.stringify(p),
    })
  
    const { customers, pagination } = res.data.data
  
    return {
      musteriler: customers,
      sayfa_bilgisi: pagination,
      musteri_sayisi: pagination.total,
    }
  }

// ✅ Tek müşteri getir
export const getMusteri = async (id: number): Promise<Musteri> => {
  const res = await axios.get(`/musteriler/${id}`)
  return res.data.data
}

// ✅ Yeni müşteri oluştur
export const createMusteri = async (data: Partial<Musteri>): Promise<Musteri> => {
  const res = await axios.post('/musteriler', data)
  return res.data.data
}

// ✅ Müşteri güncelle
export const updateMusteri = async (id: number, data: Partial<Musteri>): Promise<Musteri> => {
  const res = await axios.put(`/musteriler/${id}`, data)
  return res.data.data
}

// ✅ Müşteri sil
export const deleteMusteri = async (id: number): Promise<void> => {
  await axios.delete(`/musteriler/${id}`)
}

// ✅ Toplu işlem (sil/guncelle/disari_aktar)
export const bulkMusteri = async (
  action: 'sil' | 'guncelle' | 'disari_aktar',
  musteri_ids: number[],
  data: Record<string, any> = {}
): Promise<{ affected: number }> => {
  const res = await axios.post('/musteriler/bulk', {
    action,
    musteri_ids,
    data,
  })
  return res.data
}