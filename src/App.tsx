import { useState } from 'react'
import Konten from './Konten'
import Kalender from './Kalender'
import Dashboard from './Dashboard'

type Menu = { id: string; label: string; ikon: string }

const UTAMA: Menu[] = [
  { id: 'dashboard', label: 'Dashboard', ikon: '🏠' },
  { id: 'kalender', label: 'Kalender', ikon: '📅' },
  { id: 'konten', label: 'Konten', ikon: '🎬' },
  { id: 'tugas', label: 'Tugas', ikon: '✅' },
  { id: 'lainnya', label: 'Lainnya', ikon: '☰' },
]

const TAMBAHAN: Menu[] = [
  { id: 'analitik', label: 'Analitik', ikon: '📊' },
  { id: 'affiliate', label: 'Affiliate', ikon: '🛒' },
  { id: 'akun', label: 'Akun', ikon: '👤' },
  { id: 'laporan', label: 'Laporan', ikon: '📝' },
  { id: 'pengaturan', label: 'Pengaturan', ikon: '⚙️' },
]

function Kosong(props: { pesan: string; aksi?: string; onAksi?: () => void }) {
  return (
    <div className="kartu">
      <p>{props.pesan}</p>
      {props.aksi && props.onAksi && (
        <button className="tombol" onClick={props.onAksi}>{props.aksi}</button>
      )}
    </div>
  )
}

export default function App() {
  const [halaman, setHalaman] = useState('dashboard')
  const semua = [...UTAMA, ...TAMBAHAN]
  const judul = semua.find((m) => m.id === halaman)?.label ?? ''
  const navAktif = UTAMA.some((m) => m.id === halaman) ? halaman : 'lainnya'

  let isi
  if (halaman === 'dashboard') {
    isi = <Dashboard bukaKonten={() => setHalaman('konten')} />
  } else if (halaman === 'kalender') {
    isi = <Kalender />
  } else if (halaman === 'konten') {
    isi = <Konten />
  } else if (halaman === 'lainnya') {
    isi = (
      <div className="daftar">
        {TAMBAHAN.map((m) => (
          <button key={m.id} className="item" onClick={() => setHalaman(m.id)}>
            <span>{m.ikon}</span>{m.label}
          </button>
        ))}
      </div>
    )
  } else {
    isi = <Kosong pesan={'Halaman ' + judul + ' akan dibuat pada tahap berikutnya.'} />
  }

  return (
    <div className="app">
      <h1>{halaman === 'lainnya' ? 'Menu Lainnya' : judul}</h1>
      {isi}
      <nav className="nav">
        {UTAMA.map((m) => (
          <button key={m.id} className={navAktif === m.id ? 'aktif' : ''} onClick={() => setHalaman(m.id)}>
            <span>{m.ikon}</span>{m.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
