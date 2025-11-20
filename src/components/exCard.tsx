import { exCardText, exCardTextBold } from "@/lib/design-tokens";

interface ExampleCardProps {
  goal: string;
  when: string;
  how: string;
  reminder: string;
  // Remove exCardText prop since we're using the imported one directly
}

const ExampleCard = ({ goal, when, how, reminder }: ExampleCardProps) => {
  return (
    <div className="bg-pink-100 border border-pink-200 p-4 rounded-lg">
      <p className={exCardTextBold}>Exempel</p>
      <p className={exCardText}>Mål: {goal}</p>
      <p className={exCardText}>När: {when}</p>
      <p className={exCardText}>Hur: {how}</p>
      <p className={exCardText}>Påminnelse: {reminder}</p>
    </div>
  );
};

export default ExampleCard;