import { motion } from "framer-motion";

export function RevealSection({ children }: { children: React.ReactNode }) {
    return (
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.8, ease: "easeOut" }}>
            {children}
        </motion.div>
    );
}
