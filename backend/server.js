import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
import path from 'path';

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MySQL bağlantısı
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'naile'
});

connection.connect(err => {
    if (err) {
        console.error('Database connection başarısız: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

// Sunucuya Görsel Yükleme
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.use('/uploads', express.static('uploads'));

// Ürünleri göstermek
app.get('/urunler', (req, res) => {
    const sql = "CALL GosterUrunler()";
    connection.query(sql, (err, data) => {
        if (err) throw err;
        return res.json(data[0]);
    });
});

// Ürün Göstermek
app.get('/urunler/:id', (req, res) => {
    const productId = req.params.id;
    const sql = "CALL GosterUrun(?)";
    connection.query(sql, [productId], (err, data) => {
        if (err) {
            return res.json(err);
        }
        return res.json(data[0]);
    });
});

// Ürün Eklemek
app.post('/urun-ekle', upload.single('image'), (req, res) => {
    const { urun_adi, aciklama, fiyat, stok } = req.body;
    const imageUrl = req.file ? `http://localhost:8080/uploads/${req.file.filename}` : null;
    connection.query('CALL EkleUrun(?, ?, ?, ?, ?)', [urun_adi, aciklama, fiyat, stok, imageUrl], (error, results) => {
        if (error) throw error;
        res.json({ message: 'Ürün Başarıyla Eklendi', id: results.insertId });
    });
});

// Ürün Güncellemek
app.put('/urunler/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { urun_adi, aciklama, fiyat, stok, image_url } = req.body;
    const imageUrl = req.file ? `http://localhost:8080/uploads/${req.file.filename}` : image_url;

    connection.query('CALL DuzenleUrun(?, ?, ?, ?, ?, ?)', [id, urun_adi, aciklama, fiyat, stok, imageUrl], (error, results) => {
        if (error) throw error;
        res.json({ message: 'Ürün Başarıyla Güncellendi' });
    });
});

// Ürün Silmek
app.delete('/urunler/:id', (req, res) => {
    const { id } = req.params;
    connection.query('CALL SilUrun(?)', [id], (error, results) => {
        if (error) throw error;
        res.json({ message: 'Ürün başarıyla silindi' });
    });
});

// Yorum Eklemek
app.post('/yorum-ekle', (req, res) => {
    const { urun_id, user_id, yorum } = req.body;
    connection.query('CALL EkleYorum(?, ?, ?)', [urun_id, user_id, yorum], (error, results) => {
        if (error) throw error;
        res.json({ message: 'Yorum Başarıyla Eklendi', id: results.insertId });
    });
});

// Yorum Silmek
app.delete('/yorumlar/:id', (req, res) => {
    const yorumId = req.params.id;
    connection.query('CALL SilYorum(?)', [yorumId], (error, results) => {
        if (error) throw error;
        res.json({ message: 'Yorum başarıyla silindi' });
    });
});

// Yorumları Göstermek
app.get('/urunler/:id/yorumlar', (req, res) => {
    const urunId = req.params.id;
    connection.query('CALL GosterYorumlarWithUser(?)', [urunId], (error, results) => {
        if (error) throw error;
        res.json(results[0]);
    });
});

// Kullanıcı Oluşturmak
app.post('/register', (req, res) => {
    const { ad, email, parola, cinsiyet } = req.body;
    connection.query('CALL RegisterUser(?, ?, ?, ?)', [ad, email, parola, cinsiyet], (error, results) => {
        if (error) {
            if (error.sqlState === '45000') {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Kullanıcı kaydedilemedi', error });
        }
        res.json({ message: 'Kullanıcı başarıyla kaydedildi', id: results.insertId });
    });
});

// Kullanıcı Giriş Yapmak
app.post('/login', (req, res) => {
    const { email, parola } = req.body;
    connection.query('CALL LoginUser(?, ?)', [email, parola], (error, results) => {
        if (error) {
            if (error.sqlState === '45000') {
                return res.status(401).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Giriş yapılamadı', error });
        }
        if (results.length > 0) {
            res.json({ message: 'Giriş başarılı', user: results[0] });
        } else {
            res.status(401).json({ message: 'Email veya parola yanlış' });
        }
    });
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
