// components/DottedList.jsx
import { bodyText } from '@/lib/design-tokens';


const DottedList = ({ items }) => {
  return (
    <ul className="list-none space-y-1">
      {items.map((item, index) => (
        <li key={index} className="flex items-start">
          <span className={bodyText}>•</span>
          <span className={bodyText}>{item}</span>
        </li>
      ))}
    </ul>
  );
};
export default DottedList;