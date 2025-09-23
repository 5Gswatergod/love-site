export default function ProgressDots({current, total}:{current:number; total:number}){
  return (
    <div className="flex gap-2 justify-center" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={current}>
      {Array.from({length:total}).map((_,i)=> (
        <span key={i} className={`h-2 w-2 rounded-full ${i<current? 'bg-fuchsia-300' : 'bg-white/20'}`} />
      ))}
    </div>
  );
}