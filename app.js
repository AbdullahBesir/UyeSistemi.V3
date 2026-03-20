(function() {
  try {
    window.localStorage.removeItem('uye_logged_in');
  } catch (error) {
  }

  const SUPABASE_PROFILE_TABLE = 'profiles';
  const DEFAULT_LOGIN_EMAIL = 'besir.simsek.362@gmail.com';
  const AUTH_HASH_ITERATIONS = 120000;
  const DATA_KEY_ITERATIONS = 180000;
  const CURRENT_SCHEMA_VERSION = 3;
  const CELL_NOTIFICATION_DURATION_MS = 2400;
  const BASE_VALUE_COUNT = 26;
  const DISTRICT_COLUMN_INDEX = 9;
  const VOTE_SEQUENCE = ['SEÇ', 'HAYIR', 'ORTA', 'EVET'];
  const SIVAS_DISTRICTS = [
    'Merkez', 'Akıncılar', 'Altınyayla', 'Divriği', 'Doğanşar', 'Gemerek', 'Gölova', 'Gürün',
    'Hafik', 'İmranlı', 'Kangal', 'Koyulhisar', 'Suşehri', 'Şarkışla', 'Ulaş', 'Yıldızeli', 'Zara'
  ];
  const LEGACY_STORAGE_KEYS = {
    history: 'uye_history',
    draft: 'uye_draft',
    hiddenColumns: 'uye_hidden_columns',
    imageDirName: 'uye_image_dir_name',
    isimListesi: 'ozelIsimListesi'
  };
  const DEFAULT_NAME_RECORDS = [
    { id: 1, isim: '1. Komite Üyesi Adayı' },
    { id: 2, isim: '2. Komite Üyesi Adayı' },
    { id: 3, isim: '3. Komite Üyesi Adayı' },
    { id: 4, isim: '4. Komite Üyesi Adayı' },
    { id: 5, isim: '5. Komite Üyesi Adayı' },
    { id: 6, isim: '6. Komite Üyesi Adayı' },
    { id: 7, isim: '7. Komite Üyesi Adayı' },
    { id: 8, isim: '8. Komite Üyesi Adayı' },
    { id: 9, isim: '9. Komite Üyesi Adayı' },
    { id: 10, isim: '10. Komite Üyesi Adayı' },
    { id: 11, isim: '11. Komite Üyesi Adayı' },
    { id: 12, isim: '12. Komite Üyesi Adayı' }
  ];
  const COLUMN_TITLES = [
    'Resim', 'Üye Sicil', 'Ticaret Sicil', 'Mersis No', 'Nace Kodu', 'Vergi No', 'Meslek Grubu', 'Ünvan', 'Adres', 'İlçe',
    'Yetkili Adı-1', 'Yetkili Adı-2', 'Yetkili Adı-3', 'Firma Sabit Tel', 'Yetkili GSM.1', 'Yetkili GSM.2', 'Yetkili GSM.3',
    'E-mail', 'Instagram', 'Facebook', 'X', 'Linkedin', 'Referans.1', 'Referans.2', 'Referans.3', 'Not',
    'Ulusal Olma Durumu', 'Ziyaret 1', 'Ziyaret 1 Notu', 'Ziyaret 1 Tarihi', 'Ziyaret 2', 'Ziyaret 2 Notu',
    'Ziyaret 2 Tarihi', 'Telefon Görüşmesi', 'Telefon Görüşmesi Notu', 'Telefon Görüşmesi Tarihi',
    'Askı Olma Durumu', '2 Yıl Olma Durumu', 'Oy', 'Tarih'
  ];
  const NOTIFICATION_COLUMN_INDEX = COLUMN_TITLES.length;
  const SHARE_COLUMN_INDEX = COLUMN_TITLES.length + 1;
  const ACTION_COLUMN_INDEX = COLUMN_TITLES.length + 2;
  const HEADER_TITLES = ['Resim (Üye Resmi)', ...COLUMN_TITLES.slice(1)];
  const EXPORT_COLUMN_TITLES = [...HEADER_TITLES, 'Bildirim Durumu'];
  const TABLE_INDEX = {
    ULUSAL: 26,
    ZIYARET1: 27,
    ZIYARET1_NOT: 28,
    ZIYARET1_TARIH: 29,
    ZIYARET2: 30,
    ZIYARET2_NOT: 31,
    ZIYARET2_TARIH: 32,
    TELEFON: 33,
    TELEFON_NOT: 34,
    TELEFON_TARIH: 35,
    ASKI: 36,
    IKI_YIL: 37,
    OY: 38,
    TARIH: 39
  };
  const LEGACY_HIDDEN_COLUMN_MAP_V1_TO_V2 = {
    0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9,
    10: 10, 11: 11, 12: 12, 13: 13, 14: 14, 15: 15, 16: 16, 17: 17, 18: 18, 19: 19,
    20: 20, 21: 21, 22: 22, 23: 23, 24: 24, 25: 35, 26: 36, 27: 26, 28: 27, 29: 28,
    30: 29, 31: 30, 32: 31, 33: 32, 34: 33, 35: 34, 36: 37, 37: 38
  };
  const BASE_IMPORT_FIELDS = [
    'image', 'uyeSicil', 'ticaretSicil', 'mersisNo', 'naceKodu', 'vergiNo', 'meslekGrubu', 'unvan', 'adres', 'ilce',
    'yetkiliAdi1', 'yetkiliAdi2', 'yetkiliAdi3', 'firmaSabitTel', 'yetkiliGsm1', 'yetkiliGsm2', 'yetkiliGsm3',
    'email', 'instagram', 'facebook', 'x', 'linkedin', 'referans1', 'referans2', 'referans3', 'not'
  ];
  const IMPORT_FIELD_ALIASES = {
    image: [{ name: 'resim' }, { name: 'resim uye resmi' }, { name: 'uye resmi' }],
    uyeSicil: [{ name: 'uye sicil' }],
    ticaretSicil: [{ name: 'ticaret sicil' }],
    mersisNo: [{ name: 'mersis no' }],
    naceKodu: [{ name: 'nace kodu' }],
    vergiNo: [{ name: 'vergi no' }],
    meslekGrubu: [{ name: 'meslek grubu' }],
    unvan: [{ name: 'unvan' }],
    adres: [{ name: 'adres' }],
    ilce: [{ name: 'ilce' }, { name: 'ilçe' }],
    yetkiliAdi1: [{ name: 'yetkili adi 1' }],
    yetkiliAdi2: [{ name: 'yetkili adi 2' }],
    yetkiliAdi3: [{ name: 'yetkili adi 3' }],
    firmaSabitTel: [{ name: 'firma sabit tel' }],
    yetkiliGsm1: [{ name: 'yetkili gsm 1' }],
    yetkiliGsm2: [{ name: 'yetkili gsm 2' }],
    yetkiliGsm3: [{ name: 'yetkili gsm 3' }],
    email: [{ name: 'e mail' }, { name: 'email' }],
    instagram: [{ name: 'instagram' }],
    facebook: [{ name: 'facebook' }],
    x: [{ name: 'x' }],
    linkedin: [{ name: 'linkedin' }],
    referans1: [{ name: 'referans 1' }],
    referans2: [{ name: 'referans 2' }],
    referans3: [{ name: 'referans 3' }],
    not: [{ name: 'not' }, { name: 'not zengin metin' }],
    ulusal: [{ name: 'ulusal olma durumu' }],
    ziyaret1: [{ name: 'ziyaret 1' }],
    ziyaret1Not: [{ name: 'ziyaret 1 notu' }],
    ziyaret1Tarih: [{ name: 'ziyaret 1 tarihi' }],
    ziyaret2: [{ name: 'ziyaret 2' }],
    ziyaret2Not: [{ name: 'ziyaret 2 notu' }],
    ziyaret2Tarih: [{ name: 'ziyaret 2 tarihi' }],
    telefonGorusmesi: [{ name: 'telefon gorusmesi' }, { name: 'ziyaret 3' }],
    telefonGorusmesiNot: [{ name: 'telefon gorusmesi notu' }, { name: 'ziyaret 3 notu' }],
    telefonGorusmesiTarih: [{ name: 'telefon gorusmesi tarihi' }, { name: 'ziyaret 3 tarihi' }],
    aski: [
      { name: 'aski olma durumu' },
      { name: 'aski olmama durumu', legacyInverted: true },
      { name: 'aski durumu', legacyInverted: true }
    ],
    ikiYil: [
      { name: '2 yil olma durumu' },
      { name: '2 yil olmama durumu', legacyInverted: true },
      { name: '2 yil durumu', legacyInverted: true }
    ],
    oy: [{ name: 'oy' }],
    tarih: [{ name: 'tarih' }],
    bildirim: [{ name: 'bildirim' }, { name: 'bildirim durumu' }]
  };

  let chartInstance = null;
  let activeColumnFilter = null;
  let imageDirectoryHandle = null;
  let aktifDuzenlemeId = null;
  let kayitlar = cloneDefaultNameRecords();
  let loginLockInterval = null;
  let notificationPriorityEnabled = false;
  const supabaseConfig = window.SUPABASE_CONFIG || {};
  const supabaseClient = window.supabase && supabaseConfig.url && supabaseConfig.anonKey
    ? window.supabase.createClient(supabaseConfig.url, supabaseConfig.anonKey)
    : null;
  const state = {
    currentUser: null,
    currentUserId: '',
    authToken: '',
    userData: buildDefaultUserData(),
    profileUpdatedAt: 0,
    persistTimer: null,
    persistInFlight: false,
    persistPending: false,
    persistImmediate: false
  };

  function hasSupabaseClient() {
    return Boolean(supabaseClient);
  }

  function deriveUsernameFromEmail(email) {
    const normalizedEmail = String(nv(email, '')).trim().toLocaleLowerCase('tr-TR');
    if (!normalizedEmail) return '';
    const atIndex = normalizedEmail.indexOf('@');
    return atIndex === -1 ? normalizedEmail : normalizedEmail.slice(0, atIndex);
  }

  function buildSupabaseProfilePayload(user, userData) {
    const normalizedUserData = normalizeUserData(userData);
    return {
      id: user.id,
      email: String(user.email || '').trim().toLocaleLowerCase('tr-TR'),
      username: deriveUsernameFromEmail(user.email || ''),
      user_data: normalizedUserData,
      updated_at: Date.now()
    };
  }

  async function fetchSupabaseProfile(userId) {
    const { data, error } = await supabaseClient
      .from(SUPABASE_PROFILE_TABLE)
      .select('user_data, updated_at')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw error;
    return {
      userData: data && data.user_data ? normalizeUserData(data.user_data) : buildDefaultUserData(),
      updatedAt: Number(data && data.updated_at) || 0
    };
  }

  function qs(id) {
    return document.getElementById(id);
  }

  function escapeHtml(text) {
    return String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function nv(value, fallback) {
    return value === null || value === undefined ? fallback : value;
  }

  function cloneDefaultNameRecords() {
    return DEFAULT_NAME_RECORDS.map(item => ({ ...item }));
  }

  function buildDefaultUserData() {
    return {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      history: [],
      draft: [],
      hiddenColumns: [],
      imageDirName: '',
      isimListesi: cloneDefaultNameRecords()
    };
  }

  function tarih() {
    return new Date().toLocaleString('tr-TR');
  }

  function normalizeYesNo(value, fallback = 'HAYIR') {
    const normalized = String(nv(value, '')).trim().toUpperCase();
    if (normalized === 'EVET' || normalized === 'HAYIR') return normalized;
    return fallback;
  }

  function normalizeTextKey(value) {
    return String(nv(value, ''))
      .trim()
      .toLocaleLowerCase('tr-TR')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function normalizeDistrict(value) {
    const normalized = normalizeTextKey(value);
    if (!normalized) return '';
    const match = SIVAS_DISTRICTS.find(item => normalizeTextKey(item) === normalized);
    return match || '';
  }

  function normalizeVote(value) {
    const normalized = String(nv(value, '')).trim().toUpperCase();
    return VOTE_SEQUENCE.includes(normalized) ? normalized : 'SEÇ';
  }

  function normalizeRestrictedStatus(value, legacyInverted = false) {
    const normalized = normalizeYesNo(value, legacyInverted ? 'EVET' : 'HAYIR');
    return legacyInverted ? (normalized === 'EVET' ? 'HAYIR' : 'EVET') : normalized;
  }

  function normalizeNameRecords(value) {
    if (!Array.isArray(value) || !value.length) return cloneDefaultNameRecords();
    return value.map((item, index) => ({
      id: Number(item && item.id) || index + 1,
      isim: String((item && item.isim) || `Komite Üyesi ${index + 1}`)
    }));
  }

  function migrateHiddenColumnIndex(index, sourceSchemaVersion = CURRENT_SCHEMA_VERSION) {
    let nextIndex = Number(index);
    if (!Number.isInteger(nextIndex)) return null;
    if (sourceSchemaVersion < 2) nextIndex = LEGACY_HIDDEN_COLUMN_MAP_V1_TO_V2[nextIndex];
    if (!Number.isInteger(nextIndex)) return null;
    if (sourceSchemaVersion < 3 && nextIndex >= DISTRICT_COLUMN_INDEX) nextIndex += 1;
    return nextIndex;
  }

  function normalizeHiddenColumns(value, sourceSchemaVersion = CURRENT_SCHEMA_VERSION) {
    if (!Array.isArray(value)) return [];
    return [...new Set(
      value
        .map(item => Number(item))
        .filter(item => Number.isInteger(item))
        .map(item => migrateHiddenColumnIndex(item, sourceSchemaVersion))
        .filter(item => Number.isInteger(item) && item >= 0 && item < COLUMN_TITLES.length)
    )].sort((a, b) => a - b);
  }

  function migrateBaseValues(values, sourceSchemaVersion = CURRENT_SCHEMA_VERSION, row = {}) {
    const nextValues = Array.isArray(values) ? values.map(item => String(nv(item, ''))) : [];
    if (sourceSchemaVersion < 3) nextValues.splice(DISTRICT_COLUMN_INDEX, 0, String(nv(row.ilce, '')));
    nextValues[DISTRICT_COLUMN_INDEX] = normalizeDistrict(nextValues[DISTRICT_COLUMN_INDEX]);
    return Array.from({ length: BASE_VALUE_COUNT }, (_, index) => String(nv(nextValues[index], '')));
  }

  function normalizeRowRecord(row = {}, options = {}) {
    const sourceSchemaVersion = Number(options.sourceSchemaVersion) || CURRENT_SCHEMA_VERSION;
    const legacySchema = sourceSchemaVersion < 2;
    const values = Array.isArray(row.veri) ? row.veri : [];
    return {
      veri: migrateBaseValues(values, sourceSchemaVersion, row),
      ulusal: normalizeYesNo(row.ulusal, 'HAYIR'),
      ziyaret1: normalizeYesNo(row.ziyaret1, 'HAYIR'),
      ziyaret1Not: String(nv(row.ziyaret1Not, '')),
      ziyaret1Tarih: String(nv(row.ziyaret1Tarih, '')),
      ziyaret2: normalizeYesNo(row.ziyaret2, 'HAYIR'),
      ziyaret2Not: String(nv(row.ziyaret2Not, '')),
      ziyaret2Tarih: String(nv(row.ziyaret2Tarih, '')),
      telefonGorusmesi: normalizeYesNo(nv(row.telefonGorusmesi, row.ziyaret3), 'HAYIR'),
      telefonGorusmesiNot: String(nv(nv(row.telefonGorusmesiNot, row.ziyaret3Not), '')),
      telefonGorusmesiTarih: String(nv(nv(row.telefonGorusmesiTarih, row.ziyaret3Tarih), '')),
      aski: normalizeRestrictedStatus(row.aski, legacySchema),
      ikiYil: normalizeRestrictedStatus(row.ikiYil, legacySchema),
      oy: normalizeVote(row.oy),
      tarih: String(nv(row.tarih, tarih())),
      bildirim: normalizeYesNo(row.bildirim, 'HAYIR')
    };
  }

  function normalizeHistoryEntry(entry = {}, sourceSchemaVersion = CURRENT_SCHEMA_VERSION) {
    return {
      id: Number(entry.id) || Date.now(),
      tarih: String(nv(entry.tarih, tarih())),
      satir: Number(entry.satir) || (Array.isArray(entry.data) ? entry.data.length : 0),
      img: String(nv(entry.img, '')),
      data: Array.isArray(entry.data) ? entry.data.map(item => normalizeRowRecord(item, { sourceSchemaVersion })) : []
    };
  }

  function normalizeUserData(rawData) {
    const source = rawData && typeof rawData === 'object' ? rawData : {};
    const sourceSchemaVersion = Number(source.schemaVersion) || 1;
    return {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      history: Array.isArray(source.history) ? source.history.map(item => normalizeHistoryEntry(item, sourceSchemaVersion)) : [],
      draft: Array.isArray(source.draft) ? source.draft.map(item => normalizeRowRecord(item, { sourceSchemaVersion })) : [],
      hiddenColumns: normalizeHiddenColumns(source.hiddenColumns, sourceSchemaVersion),
      imageDirName: String(nv(source.imageDirName, '')),
      isimListesi: normalizeNameRecords(source.isimListesi)
    };
  }

  function readLegacyJson(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function readLegacyUserData() {
    const history = readLegacyJson(LEGACY_STORAGE_KEYS.history, []);
    const draft = readLegacyJson(LEGACY_STORAGE_KEYS.draft, []);
    const hiddenColumns = readLegacyJson(LEGACY_STORAGE_KEYS.hiddenColumns, []);
    const isimListesi = readLegacyJson(LEGACY_STORAGE_KEYS.isimListesi, null);
    const imageDirName = window.localStorage.getItem(LEGACY_STORAGE_KEYS.imageDirName) || '';
    const hasLegacyData = Boolean(
      (Array.isArray(history) && history.length) ||
      (Array.isArray(draft) && draft.length) ||
      (Array.isArray(hiddenColumns) && hiddenColumns.length) ||
      imageDirName ||
      Array.isArray(isimListesi)
    );
    if (!hasLegacyData) return null;
    return {
      schemaVersion: 1,
      history,
      draft,
      hiddenColumns,
      imageDirName,
      isimListesi: Array.isArray(isimListesi) ? isimListesi : cloneDefaultNameRecords()
    };
  }

  function clearLegacyStorage() {
    Object.values(LEGACY_STORAGE_KEYS).forEach(key => {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
      }
    });
    try {
      window.localStorage.removeItem('uye_logged_in');
    } catch (error) {
    }
    try {
      Object.keys(window.localStorage).forEach(key => {
        if (key.indexOf('uye_profile_cache_v1:') === 0) window.localStorage.removeItem(key);
      });
    } catch (error) {
    }
  }

  function getLocalProfileCacheKey(username) {
    const normalizedUsername = String(nv(username, '')).trim().toLocaleLowerCase('tr-TR');
    return normalizedUsername ? `uye_profile_cache_v1:${normalizedUsername}` : '';
  }

  function readLocalProfileCache(username) {
    const key = getLocalProfileCacheKey(username);
    if (!key) return null;
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return null;
      return {
        savedAt: Number(parsed.savedAt) || 0,
        userData: normalizeUserData(parsed.userData)
      };
    } catch (error) {
      return null;
    }
  }

  function hasMeaningfulUserData(data) {
    const userData = normalizeUserData(data);
    return Boolean(
      userData.history.length ||
      userData.draft.length ||
      userData.hiddenColumns.length ||
      userData.imageDirName ||
      userData.isimListesi.some((item, index) => item.isim !== (DEFAULT_NAME_RECORDS[index] && DEFAULT_NAME_RECORDS[index].isim))
    );
  }

  async function migrateBrowserUserDataToProfile(username, remoteUserData, remoteUpdatedAt = 0) {
    const normalizedRemoteData = normalizeUserData(remoteUserData || buildDefaultUserData());
    const normalizedRemoteUpdatedAt = Number(remoteUpdatedAt) || 0;
    const localCache = readLocalProfileCache(username);
    const legacyUserData = readLegacyUserData();
    const localCacheIsNewer = Boolean(localCache && localCache.savedAt > normalizedRemoteUpdatedAt);
    const shouldMigrateLegacyData = !localCacheIsNewer && legacyUserData && !hasMeaningfulUserData(normalizedRemoteData);
    if (!localCacheIsNewer && !shouldMigrateLegacyData) {
      clearLegacyStorage();
      return {
        userData: normalizedRemoteData,
        updatedAt: normalizedRemoteUpdatedAt
      };
    }
    const nextUserData = normalizeUserData(localCacheIsNewer ? localCache.userData : legacyUserData);
    const response = await saveUserData(nextUserData);
    clearLegacyStorage();
    return {
      userData: nextUserData,
      updatedAt: Number(response && response.updatedAt) || Date.now()
    };
  }

  function bytesToBase64(bytes) {
    let binary = '';
    bytes.forEach(byte => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }

  function base64ToBytes(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  function randomBase64(length) {
    return bytesToBase64(window.crypto.getRandomValues(new Uint8Array(length)));
  }

  async function derivePasswordBits(password, saltBase64, iterations) {
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    );
    const bits = await window.crypto.subtle.deriveBits({
      name: 'PBKDF2',
      salt: base64ToBytes(saltBase64),
      iterations,
      hash: 'SHA-256'
    }, keyMaterial, 256);
    return new Uint8Array(bits);
  }

  async function hashPassword(password, saltBase64) {
    return bytesToBase64(await derivePasswordBits(password, saltBase64, AUTH_HASH_ITERATIONS));
  }

  async function deriveEncryptionKey(password, saltBase64) {
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );
    return window.crypto.subtle.deriveKey({
      name: 'PBKDF2',
      salt: base64ToBytes(saltBase64),
      iterations: DATA_KEY_ITERATIONS,
      hash: 'SHA-256'
    }, keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  }

  async function encryptData(data, password, saltBase64) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveEncryptionKey(password, saltBase64);
    const cipherBuffer = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      new TextEncoder().encode(JSON.stringify(data))
    );
    return {
      iv: bytesToBase64(iv),
      cipherText: bytesToBase64(new Uint8Array(cipherBuffer))
    };
  }

  async function decryptData(record, password, saltBase64) {
    const key = await deriveEncryptionKey(password, saltBase64);
    const plainBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: base64ToBytes(record.iv) },
      key,
      base64ToBytes(record.cipherText)
    );
    return JSON.parse(new TextDecoder().decode(plainBuffer));
  }

  async function seedDefaultUsers() {
    return;
  }

  async function saveUserData(data) {
    if (!hasSupabaseClient() || !state.currentUserId) {
      throw new Error('Supabase baglantisi bulunamadi.');
    }
    const payload = buildSupabaseProfilePayload({
      id: state.currentUserId,
      email: state.currentUser
    }, data);
    const { data: savedProfile, error } = await supabaseClient
      .from(SUPABASE_PROFILE_TABLE)
      .upsert(payload, { onConflict: 'id' })
      .select('updated_at')
      .single();
    if (error) throw error;
    return {
      ok: true,
      updatedAt: Number(savedProfile && savedProfile.updated_at) || payload.updated_at
    };
  }

  async function persistCurrentUserData(data = state.userData) {
    if (!state.currentUser || !state.currentUserId || !state.authToken) return;
    const response = await saveUserData(data);
    state.profileUpdatedAt = Number(response && response.updatedAt) || Date.now();
  }

  async function saveDirectoryHandleForCurrentUser(handle) {
    if (!state.currentUser || !handle) return;
  }

  async function loadDirectoryHandleForUser(username) {
    if (!username) return null;
    return null;
  }

  function clearLoginStatus() {
    qs('loginError').textContent = '';
    qs('loginMeta').textContent = '';
  }

  function updateLoginMetaNotice() {
    if (!hasSupabaseClient()) {
      qs('loginMeta').textContent = 'Supabase baglantisi icin supabase-config.js dosyasini doldur.';
    }
  }

  function setLoginControlsDisabled(disabled) {
    ['user', 'pass', 'loginButton'].forEach(id => {
      const element = qs(id);
      if (element) element.disabled = disabled;
    });
  }

  function clearLoginLockInterval() {
    if (loginLockInterval) {
      clearInterval(loginLockInterval);
      loginLockInterval = null;
    }
  }

  function resetPersistState() {
    state.persistPending = false;
    state.persistImmediate = false;
    state.persistInFlight = false;
    if (state.persistTimer) {
      clearTimeout(state.persistTimer);
      state.persistTimer = null;
    }
  }

  function resetAuthState() {
    resetPersistState();
    state.currentUser = null;
    state.currentUserId = '';
    state.authToken = '';
    state.userData = buildDefaultUserData();
    state.profileUpdatedAt = 0;
    kayitlar = cloneDefaultNameRecords();
    aktifDuzenlemeId = null;
    imageDirectoryHandle = null;
    clearCellNotification();
  }

  async function ensureSupabaseProfile(user, fallbackUserData = null) {
    const payload = buildSupabaseProfilePayload(user, fallbackUserData || buildDefaultUserData());
    const { error } = await supabaseClient
      .from(SUPABASE_PROFILE_TABLE)
      .upsert(payload, { onConflict: 'id' });
    if (error) throw error;
    return {
      userData: normalizeUserData(payload.user_data),
      updatedAt: payload.updated_at
    };
  }

  async function loadSupabaseProfile(user) {
    const profile = await fetchSupabaseProfile(user.id);
    if (profile.updatedAt || hasMeaningfulUserData(profile.userData)) return profile;
    return ensureSupabaseProfile(user, profile.userData);
  }

  async function applyAuthenticatedSession(session) {
    const user = session && session.user;
    if (!user || !user.id) throw new Error('Supabase oturumu alinamadi.');
    state.currentUser = String(user.email || '').trim().toLocaleLowerCase('tr-TR');
    state.currentUserId = user.id;
    state.authToken = session.access_token || '';
    resetPersistState();
    const profile = await loadSupabaseProfile(user);
    const resolvedProfile = await migrateBrowserUserDataToProfile(state.currentUser, profile.userData, profile.updatedAt);
    state.userData = resolvedProfile.userData;
    state.profileUpdatedAt = resolvedProfile.updatedAt;
    kayitlar = normalizeNameRecords(state.userData.isimListesi);
    aktifDuzenlemeId = null;
    imageDirectoryHandle = await loadDirectoryHandleForUser(state.currentUser);
    qs('user').value = state.currentUser;
    qs('pass').value = '';
    qs('loginPage').classList.add('hidden');
    qs('app').classList.remove('hidden');
    await initializeApp();
  }

  function startLoginLockCountdown(username, lockUntil) {
    clearLoginLockInterval();
    const tick = () => {
      const remaining = lockUntil - Date.now();
      if (remaining <= 0) {
        clearLoginLockInterval();
        clearLoginStatus();
        setLoginControlsDisabled(false);
        return;
      }
      if (qs('user').value.trim() === username) {
        qs('loginError').textContent = '3 hatali deneme sonrasi giris gecici olarak kilitlendi.';
        qs('loginMeta').textContent = `${Math.ceil(remaining / 1000)} saniye sonra tekrar deneyebilirsin.`;
        setLoginControlsDisabled(true);
      }
    };
    tick();
    loginLockInterval = window.setInterval(tick, 1000);
  }

  async function refreshLoginStateForUser(username) {
    clearLoginLockInterval();
    clearLoginStatus();
    setLoginControlsDisabled(false);
    updateLoginMetaNotice();
    if (!username) return;
  }

  async function login() {
    const email = qs('user').value.trim().toLocaleLowerCase('tr-TR');
    const password = qs('pass').value;
    clearLoginStatus();
    if (!email || !password) {
      qs('loginError').textContent = 'E-posta ve sifre zorunlu.';
      return;
    }
    if (!hasSupabaseClient()) {
      qs('loginError').textContent = 'Supabase ayarlari eksik. supabase-config.js dosyasini doldur.';
      return;
    }
    if (email.indexOf('@') === -1) {
      qs('loginError').textContent = 'Supabase girisi icin e-posta kullan.';
      return;
    }
    setLoginControlsDisabled(true);
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      await applyAuthenticatedSession(data.session);
    } catch (error) {
      console.error(error);
      qs('loginError').textContent = 'Giris basarisiz. E-posta, sifre veya Supabase ayarlarini kontrol et.';
      setLoginControlsDisabled(false);
    }
  }

  async function restoreSupabaseSession() {
    if (!hasSupabaseClient()) return false;
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    if (!data.session || !data.session.user) return false;
    await applyAuthenticatedSession(data.session);
    return true;
  }

  async function logout() {
    clearLoginStatus();
    setLoginControlsDisabled(true);
    try {
      await flushPersistQueue();
      if (hasSupabaseClient()) {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
      }
      resetAuthState();
      qs('app').classList.add('hidden');
      qs('loginPage').classList.remove('hidden');
      setLoginControlsDisabled(false);
    } catch (error) {
      console.error(error);
      qs('loginError').textContent = 'Cikis sirasinda beklenmeyen bir hata olustu.';
      setLoginControlsDisabled(false);
    }
  }

  function renderTableHeader() {
    const headerRow = qs('tableHeaderRow');
    if (!headerRow) return;
    headerRow.innerHTML = HEADER_TITLES.map((title, index) => `
      <th data-col="${index}" oncontextmenu="kolonMenuAc(event, ${index})">
        ${escapeHtml(title)}
        <span class="col-resizer" onmousedown="sutunBoyutlandirBaslat(event, ${index})"></span>
      </th>
    `).join('') + `
      <th data-col="${NOTIFICATION_COLUMN_INDEX}" oncontextmenu="kolonMenuAc(event, ${NOTIFICATION_COLUMN_INDEX})">Bildirim</th>
      <th data-col="${SHARE_COLUMN_INDEX}">Paylaş</th>
      <th data-col="${ACTION_COLUMN_INDEX}">İşlem</th>
    `;
  }

  function voteClass(value) {
    return ({ 'SEÇ': 'none', 'HAYIR': 'hayir', 'ORTA': 'orta', 'EVET': 'evet' })[value] || 'none';
  }

  function setVoteElementValue(el, value) {
    el.dataset.val = value;
    el.textContent = value;
    el.className = 'vote ' + voteClass(value) + (el.dataset.locked === '1' ? ' disabled' : '');
  }

  function hucre(value = '', type = 'text') {
    const safe = escapeHtml(value);
    if (type === 'note') return `<textarea class="cell" oninput="autoSaveDraft(); filtre()">${safe}</textarea>`;
    return `<input class="cell" value="${safe}" oninput="autoSaveDraft(); filtre()">`;
  }

  function oyDiv(value = 'SEÇ') {
    const normalized = normalizeVote(value);
    return `<div class="vote ${voteClass(normalized)}" onclick="oyDegistir(this)" data-val="${escapeHtml(normalized)}" data-locked="0">${escapeHtml(normalized)}</div>`;
  }

  function evetHayirSelect(value = 'HAYIR', cls = '') {
    const normalized = normalizeYesNo(value, 'HAYIR');
    return `<select class="cell ${cls}" onchange="durumDegisti(this)"><option value="EVET" ${normalized === 'EVET' ? 'selected' : ''}>Evet</option><option value="HAYIR" ${normalized === 'HAYIR' ? 'selected' : ''}>Hayır</option></select>`;
  }

  function selectCell(options, value = '', cls = '', placeholder = 'Seçiniz') {
    const normalizedValue = String(nv(value, ''));
    const optionValues = options.includes(normalizedValue) ? options : [...options, normalizedValue].filter(Boolean);
    return `<select class="cell ${cls}" onchange="autoSaveDraft(); filtre()">
      <option value="">${escapeHtml(placeholder)}</option>
      ${optionValues.map(option => `<option value="${escapeHtml(option)}" ${option === normalizedValue ? 'selected' : ''}>${escapeHtml(option)}</option>`).join('')}
    </select>`;
  }

  function ilceSelect(value = '') {
    return selectCell(SIVAS_DISTRICTS, normalizeDistrict(value), 'ilce-select', 'İlçe Seç');
  }

  function makeLink(url, type) {
    const value = (url || '').trim();
    if (!value) return '';
    let href = value;
    if (type === 'phone') href = 'tel:' + value.replace(/\s+/g, '');
    if (type === 'email') href = value.startsWith('mailto:') ? value : 'mailto:' + value;
    if (type === 'social' && !/^https:\/\//i.test(value)) href = 'https://' + value;
    return `<a class="link-preview" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">Bağlantıyı Aç</a>`;
  }

  function imageCell(value = '') {
    const safe = escapeHtml(value);
    return `
      <div class="image-cell" style="display:flex; flex-direction:row; gap:10px; align-items:flex-start; min-width:260px;">
        <img class="thumb" src="${safe}" onerror="this.style.visibility='hidden'" onload="this.style.visibility='visible'">
        <div style="display:flex; flex-direction:column; gap:8px; min-width:150px; flex:1;">
          <input class="cell" placeholder="Resim yolu / veri / URL" value="${safe}" oninput="resimInputDegisti(this)">
          <div class="inline-actions">
            <input type="file" accept="image/*" onchange="resimSec(this)">
          </div>
        </div>
      </div>
    `;
  }

  function actionCell(value = '', type = 'text', linkType = '') {
    const safe = escapeHtml(value);
    const link = linkType ? makeLink(value, linkType) : '';
    return `
      <div class="link-cell">
        ${type === 'note' ? `<textarea class="cell" oninput="autoSaveDraft(); filtre()">${safe}</textarea>` : `<input class="cell" value="${safe}" oninput="autoSaveDraft(); filtre()">`}
        ${link}
      </div>
    `;
  }

  function getCellValue(td) {
    const input = td.querySelector('input.cell, textarea.cell, select.cell');
    if (input) return input.value || '';
    const notificationButton = td.querySelector('.notification-toggle');
    if (notificationButton) return notificationButton.dataset.value || 'HAYIR';
    const vote = td.querySelector('.vote');
    if (vote) return vote.dataset.val || vote.textContent || '';
    return td.textContent || '';
  }

  function clearCellNotification(row = null) {
    const rows = row ? [row] : [...document.querySelectorAll('#tablo tbody tr.row-notification-flash')];
    rows.forEach(item => {
      if (item && item.__notificationTimer) {
        clearTimeout(item.__notificationTimer);
        item.__notificationTimer = null;
      }
      if (item) item.classList.remove('row-notification-flash');
    });
  }

  function setNotificationState(row, isActive, options = {}) {
    if (!row) return;
    row.dataset.notification = isActive ? 'EVET' : 'HAYIR';
    row.classList.toggle('row-notification-active', isActive);
    const button = row.querySelector('.notification-toggle');
    if (button) {
      button.dataset.value = row.dataset.notification;
      button.classList.toggle('is-active', isActive);
      button.textContent = isActive ? 'Bildirim Açık' : 'Bildirim Kapalı';
      button.title = isActive
        ? 'Bildirim işaretini kaldırmak için tıkla.'
        : 'Satırı bildirimli olarak işaretlemek için tıkla.';
    }
    if (options.flash) {
      clearCellNotification(row);
      row.classList.add('row-notification-flash');
      row.__notificationTimer = window.setTimeout(() => {
        clearCellNotification(row);
      }, CELL_NOTIFICATION_DURATION_MS);
    }
  }

  function satirBildirimGoster(btn) {
    const row = btn && btn.closest ? btn.closest('tr') : null;
    if (!row) return;
    const nextState = row.dataset.notification !== 'EVET';
    setNotificationState(row, nextState, { flash: nextState });
    autoSaveDraft();
    filtre();
  }

  function setShareSelectionState(row, isSelected) {
    if (!row) return;
    row.dataset.shareSelected = isSelected ? '1' : '0';
    row.classList.toggle('row-share-selected', isSelected);
    const button = row.querySelector('.share-toggle');
    if (button) {
      button.classList.toggle('is-active', isSelected);
      button.textContent = isSelected ? 'Seçildi' : 'Seç';
      button.title = isSelected
        ? 'Paylaşım listesinden çıkarmak için tıkla.'
        : 'Bu satırı paylaşım listesine eklemek için tıkla.';
    }
  }

  function updateShareSelectionSummary() {
    const selectedCount = document.querySelectorAll('#tablo tbody tr[data-share-selected="1"]').length;
    const summary = qs('shareSummary');
    const shareButton = qs('shareButton');
    if (summary) {
      summary.textContent = selectedCount
        ? `${selectedCount} satır paylaşım için seçildi.`
        : 'Paylaşım için henüz satır seçilmedi.';
    }
    if (shareButton) shareButton.disabled = selectedCount === 0;
    if (!selectedCount) closeShareMenu();
  }

  function toggleShareSelection(btn) {
    const row = btn && btn.closest ? btn.closest('tr') : null;
    if (!row) return;
    setShareSelectionState(row, row.dataset.shareSelected !== '1');
    updateShareSelectionSummary();
  }

  function closeShareMenu() {
    const menu = qs('shareMenu');
    if (menu) menu.classList.add('hidden');
  }

  function toggleShareMenu() {
    const selectedCount = document.querySelectorAll('#tablo tbody tr[data-share-selected="1"]').length;
    if (!selectedCount) {
      alert('Önce paylaşılacak en az bir satır seçmelisin.');
      return;
    }
    const menu = qs('shareMenu');
    if (!menu) return;
    menu.classList.toggle('hidden');
  }

  function getRowData(row) {
    const cells = [...row.querySelectorAll('td')];
    return normalizeRowRecord({
      veri: cells.slice(0, BASE_VALUE_COUNT).map(td => getCellValue(td)),
      ulusal: getCellValue(cells[TABLE_INDEX.ULUSAL]),
      ziyaret1: getCellValue(cells[TABLE_INDEX.ZIYARET1]),
      ziyaret1Not: getCellValue(cells[TABLE_INDEX.ZIYARET1_NOT]),
      ziyaret1Tarih: getCellValue(cells[TABLE_INDEX.ZIYARET1_TARIH]),
      ziyaret2: getCellValue(cells[TABLE_INDEX.ZIYARET2]),
      ziyaret2Not: getCellValue(cells[TABLE_INDEX.ZIYARET2_NOT]),
      ziyaret2Tarih: getCellValue(cells[TABLE_INDEX.ZIYARET2_TARIH]),
      telefonGorusmesi: getCellValue(cells[TABLE_INDEX.TELEFON]),
      telefonGorusmesiNot: getCellValue(cells[TABLE_INDEX.TELEFON_NOT]),
      telefonGorusmesiTarih: getCellValue(cells[TABLE_INDEX.TELEFON_TARIH]),
      aski: getCellValue(cells[TABLE_INDEX.ASKI]),
      ikiYil: getCellValue(cells[TABLE_INDEX.IKI_YIL]),
      oy: getCellValue(cells[TABLE_INDEX.OY]),
      tarih: cells[TABLE_INDEX.TARIH].textContent.trim() || tarih(),
      bildirim: row.dataset.notification || 'HAYIR'
    });
  }

  function getSelectedTableData() {
    return [...document.querySelectorAll('#tablo tbody tr[data-share-selected="1"]')].map(getRowData);
  }

  function moveNotificationRowsToTop() {
    const tbody = qs('tablo').querySelector('tbody');
    const rows = [...tbody.querySelectorAll('tr')];
    rows
      .sort((a, b) => {
        const aScore = a.dataset.notification === 'EVET' ? 1 : 0;
        const bScore = b.dataset.notification === 'EVET' ? 1 : 0;
        return bScore - aScore;
      })
      .forEach(row => tbody.appendChild(row));
  }

  function getTableData() {
    const rows = [...qs('tablo').querySelectorAll('tbody tr')];
    return rows.map(getRowData);
  }

  function getDraft() {
    return Array.isArray(state.userData.draft) ? state.userData.draft.map(item => normalizeRowRecord(item)) : [];
  }

  function getHistory() {
    return Array.isArray(state.userData.history) ? state.userData.history.map(item => normalizeHistoryEntry(item)) : [];
  }

  async function flushPersistQueue() {
    if (!state.currentUser || !state.authToken) return;
    if (state.persistTimer) {
      clearTimeout(state.persistTimer);
      state.persistTimer = null;
    }
    if (state.persistInFlight || (!state.persistPending && !state.persistImmediate)) return;
    const snapshot = normalizeUserData(state.userData);
    state.persistPending = false;
    state.persistImmediate = false;
    state.persistInFlight = true;
    let persistSucceeded = false;
    try {
      await persistCurrentUserData(snapshot);
      persistSucceeded = true;
    } catch (error) {
      state.persistPending = true;
      console.error(error);
    } finally {
      state.persistInFlight = false;
    }
    if (persistSucceeded && (state.persistPending || state.persistImmediate)) {
      window.setTimeout(() => {
        flushPersistQueue().catch(console.error);
      }, 0);
    }
  }

  function queuePersistUserData(immediate = false) {
    if (!state.currentUser || !state.authToken) return;
    state.persistPending = true;
    state.persistImmediate = state.persistImmediate || immediate;
    if (state.persistTimer) {
      clearTimeout(state.persistTimer);
      state.persistTimer = null;
    }
    if (immediate) {
      flushPersistQueue().catch(console.error);
      return;
    }
    state.persistTimer = window.setTimeout(() => {
      flushPersistQueue().catch(console.error);
    }, 150);
  }

  function autoSaveDraft() {
    if (!state.currentUser) return;
    state.userData.draft = getTableData();
    queuePersistUserData();
    loadChart();
  }

  function rowVotingLocked(row) {
    return (row.querySelector('.aski-select').value || 'HAYIR') === 'EVET' ||
      (row.querySelector('.ikiyil-select').value || 'HAYIR') === 'EVET';
  }

  function updateVoteAvailability(row) {
    const vote = row.querySelector('.vote');
    if (!vote) return;
    const locked = rowVotingLocked(row);
    vote.dataset.locked = locked ? '1' : '0';
    setVoteElementValue(vote, locked ? 'SEÇ' : (vote.dataset.val || 'SEÇ'));
    vote.title = locked
      ? 'Askı Olma Durumu veya 2 Yıl Olma Durumu = Evet olduğu için oy verilemez.'
      : 'Oy durumunu değiştirmek için tıkla.';
  }

  function satirRenkGuncelle(row) {
    if (!row) return;
    updateVoteAvailability(row);
    row.classList.remove('row-none', 'row-hayir', 'row-orta', 'row-evet', 'row-excluded');
    row.classList.add(({ 'SEÇ': 'row-none', 'HAYIR': 'row-hayir', 'ORTA': 'row-orta', 'EVET': 'row-evet' })[row.querySelector('.vote').dataset.val || 'SEÇ'] || 'row-none');
    if (rowVotingLocked(row)) row.classList.add('row-excluded');
  }

  function satirEkle(data = null, options = {}) {
    const item = normalizeRowRecord(data || {});
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${imageCell(item.veri[0] || '')}</td>
      <td>${hucre(item.veri[1] || '')}</td>
      <td>${hucre(item.veri[2] || '')}</td>
      <td>${hucre(item.veri[3] || '')}</td>
      <td>${hucre(item.veri[4] || '')}</td>
      <td>${hucre(item.veri[5] || '')}</td>
      <td>${hucre(item.veri[6] || '')}</td>
      <td>${hucre(item.veri[7] || '')}</td>
      <td>${hucre(item.veri[8] || '')}</td>
      <td>${ilceSelect(item.veri[9] || '')}</td>
      <td>${hucre(item.veri[10] || '')}</td>
      <td>${hucre(item.veri[11] || '')}</td>
      <td>${hucre(item.veri[12] || '')}</td>
      <td>${actionCell(item.veri[13] || '', 'text', 'phone')}</td>
      <td>${actionCell(item.veri[14] || '', 'text', 'phone')}</td>
      <td>${actionCell(item.veri[15] || '', 'text', 'phone')}</td>
      <td>${actionCell(item.veri[16] || '', 'text', 'phone')}</td>
      <td>${actionCell(item.veri[17] || '', 'text', 'email')}</td>
      <td>${actionCell(item.veri[18] || '', 'text', 'social')}</td>
      <td>${actionCell(item.veri[19] || '', 'text', 'social')}</td>
      <td>${actionCell(item.veri[20] || '', 'text', 'social')}</td>
      <td>${actionCell(item.veri[21] || '', 'text', 'social')}</td>
      <td>${hucre(item.veri[22] || '')}</td>
      <td>${hucre(item.veri[23] || '')}</td>
      <td>${hucre(item.veri[24] || '')}</td>
      <td>${actionCell(item.veri[25] || '', 'note')}</td>
      <td>${evetHayirSelect(item.ulusal, 'ulusal-select')}</td>
      <td>${evetHayirSelect(item.ziyaret1, 'ziyaret1-select')}</td>
      <td>${actionCell(item.ziyaret1Not, 'note')}</td>
      <td>${hucre(item.ziyaret1Tarih)}</td>
      <td>${evetHayirSelect(item.ziyaret2, 'ziyaret2-select')}</td>
      <td>${actionCell(item.ziyaret2Not, 'note')}</td>
      <td>${hucre(item.ziyaret2Tarih)}</td>
      <td>${evetHayirSelect(item.telefonGorusmesi, 'telefon-select')}</td>
      <td>${actionCell(item.telefonGorusmesiNot, 'note')}</td>
      <td>${hucre(item.telefonGorusmesiTarih)}</td>
      <td>${evetHayirSelect(item.aski, 'aski-select')}</td>
      <td>${evetHayirSelect(item.ikiYil, 'ikiyil-select')}</td>
      <td>${oyDiv(item.oy)}</td>
      <td class="meta">${escapeHtml(item.tarih)}</td>
      <td class="utility-cell"><button type="button" class="btn-secondary notification-toggle" onclick="satirBildirimGoster(this)">Bildirim Kapalı</button></td>
      <td class="utility-cell"><button type="button" class="btn-light share-toggle" onclick="toggleShareSelection(this)">Seç</button></td>
      <td class="utility-cell"><button type="button" class="btn-danger" onclick="sil(this)">Sil</button></td>
    `;
    qs('tablo').querySelector('tbody').appendChild(tr);
    setNotificationState(tr, item.bildirim === 'EVET');
    setShareSelectionState(tr, false);
    satirRenkGuncelle(tr);
    applyHiddenColumns();
    if (!options.skipSave) autoSaveDraft();
    filtre();
  }

  function renderRows(data = []) {
    const tbody = qs('tablo').querySelector('tbody');
    clearCellNotification();
    tbody.innerHTML = '';
    if (Array.isArray(data) && data.length) data.forEach(item => satirEkle(item, { skipSave: true }));
    else satirEkle(null, { skipSave: true });
    updateShareSelectionSummary();
    autoSaveDraft();
  }

  function renderHiddenColumns() {
    const hidden = Array.isArray(state.userData.hiddenColumns) ? state.userData.hiddenColumns : [];
    const box = qs('hiddenColumnsBox');
    if (!hidden.length) {
      box.innerHTML = '<span class="mini-note">Gizlenmiş sütun yok.</span>';
      return;
    }
    box.innerHTML = '<span class="mini-note">Gizlenmiş sütunlar:</span>' + hidden.map(index => `
      <button type="button" class="hidden-chip" onclick="sutunGoster(${index})">${escapeHtml(COLUMN_TITLES[index] || ('Sütun ' + index))} ekle</button>
    `).join('');
  }

  function applyHiddenColumns() {
    const hidden = Array.isArray(state.userData.hiddenColumns) ? state.userData.hiddenColumns : [];
    qs('tablo').querySelectorAll('tr').forEach(row => {
      [...row.children].forEach((cell, index) => {
        cell.style.display = hidden.includes(index) ? 'none' : '';
      });
    });
  }

  function sutunGizle(index) {
    const hidden = normalizeHiddenColumns([...(state.userData.hiddenColumns || []), index]);
    state.userData.hiddenColumns = hidden;
    queuePersistUserData();
    applyHiddenColumns();
    renderHiddenColumns();
  }

  function sutunGoster(index) {
    state.userData.hiddenColumns = normalizeHiddenColumns((state.userData.hiddenColumns || []).filter(item => item !== index));
    queuePersistUserData();
    applyHiddenColumns();
    renderHiddenColumns();
  }

  function getColumnFilterDefinition(columnIndex) {
    if (columnIndex === DISTRICT_COLUMN_INDEX) {
      return { type: 'exact', options: SIVAS_DISTRICTS, placeholder: 'Tüm İlçeler' };
    }
    if ([
      TABLE_INDEX.ULUSAL,
      TABLE_INDEX.ZIYARET1,
      TABLE_INDEX.ZIYARET2,
      TABLE_INDEX.TELEFON,
      TABLE_INDEX.ASKI,
      TABLE_INDEX.IKI_YIL
    ].includes(columnIndex)) {
      return { type: 'exact', options: ['EVET', 'HAYIR'], placeholder: 'Tüm Durumlar' };
    }
    if (columnIndex === NOTIFICATION_COLUMN_INDEX) {
      return { type: 'exact', options: ['EVET', 'HAYIR'], placeholder: 'Tüm Bildirimler' };
    }
    if (columnIndex === TABLE_INDEX.OY) {
      return { type: 'exact', options: VOTE_SEQUENCE, placeholder: 'Tüm Oylar' };
    }
    return { type: 'includes' };
  }

  function getFilterLabel(value) {
    if (value === 'EVET') return 'Evet';
    if (value === 'HAYIR') return 'Hayır';
    if (value === 'SEÇ') return 'Seç';
    return value;
  }

  function applyColumnFilter(columnIndex, value, match = 'includes') {
    const trimmedValue = String(nv(value, '')).trim();
    if (!trimmedValue) {
      if (activeColumnFilter && activeColumnFilter.index === columnIndex) activeColumnFilter = null;
    } else {
      activeColumnFilter = { index: columnIndex, text: trimmedValue, match };
    }
    filtre();
    contextMenuKapat();
  }

  function filtre() {
    const oy = qs('oyFiltre').value;
    const rows = [...qs('tablo').querySelectorAll('tbody tr')];
    const hasAnyFilter = Boolean(oy || activeColumnFilter);
    rows.forEach(row => {
      row.classList.remove('filtered-row');
      const rowVote = row.querySelector('.vote').dataset.val || 'SEÇ';
      const oyUygun = !oy || rowVote === oy;
      let kolonUygun = true;
      if (activeColumnFilter) {
        const cell = row.querySelectorAll('td')[activeColumnFilter.index];
        const cellValue = getCellValue(cell);
        kolonUygun = activeColumnFilter.match === 'exact'
          ? normalizeTextKey(cellValue) === normalizeTextKey(activeColumnFilter.text)
          : normalizeTextKey(cellValue).includes(normalizeTextKey(activeColumnFilter.text));
      }
      const show = oyUygun && kolonUygun;
      row.style.display = show ? '' : 'none';
      if (show && hasAnyFilter) row.classList.add('filtered-row');
    });
    if (notificationPriorityEnabled) moveNotificationRowsToTop();
  }

  function filtreTemizle() {
    qs('oyFiltre').value = '';
    activeColumnFilter = null;
    notificationPriorityEnabled = false;
    contextMenuKapat();
    document.querySelectorAll('#tablo tbody tr').forEach(row => {
      row.style.display = '';
      row.classList.remove('filtered-row');
    });
  }

  function kolonMenuAc(event, columnIndex) {
    event.preventDefault();
    contextMenuKapat();
    const title = qs('tablo').querySelector(`th[data-col="${columnIndex}"]`).textContent || 'Kolon';
    const filterDefinition = getColumnFilterDefinition(columnIndex);
    const activeValue = activeColumnFilter && activeColumnFilter.index === columnIndex ? activeColumnFilter.text : '';
    const isBaseColumn = columnIndex < COLUMN_TITLES.length;
    const isNotificationColumn = columnIndex === NOTIFICATION_COLUMN_INDEX;
    const menu = document.createElement('div');
    menu.className = 'context-menu';
    menu.innerHTML = `
      <div class="context-menu-title">${escapeHtml(title)}</div>
      ${filterDefinition.type === 'exact'
        ? `<select id="contextFilterInput" class="input">
            <option value="">${escapeHtml(filterDefinition.placeholder || 'Tümü')}</option>
            ${filterDefinition.options.map(option => `
              <option value="${escapeHtml(option)}" ${option === activeValue ? 'selected' : ''}>${escapeHtml(getFilterLabel(option))}</option>
            `).join('')}
          </select>`
        : `<input id="contextFilterInput" class="input" placeholder="Metne göre filtrele" value="${escapeHtml(activeValue)}">`
      }
      <button type="button" id="contextApply">Filtrele</button>
      <button type="button" id="contextClear">Bu kolon filtresini temizle</button>
      ${isNotificationColumn ? `<button type="button" id="contextPriority">${notificationPriorityEnabled ? 'Bildirim önceliğini kapat' : 'Bildirimlileri en üste taşı'}</button>` : ''}
      ${isBaseColumn ? `<button type="button" id="contextHide">Sütunu gizle</button>` : ''}
    `;
    menu.style.left = event.clientX + 'px';
    menu.style.top = event.clientY + 'px';
    document.body.appendChild(menu);
    const input = menu.querySelector('#contextFilterInput');
    input.focus();
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') applyColumnFilter(columnIndex, input.value, filterDefinition.type);
    });
    menu.querySelector('#contextApply').onclick = () => {
      applyColumnFilter(columnIndex, input.value, filterDefinition.type);
    };
    menu.querySelector('#contextClear').onclick = () => {
      applyColumnFilter(columnIndex, '', filterDefinition.type);
    };
    if (isNotificationColumn) {
      menu.querySelector('#contextPriority').onclick = () => {
        notificationPriorityEnabled = !notificationPriorityEnabled;
        filtre();
        contextMenuKapat();
      };
    }
    if (isBaseColumn) {
      menu.querySelector('#contextHide').onclick = () => {
        sutunGizle(columnIndex);
        contextMenuKapat();
      };
    }
    setTimeout(() => document.addEventListener('click', contextMenuKapat, { once: true }), 0);
  }

  function contextMenuKapat() {
    document.querySelectorAll('.context-menu').forEach(menu => menu.remove());
  }

  function updateFolderInfo() {
    const info = qs('folderInfo');
    const folderName = state.userData.imageDirName || '';
    if (!folderName) {
      info.textContent = '';
      info.classList.add('hidden');
      return;
    }
    info.textContent = `Seçili resim klasörü: ${folderName}`;
    info.classList.remove('hidden');
    info.classList.add('mini-note');
  }

  function listeyiCiz() {
    const alan = qs('isimSatirlari');
    alan.innerHTML = '';
    kayitlar.forEach(kayit => {
      const satir = document.createElement('div');
      satir.className = 'isim-satir';
      satir.innerHTML = aktifDuzenlemeId === kayit.id ? `
        <div class="isim-hucre">${kayit.id}</div>
        <div class="isim-hucre"><input id="isimGirdi-${kayit.id}" class="isim-girdi" type="text" value="${escapeHtml(kayit.isim)}" /></div>
        <div class="isim-hucre isim-hucre-son">
          <div class="isim-aksiyon">
            <button class="isim-buton isim-buton-kaydet" onclick="ismiKaydet(${kayit.id})">Kaydet</button>
            <button class="isim-buton isim-buton-iptal" onclick="duzenlemeyiIptalEt()">İptal</button>
          </div>
        </div>
      ` : `
        <div class="isim-hucre">${kayit.id}</div>
        <div class="isim-hucre">${escapeHtml(kayit.isim)}</div>
        <div class="isim-hucre isim-hucre-son">
          <div class="isim-aksiyon"><button class="isim-buton isim-buton-duzenle" onclick="duzenlemeyiBaslat(${kayit.id})">Düzenle</button></div>
        </div>
      `;
      alan.appendChild(satir);
    });
  }

  function duzenlemeyiBaslat(id) {
    aktifDuzenlemeId = id;
    listeyiCiz();
  }

  function ismiKaydet(id) {
    const girdi = qs(`isimGirdi-${id}`);
    const yeniIsim = girdi.value.trim() || '';
    if (!yeniIsim) {
      alert('İsim boş bırakılamaz.');
      return;
    }
    const hedef = kayitlar.find(item => item.id === id);
    if (hedef) hedef.isim = yeniIsim;
    aktifDuzenlemeId = null;
    state.userData.isimListesi = normalizeNameRecords(kayitlar);
    queuePersistUserData();
    listeyiCiz();
  }

  function duzenlemeyiIptalEt() {
    aktifDuzenlemeId = null;
    listeyiCiz();
  }

  function resimInputDegisti(input) {
    input.closest('.image-cell').querySelector('.thumb').src = input.value.trim();
    autoSaveDraft();
    filtre();
  }

  async function ensureDirectoryPermission(handle, write = false) {
    if (!handle) return false;
    const options = { mode: write ? 'readwrite' : 'read' };
    if (await handle.queryPermission(options) === 'granted') return true;
    return await handle.requestPermission(options) === 'granted';
  }

  async function resimSec(fileInput) {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    const wrapper = fileInput.closest('.image-cell');
    const textInput = wrapper.querySelector('input.cell');
    const img = wrapper.querySelector('.thumb');
    const savedPath = await resmiKlasoreKaydet(file);
    if (savedPath) {
      textInput.value = savedPath;
      img.src = savedPath;
      img.style.visibility = 'visible';
      autoSaveDraft();
      return;
    }
    const reader = new FileReader();
    reader.onload = event => {
      textInput.value = event.target.result;
      img.src = event.target.result;
      img.style.visibility = 'visible';
      autoSaveDraft();
    };
    reader.readAsDataURL(file);
  }

  async function klasorSec() {
    try {
      if (!window.showDirectoryPicker) return alert('Bu tarayıcı klasör seçimini desteklemiyor.');
      imageDirectoryHandle = await window.showDirectoryPicker();
      state.userData.imageDirName = imageDirectoryHandle.name || 'Seçili klasör';
      updateFolderInfo();
      await saveDirectoryHandleForCurrentUser(imageDirectoryHandle);
      queuePersistUserData(true);
    } catch (error) {
    }
  }

  async function resmiKlasoreKaydet(file) {
    try {
      if (!imageDirectoryHandle || !(await ensureDirectoryPermission(imageDirectoryHandle, true))) return null;
      const cleanName = (file.name || ('resim_' + Date.now() + '.png')).replace(/[^a-zA-Z0-9._-]/g, '_');
      const target = await imageDirectoryHandle.getFileHandle(cleanName, { create: true });
      const writable = await target.createWritable();
      await writable.write(file);
      await writable.close();
      return cleanName;
    } catch (error) {
      return null;
    }
  }

  function sil(btn) {
    btn.closest('tr').remove();
    updateShareSelectionSummary();
    autoSaveDraft();
    filtre();
  }

  function oyDegistir(el) {
    if (el.dataset.locked === '1') return;
    const current = el.dataset.val || 'SEÇ';
    const next = VOTE_SEQUENCE[(VOTE_SEQUENCE.indexOf(current) + 1) % VOTE_SEQUENCE.length];
    setVoteElementValue(el, next);
    satirRenkGuncelle(el.closest('tr'));
    autoSaveDraft();
    filtre();
  }

  function durumDegisti(select) {
    satirRenkGuncelle(select.closest('tr'));
    autoSaveDraft();
    loadChart();
    filtre();
  }

  async function tumunuKaydet() {
    const data = getTableData();
    const canvas = await html2canvas(qs('tableArea'), { backgroundColor: '#ffffff', scale: 1.2 });
    state.userData.history.push({
      id: Date.now(),
      tarih: tarih(),
      satir: data.length,
      img: canvas.toDataURL('image/png'),
      data
    });
    state.userData.draft = data;
    queuePersistUserData(true);
    renderHistory();
    loadChart();
    alert('Kayıt başarıyla alındı.');
  }

  function renderHistory() {
    const cards = qs('cards');
    const history = [...getHistory()].reverse();
    if (!history.length) {
      cards.className = '';
      cards.innerHTML = '<div class="empty">Henüz kayıt yok. Anasayfada tabloyu doldurup Kaydet butonuna bas.</div>';
      return;
    }
    cards.className = 'cards';
    cards.innerHTML = history.map(item => `
      <div class="card">
        <img src="${item.img}" alt="Kayıt görünümü">
        <div class="card-body">
          <h3>Kayıt #${item.id}</h3>
          <p><strong>Satır:</strong> ${item.satir}</p>
          <p><strong>Tarih:</strong> ${escapeHtml(item.tarih)}</p>
          <div class="card-actions">
            <button type="button" class="btn-primary" onclick="kaydiYukle(${item.id})">Yükle</button>
            <button type="button" class="btn-danger" onclick="kaydiSil(${item.id})">Sil</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  function kaydiYukle(id) {
    const item = getHistory().find(entry => entry.id === id);
    if (!item) return;
    renderRows(item.data || []);
    showPage('ana');
    alert('Kayıt tabloya yüklendi.');
  }

  function kaydiSil(id) {
    state.userData.history = getHistory().filter(entry => entry.id !== id);
    queuePersistUserData(true);
    renderHistory();
    loadChart();
  }

  function sonKaydiYukle() {
    const history = getHistory();
    if (!history.length) return alert('Yüklenecek kayıt yok.');
    renderRows(history[history.length - 1].data || []);
    alert('Son kayıt yüklendi.');
  }

  function tabloTemizle() {
    if (!window.confirm('Tablodaki tüm satırlar temizlensin mi? Bu işlem mevcut taslağı sıfırlar.')) return;
    renderRows([]);
  }

  function buildRowExportArray(item) {
    return [
      ...item.veri, item.ulusal, item.ziyaret1, item.ziyaret1Not, item.ziyaret1Tarih,
      item.ziyaret2, item.ziyaret2Not, item.ziyaret2Tarih, item.telefonGorusmesi,
      item.telefonGorusmesiNot, item.telefonGorusmesiTarih, item.aski, item.ikiYil, item.oy, item.tarih, item.bildirim
    ];
  }

  function getVoteRowColor(item) {
    if (item.aski === 'EVET' || item.ikiYil === 'EVET') return '#e2e8f0';
    if (item.oy === 'EVET') return '#dcfce7';
    if (item.oy === 'ORTA') return '#fef3c7';
    if (item.oy === 'HAYIR') return '#fee2e2';
    return '#f8fafc';
  }

  function buildExportFileName(prefix, count, extension) {
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    return `${prefix}-${count}-satir-${stamp}.${extension}`;
  }

  function downloadBlob(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function buildExcelHtml(data, reportTitle) {
    const rowsHtml = data.map((item, rowIndex) => `
      <tr style="background:${getVoteRowColor(item)};">
        ${buildRowExportArray(item).map(value => `
          <td style="border:1px solid #cbd5e1;padding:8px 10px;vertical-align:top;">${escapeHtml(value)}</td>
        `).join('')}
      </tr>
    `).join('');
    return `\ufeff
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Segoe UI, Arial, sans-serif; background: #f8fafc; color: #0f172a; }
            .sheet { padding: 24px; }
            .sheet h1 { margin: 0 0 8px; font-size: 24px; }
            .sheet p { margin: 0 0 18px; color: #475569; }
            table { border-collapse: collapse; width: 100%; }
            th {
              background: linear-gradient(180deg, #1d4ed8, #1e3a8a);
              color: #ffffff;
              font-weight: 700;
              border: 1px solid #93c5fd;
              padding: 10px;
              text-align: left;
            }
          </style>
        </head>
        <body>
          <div class="sheet">
            <h1>${escapeHtml(reportTitle)}</h1>
            <p>Olusturulma: ${escapeHtml(tarih())} | Satir sayisi: ${data.length}</p>
            <table>
              <thead>
                <tr>${EXPORT_COLUMN_TITLES.map(title => `<th>${escapeHtml(title)}</th>`).join('')}</tr>
              </thead>
              <tbody>${rowsHtml}</tbody>
            </table>
          </div>
        </body>
      </html>
    `;
  }

  function exportRowsAsExcel(data, reportTitle = 'Uye Raporu') {
    if (!data.length) {
      alert('Dışa aktarılacak satır bulunamadı.');
      return;
    }
    const html = buildExcelHtml(data, reportTitle);
    downloadBlob(
      buildExportFileName('uye-raporu', data.length, 'xls'),
      html,
      'application/vnd.ms-excel;charset=utf-8'
    );
  }

  function getPrimaryRecordTitle(item, index) {
    return String(item.veri[7] || item.veri[10] || item.veri[1] || `Kayit ${index + 1}`).trim();
  }

  function buildPdfFieldRows(item) {
    const rows = [
      ['Üye Sicil', item.veri[1]],
      ['Ticaret Sicil', item.veri[2]],
      ['Mersis No', item.veri[3]],
      ['Nace Kodu', item.veri[4]],
      ['Vergi No', item.veri[5]],
      ['Meslek Grubu', item.veri[6]],
      ['Ünvan', item.veri[7]],
      ['Adres', item.veri[8]],
      ['İlçe', item.veri[9]],
      ['Yetkili Adı 1', item.veri[10]],
      ['Yetkili Adı 2', item.veri[11]],
      ['Yetkili Adı 3', item.veri[12]],
      ['Firma Sabit Tel', item.veri[13]],
      ['Yetkili GSM 1', item.veri[14]],
      ['Yetkili GSM 2', item.veri[15]],
      ['Yetkili GSM 3', item.veri[16]],
      ['E-Posta', item.veri[17]],
      ['Instagram', item.veri[18]],
      ['Facebook', item.veri[19]],
      ['X', item.veri[20]],
      ['Linkedin', item.veri[21]],
      ['Referans 1', item.veri[22]],
      ['Referans 2', item.veri[23]],
      ['Referans 3', item.veri[24]],
      ['Not', item.veri[25]],
      ['Ulusal Olma Durumu', item.ulusal],
      ['Ziyaret 1', item.ziyaret1],
      ['Ziyaret 1 Notu', item.ziyaret1Not],
      ['Ziyaret 1 Tarihi', item.ziyaret1Tarih],
      ['Ziyaret 2', item.ziyaret2],
      ['Ziyaret 2 Notu', item.ziyaret2Not],
      ['Ziyaret 2 Tarihi', item.ziyaret2Tarih],
      ['Telefon Görüşmesi', item.telefonGorusmesi],
      ['Telefon Görüşmesi Notu', item.telefonGorusmesiNot],
      ['Telefon Görüşmesi Tarihi', item.telefonGorusmesiTarih],
      ['Askı Olma Durumu', item.aski],
      ['2 Yıl Olma Durumu', item.ikiYil],
      ['Oy', item.oy],
      ['Bildirim Durumu', item.bildirim],
      ['Tablo Tarihi', item.tarih]
    ];
    return rows.filter(([, value]) => String(nv(value, '')).trim() !== '');
  }

  function buildPdfReportMarkup(data, reportTitle) {
    return `
      <style>
        .pdf-report {
          width: 1120px;
          padding: 40px;
          background: linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%);
          color: #0f172a;
          font-family: "Segoe UI", Arial, sans-serif;
        }
        .pdf-report * { box-sizing: border-box; }
        .pdf-cover {
          background: linear-gradient(135deg, #0f172a, #1d4ed8);
          color: #fff;
          border-radius: 28px;
          padding: 28px 30px;
          margin-bottom: 24px;
          box-shadow: 0 18px 40px rgba(29, 78, 216, 0.22);
        }
        .pdf-cover h1 { margin: 0 0 8px; font-size: 34px; }
        .pdf-cover p { margin: 0; font-size: 15px; color: rgba(255,255,255,0.85); }
        .pdf-record {
          page-break-inside: avoid;
          background: #ffffff;
          border: 1px solid #dbe5f3;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
          margin-bottom: 22px;
        }
        .pdf-record-head {
          display: grid;
          grid-template-columns: 180px 1fr;
          gap: 20px;
          padding: 24px;
          background: linear-gradient(180deg, rgba(219, 234, 254, 0.75), rgba(255,255,255,0.96));
        }
        .pdf-record-photo {
          width: 180px;
          height: 180px;
          object-fit: cover;
          border-radius: 20px;
          border: 1px solid #cbd5e1;
          background: #e2e8f0;
        }
        .pdf-record-summary h2 {
          margin: 0 0 8px;
          font-size: 28px;
        }
        .pdf-record-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin: 16px 0 0;
        }
        .pdf-chip {
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 13px;
          font-weight: 700;
        }
        .pdf-chip.vote-evet { background: #dcfce7; color: #166534; }
        .pdf-chip.vote-orta { background: #fef3c7; color: #92400e; }
        .pdf-chip.vote-hayir { background: #fee2e2; color: #991b1b; }
        .pdf-chip.vote-sec { background: #e2e8f0; color: #334155; }
        .pdf-chip.notice-on { background: #dbeafe; color: #1d4ed8; }
        .pdf-chip.notice-off { background: #f1f5f9; color: #475569; }
        .pdf-detail-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          padding: 0 24px 24px;
        }
        .pdf-detail-item {
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 12px 14px;
          background: #f8fafc;
        }
        .pdf-detail-item strong {
          display: block;
          color: #1e3a8a;
          margin-bottom: 6px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .pdf-detail-item span {
          display: block;
          color: #0f172a;
          white-space: pre-wrap;
          word-break: break-word;
          line-height: 1.45;
        }
      </style>
      <div class="pdf-report">
        <div class="pdf-cover">
          <h1>${escapeHtml(reportTitle)}</h1>
          <p>Olusturulma: ${escapeHtml(tarih())} | Kayit sayisi: ${data.length}</p>
        </div>
        ${data.map((item, index) => {
          const detailRows = buildPdfFieldRows(item).map(([label, value]) => `
            <div class="pdf-detail-item">
              <strong>${escapeHtml(label)}</strong>
              <span>${escapeHtml(value)}</span>
            </div>
          `).join('');
          const voteClass = item.oy === 'EVET' ? 'vote-evet' : item.oy === 'ORTA' ? 'vote-orta' : item.oy === 'HAYIR' ? 'vote-hayir' : 'vote-sec';
          const imageValue = String(nv(item.veri[0], '')).trim();
          return `
            <section class="pdf-record">
              <div class="pdf-record-head">
                ${imageValue ? `<img class="pdf-record-photo" src="${escapeHtml(imageValue)}" alt="${escapeHtml(getPrimaryRecordTitle(item, index))}" onerror="this.style.display='none'">` : `<div class="pdf-record-photo"></div>`}
                <div class="pdf-record-summary">
                  <h2>${escapeHtml(getPrimaryRecordTitle(item, index))}</h2>
                  <div>${escapeHtml(item.veri[7] || item.veri[10] || 'Kayit detayi')}</div>
                  <div class="pdf-record-meta">
                    <span class="pdf-chip ${voteClass}">Oy: ${escapeHtml(item.oy)}</span>
                    <span class="pdf-chip ${item.bildirim === 'EVET' ? 'notice-on' : 'notice-off'}">Bildirim: ${escapeHtml(item.bildirim)}</span>
                    <span class="pdf-chip notice-off">İlçe: ${escapeHtml(item.veri[9] || '-')}</span>
                    <span class="pdf-chip notice-off">Tarih: ${escapeHtml(item.tarih)}</span>
                  </div>
                </div>
              </div>
              <div class="pdf-detail-grid">${detailRows}</div>
            </section>
          `;
        }).join('')}
      </div>
    `;
  }

  function waitForContainerImages(container) {
    const images = [...container.querySelectorAll('img')].filter(img => img.getAttribute('src'));
    if (!images.length) return Promise.resolve();
    return Promise.all(images.map(img => new Promise(resolve => {
      if (img.complete) {
        resolve();
        return;
      }
      img.addEventListener('load', resolve, { once: true });
      img.addEventListener('error', resolve, { once: true });
    })));
  }

  async function exportRowsAsPdf(data, reportTitle = 'Uye Raporu') {
    if (!data.length) {
      alert('PDF için en az bir satır seçmelisin.');
      return;
    }
    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert('PDF aracı yüklenemedi.');
      return;
    }
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-20000px';
    container.style.top = '0';
    container.style.zIndex = '-1';
    container.innerHTML = buildPdfReportMarkup(data, reportTitle);
    document.body.appendChild(container);
    try {
      await waitForContainerImages(container);
      const canvas = await html2canvas(container.firstElementChild, {
        backgroundColor: '#f8fbff',
        scale: 1.6,
        useCORS: true
      });
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const imgData = canvas.toDataURL('image/png');
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }
      pdf.save(buildExportFileName('uye-raporu', data.length, 'pdf'));
    } finally {
      container.remove();
    }
  }

  function paylasSecilenleri(format) {
    const data = getSelectedTableData();
    if (!data.length) {
      alert('Paylaşım için seçili satır bulunamadı.');
      return;
    }
    if (format === 'pdf') {
      exportRowsAsPdf(data, 'Secili Uye Raporu').catch(error => {
        console.error(error);
        alert('PDF oluşturulurken beklenmeyen bir hata oluştu.');
      });
    } else {
      exportRowsAsExcel(data, 'Secili Uye Raporu');
    }
    closeShareMenu();
  }

  function paylasSecimleriTemizle() {
    document.querySelectorAll('#tablo tbody tr[data-share-selected="1"]').forEach(row => {
      setShareSelectionState(row, false);
    });
    updateShareSelectionSummary();
  }

  function normalizeHeaderValue(value) {
    return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  }

  function buildImportHeaderMap(headers) {
    const normalizedHeaders = headers.map(normalizeHeaderValue);
    const result = {};
    Object.entries(IMPORT_FIELD_ALIASES).forEach(([field, aliases]) => {
      for (const alias of aliases) {
        const index = normalizedHeaders.findIndex(header => header === alias.name);
        if (index !== -1) {
          result[field] = { index, legacyInverted: Boolean(alias.legacyInverted) };
          break;
        }
      }
    });
    return result;
  }

  function mapExcelRowWithHeaders(row, headerMap) {
    const getValue = (field, fallback = '') => headerMap[field] ? nv(row[headerMap[field].index], fallback) : fallback;
    return normalizeRowRecord({
      veri: BASE_IMPORT_FIELDS.map(field => String(getValue(field, ''))),
      ulusal: getValue('ulusal', 'HAYIR'),
      ziyaret1: getValue('ziyaret1', 'HAYIR'),
      ziyaret1Not: getValue('ziyaret1Not', ''),
      ziyaret1Tarih: getValue('ziyaret1Tarih', ''),
      ziyaret2: getValue('ziyaret2', 'HAYIR'),
      ziyaret2Not: getValue('ziyaret2Not', ''),
      ziyaret2Tarih: getValue('ziyaret2Tarih', ''),
      telefonGorusmesi: getValue('telefonGorusmesi', 'HAYIR'),
      telefonGorusmesiNot: getValue('telefonGorusmesiNot', ''),
      telefonGorusmesiTarih: getValue('telefonGorusmesiTarih', ''),
      aski: normalizeRestrictedStatus(getValue('aski', 'HAYIR'), Boolean(headerMap.aski && headerMap.aski.legacyInverted)),
      ikiYil: normalizeRestrictedStatus(getValue('ikiYil', 'HAYIR'), Boolean(headerMap.ikiYil && headerMap.ikiYil.legacyInverted)),
      oy: getValue('oy', 'SEÇ'),
      tarih: getValue('tarih', tarih()),
      bildirim: getValue('bildirim', 'HAYIR')
    });
  }

  function mapExcelRowByPosition(row, sourceSchemaVersion = CURRENT_SCHEMA_VERSION) {
    if (sourceSchemaVersion < 2) {
      return normalizeRowRecord({
        veri: Array.from({ length: 25 }, (_, index) => nv(row[index], '')),
        ziyaret1: nv(row[27], 'HAYIR'),
        ziyaret1Not: nv(row[28], ''),
        ziyaret1Tarih: nv(row[29], ''),
        ziyaret2: nv(row[30], 'HAYIR'),
        ziyaret2Not: nv(row[31], ''),
        ziyaret2Tarih: nv(row[32], ''),
        telefonGorusmesi: nv(row[33], 'HAYIR'),
        telefonGorusmesiNot: nv(row[34], ''),
        telefonGorusmesiTarih: nv(row[35], ''),
        aski: nv(row[25], 'EVET'),
        ikiYil: nv(row[26], 'EVET'),
        oy: nv(row[36], 'SEÇ'),
        tarih: nv(row[37], tarih())
      }, { sourceSchemaVersion });
    }
    if (sourceSchemaVersion < 3) {
      return normalizeRowRecord({
        veri: Array.from({ length: 25 }, (_, index) => nv(row[index], '')),
        ulusal: nv(row[25], 'HAYIR'),
        ziyaret1: nv(row[26], 'HAYIR'),
        ziyaret1Not: nv(row[27], ''),
        ziyaret1Tarih: nv(row[28], ''),
        ziyaret2: nv(row[29], 'HAYIR'),
        ziyaret2Not: nv(row[30], ''),
        ziyaret2Tarih: nv(row[31], ''),
        telefonGorusmesi: nv(row[32], 'HAYIR'),
        telefonGorusmesiNot: nv(row[33], ''),
        telefonGorusmesiTarih: nv(row[34], ''),
        aski: nv(row[35], 'HAYIR'),
        ikiYil: nv(row[36], 'HAYIR'),
        oy: nv(row[37], 'SEÇ'),
        tarih: nv(row[38], tarih())
      }, { sourceSchemaVersion });
    }
    return normalizeRowRecord({
      veri: Array.from({ length: BASE_VALUE_COUNT }, (_, index) => nv(row[index], '')),
      ulusal: nv(row[26], 'HAYIR'),
      ziyaret1: nv(row[27], 'HAYIR'),
      ziyaret1Not: nv(row[28], ''),
      ziyaret1Tarih: nv(row[29], ''),
      ziyaret2: nv(row[30], 'HAYIR'),
      ziyaret2Not: nv(row[31], ''),
      ziyaret2Tarih: nv(row[32], ''),
      telefonGorusmesi: nv(row[33], 'HAYIR'),
      telefonGorusmesiNot: nv(row[34], ''),
      telefonGorusmesiTarih: nv(row[35], ''),
      aski: nv(row[36], 'HAYIR'),
      ikiYil: nv(row[37], 'HAYIR'),
      oy: nv(row[38], 'SEÇ'),
      tarih: nv(row[39], tarih())
    });
  }

  function excel() {
    exportRowsAsExcel(getTableData(), 'Tum Uye Listesi');
  }

  function exceldenYukle(input) {
    const file = input.files && input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const workbook = XLSX.read(new Uint8Array(event.target.result), { type: 'array' });
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1, defval: '' });
        if (!rows.length) return alert('Excel içinde veri bulunamadı.');
        const headers = rows[0].map(item => String(nv(item, '')));
        const body = rows.slice(1).filter(row => row.some(value => String(value).trim() !== ''));
        const headerMap = buildImportHeaderMap(headers);
        const recognized = Object.keys(headerMap).length;
        const looksLegacy = normalizeHeaderValue(headers[25]) === 'aski olmama durumu' || normalizeHeaderValue(headers[33]) === 'ziyaret 3';
        const positionalSchemaVersion = looksLegacy ? 1 : (headers.length >= COLUMN_TITLES.length ? 3 : 2);
        renderRows(body.map(row => recognized >= 10 ? mapExcelRowWithHeaders(row, headerMap) : mapExcelRowByPosition(row, positionalSchemaVersion)));
        applyHiddenColumns();
        alert('Excel verileri tabloya yüklendi.');
      } catch (error) {
        alert('Excel okunamadı. Başlık sırası sistemle aynı olmalı.');
      }
    };
    reader.readAsArrayBuffer(file);
    input.value = '';
  }

  function loadChart() {
    const counts = { EVET: 0, ORTA: 0, HAYIR: 0 };
    let total = 0;
    getTableData().forEach(item => {
      if (item.aski === 'EVET' || item.ikiYil === 'EVET') return;
      total += 1;
      if (counts[item.oy] !== undefined) counts[item.oy] += 1;
    });
    qs('statTotal').textContent = String(total);
    qs('statEvet').textContent = String(counts.EVET);
    qs('statOrta').textContent = String(counts.ORTA);
    qs('statHayir').textContent = String(counts.HAYIR);
    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(qs('chart'), {
      type: 'pie',
      data: { labels: ['EVET', 'ORTA', 'HAYIR'], datasets: [{ data: [counts.EVET, counts.ORTA, counts.HAYIR], backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'], borderWidth: 0 }] },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });
  }

  function sutunBoyutlandirBaslat(event, index) {
    event.preventDefault();
    event.stopPropagation();
    const rows = [...qs('tablo').querySelectorAll('tr')];
    const startX = event.clientX;
    const header = qs('tablo').querySelector(`th[data-col="${index}"]`);
    const startWidth = header ? header.offsetWidth : 120;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    function onMove(moveEvent) {
      const width = Math.max(70, startWidth + (moveEvent.clientX - startX));
      rows.forEach(row => {
        const cell = row.children[index];
        if (cell) {
          cell.style.width = width + 'px';
          cell.style.minWidth = width + 'px';
          cell.style.maxWidth = width + 'px';
        }
      });
    }
    function onUp() {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  function showPage(id) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    qs(id).classList.add('active');
    document.querySelectorAll('.menu button').forEach(btn => btn.classList.remove('active'));
    qs('nav-' + id).classList.add('active');
    if (id === 'kayit') renderHistory();
    if (id === 'grafik') loadChart();
  }

  async function initializeApp() {
    renderTableHeader();
    listeyiCiz();
    updateFolderInfo();
    renderRows(getDraft());
    applyHiddenColumns();
    renderHiddenColumns();
    renderHistory();
    loadChart();
    setLoginControlsDisabled(false);
    clearLoginStatus();
  }

  async function bootstrap() {
    Object.assign(window, {
      login, logout, showPage, filtre, filtreTemizle, satirEkle, klasorSec, exceldenYukle, tabloTemizle, sonKaydiYukle,
      tumunuKaydet, excel, kolonMenuAc, sutunBoyutlandirBaslat, sil, oyDegistir, durumDegisti, sutunGoster,
      resimInputDegisti, resimSec, duzenlemeyiBaslat, ismiKaydet, duzenlemeyiIptalEt, kaydiYukle, kaydiSil,
      satirBildirimGoster,
      autoSaveDraft,
      toggleShareSelection,
      toggleShareMenu,
      paylasSecilenleri,
      paylasSecimleriTemizle
    });
    renderTableHeader();
    await seedDefaultUsers();
    qs('user').value = DEFAULT_LOGIN_EMAIL;
    await refreshLoginStateForUser(qs('user').value.trim());
    qs('user').addEventListener('input', async () => refreshLoginStateForUser(qs('user').value.trim()));
    qs('user').addEventListener('keydown', event => { if (event.key === 'Enter') login(); });
    qs('pass').addEventListener('keydown', event => { if (event.key === 'Enter') login(); });
    window.addEventListener('pagehide', () => queuePersistUserData(true));
    if (await restoreSupabaseSession()) return;
  }

  bootstrap().catch(error => {
    console.error(error);
    qs('loginError').textContent = 'Uygulama başlatılamadı.';
  });
})();
