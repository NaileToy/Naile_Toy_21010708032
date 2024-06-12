CREATE DATABASE melekmoda;
USE melekmoda;

CREATE TABLE kullanicilar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ad VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    parola VARCHAR(255) NOT NULL,
    cinsiyet VARCHAR(10) NOT NULL,
    profile_foto_url VARCHAR(255),
    kayit_tarih TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subeler (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sube_adi VARCHAR(100) NOT NULL,
    sube_adresi TEXT,
    olusturulma_tarih TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE urunler (
    id INT AUTO_INCREMENT PRIMARY KEY,
    urun_adi VARCHAR(100) NOT NULL,
    aciklama TEXT,
    fiyat VARCHAR(200) NOT NULL,
    stok INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    sube_id INT,
    olusturulma_tarih TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sube_id) REFERENCES subeler(id)
);

CREATE TABLE yorumlar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    urun_id INT,
    user_id INT,
    yorum TEXT,
    yorum_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (urun_id) REFERENCES urunler(id),
	FOREIGN KEY (user_id) REFERENCES kullanicilar(id)
);

INSERT INTO subeler (sube_adi, sube_adresi)
VALUES ('Test Şube Adı', 'Test Şube Adresi');

DELIMITER //
CREATE FUNCTION GetProfilePhotoUrl(cinsiyet VARCHAR(10)) 
RETURNS VARCHAR(255) 
DETERMINISTIC
BEGIN
    DECLARE profileFotoUrl VARCHAR(255);
    IF cinsiyet = 'Erkek' THEN
        SET profileFotoUrl = 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60';
    ELSEIF cinsiyet = 'Kadın' THEN
        SET profileFotoUrl = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60';
    ELSE
        SET profileFotoUrl = 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60';
    END IF;
    RETURN profileFotoUrl;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE GosterUrunler()
BEGIN
    SELECT * FROM urunler;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE GosterUrun(
    IN urunId INT
)
BEGIN
    SELECT u.id, u.urun_adi, u.aciklama, u.fiyat, u.stok, u.image_url, s.sube_adi, s.sube_adresi
    FROM urunler u
    INNER JOIN subeler s ON u.sube_id = s.id
    WHERE u.id = urunId;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE EkleUrun(
    IN p_urun_adi VARCHAR(100),
    IN p_aciklama TEXT,
    IN p_fiyat VARCHAR(200),
    IN p_stok INT,
    IN p_image_url VARCHAR(255)
)
BEGIN
    DECLARE sube_id INT;
    SET sube_id = 1;
    INSERT INTO urunler (urun_adi, aciklama, fiyat, stok, image_url, sube_id)
    VALUES (p_urun_adi, p_aciklama, p_fiyat, p_stok, p_image_url, sube_id);
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE SilUrun(
    IN p_urun_id INT
)
BEGIN
    DELETE FROM yorumlar WHERE urun_id = p_urun_id;
    DELETE FROM urunler WHERE id = p_urun_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE DuzenleUrun(
    IN p_urun_id INT,
    IN p_urun_adi VARCHAR(100),
    IN p_aciklama TEXT,
    IN p_fiyat VARCHAR(200),
    IN p_stok INT,
    IN p_image_url VARCHAR(255)
)
BEGIN
    DECLARE sube_id INT;
    SET sube_id = 1;
    UPDATE urunler
    SET urun_adi = p_urun_adi,
        aciklama = p_aciklama,
        fiyat = p_fiyat,
        stok = p_stok,
        image_url = p_image_url,
        sube_id = sube_id
    WHERE id = p_urun_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE GosterYorumlar(
    IN p_urun_id INT
)
BEGIN
    SELECT * FROM yorumlar WHERE urun_id = p_urun_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE GosterYorumlarWithUser(
    IN p_urun_id INT
)
BEGIN
    SELECT y.id, y.urun_id, y.yorum, y.yorum_tarihi, u.ad as user_ad
    FROM yorumlar y
    INNER JOIN kullanicilar u ON y.user_id = u.id
    WHERE y.urun_id = p_urun_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE EkleYorum(
    IN p_urun_id INT,
    IN p_user_id INT,
    IN p_yorum TEXT
)
BEGIN
    INSERT INTO yorumlar (urun_id, user_id, yorum)
    VALUES (p_urun_id, p_user_id, p_yorum);
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE SilYorum(
    IN p_yorum_id INT
)
BEGIN
    DELETE FROM yorumlar WHERE id = p_yorum_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE RegisterUser(
    IN p_ad VARCHAR(50),
    IN p_email VARCHAR(50),
    IN p_parola VARCHAR(255),
    IN p_cinsiyet VARCHAR(10)
)
BEGIN
    DECLARE userCount INT;
    DECLARE profileFotoUrl VARCHAR(255);
    
    SELECT COUNT(*) INTO userCount FROM kullanicilar WHERE email = p_email;
    IF userCount > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Email zaten var';
    ELSE
        SET profileFotoUrl = GetProfilePhotoUrl(p_cinsiyet);
        INSERT INTO kullanicilar (ad, email, parola, cinsiyet, profile_foto_url) 
        VALUES (p_ad, p_email, p_parola, p_cinsiyet, profileFotoUrl);
    END IF;
END //
DELIMITER ;



DELIMITER //
CREATE PROCEDURE LoginUser(
    IN p_email VARCHAR(50),
    IN p_parola VARCHAR(255)
)
BEGIN
    DECLARE userCount INT;
    SELECT COUNT(*) INTO userCount FROM kullanicilar WHERE email = p_email AND parola = p_parola;
    IF userCount = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Geçersiz email yada parola';
    END IF;
    SELECT * FROM kullanicilar WHERE email = p_email AND parola = p_parola;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER ParolaKontrolu
BEFORE INSERT ON kullanicilar
FOR EACH ROW
BEGIN
    IF CHAR_LENGTH(NEW.parola) < 6 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Parola en az 6 karakter uzunluğunda olmalıdır';
    END IF;
END //
DELIMITER ;


DELIMITER //
CREATE TRIGGER StokKontroluBeforeInsert
BEFORE INSERT ON urunler
FOR EACH ROW
BEGIN
    IF NEW.stok < 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Stok miktarı 0 ın altına düşemez';
    END IF;
END //
DELIMITER ;



