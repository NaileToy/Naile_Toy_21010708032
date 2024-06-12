import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Urunler from "./Sayfalar/Urunler";
import Urun from "./Sayfalar/Urun";
import UrunEkle from "./Sayfalar/UrunEkle";
import UrunDuzenle from "./Sayfalar/UrunDuzenle";
import Login from "./Sayfalar/Login";
import Register from "./Sayfalar/Register";
import ProtectedRoute from "./ProtectedRoute"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<ProtectedRoute><Urunler /></ProtectedRoute>} />
                <Route path="/urun-ekle" element={<ProtectedRoute><UrunEkle /></ProtectedRoute>} />
                <Route path="/urunler/:urunId" element={<ProtectedRoute><Urun /></ProtectedRoute>} />
                <Route path="/urunler/:urunId/edit" element={<ProtectedRoute><UrunDuzenle /></ProtectedRoute>} />
            </Routes>
        </BrowserRouter>
    );
}
export default App;
