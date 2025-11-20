interface ExampleCardProps {
  goal: string;
  when: string;
  how: string;
  reminder: string;
  bodyText?: string;
}

const ExampleCard = ({ goal, when, how, reminder, bodyText }: ExampleCardProps) => {
  return (
    <div className="bg-secondary/20 border border-secondary/30 p-4 rounded-lg">
      <p className={bodyText}>Mål: {goal}</p>
      <p className={bodyText}>När: {when}</p>
      <p className={bodyText}>Hur: {how}</p>
      <p className={bodyText}>Påminnelse: {reminder}</p>
    </div>
  );
};

export default ExampleCard;