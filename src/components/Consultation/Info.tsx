const Info = ({ label, value }) => {
  const display =
    value === null || value === undefined || value === "" ? "Not Given" : value;

  return (
    <div className="flex flex-col">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="text-gray-900 font-medium">{display}</span>
    </div>
  );
};

export default Info;
