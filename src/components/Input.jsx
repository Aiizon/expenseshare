export default function Input({ type, placeholder, value, onChange }) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-3/4 border border-gray-300 rounded-md p-2"
        />
    );
}