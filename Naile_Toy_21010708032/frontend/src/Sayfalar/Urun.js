import Layout from "../Layout";
import { FaStar } from "react-icons/fa";
import {useParams} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import Comment from "../Comment";

export default function Urun() {
    const {urunId} = useParams();
    const [product, setProduct] = useState([]);
    const [comments, setComments] = useState([]);
    const [flag1, setFlag1] = useState(false);
    const [flag2, setFlag2] = useState(false);
    const [newComment, setNewComment] = useState("");

    const load = useCallback(() => {
        axios.get(`http://127.0.0.1:8080/urunler/${urunId}`).then((response) => {
            setProduct(response.data[0]);
            setFlag1(true);
        });
        axios.get(`http://127.0.0.1:8080/urunler/${urunId}/yorumlar`).then((response) => {
            setComments(response.data);
            setFlag2(true);
        });
    }, [urunId]);

    useEffect(() => {
        if (urunId) {
            load();
        }
    }, [urunId, load]);

    const deleteFunction = async () => {
        const response = await axios.delete(`http://127.0.0.1:8080/urunler/${urunId}`);
        if (response.status === 200) {
            alert("Ürün başarıyla silindi.");
            window.location.href = "/";
        } else {
            alert("Ürün silinirken bir hata oluştu.");
        }
    }

    const handleCommentSubmit = async () => {
        if (newComment.trim() === "") {
            alert("Yorum boş olamaz!");
            return;
        }
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await axios.post('http://127.0.0.1:8080/yorum-ekle', {
            urun_id: urunId,
            user_id: user[0].id,
            yorum: newComment
        });
        if (response.status === 200) {
            setNewComment("");
            load();
        } else {
            alert("Yorum eklenirken bir hata oluştu.");
        }
    }


    if (!flag1 && !flag2) {
        return (
            <Layout>
                <div>Yükleniyor...</div>
            </Layout>
        );
    }

    console.log(product);

    return (
        <Layout>
            <div className="flex flex-row space-x-10">
                <img src={product.image_url} className="rounded-sm object-contain h-[37rem] w-[50%]"/>
                <div className="w-[40%] space-y-6">
                    <div className="flex flex-col space-y-2">
                        <div className="flex justify-between items-center">
                            <div className="text-md text-gray-900 font-medium">{product.urun_adi}</div>
                            <div className="text-md text-gray-900 font-medium">{product.fiyat} TL</div>
                        </div>
                        <div className="flex flex-row space-x-0.5">
                            <FaStar className="text-yellow-400" />
                            <FaStar className="text-yellow-400" />
                            <FaStar className="text-yellow-400" />
                            <FaStar className="text-yellow-400" />
                            <FaStar className="text-gray-300" />
                        </div>
                    </div>

                    <div className="flex flex-row items-start space-x-2">
                        <div className="text-md text-gray-900 font-medium">Son {product.stok} adet ürün kaldı </div>
                    </div>

                    <div className="flex flex-col items-start justify-center">
                        <div className="text-md text-gray-900 font-medium">Ürün {product.sube_adi} şubesinde bulunuyor </div>
                        <div className="text-sm text-gray-800 font-medium">({product.sube_adresi})</div>
                    </div>

                    <div className="flex flex-col items-start justify-center">
                        <div className="text-md text-gray-900 font-medium">Renk Seçenekleri</div>
                        <div className="mt-1.5 flex flex-row space-x-2">
                            <div className="h-6 w-6 rounded-full bg-gray-400 hover:ring-1 hover:ring-gray-500"></div>
                            <div className="h-6 w-6 rounded-full bg-red-500  hover:ring-1 hover:ring-red-600"></div>
                            <div className="h-6 w-6 rounded-full bg-black  hover:ring-1 hover:ring-black"></div>
                        </div>
                    </div>

                    <div className="flex flex-col items-start justify-center">
                        <div className="text-md text-gray-900 font-medium">Beden</div>
                        <div className="mt-1.5 w-full flex items-center justify-between flex-row space-x-2">
                            <div className="w-14 h-9 flex items-center justify-center border border-gray-300 rounded-md font-medium text-sm hover:bg-indigo-600 hover:text-white cursor-pointer ease-in-out delay-75">XXS</div>
                            <div className="w-14 h-9 flex items-center justify-center border border-gray-300 rounded-md font-medium text-sm hover:bg-indigo-600 hover:text-white cursor-pointer ease-in-out delay-75">XS</div>
                            <div className="w-14 h-9 flex items-center justify-center border border-gray-300 rounded-md font-medium text-sm hover:bg-indigo-600 hover:text-white cursor-pointer ease-in-out delay-75">S</div>
                            <div className="w-14 h-9 flex items-center justify-center border border-gray-300 rounded-md font-medium text-sm hover:bg-indigo-600 hover:text-white cursor-pointer ease-in-out delay-75">M</div>
                            <div className="w-14 h-9 flex items-center justify-center border border-gray-300 rounded-md font-medium text-sm hover:bg-indigo-600 hover:text-white cursor-pointer ease-in-out delay-75">L</div>
                            <div className="w-14 h-9 flex items-center justify-center border border-gray-300 rounded-md font-medium text-sm hover:bg-indigo-600 hover:text-white cursor-pointer ease-in-out delay-75">XL</div>
                        </div>
                    </div>

                    <div className="flex flex-col items-start justify-center">
                        <button className="w-full bg-indigo-600 flex items-center justify-center py-2.5 text-white font-medium text-md rounded-md hover:bg-indigo-700">
                            Satın Al
                        </button>
                    </div>

                    <div className="flex flex-col items-start justify-center">
                        <div className="text-sm text-gray-900 font-semibold">Açıklama</div>
                        <div className="mt-1.5 text-xs text-gray-800 font-semibold">
                            {product.aciklama}
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <button
                            className="w-36 bg-indigo-600 flex items-center justify-center py-1.5 text-white font-medium text-md rounded-md hover:bg-indigo-700"
                            onClick={() => window.location.href = `/urunler/${product.id}/edit`}
                        >
                            Düzenle
                        </button>
                        <button
                            className="w-20 bg-red-500 flex items-center justify-center py-1.5 text-white font-medium text-md rounded-md hover:bg-red-600"
                            onClick={() => {deleteFunction()}}
                        >
                            Sil
                        </button>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <div className="text-sm text-gray-900 font-semibold">Yorumlar</div>
                        <div className="mt-1 relative">
                            <textarea
                                className="mt-1.5 text-sm w-full rounded-md border border-gray-300 p-2 focus:outline-0 placeholder:text-xs"
                                rows={3}
                                placeholder={"Bir yorum giriniz..."}
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                maxLength={64}
                            />
                            <button
                                className="w-20 top-12 right-3 absolute bg-indigo-600 flex items-center justify-center py-1.5 text-white font-medium text-xs rounded-md hover:bg-indigo-700"
                                onClick={handleCommentSubmit}
                            >
                                Paylaş
                            </button>
                        </div>
                        <div className="flex flex-col space-y-8 ml-1">
                            {comments.map(comment => (
                                <Comment key={comment.id} text={comment.yorum} user={comment.user_ad} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
