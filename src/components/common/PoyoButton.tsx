export default function PoyoButton(
  { children, className='', ...btnProps }:
  React.ComponentProps<'button'> & { children: React.ReactNode }
){
  return (
    <button
      {...btnProps}
      className={`btn-poyo poyo ${className}`}
    >
      {children}
    </button>
  );
}