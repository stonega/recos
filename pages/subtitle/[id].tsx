import { SrtItem } from "utils";
export async function getServerSideProps(context: any) {
    const { id } = context.params;
    const response = await fetch(`/api/subtitle/${id}`);
    const result = await response.json();
    return {
        props: {
            result: result.data
        },
    };
}
const SubtitlePage = ({ result}: {result: SrtItem[]}) => {
    return <div>
        Subtitle Page
        {
          result.map(subtitle => {return <div key={subtitle.id}>{subtitle.text}</div>})
        }
        </div>;
}

export default SubtitlePage;