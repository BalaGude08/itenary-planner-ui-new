interface TripProgressProps {
  currentStep: number;
  totalSteps: number;
}

export const TripProgress = ({ currentStep, totalSteps }: TripProgressProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Trip Progress</span>
        <span className="text-muted-foreground">
          Day {currentStep} of {totalSteps}
        </span>
      </div>
      
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
};
