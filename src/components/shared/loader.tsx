import { cn } from "@/lib";

interface Props {
  className?: string;
}

export const Loader = ({ className }: Props) => {
  return (
    <div className={cn("z-50! grid h-screen w-screen place-items-center bg-white", className)}>
      <div className="relative grid size-52 animate-spin place-items-center rounded-full duration-1000">
        <div className="bg-primary-400 animate-follow absolute top-0 left-0 size-5 rounded-full duration-1000"></div>
        <div className="bg-primary-400 size-20 rounded-full"></div>
      </div>
    </div>
  );
};
