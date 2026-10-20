import { useEffect, useState } from 'react'

type Item = { id: number; judul: string; platform: string; status: string; tanggal_tayang: string | null }

const PLATFORM = ['tiktok', 'instagram', 'youtube', 'facebook', 'x']
const STATUS = ['ide', 'produksi', 'siap', 'tayang']

export default function Konten() {
  const [daftar, setDaftar] = useState<Item[]>([])
  const [judul, setJudul] = useState('')
  const [platform, setPlatform] = useState('tiktok')
  const [status, setStatus] = useState('ide')
  const [tanggal, setTanggal] = useState('')
  const [pesan, setPesan] = useState('')

  async function muat() {
    try {
      const r = await fetch('/api/konten')
      if (!r.ok) throw new Error()
      setDaftar(await r.json())
      setPesan('')
    } catch {
      setPesan('Gagal memuat data. Pastikan API berjalan.')
    }
  }

  useEffect(() => {
    muat()
  }, [])

  async function tambah() {
    if (!judul.trim()) {
      setPesan('Judul wajib diisi.')
      return
    }
    const r = await fetch('/api/konten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ judul, platform, status, tanggal_tayang: tanggal || null }),
    })
    if (!r.ok) {
      setPesan('Gagal menyimpan konten.')
      return
    }
    setJudul('')
    setTanggal('')
    muat()
  }

  async function ubahTanggal(id: number, tanggal_tayang: string) {
    await fetch('/api/konten/' + id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tanggal_tayang }),
    })
    muat()
  }

  async function hapus(id: number) {
    await fetch('/api/konten/' + id, { method: 'DELETE' })
    muat()
  }

  return (
    <div>
      <div className="kartu form">
        <input className="isian" placeholder="Judul konten" value={judul} onChange={(e) => setJudul(e.target.value)} />
        <select className="isian" value={platform} onChange={(e) => setPlatform(e.target.value)}>
          {PLATFORM.map((p) => <option key={p}>{p}</option>)}
        </select>
        <select className="isian" value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <input className="isian" type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
        <button className="tombol" onClick={tambah}>Tambah konten</button>
      </div>
      {pesan && <p className="pesan">{pesan}</p>}
      <div className="daftar" style={{ marginTop: 16 }}>
        {daftar.map((k) => (
          <div key={k.id} className="item" style={{ justifyContent: 'space-between' }}>
            <div>
              <div>{k.judul}</div>
              <small style={{ color: 'var(--abu)' }}>{k.platform} · {k.status}</small>
            </div>
            <button className="hapus" onClick={() => hapus(k.id)}>Hapus</button>
          </div>
        ))}
      </div>
    </div>
  )
}
