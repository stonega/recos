import { SrtItem, parseTimestamp } from "utils";

const SrtItemCard = ({srtItem}: { srtItem: SrtItem}) => {
    return (<>
    <div className="mt-4 py-2 border-b-2 border-b-green-600">
        <div className="mb-4">{parseTimestamp(srtItem.start_timestamp!)}</div>
        <div className="font-serifs text-xl">
        {srtItem.text}
        </div>
    </div>
    </>)
}

export default SrtItemCard