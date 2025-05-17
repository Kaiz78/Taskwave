import logoWorld from "@/assets/logo.svg";
export function Logo() {
  return (
    <div className="mb-8 flex flex-col items-center">
      <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-blue-400 text-white shadow-lg">
        <img src={logoWorld} className="logo " alt="Logo Taskwave" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400">
        Taskwave
      </h1>
    </div>
  );
}
