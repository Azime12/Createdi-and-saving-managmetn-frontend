interface InfoFieldProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    secure?: boolean;
  }
  
  const InfoField = ({ icon, label, value, secure = false }: InfoFieldProps) => (
    <div className="flex items-start py-3 border-b border-gray-100 last:border-0">
      <div className="mr-3 mt-1 text-gray-500">{icon}</div>
      <div className="flex-1">
        <div className="text-sm text-gray-500">{label}</div>
        <div className="mt-1 font-medium">
          {secure ? (
            <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
              {value.replace(/.(?=.{4})/g, '•')}
            </span>
          ) : (
            value || <span className="text-gray-400">Not provided</span>
          )}
        </div>
      </div>
    </div>
  );
  
  export default InfoField;