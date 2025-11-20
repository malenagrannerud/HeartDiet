import { exCardTextBold } from "@/lib/design-tokens";

interface ExampleCardProps {
  goal: string;
  when: string;
  how: string;
  reminder: string;
}

const ExampleCard = ({ goal, when, how, reminder }: ExampleCardProps) => {
  const handwritingStyle = {
    fontFamily: "'Dancing Script', cursive",
    fontSize: '0.875rem', // text-sm
    fontWeight: 400
  };

  return (
    <div className="bg-pink-100 border border-pink-200 p-2 rounded-md">
      <p><span className={exCardTextBold}>Mål: </span><span style={handwritingStyle}>{goal}</span></p>
      <p><span className={exCardTextBold}>När: </span><span style={handwritingStyle}>{when}</span></p>
      <p><span className={exCardTextBold}>Hur: </span><span style={handwritingStyle}>{how}</span></p>
      <p><span className={exCardTextBold}>Påminnelse: </span><span style={handwritingStyle}>{reminder}</span></p>
    </div>
  );
};