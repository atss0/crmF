import axios from '../utils/axios' // tokenlı axios instance
import qs from 'qs'

// Tipler
export type Firsat = {
    id: number
    baslik: string
    aciklama: string
    deger: number
    asama: 'lead' | 'proposal' | 'negotiation' | 'won' | 'lost'
    olasilik: number
    beklenen_kapanis_tarihi: string
    musteri_id: number
    musteri?: {
        id: number
        isim: string
        eposta: string
    }
    atanan_id: number
    atanan_kullanici?: {
        id: number
        isim: string
        eposta: string
    }
    etiketler: string[]
    ozel_alanlar: Record<string, any>
    created_at: string
    updated_at: string
}

export type PaginationMeta = {
    page: number
    limit: number
    total: number
    pages: number
}

// ✅ Tüm fırsatları getir
export const getFirsatlar = async (params = {}): Promise<{
    firsatlar: Firsat[]
    sayfalama: PaginationMeta
}> => {
    const res = await axios.get('/firsatlar', {
        params,
        paramsSerializer: (p) => qs.stringify(p),
    })

    return {
        firsatlar: res.data.data.firsatlar,
        sayfalama: res.data.data.sayfalama,
    }
}

// ✅ Tek fırsatı getir
export const getFirsat = async (id: number): Promise<Firsat> => {
    const res = await axios.get(`/firsatlar/${id}`)
    return res.data.data
}

// ✅ Yeni fırsat oluştur
export const createFirsat = async (data: Partial<Firsat>): Promise<Firsat> => {
    const res = await axios.post('/firsatlar', data)
    return res.data.data
}

// ✅ Fırsat güncelle
export const updateFirsat = async (id: number, data: Partial<Firsat>): Promise<Firsat> => {
    const res = await axios.put(`/firsatlar/${id}`, data)
    return res.data.data
}

// ✅ Fırsat sil
export const deleteFirsat = async (id: number): Promise<void> => {
    await axios.delete(`/firsatlar/${id}`)
}

// ✅ Kanban görünüm verisi
export const getFirsatPipeline = async (): Promise<{
    asamalar: {
        id: string
        isim: string
        renk: string
        firsatlar: {
            id: number
            baslik: string
            deger: number
            musteri: string
            olasilik: number
            beklenenKapanisTarihi: string
        }[]
        toplamDeger: number
        adet: number
    }[]
    toplamDeger: number
    toplamAdet: number
}> => {
    const res = await axios.get('/firsatlar/pipeline')
    return res.data.data
}