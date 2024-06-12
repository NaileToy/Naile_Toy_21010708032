import Layout from "../Layout";
import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";


export default function UrunDuzenle() {
    const { urunId } = useParams();
    const [fileName, setFileName] = useState("");


    const [product, setProduct] = useState({
        id : "",
        urun_adi : "",
        fiyat : "",
        aciklama : "",
        stok : "",
        image_url : "",
    });

    const load = useCallback(() => {
        axios.get(`http://127.0.0.1:8080/urunler/${urunId}`).then((response) => {
            setProduct({
                id : response.data[0].id,
                urun_adi : response.data[0].urun_adi,
                fiyat : response.data[0].fiyat,
                aciklama : response.data[0].aciklama,
                stok : response.data[0].stok,
                image_url : response.data[0].image_url,
            });
        });
    }, [urunId]);

    useEffect(() => {
        if (urunId) {
            load();
        }
    }, [urunId, load]);

    const handleFileChange = (event) => {
        if (event.target.files.length > 0) {
            setFileName(event.target.files[0].name);
            setProduct({...product, image_url: event.target.files[0]})
        } else {
            setFileName("");
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("urun_adi", product.urun_adi);
        formData.append("fiyat", product.fiyat);
        formData.append("aciklama", product.aciklama);
        formData.append("stok", product.stok);
        if (product.image_url instanceof File) {
            formData.append("image", product.image_url);
        } else {
            formData.append("image_url", product.image_url);
        }

        axios.put(`http://127.0.0.1:8080/urunler/${urunId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
            .then(response => {
                if (response.data.message) {
                    alert(response.data.message);
                } else {
                    alert("Ürün Güncellenemedi");
                }
            });
    };

    return (
        <Layout>
            <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
                <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                    <div>
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Ürün Güncelle</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Ürün Güncellemek İçin Aşağıdaki Formu Doldurunuz.
                            </p>
                        </div>

                        <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">

                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                    Ürün Adı
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <div className="max-w-lg flex rounded-md shadow-sm">
                                        <input
                                            type="text"
                                            value={product.urun_adi}
                                            onChange={(e) => setProduct({...product, urun_adi: e.target.value})}
                                            className="mt-1.5 w-full rounded-md border border-gray-300 p-2 focus:outline-0"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                    Ürün Fiyatı
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <div className="max-w-lg flex rounded-md shadow-sm">
                                        <input
                                            type="text"
                                            value={product.fiyat}
                                            onChange={(e) => setProduct({...product, fiyat: e.target.value})}
                                            className="mt-1.5 w-full rounded-md border border-gray-300 p-2 focus:outline-0"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                    Ürün Stok Sayısı
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <div className="max-w-lg flex rounded-md shadow-sm">
                                        <input
                                            type="text"
                                            value={product.stok}
                                            onChange={(e) => setProduct({...product, stok: e.target.value})}
                                            className="mt-1.5 w-full rounded-md border border-gray-300 p-2 focus:outline-0"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label htmlFor="about" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                    Ürün Açıklaması
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <textarea
                                        value={product.aciklama}
                                        onChange={(e) => setProduct({...product, aciklama: e.target.value})}
                                        className="mt-1.5 w-[64%] rounded-md border border-gray-300 p-2 focus:outline-0"
                                        rows={3}
                                    />
                                    <p className="mt-2 text-sm text-gray-500">Satışa sunulacak olan ürüne bir açıklama giriniz.</p>
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label htmlFor="cover-photo" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                    Ürün Fotoğrafı
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            <svg
                                                className="mx-auto h-12 w-12 text-gray-400"
                                                stroke="currentColor"
                                                fill="none"
                                                viewBox="0 0 48 48"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <div className="flex text-sm text-gray-600">
                                                <label
                                                    htmlFor="file-upload"
                                                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                                >
                                                    <span>Upload a file</span>
                                                    <input
                                                        id="file-upload"
                                                        name="file-upload"
                                                        type="file"
                                                        className="sr-only"
                                                        onChange={handleFileChange}
                                                    />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {fileName ? fileName : "PNG, JPG, GIF up to 10MB"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full flex justify-end sm:border-t sm:border-gray-200 sm:pt-5">
                                <button
                                    type={"submit"}
                                    className="w-36 bg-indigo-600 flex items-center justify-center py-1.5 text-white font-medium text-md rounded-md hover:bg-indigo-700"
                                >
                                    Güncelle
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </Layout>
    );
}
