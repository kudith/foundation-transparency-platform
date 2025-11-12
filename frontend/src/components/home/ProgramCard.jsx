import { Link } from "react-router-dom";

const ProgramCard = ({
  id,
  title,
  description,
  budget,
  beneficiaries,
  category,
  status,
}) => {
  return (
    <div className="bg-white border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="font-serif text-xs text-gray-500 uppercase tracking-wide">
          {category}
        </span>
        <span
          className={`font-serif text-xs px-2 py-1 border ${
            status === "Aktif"
              ? "border-gray-900 text-gray-900"
              : "border-gray-400 text-gray-600"
          }`}
        >
          {status}
        </span>
      </div>

      <h3 className="font-serif text-xl font-bold text-gray-900 mb-3">
        {title}
      </h3>

      <p className="font-serif text-gray-600 mb-6 leading-relaxed">
        {description}
      </p>

      <div className="space-y-2 mb-6">
        <div className="flex justify-between font-serif text-sm">
          <span className="text-gray-500">Anggaran:</span>
          <span className="text-gray-900 font-semibold">{budget}</span>
        </div>
        <div className="flex justify-between font-serif text-sm">
          <span className="text-gray-500">Penerima Manfaat:</span>
          <span className="text-gray-900 font-semibold">{beneficiaries}</span>
        </div>
      </div>

      <Link
        to={`/program/${id}`}
        className="inline-block font-serif text-sm text-gray-900 border-b border-gray-900 hover:text-gray-600 hover:border-gray-600 transition-colors"
      >
        Lihat Detail →
      </Link>
    </div>
  );
};

export default ProgramCard;
