import { useProfileStore } from "@/store/use-sidebar-store";
import { CreditCard, Lock, Award, User, Settings } from "lucide-react"; // Example icons

export const Sidebar = () => {
  const { activeTab, setActiveTab } = useProfileStore();

  const menuItems = [
    { id: "overview", label: "Company Profile", icon: <User size={20} /> },
    {
      id: "payments",
      label: "Payment History",
      icon: <CreditCard size={20} />,
    },
    { id: "competencies", label: "Competency List", icon: <Award size={20} /> },
    { id: "security", label: "Change Password", icon: <Lock size={20} /> },
    { id: "settings", label: "Update Info", icon: <Settings size={20} /> },
  ];

  return (
    <div className="w-64 h-full bg-slate-50 border-r border-slate-200 p-4">
      <h2 className="text-xl font-bold mb-6 px-2">Account</h2>
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === item.id
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};
