interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  return (
    <div className="flex flex-1 flex-col justify-center px-6 lg:px-8">
      {children}
    </div>
  );
}
