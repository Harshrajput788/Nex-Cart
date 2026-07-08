
function SellerProductLoading() {
    return (
        <tr className="animate-pulse">
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded" />
                    <div className="space-y-2">
                        <div className="h-4 w-32 bg-gray-200 rounded" />
                        <div className="h-3 w-20 bg-gray-100 rounded" />
                    </div>
                </div>
            </td>

            <td className="px-6 py-4">
                <div className="h-4 w-16 bg-gray-200 rounded" />
            </td>

            <td className="px-6 py-4">
                <div className="h-6 w-14 bg-gray-200 rounded-full" />
            </td>

            <td className="px-6 py-4">
                <div className="h-4 w-20 bg-gray-200 rounded" />
            </td>

            <td className="px-6 py-4">
                <div className="h-6 w-20 bg-gray-200 rounded-full" />
            </td>

            <td className="px-6 py-4">
                <div className="flex gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded" />
                    <div className="w-8 h-8 bg-gray-200 rounded" />
                    <div className="w-8 h-8 bg-gray-200 rounded" />
                </div>
            </td>
        </tr>
    )
}

export default SellerProductLoading