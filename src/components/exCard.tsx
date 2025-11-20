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
      <p className={exCardTextBold}>Mål: <span className="font-script">{goal}</span></p>
      <p className={exCardTextBold}>När: <span className="font-script">{when}</span></p>
      <p className={exCardTextBold}>Hur: <span className="font-script">{how}</span></p>
      <p className={exCardTextBold}>Påminnelse: <span className="font-script">{reminder}</span></p>
    </div>
  );
};