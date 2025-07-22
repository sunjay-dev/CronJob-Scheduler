export default function StatCard({ title, value }: { title: string; value: number }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow text-center">
            <h2 className="text-2xl font-semibold text-purple-600">{value}</h2>
            <p className="text-gray-500 text-sm">{title}</p>
        </div>
    );
}