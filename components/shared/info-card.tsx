interface InfoCardProps {
  title: string;
  value: string;
  prefix?: string;
}
const InfoCard = ({ title, value, prefix }: InfoCardProps) => {
  return (
    <div className="flex w-auto flex-col items-center justify-center space-y-2 rounded-md bg-green-200 py-4">
      <span className="text-xl font-bold">{title}</span>
      <span className="flex flex-row items-center">
        {prefix && <span>{prefix}</span>}
        <span className="ml-1 text-center text-2xl font-bold">{value}</span>
      </span>
    </div>
  );
};

export default InfoCard;
