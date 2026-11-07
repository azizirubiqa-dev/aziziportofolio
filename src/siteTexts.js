// Semua teks tetap (judul section, label tombol, angka statistik) yang bisa diedit dari admin → menu "Teks Situs".
// Disimpan di site_settings.texts (jsonb). Kosong = pakai teks bawaan di bawah.
export const DEFAULT_TEXTS = {
  hero_greeting: 'Hi, I’m', hero_name: 'Azizi', hero_title_word: 'Portfolio', hero_cta: 'View work', hero_scroll: 'Scroll to explore',
  stat1_value: '2', stat1_label: 'Years in creative industry',
  stat2_value: '20', stat2_label: 'Creative projects',
  stat3_value: '10', stat3_label: 'Achievements',
  stat4_value: 'Global', stat4_label: 'International clients',
  resume_label: 'View resume',
  clients_eyebrow: 'Clients', clients_title: 'Brands I’ve worked with',
  toolkit_eyebrow: 'Toolkit', toolkit_title: 'The tools behind the work',
  process_eyebrow: 'Process', process_title: 'From idea to final frame',
  work_eyebrow: 'Selected work', work_title: 'Work that speaks', work_all: 'All work',
  journey_eyebrow: 'Journey', journey_title: 'Always moving. Always creating',
  exp_title: 'Experience', exp_count: '3', exp_more: 'View details', edu_title: 'Education & skills', edu_label: 'Education', toolkit_label: 'Creative toolkit',
  contact_eyebrow: 'Contact', contact_title_1: 'Let’s work', contact_title_2: 'together',
  contact_text_1: 'Have a story to tell?', contact_text_2: 'Let’s make something worth watching.',
  contact_cta: 'Start a conversation', contact_email_btn: 'Send an email',
  brief_title: 'Tell me about your project', brief_sub: 'Share your idea, needs, and timeline. It opens as a draft in WhatsApp.', brief_chips: 'Film, Commercial, Collab',
  footer_text: 'Every frame has a purpose.',
};

// Pengelompokan untuk halaman admin (urutan = urutan di situs)
export const TEXT_GROUPS = [
  { title: '1 · Hero', keys: [['hero_greeting', 'Sapaan'], ['hero_name', 'Nama besar'], ['hero_title_word', 'Tulisan besar di belakang foto'], ['hero_cta', 'Tombol utama'], ['hero_scroll', 'Teks “scroll” di bawah']] },
  { title: '1 · Hero — empat kartu statistik', note: 'Isi angka saja (mis. 2) untuk animasi hitung + tanda “+”. Isi teks (mis. Global) untuk tampil apa adanya.', keys: [['stat1_value', 'Kartu 1: angka/teks'], ['stat1_label', 'Kartu 1: keterangan'], ['stat2_value', 'Kartu 2: angka/teks'], ['stat2_label', 'Kartu 2: keterangan'], ['stat3_value', 'Kartu 3: angka/teks'], ['stat3_label', 'Kartu 3: keterangan'], ['stat4_value', 'Kartu 4: angka/teks'], ['stat4_label', 'Kartu 4: keterangan']] },
  { title: '2 · Clients', keys: [['clients_eyebrow', 'Label kecil'], ['clients_title', 'Judul']] },
  { title: '3 · Toolkit & Process', keys: [['toolkit_eyebrow', 'Toolkit: label kecil'], ['toolkit_title', 'Toolkit: judul'], ['process_eyebrow', 'Process: label kecil'], ['process_title', 'Process: judul']] },
  { title: '4 · Work', keys: [['work_eyebrow', 'Label kecil'], ['work_title', 'Judul'], ['work_all', 'Tombol “All work”']] },
  { title: '5 · Journey', keys: [['journey_eyebrow', 'Label kecil'], ['journey_title', 'Judul'], ['exp_title', 'Kartu kiri: judul'], ['exp_more', 'Kartu kiri: tombol detail'], ['exp_count', 'Kartu kiri: jumlah pengalaman di depan (sisanya di “View details”)'], ['edu_title', 'Kartu kanan: judul'], ['edu_label', 'Kartu kanan: sub “Education”'], ['toolkit_label', 'Kartu kanan: sub “Creative toolkit”']] },
  { title: '6 · Contact', keys: [['contact_eyebrow', 'Label kecil'], ['contact_title_1', 'Judul baris 1'], ['contact_title_2', 'Judul baris 2'], ['contact_text_1', 'Kalimat 1'], ['contact_text_2', 'Kalimat 2'], ['contact_cta', 'Tombol WhatsApp'], ['contact_email_btn', 'Tombol email'], ['resume_label', 'Tombol resume (Contact & Hero)'], ['brief_title', 'Kartu brief: judul'], ['brief_sub', 'Kartu brief: penjelasan'], ['brief_chips', 'Kartu brief: chip (pisah koma)']] },
  { title: 'Footer', keys: [['footer_text', 'Teks setelah © tahun Azizi.']] },
];
