import React from 'react'
import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '', 
  hover = true,
  gradient = false,
  ...props 
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -2, scale: 1.01 } : {}}
      transition={{ duration: 0.2 }}
      className={`
        ${gradient ? 'card-gradient' : 'card'}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card