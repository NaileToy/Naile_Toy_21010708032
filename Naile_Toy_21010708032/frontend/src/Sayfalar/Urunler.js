import {useEffect, useState} from "react";
import Layout from "../Layout";
import axios from "axios";

export default function Urunler() {
    const [products, setProducts] = useState([]);
    const [flag, setFlag] = useState(false);

    const load = () => {
        axios.get('http://localhost:8080/urunler').then((response) => {
            setProducts(response.data);
            setFlag(true);
        });
    }

    useEffect(() => {
        load();
    }, []);


    if (!flag) {
        return (
            <Layout>
                <div>Yükleniyor...</div>
            </Layout>
        );
    }
    return (
        <Layout>
            <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                {products.map((product,index) => (
                    <a key={index} href={`/urunler/${product.id}`}>
                        <div className="flex items-center justify-center px-2 py-6 rounded-sm flex-col space-y-2">
                            <div>
                                <img src={product.image_url} className="h-[420px] rounded-sm"/>
                                <div className="w-full flex justify-between items-center mt-2">
                                    <div className="text-md text-gray-800 font-medium">{product.urun_adi}</div>
                                    <div className="text-md text-gray-800 font-medium">{product.fiyat} TL</div>
                                </div>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </Layout>
    );
}
