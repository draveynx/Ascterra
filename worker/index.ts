export default {
  async fetch(req: Request, env: any): Promise<Response> {
    const url = new URL(req.url)
    const bagian = url.pathname.split('/').filter(Boolean)
    if (bagian[0] !== 'api' || bagian[1] !== 'konten') {
      return Response.json({ error: 'Tidak ditemukan' }, { status: 404 })
    }
    const db = env.ascterra_db
    const id = bagian[2]

    if (req.method === 'GET' && !id) {
      const hasil = await db.prepare('SELECT * FROM konten ORDER BY id DESC').all()
      return Response.json(hasil.results)
    }
    if (req.method === 'POST' && !id) {
      const b: any = await req.json()
      if (!b.judul || !String(b.judul).trim()) {
        return Response.json({ error: 'Judul wajib diisi' }, { status: 400 })
      }
      await db
        .prepare('INSERT INTO konten (judul, platform, status, tanggal_tayang, catatan) VALUES (?, ?, ?, ?, ?)')
        .bind(String(b.judul).trim(), b.platform || 'tiktok', b.status || 'ide', b.tanggal_tayang || null, b.catatan || null)
        .run()
      return Response.json({ ok: true }, { status: 201 })
    }
    if (req.method === 'DELETE' && id) {
      await db.prepare('DELETE FROM konten WHERE id = ?').bind(id).run()
      return Response.json({ ok: true })
    }
    return Response.json({ error: 'Metode tidak didukung' }, { status: 405 })
  },
}
