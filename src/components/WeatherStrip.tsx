interface WeatherStripProps {
  days: Array<{
    date: string;
    temp: number;
    condition: string;
  }>;
}

export const WeatherStrip = ({ days }: WeatherStripProps) => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {days.map((day, idx) => (
        <div
          key={idx}
          className="flex-shrink-0 bg-muted rounded-lg p-3 min-w-[100px] text-center"
        >
          <div className="text-xs text-muted-foreground mb-1">
            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
          </div>
          <div className="text-2xl font-bold text-primary mb-1">
            {day.temp}°
          </div>
          <div className="text-xs">{day.condition}</div>
        </div>
      ))}
    </div>
  );
};
