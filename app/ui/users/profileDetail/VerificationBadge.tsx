import { MdVerified, MdOutlinePendingActions } from "react-icons/md";

interface VerificationBadgeProps {
  verified: boolean;
  text: string;
}

const VerificationBadge = ({ verified, text }: VerificationBadgeProps) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
    verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
  }`}>
    {verified ? <MdVerified className="mr-1" /> : <MdOutlinePendingActions className="mr-1" />}
    {text}
  </span>
);

export default VerificationBadge;