import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

export default function Register() {
    const [ad, setAd] = useState('');
    const [email, setEmail] = useState('');
    const [parola, setParola] = useState('');
    const [cinsiyet, setCinsiyet] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8080/register', { ad, email, parola, cinsiyet });
            if (res.data) {
                navigate('/login');
            }
        } catch (error) {
            console.error('Kayıt Başarısız:', error);
        }
    };

    return (
        <>
            <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <img
                        className="mx-auto h-12 w-auto"
                        src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                        alt="Workflow"
                    />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Kayıt ol</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Zaten bir hesabın var mı? Giriş yap
                        </a>
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form className="space-y-6" onSubmit={handleRegister}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Ad Soyad
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        value={ad}
                                        onChange={(e) => setAd(e.target.value)}
                                        required
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    E-Posta
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Parola
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="password"
                                        value={parola}
                                        onChange={(e) => setParola(e.target.value)}
                                        required
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Cinsiyet</label>
                                <div className="flex flex-row space-x-6">
                                    <div className="flex items-center mt-2">
                                        <input
                                            id="erkek"
                                            name="cinsiyet"
                                            type="radio"
                                            value="Erkek"
                                            onChange={(e) => setCinsiyet(e.target.value)}
                                            required
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="erkek" className="ml-2 block text-sm font-medium text-gray-700">
                                            Erkek
                                        </label>
                                    </div>
                                    <div className="flex items-center mt-2">
                                        <input
                                            id="kadin"
                                            name="cinsiyet"
                                            type="radio"
                                            value="Kadın"
                                            onChange={(e) => setCinsiyet(e.target.value)}
                                            required
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="kadin" className="ml-2 block text-sm font-medium text-gray-700">
                                            Kadın
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Kayıt ol
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
