import { exCardText, exCardTextBold } from "@/lib/design-tokens";

interface ExampleCardProps {
  goal: string;
  when: string;
  how: string;
  reminder: string;
}

const ExampleCard = ({ goal, when, how, reminder }: ExampleCardProps) => {
  return (
    <div className="bg-pink-100 border border-pink-200 p-2 rounded-md">
      <p><span className={exCardTextBold}>Mål: </span><span className="handwriting font-normal text-inherit">{goal}</span></p>
      <p><span className={exCardTextBold}>När: </span><span className="handwriting">{when}</span></p>
      <p><span className={exCardTextBold}>Hur: </span><span className="handwriting">{how}</span></p>
      <p><span className={exCardTextBold}>Påminnelse: </span><span className="handwriting">{reminder}</span></p>
    </div>
  );
};

export default ExampleCard;