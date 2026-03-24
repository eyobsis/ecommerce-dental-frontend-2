import { BarChart } from "lucide-react";

const EmptyState = () => (
  <div className="flex flex-col justify-center items-center text-center h-full p-8 rounded-lg bg-muted">
    <BarChart className="h-16 w-16 text-muted-foreground mb-4" />
    <h3 className="text-xl font-semibold">No Statistics to Show</h3>
    <p className="text-muted-foreground">
      Once you start placing orders, your performance dashboard will appear
      here.
    </p>
  </div>
);

export default EmptyState;
