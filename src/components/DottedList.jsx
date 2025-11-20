// components/DottedList.jsx
import { bodyText } from '@/lib/design-tokens';


const DottedList = ({ items }) => {
  return (
    <ul className="list-none mt-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start">
          <span className={`${bodyText} mr-2`}>•</span>
          <span className={bodyText}>{item}</span>
        </li>
      ))}
    </ul>
  );
};
export default DottedList;