export type Lang = "id" | "en";

type Entry = { id: string; en: string };

const tr: Record<string, Entry> = {
  // === HEADER ===
  "nav.tools": { id: "Tools", en: "Tools" },
  "nav.features": { id: "Features", en: "Features" },
  "nav.showcase": { id: "Showcase", en: "Showcase" },
  "nav.admin": { id: "Admin", en: "Admin" },
  "nav.login": { id: "Login", en: "Login" },
  "nav.logout": { id: "Logout", en: "Logout" },
  "nav.getStarted": { id: "GET STARTED", en: "GET STARTED" },
  "nav.loggedInAs": { id: "Logged in as", en: "Logged in as" },

  // === HERO ===
  "hero.title": { id: "SOCIAL TOOLS BY ZA!!", en: "SOCIAL TOOLS BY ZA!!" },
  "hero.tagline": { id: "Alat tempur kuliah, ngoding, dan ngonten terlengkap buat bertahan hidup sampai lulus!", en: "The ultimate toolkit for surviving college, coding, and content creation!" },
  "hero.tag1": { id: "#Semester6Survival", en: "#Semester6Survival" },
  "hero.tag2": { id: "#NoDebtNoStress", en: "#NoDebtNoStress" },
  "hero.tag3": { id: "#FullComicMode", en: "#FullComicMode" },

  // === FOOTER ===
  "footer.title": { id: "THE CREW / CONTACT ME", en: "THE CREW / CONTACT ME" },
  "footer.desc": { id: "Punya pertanyaan, kritik, atau pengen ngopi bareng? Temuin gue di sosmed bawah ini!", en: "Questions, feedback, or wanna grab coffee? Find me on socials below!" },
  "footer.terms": { id: "Syarat", en: "Terms" },
  "footer.privacy": { id: "Privasi", en: "Privacy" },
  "footer.contact": { id: "Kontak", en: "Contact" },
  "footer.copyright": { id: "LETTER TO THE EDITOR:", en: "LETTER TO THE EDITOR:" },

  // === HOME ===
  "home.subtools": { id: "FULL PAGE", en: "FULL PAGE" },
  "home.open": { id: "BUKA →", en: "OPEN →" },
  "subtools.photobox": { id: "Photobox Comic Studio", en: "Photobox Comic Studio" },
  "subtools.photoboxDesc": { id: "Upload foto, pilih layout & filter komik, download collage", en: "Upload photos, pick layouts & comic filters, download collage" },
  "subtools.jurnal": { id: "Jurnal Finder", en: "Jurnal Finder" },
  "subtools.jurnalDesc": { id: "Cari jurnal akademik dari Google Scholar", en: "Search academic journals from Google Scholar" },
  "subtools.markdown": { id: "Markdown Previewer", en: "Markdown Previewer" },
  "subtools.markdownDesc": { id: "Tulis Markdown, lihat preview HTML real-time", en: "Write Markdown, see real-time HTML preview" },
  "subtools.linktree": { id: "Linktree Generator", en: "Linktree Generator" },
  "subtools.linktreeDesc": { id: "Buat halaman linktree pribadi aesthetic", en: "Create your own aesthetic linktree page" },

  // === FEATURES PAGE ===
  "features.title": { id: "ALL FEATURES!!", en: "ALL FEATURES!!" },
  "features.subtitle": { id: "13 alat sakti buat naklukin tugas kuliah, ngoding, dan ngonten. Satu web, semua beres!", en: "13 powerful tools to conquer college, coding, and content creation. One site, all done!" },
  "features.ctaTitle": { id: "SIAP MENJADI LEGENDS?", en: "READY TO BE LEGENDS?" },
  "features.ctaDesc": { id: "Cobain semua tools sekarang juga. Gratis, cepat, dan gampang!", en: "Try all tools now. Free, fast, and easy!" },
  "features.ctaBtn": { id: "COBAIN SEKARANG", en: "TRY NOW" },

  // === FEATURES - CARD DATA ===
  "f.photobox.title": { id: "Photobox Comic Studio", en: "Photobox Comic Studio" },
  "f.photobox.badge": { id: "BOOTH!", en: "BOOTH!" },
  "f.photobox.desc": { id: "Upload 1-6 foto, pilih layout komik, aplikasikan 12+ filter unik, download hasilnya sebagai PNG.", en: "Upload 1-6 photos, pick comic layouts, apply 12+ unique filters, download as PNG." },
  "f.photobox.hl": { id: "12+ efek filter,6 layout grid,Comic-style,Canvas-based", en: "12+ filters,6 grid layouts,Comic-style,Canvas-based" },
  "f.tiktok.title": { id: "TikTok Video Downloader", en: "TikTok Video Downloader" },
  "f.tiktok.badge": { id: "BOOM!", en: "BOOM!" },
  "f.tiktok.desc": { id: "Sedot video TikTok tanpa watermark. Cukup paste link, klik GRAB, dan video siap diunduh.", en: "Download TikTok videos without watermark. Just paste link, click GRAB, and download." },
  "f.tiktok.hl": { id: "No watermark,HD quality,Free forever", en: "No watermark,HD quality,Free forever" },
  "f.removebg.title": { id: "Remove Background Image", en: "Remove Background Image" },
  "f.removebg.badge": { id: "ZAP!", en: "ZAP!" },
  "f.removebg.desc": { id: "Hapus latar belakang gambar otomatis 100% di browser pake AI. Privasi terjamin!", en: "Remove image backgrounds automatically 100% in-browser with AI. Privacy guaranteed!" },
  "f.removebg.hl": { id: "AI-powered,100% client-side,PNG transparent", en: "AI-powered,100% client-side,PNG transparent" },
  "f.pdftoword.title": { id: "PDF to Word Converter", en: "PDF to Word Converter" },
  "f.pdftoword.badge": { id: "CONVERT!", en: "CONVERT!" },
  "f.pdftoword.desc": { id: "Konversi file PDF ke dokumen Word (.docx) dengan format rapi. Tinggal upload dan convert!", en: "Convert PDF files to Word documents (.docx) with clean formatting. Just upload and convert!" },
  "f.pdftoword.hl": { id: "Server-side processing,Preserves text,Fast conversion", en: "Server-side processing,Preserves text,Fast conversion" },
  "f.ocr.title": { id: "OCR Picture to Text", en: "OCR Picture to Text" },
  "f.ocr.badge": { id: "SCAN!", en: "SCAN!" },
  "f.ocr.desc": { id: "Ekstrak teks dari gambar pake teknologi OCR di browser. Scanning SIM/KTP jadi mudah!", en: "Extract text from images using OCR tech in your browser. Scanning IDs made easy!" },
  "f.ocr.hl": { id: "Tesseract.js engine,Multi-language,Client-side", en: "Tesseract.js engine,Multi-language,Client-side" },
  "f.jurnal.title": { id: "Jurnal Finder / Google Scholar", en: "Jurnal Finder / Google Scholar" },
  "f.jurnal.badge": { id: "SEARCH!", en: "SEARCH!" },
  "f.jurnal.desc": { id: "Cari jurnal akademik dari Google Scholar langsung. Dapatkan link PDF jurnal terpercaya!", en: "Search academic journals from Google Scholar directly. Get trusted PDF links!" },
  "f.jurnal.hl": { id: "Google Scholar API,PDF links,Academic search", en: "Google Scholar API,PDF links,Academic search" },
  "f.pictopdf.title": { id: "Picture to PDF Converter", en: "Picture to PDF Converter" },
  "f.pictopdf.badge": { id: "ZIP!", en: "ZIP!" },
  "f.pictopdf.desc": { id: "Gabungin banyak gambar JPG/PNG jadi satu file PDF ukuran A4. Multi-file support!", en: "Combine multiple JPG/PNG images into one A4 PDF file. Multi-file support!" },
  "f.pictopdf.hl": { id: "Multi-file,A4 format,Client-side", en: "Multi-file,A4 format,Client-side" },
  "f.dorking.title": { id: "Dorking OSINT Search", en: "Dorking OSINT Search" },
  "f.dorking.badge": { id: "DORK!", en: "DORK!" },
  "f.dorking.desc": { id: "Lacak username di 35+ social media. OSINT tool buat riset digital footprint!", en: "Track usernames across 35+ social media platforms. OSINT tool for digital footprint research!" },
  "f.dorking.hl": { id: "35+ platforms,Username search,OSINT tool", en: "35+ platforms,Username search,OSINT tool" },
  "f.json.title": { id: "JSON Formatter & Validator", en: "JSON Formatter & Validator" },
  "f.json.badge": { id: "CODE!", en: "CODE!" },
  "f.json.desc": { id: "Rapihin dan validasi JSON langsung di browser. Debugging API jadi lebih gampang!", en: "Format and validate JSON directly in your browser. API debugging made easier!" },
  "f.json.hl": { id: "Real-time validation,Auto-format,Copy output", en: "Real-time validation,Auto-format,Copy output" },
  "f.markdown.title": { id: "Markdown Previewer", en: "Markdown Previewer" },
  "f.markdown.badge": { id: "ZAP!", en: "ZAP!" },
  "f.markdown.desc": { id: "Tulis catatan pake Markdown, liat hasil live preview. Plus export ke HTML/PDF!", en: "Write notes in Markdown, see live preview. Plus export to HTML/PDF!" },
  "f.markdown.hl": { id: "Live preview,Copy HTML,Print to PDF", en: "Live preview,Copy HTML,Print to PDF" },
  "f.sosmed.title": { id: "Social Media Hub & Contact", en: "Social Media Hub & Contact" },
  "f.sosmed.badge": { id: "CREW!", en: "CREW!" },
  "f.sosmed.desc": { id: "Temukan semua link sosial media: Instagram, Threads, LinkedIn, Kaggle, WhatsApp.", en: "Find all social media links: Instagram, Threads, LinkedIn, Kaggle, WhatsApp." },
  "f.sosmed.hl": { id: "All links,WhatsApp chat,Connect easily", en: "All links,WhatsApp chat,Connect easily" },
  "f.quote.title": { id: "Quote Generator", en: "Quote Generator" },
  "f.quote.badge": { id: "QUOTE!", en: "QUOTE!" },
  "f.quote.desc": { id: "Bikin quote kocak anak gen z buat story/feed IG. Random quote atau tulis sendiri, langsung jadi gambar!", en: "Create funny gen z quotes for IG stories/feed. Random or custom, instantly becomes an image!" },
  "f.quote.hl": { id: "30+ random quotes,Editable text,Download PNG", en: "30+ random quotes,Editable text,Download PNG" },
  "f.linktree.title": { id: "Linktree Generator", en: "Linktree Generator" },
  "f.linktree.badge": { id: "TREE!", en: "TREE!" },
  "f.linktree.desc": { id: "Buat linktree keren buat bio IG. Tambahin semua sosial media lo, generate link atau download PNG!", en: "Create a cool linktree for your IG bio. Add all your social media, generate link or download PNG!" },
  "f.linktree.hl": { id: "15+ platforms,Shareable link,Download PNG", en: "15+ platforms,Shareable link,Download PNG" },
  "f.barber.title": { id: "Barber Kalkulator", en: "Barber Calculator" },
  "f.barber.badge": { id: "HITUNG!", en: "CALC!" },
  "f.barber.desc": { id: "Hitung pendapatan harian barber. Sistem bagi hasil 60:40 + potong uang makan karyawan.", en: "Calculate daily barber income. 60:40 revenue share + employee meal deductions." },
  "f.barber.hl": { id: "Potong Dewasa 25k,Potong Anak 20k,Uang Makan 25k", en: "Adult Cut 25k,Kid Cut 20k,Meal Deduct 25k" },

  // === SHOWCASE PAGE ===
  "showcase.title": { id: "SHOWCASE!!", en: "SHOWCASE!!" },
  "showcase.subtitle": { id: "Lihat gimana cara kerja setiap tools. Tinggal ikutin langkah-langkahnya!", en: "See how each tool works. Just follow the steps!" },
  "showcase.ctaTitle": { id: "YOUR TURN NOW!", en: "YOUR TURN NOW!" },
  "showcase.ctaDesc": { id: "Semua tools siap dipake. Langsung aja cobain!", en: "All tools are ready to use. Go ahead and try them!" },
  "showcase.ctaBtn": { id: "MULAI SEKARANG", en: "START NOW" },
  "showcase.demoSteps": { id: "Demo Steps", en: "Demo Steps" },
  "showcase.cobain": { id: "COBAIN", en: "TRY IT" },

  // === SHOWCASE - CARD DATA ===
  "s.photobox.badge": { id: "BOOTH!", en: "BOOTH!" },
  "s.photobox.desc": { id: "Upload 1-6 foto, atur layout, pilih filter keren, download collage komik siap upload.", en: "Upload 1-6 photos, arrange layout, pick cool filters, download comic collage ready to post." },
  "s.photobox.steps": { id: "Upload 1-6 foto,Pilih layout grid,Pilih efek filter unik,Download PNG", en: "Upload 1-6 photos,Choose grid layout,Pick unique filter effect,Download PNG" },
  "s.tiktok.badge": { id: "BOOM!", en: "BOOM!" },
  "s.tiktok.desc": { id: "Paste link TikTok, klik GRAB, langsung dapet video tanpa watermark.", en: "Paste TikTok link, click GRAB, instantly get video without watermark." },
  "s.tiktok.steps": { id: "Copy TikTok video URL,Paste di input field,Klik GRAB VIDEO!,Download hasilnya", en: "Copy TikTok video URL,Paste in input field,Click GRAB VIDEO!,Download result" },
  "s.removebg.badge": { id: "ZAP!", en: "ZAP!" },
  "s.removebg.desc": { id: "Upload gambar, AI langsung hapus background. Hasil PNG transparan siap download.", en: "Upload image, AI instantly removes background. Transparent PNG ready to download." },
  "s.removebg.steps": { id: "Upload gambar,Klik REMOVE BG,Preview hasil,Download PNG", en: "Upload image,Click REMOVE BG,Preview result,Download PNG" },
  "s.pdftoword.badge": { id: "CONVERT!", en: "CONVERT!" },
  "s.pdftoword.desc": { id: "Upload PDF, convert ke Word dengan server-side processing. File .docx langsung terdownload.", en: "Upload PDF, convert to Word with server-side processing. .docx file downloads instantly." },
  "s.pdftoword.steps": { id: "Pilih file PDF,Upload ke server,Proses ekstraksi teks,Download .docx", en: "Select PDF file,Upload to server,Text extraction process,Download .docx" },
  "s.ocr.badge": { id: "SCAN!", en: "SCAN!" },
  "s.ocr.desc": { id: "Upload gambar berisi teks, Tesseract.js di browser bakal scan dan extract teksnya.", en: "Upload an image with text, Tesseract.js in your browser will scan and extract the text." },
  "s.ocr.steps": { id: "Upload gambar,Klik SCAN!,Tunggu OCR process,Copy hasil teks", en: "Upload image,Click SCAN!,Wait for OCR process,Copy extracted text" },
  "s.jurnal.badge": { id: "SEARCH!", en: "SEARCH!" },
  "s.jurnal.desc": { id: "Cari jurnal akademik dari Google Scholar. Hasil berupa kartu dengan link PDF.", en: "Search academic journals from Google Scholar. Results shown as cards with PDF links." },
  "s.jurnal.steps": { id: "Ketik kata kunci,Klik Cari Jurnal,Lihat hasil kartu,Klik GO TO PDF", en: "Type keywords,Click Search Journal,View result cards,Click GO TO PDF" },
  "s.pictopdf.badge": { id: "ZIP!", en: "ZIP!" },
  "s.pictopdf.desc": { id: "Pilih banyak gambar, atur urutannya, generate PDF A4. Semua di browser!", en: "Select multiple images, arrange order, generate A4 PDF. All in your browser!" },
  "s.pictopdf.steps": { id: "Pilih multi-file gambar,Lihat preview grid,Klik GENERATE PDF!,File siap diunduh", en: "Select multi image files,View grid preview,Click GENERATE PDF!,File ready to download" },
  "s.dorking.badge": { id: "DORK!", en: "DORK!" },
  "s.dorking.desc": { id: "Cari username di 35+ social media. Temukan jejak digital seseorang dengan cepat!", en: "Search username across 35+ social media. Find someone's digital footprint fast!" },
  "s.dorking.steps": { id: "Masukkan username,Klik DORK NOW!,Scan 35+ platforms,Lihat hasil found", en: "Enter username,Click DORK NOW!,Scan 35+ platforms,View found results" },
  "s.json.badge": { id: "CODE!", en: "CODE!" },
  "s.json.desc": { id: "Tempel JSON berantakan, klik RAPIHKAN, langsung terformat rapi dengan indentasi.", en: "Paste messy JSON, click FORMAT, instantly formatted with proper indentation." },
  "s.json.steps": { id: "Paste JSON,Klik RAPIHKAN!,Validasi otomatis,Copy hasil", en: "Paste JSON,Click FORMAT!,Auto validation,Copy result" },
  "s.markdown.badge": { id: "ZAP!", en: "ZAP!" },
  "s.markdown.desc": { id: "Tulis Markdown di kiri, lihat HTML preview real-time di kanan. Bisa print PDF juga!", en: "Write Markdown on the left, see real-time HTML preview on the right. Can also print to PDF!" },
  "s.markdown.steps": { id: "Tulis Markdown,Preview real-time,Copy HTML,Print PDF", en: "Write Markdown,Real-time preview,Copy HTML,Print PDF" },
  "s.quote.badge": { id: "QUOTE!", en: "QUOTE!" },
  "s.quote.desc": { id: "Bikin quote kocak anak gen z siap upload. Random quote langsung jadi gambar 1:1!", en: "Create funny gen z quotes ready to upload. Random quote instantly becomes a 1:1 image!" },
  "s.quote.steps": { id: "Klik ACKAHIN! buat quote random,Edit sendiri kalo mau,Klik DOWNLOAD,Upload ke story/feed", en: "Click ACKAHIN! for random quote,Edit if you want,Click DOWNLOAD,Upload to story/feed" },
  "s.linktree.badge": { id: "TREE!", en: "TREE!" },
  "s.linktree.desc": { id: "Bikin halaman linktree lo sendiri. Tambahin semua link sosial media, generate link buat bio IG!", en: "Create your own linktree page. Add all your social media links, generate link for IG bio!" },
  "s.linktree.steps": { id: "Isi nama kamu,Tambah link sosial media,Klik GENERATE LINK,Copy & paste di bio IG", en: "Fill your name,Add social media links,Click GENERATE LINK,Copy & paste in IG bio" },
  "s.barber.badge": { id: "HITUNG!", en: "CALC!" },
  "s.barber.desc": { id: "Hitung pendapatan harian barber dengan sistem bagi hasil 60:40. Bisa atur potongan uang makan!", en: "Calculate daily barber income with 60:40 revenue share system. Adjustable meal deductions!" },
  "s.barber.steps": { id: "Isi jumlah potong dewasa,Isi jumlah potong anak,Isi jumlah semir,Atur uang makan lihat hasil bersih", en: "Fill adult cut count,Fill kid cut count,Fill dye count,Set meal deduct see net result" },

  // === LOGIN PAGE ===
  "login.title": { id: "LOGIN", en: "LOGIN" },
  "login.subtitle": { id: "Masuk ke Social Tools By Za!!", en: "Login to Social Tools By Za!!" },
  "login.email": { id: "Email", en: "Email" },
  "login.password": { id: "Password", en: "Password" },
  "login.btn": { id: "MASUK", en: "LOGIN" },
  "login.loading": { id: "LOADING...", en: "LOADING..." },
  "login.noAccount": { id: "Belum punya akun? Hubungi admin buat daftar.", en: "Don't have an account? Contact admin to register." },
  "login.failed": { id: "Login gagal", en: "Login failed" },

  // === ADMIN PAGE ===
  "admin.title": { id: "Admin Panel", en: "Admin Panel" },
  "admin.subtitle": { id: "Kelola user Social Tools By Za!!", en: "Manage Social Tools By Za!! users" },
  "admin.loading": { id: "Loading users...", en: "Loading users..." },
  "admin.error": { id: "Gagal fetch users", en: "Failed to fetch users" },
  "admin.addBtn": { id: "Tambah User", en: "Add User" },
  "admin.formTitle": { id: "Buat Akun Baru", en: "Create New Account" },
  "admin.formName": { id: "Nama", en: "Name" },
  "admin.formEmail": { id: "Email", en: "Email" },
  "admin.formPass": { id: "Password", en: "Password" },
  "admin.formSubmit": { id: "BUAT AKUN", en: "CREATE ACCOUNT" },
  "admin.formCreating": { id: "MEMBUAT...", en: "CREATING..." },
  "admin.cancel": { id: "Batal", en: "Cancel" },
  "admin.noUsers": { id: "Belum ada user", en: "No users yet" },
  "admin.role": { id: "Role:", en: "Role:" },
  "admin.deleteBtn": { id: "Hapus", en: "Delete" },
  "admin.deleteConfirm": { id: "Yakin hapus user ini?", en: "Are you sure you want to delete this user?" },
  "admin.logout": { id: "Logout", en: "Logout" },

  // === PREMIUM GATE ===
  "premium.exclusive": { id: "EXCLUSIVE", en: "EXCLUSIVE" },
  "premium.desc": { id: "Chat buat dapetin akun!", en: "Chat to get an account!" },
  "premium.haveAccount": { id: "Udah punya akun?", en: "Already have an account?" },
  "premium.login": { id: "Login", en: "Login" },

  // === CHAT WELCOME ===
  "chatwelcome.title": { id: "HALO! ADA YANG BISA DIBANTU? 👋", en: "HELLO! CAN I HELP YOU? 👋" },
  "chatwelcome.desc": { id: "Gue ZaBot, asisten virtual siap bantu lo pake tools di sini. Tanya aja kalo bingung!", en: "I'm ZaBot, your virtual assistant ready to help you use the tools here. Just ask if you're confused!" },
  "chatwelcome.btn": { id: "AKU BUTUH BANTUAN 💬", en: "I NEED HELP 💬" },
  "chatwelcome.dismiss": { id: "Gausah, makasih", en: "No thanks" },

  // === PHOTOBOX ===
  "photobox.title": { id: "Photobox Studio", en: "Photobox Studio" },
  "photobox.subtitle": { id: "Bikin collage foto dengan berbagai tema", en: "Create photo collages with various themes" },
  "photobox.uploadTitle": { id: "Upload Foto", en: "Upload Photos" },
  "photobox.uploadDesc": { id: "Klik atau drag & drop foto di sini", en: "Click or drag & drop photos here" },
  "photobox.uploadLimit": { id: "Maksimal 6 foto • JPG, PNG, WebP", en: "Max 6 photos • JPG, PNG, WebP" },
  "photobox.foto": { id: "Foto", en: "Photos" },
  "photobox.hapusSemua": { id: "Hapus semua", en: "Delete all" },
  "photobox.layout": { id: "Layout", en: "Layout" },
  "photobox.bingkai": { id: "Bingkai", en: "Frame" },
  "photobox.custom": { id: "Custom", en: "Custom" },
  "photobox.editCustom": { id: "Edit Bingkai Custom", en: "Edit Custom Frame" },
  "photobox.filter": { id: "Filter", en: "Filter" },
  "photobox.download": { id: "DOWNLOAD PNG", en: "DOWNLOAD PNG" },
  "photobox.filmstripWarn": { id: "Film Strip butuh minimal 2 foto", en: "Film Strip needs at least 2 photos" },

  // === TOOL COMMON ===
  "tool.trending": { id: "Trending", en: "Trending" },
  "tool.classic": { id: "Classic", en: "Classic" },

  // === TIKTOK DOWNLOADER ===
  "tiktok.title": { id: "TikTok Downloader", en: "TikTok Downloader" },
  "tiktok.desc": { id: "Sedot video TikTok tanpa watermark!", en: "Download TikTok videos without watermark!" },
  "tiktok.placeholder": { id: "Tempel link TikTok di sini...", en: "Paste TikTok link here..." },
  "tiktok.grab": { id: "GRAB VIDEO!", en: "GRAB VIDEO!" },
  "tiktok.download": { id: "Download Video", en: "Download Video" },

  // === PDF TO WORD ===
  "pdftoword.title": { id: "PDF to Word Converter", en: "PDF to Word Converter" },
  "pdftoword.desc": { id: "Upload PDF, convert ke Word. Server-side processing, file langsung terdownload!", en: "Upload PDF, convert to Word. Server-side processing, file downloads instantly!" },
  "pdftoword.uploadLabel": { id: "Pilih file PDF atau drag & drop di sini", en: "Select PDF file or drag & drop here" },
  "pdftoword.converting": { id: "Mengonversi...", en: "Converting..." },
  "pdftoword.convert": { id: "CONVERT KE WORD", en: "CONVERT TO WORD" },

  // === REMOVE BACKGROUND ===
  "removebg.title": { id: "Remove Background", en: "Remove Background" },
  "removebg.desc": { id: "Hapus latar belakang gambar otomatis pake AI. 100% di browser!", en: "Remove image background automatically with AI. 100% in-browser!" },
  "removebg.uploadLabel": { id: "Upload atau drag & drop gambar", en: "Upload or drag & drop image" },
  "removebg.remove": { id: "REMOVE BG", en: "REMOVE BG" },
  "removebg.download": { id: "Download PNG", en: "Download PNG" },

  // === JURNAL FINDER ===
  "jurnal.title": { id: "Jurnal Finder", en: "Jurnal Finder" },
  "jurnal.desc": { id: "Cari jurnal akademik dari Google Scholar. Dapatkan link PDF jurnal terpercaya!", en: "Search academic journals from Google Scholar. Get trusted PDF links!" },
  "jurnal.placeholder": { id: "Cari jurnal, skripsi,论文...", en: "Search journals, papers, articles..." },
  "jurnal.search": { id: "Cari Jurnal", en: "Search Journal" },
  "jurnal.noResults": { id: "Tidak ada jurnal ditemukan", en: "No journals found" },
  "jurnal.goToPdf": { id: "GO TO PDF", en: "GO TO PDF" },

  // === DORKING ===
  "dorking.title": { id: "Dorking OSINT", en: "Dorking OSINT" },
  "dorking.desc": { id: "Lacak username di 35+ social media. Cari jejak digital seseorang!", en: "Track username across 35+ social media. Find someone's digital footprint!" },
  "dorking.username": { id: "Username", en: "Username" },
  "dorking.dork": { id: "Dorking", en: "Dorking" },
  "dorking.placeholder": { id: "Masukkan username atau nama", en: "Enter username or name" },
  "dorking.btn": { id: "DORK NOW!", en: "DORK NOW!" },
  "dorking.typeUsername": { id: "Username", en: "Username" },
  "dorking.typeDork": { id: "Dorking", en: "Dorking" },

  // === MARKDOWN ===
  "markdown.title": { id: "Markdown Previewer", en: "Markdown Previewer" },
  "markdown.desc": { id: "Tulis Markdown, lihat preview HTML secara real-time!", en: "Write Markdown, see real-time HTML preview!" },

  // === LINKTREE ===
  "linktree.title": { id: "Linktree Generator", en: "Linktree Generator" },
  "linktree.desc": { id: "Buat halaman linktree pribadi dengan 15+ platform sosial media!", en: "Create your own linktree page with 15+ social media platforms!" },

  // === QUOTE GENERATOR ===
  "quote.title": { id: "Quote Generator", en: "Quote Generator" },
  "quote.desc": { id: "Bikin quote kocak anak gen z siap upload!", en: "Create funny gen z quotes ready to upload!" },
  "quote.ackahin": { id: "ACKAHIN!", en: "GENERATE!" },

  // === BARBER ===
  "barber.title": { id: "Barber Kalkulator", en: "Barber Calculator" },
  "barber.desc": { id: "Hitung pendapatan harian barber dengan sistem bagi hasil 60:40!", en: "Calculate daily barber income with 60:40 revenue share system!" },

  // === JSON FORMATTER ===
  "json.title": { id: "JSON Formatter", en: "JSON Formatter" },
  "json.desc": { id: "Rapihin dan validasi JSON langsung di browser!", en: "Format and validate JSON directly in your browser!" },

  // === PICTURE TO PDF ===
  "pictopdf.title": { id: "Picture to PDF", en: "Picture to PDF" },
  "pictopdf.desc": { id: "Gabungin gambar jadi satu file PDF. Multi-file support!", en: "Combine images into one PDF file. Multi-file support!" },

  // === OCR ===
  "ocr.title": { id: "OCR Picture to Text", en: "OCR Picture to Text" },
  "ocr.desc": { id: "Ekstrak teks dari gambar pake teknologi OCR!", en: "Extract text from images using OCR technology!" },

  // === CATEGORIES ===
  "category.all": { id: "All", en: "All" },
  "category.social": { id: "Sosial Media", en: "Social Media" },
  "category.image": { id: "Gambar & Foto", en: "Image Tools" },
  "category.document": { id: "Dokumen", en: "Documents" },
  "category.dev": { id: "Developer", en: "Developer" },
  "category.osint": { id: "OSINT", en: "OSINT" },
  "category.academic": { id: "Akademik", en: "Academic" },
  "category.fun": { id: "Fun & Utility", en: "Fun & Utility" },

  // === CHATBOT ===
  "chat.placeholder": { id: "Tanya sesuatu...", en: "Ask something..." },
  "chat.about": { id: "Tentang SocialTools", en: "About SocialTools" },
  "chat.features": { id: "Fitur Tools", en: "Tool Features" },
  "chat.help": { id: "Cara Pemakaian", en: "How to Use" },
  "chat.suggest": { id: "Saran / Kontak", en: "Suggest / Contact" },
  "chat.ask": { id: "Tanya ZaBot", en: "Ask ZaBot" },
};

export function t(key: string, lang: Lang): string {
  return tr[key]?.[lang] ?? key;
}

export function tList(key: string, lang: Lang): string[] {
  const val = tr[key]?.[lang];
  return val ? val.split(",") : [];
}

export default tr;
