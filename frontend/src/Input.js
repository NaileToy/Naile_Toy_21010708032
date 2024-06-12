export default function Input({ title, value, onChange }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{title}</label>
            <input
                type="text"
                className="mt-1.5 w-96 rounded-md border border-gray-500 p-2 focus:outline-0"
                value={value}
                onChange={onChange}
            />
        </div>
    );
}
