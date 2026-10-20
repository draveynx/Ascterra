import { useEffect, useState } from 'react'

type Item = { id: number; judul: string; platform: string; status: string }

const STATUS = ['ide', 'produksi', 'siap', 'tayang']

export default function Dashboard(props: { bukaKonten: () => void }) {
  const [daftar, setDaftar] = useState<Item[]>([])
  const [memuat, setMemuat] = useState(true)
  const [gagal, setGagal] = useState(false)

  useEffect(() => {
    fetch('/api/konten')
      .then((r) => {
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then(setDaftar)
      .catch(() => setGagal(true))
      .finally(() => setMemuat(false))
  }, [])

  if (memuat) return <p className="pesan">Memuat...</p>
  if (gagal) return <p className="pesan">Gagal memuat data. Pastikan API berjalan.</p>

  return (
    <div>
      <div className="statistik">
        {STATUS.map((s) => (
          <div key={s} className="kartu stat">
            <strong>{daftar.filter((k) => k.status === s).length}</strong>
            <span>{s}</span>
          </div>
        ))}
      </div>
      <div className="kartu" style={{ marginTop: 16 }}>
        <p>{daftar.length === 0 ? 'Belum ada konten. Mulai dengan konten pertama Anda.' : 'Total ' + daftar.length + ' konten.'}</p>
        <button className="tombol" onClick={props.bukaKonten}>Kelola konten</button>
      </div>
    </div>
  )
}
