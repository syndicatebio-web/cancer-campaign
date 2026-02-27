'use client'

import { motion } from 'framer-motion'

const weapons = [
  {
    id: 1,
    title: 'Early detection',
    description:
      'Spot the enemy before it spreads. Early detection gives you the first strike and increases the chance of winning the battle.',
  },
  {
    id: 2,
    title: 'Regular screening',
    description:
      'Routine checks are your surveillance system. They track movement, expose threats, and prevent surprise attacks.',
  },
  {
    id: 3,
    title: 'Education and awareness',
    description:
      'Training builds stronger fighters. Education equips individuals and communities to respond fast and act right. When people recognize warning signs, the enemy loses its advantage.',
  },
  {
    id: 4,
    title: 'Hereditary risk screening',
    description:
      'Cancer does not move alone. It often travels through bloodlines. Understanding inherited risk turns family history into battlefield intelligence and gives the next generation a head start.',
  },
  {
    id: 5,
    title: 'Family conversations',
    description:
      'Silence is the enemy’s cover. Open dialogue removes the fog of war. When families talk about health history, they strengthen their defense across generations.',
  },
  {
    id: 6,
    title: 'Community support',
    description:
      'No one fights alone. Support systems hold the line, lift morale, and keep patients in the fight.',
  },
]

export function WeaponsSection() {
  return (
    <section id="weapons" className="relative z-10 px-4 md:px-8 py-16 md:py-20">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5 }}
            className="text-sm md:text-base font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3"
          >
            In the fight against cancer
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6"
          >
            <span className="block">Action is the</span>
            <span className="text-primary">Weapon</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Every choice, every conversation, every test is a strike against cancer. These are the weapons we use to
            turn fear into action.
          </motion.p>
        </div>

        {/* Weapons Grid */}
        <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {weapons.map((weapon, index) => (
            <motion.article
              key={weapon.id}
              className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/90 backdrop-blur-sm p-5 md:p-6 shadow-sm"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
              whileHover={{
                y: -6,
                scale: 1.02,
                boxShadow: '0 18px 35px rgba(0,0,0,0.15)',
              }}
            >
              {/* Accent glow */}
              <div className="pointer-events-none absolute inset-x-0 -top-12 h-24 bg-gradient-to-b from-primary/10 to-transparent" />

              {/* Weapon label */}
              <div className="relative z-10 mb-3 md:mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-[0.7rem]">
                  {weapon.id}
                </span>
                <span>Weapon {weapon.id}</span>
              </div>

              {/* Title */}
              <h3 className="relative z-10 mb-2 text-lg md:text-xl font-semibold text-foreground">
                {weapon.title}
              </h3>

              {/* Description */}
              <p className="relative z-10 text-sm md:text-[0.95rem] leading-relaxed text-muted-foreground">
                {weapon.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}