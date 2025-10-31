interface CostBreakdownProps {
  costs: Array<{
    category: string;
    amount: number;
  }>;
  currency: string;
}

export const CostBreakdown = ({ costs, currency }: CostBreakdownProps) => {
  const total = costs.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="bg-card rounded-lg border p-4 space-y-3">
      <h3 className="font-semibold text-lg">Cost Breakdown</h3>
      
      <div className="space-y-2">
        {costs.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{item.category}</span>
            <span className="font-medium">
              {currency} {item.amount.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
      
      <div className="pt-3 border-t flex justify-between font-semibold">
        <span>Total</span>
        <span className="text-primary">
          {currency} {total.toFixed(2)}
        </span>
      </div>
    </div>
  );
};
