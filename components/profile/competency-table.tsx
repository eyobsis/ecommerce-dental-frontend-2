import { Competency } from "@/generated/prisma/client";

export const CompetencyTable = ({ data }: { data: Competency[] }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-left bg-white">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="p-4 font-semibold text-slate-700">Doctor Name</th>
            <th className="p-4 font-semibold text-slate-700">Status</th>
            <th className="p-4 font-semibold text-slate-700">Expiration</th>
            <th className="p-4 font-semibold text-slate-700">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((comp) => (
            <tr
              key={comp.id}
              className="border-b last:border-none hover:bg-slate-50"
            >
              <td className="p-4 font-medium">{comp.doctorName}</td>
              <td className="p-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    comp.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {comp.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="p-4 text-slate-600">
                {comp.expirationDate
                  ? new Date(comp.expirationDate).toLocaleDateString()
                  : "N/A"}
              </td>
              <td className="p-4">
                <button className="text-blue-600 hover:underline">
                  View License
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
