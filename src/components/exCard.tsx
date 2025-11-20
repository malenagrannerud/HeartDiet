import { exCardTextBold, exCardTextHand } from "@/lib/design-tokens";

interface ExampleCardProps {
  goal: string;
  when: string;
  how: string;
  reminder: string;
}

const ExampleCard = ({ goal, when, how, reminder }: ExampleCardProps) => {
  return (
    <div className="bg-pink-100 border border-pink-200 p-2 rounded-md">
      <p><span className={exCardTextBold}>Mål: </span><span className={exCardTextHand}>{goal}</span></p>
      <p><span className={exCardTextBold}>När: </span><span className={exCardTextHand}>{when}</span></p>
      <p><span className={exCardTextBold}>Hur: </span><span className={exCardTextHand}>{how}</span></p>
      <p><span className={exCardTextBold}>Påminnelse: </span><span className={exCardTextHand}>{reminder}</span></p>
    </div>
  );
};

export default ExampleCard;