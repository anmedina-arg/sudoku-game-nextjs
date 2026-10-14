type ButtonsProps = {
  functionClick: () => void;
  children: string;
};

export const Buttons = ({functionClick, children}:ButtonsProps) => {
  return (
    <button
      onClick={functionClick}
      className="bg-orange-500 rounded-md border-none font-bold p-2 m-2"
    >
      {children}
    </button>
  )
};

export default Buttons;