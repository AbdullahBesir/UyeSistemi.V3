# Uye Yonetim Sistemi

Bu proje artik Python `server.py` veya yerel `app.db` kullanmaz. Uygulama statik olarak calisir ve kullanici girisi ile profil verileri Supabase uzerinden yonetilir.

## Gerekli dosyalar

- `index.html`
- `app.js`
- `supabase-config.js`
- `supabase-schema.sql`

## Supabase kurulumu

1. Supabase projesi olustur.
2. SQL Editor icinde `supabase-schema.sql` dosyasinin icerigini calistir.
3. Supabase panelinden proje `URL` ve `anon` key bilgisini al.
4. `supabase-config.js` dosyasini doldur:

```js
window.SUPABASE_CONFIG = {
  url: 'https://YOUR-PROJECT.supabase.co',
  anonKey: 'YOUR_SUPABASE_ANON_KEY'
};
```

## GitHub uzerinden yayinlama

Bu proje statik oldugu icin GitHub Pages ile yayinlanabilir.

1. Dosyalari GitHub reposuna yukle.
2. Repo ayarlarinda `Pages` bolumunu ac.
3. Kaynak olarak ilgili branch'i ve root klasoru sec.
4. GitHub Pages yayina girdikten sonra olusan URL uzerinden uygulamayi ac.

## Notlar

- `anon` key istemci tarafinda kullanilabilir; gizli servis anahtari kullanma.
- Giris icin Supabase Authentication tarafinda kullanicilarin olusturulmus olmasi gerekir.
- Eski Python ve SQLite dosyalari projeden cikarildi.
