import { Backspace } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface NumericKeypadProps {
  onPress: (value: string) => void
  onClear: () => void
  onDelete: () => void
}

export default function NumericKeypad({ onPress, onClear, onDelete }: NumericKeypadProps) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '000']

  return (
    <div className="grid grid-cols-3 gap-1 bg-gray-100 p-2 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      {keys.map((key) => (
        <motion.button
          key={key}
          whileTap={{ scale: 0.95, backgroundColor: '#f3f4f6' }}
          type="button"
          onClick={() => onPress(key)}
          className="h-16 flex items-center justify-center text-xl font-semibold text-gray-800 bg-white rounded-xl shadow-sm"
        >
          {key}
        </motion.button>
      ))}
      
      <motion.button
        whileTap={{ scale: 0.95 }}
        type="button"
        onClick={onDelete}
        className="h-16 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-600"
      >
        <Backspace size={28} weight="duotone" />
      </motion.button>
    </div>
  )
}