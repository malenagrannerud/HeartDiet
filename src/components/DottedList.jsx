// components/DottedList.jsx
const DottedList = ({ items }) => {
  return (
    <ul className="list-none space-y-2 mt-3">
      {items.map((item, index) => (
        <li key={index} className="flex items-start">
          <span className="text-gray-600 mr-3 mt-1.5">•</span>
          <span className="text-gray-700 flex-1">{item}</span>
        </li>
      ))}
    </ul>
  );
};

export default DottedList;