import { motion } from 'framer-motion';

export default function StrengthBar({ value }: { value: number }) {
  return <div className="bar"><div className="bar__head"><span>Sức mạnh đoàn kết</span><span className="bar__value">{Math.round(value)}%</span></div><div className="bar__track" role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100} aria-label="Sức mạnh đoàn kết"><motion.div className="bar__fill" animate={{ width: `${value}%` }} transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }} /></div></div>;
}
