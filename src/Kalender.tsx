import { useEffect, useState } from 'react'

type Item = { id: number; judul: string; platform: string; status: string; tanggal_tayang: string | null }

const HARI = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

function kunci(t: Date) {
  const m = String(t.getMonth() + 1).padStart(2, '0')
  const d = String(t.getDate()).padStart(2, '0')
  return t.getFullYear() + '-' + m + '-' + d
}

export default function Kalender() {
  const hariIni = kunci(new Date())
  const [tahun, setTahun] = useState(new Date().getFullYear())
  const [bulan, setBulan] = useState(new Date().getMonth())
  const [pilih, setPilih] = useState(hariIni)
  const [daftar, setDaftar] = useState<Item[]>([])
  const [gagal, setGagal] = useState(false)

  useEffect(() => {
    fetch('/api/konten')
      .then((r) => {
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then(setDaftar)
      .catch(() => setGagal(true))
  }, [])

  function geser(n: number) {
    const t = new Date(tahun, bulan + n, 1)
    setTahun(t.getFullYear())
    setBulan(t.getMonth())
  }

  const awal = (new Date(tahun, bulan, 1).getDay() + 6) % 7
  const jumlah = new Date(tahun, bulan + 1, 0).getDate()
  const sel: (number | null)[] = []
  for (let i = 0; i < awal; i++) sel.push(null)
  for (let d = 1; d <= jumlah; d++) sel.push(d)
  const milik = (k: string) => daftar.filter((x) => x.tanggal_tayang === k)
  const kunciHari = (d: number) => kunci(new Date(tahun, bulan, d))

  if (gagal) return <p className="pesan">Gagal memuat data. Pastikan API berjalan.</p>

  return (
    <div>
      <div className="kal-kepala">
        <button className="hapus" onClick={() => geser(-1)}>‹</button>
        <strong>{BULAN[bulan]} {tahun}</strong>
        <button className="hapus" onClick={() => geser(1)}>›</button>
      </div>
      <div className="kal-grid">
        {HARI.map((h) => <div key={h} className="kal-hari">{h}</div>)}
        {sel.map((d, i) => d === null ? <div key={'k' + i} /> : (
          <button key={d} className={'kal-sel' + (kunciHari(d) === pilih ? ' pilih' : '') + (kunciHari(d) === hariIni ? ' ini' : '')} onClick={() => setPilih(kunciHari(d))}>
            {d}
            {milik(kunciHari(d)).length > 0 && <i className="titik">{milik(kunciHari(d)).length}</i>}
          </button>
        ))}
      </div>
      <h3 className="kal-judul">{pilih}</h3>
      <div className="daftar">
        {milik(pilih).length === 0 && <p className="pesan">Tidak ada konten di tanggal ini.</p>}
        {milik(pilih).map((k) => (
          <div key={k.id} className="item">
            <div>
              <div>{k.judul}</div>
              <small style={{ color: 'var(--abu)' }}>{k.platform} · {k.status}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
