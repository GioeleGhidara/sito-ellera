import { motion } from "framer-motion";
import { Construction, Settings, AlertTriangle } from "@/lib/icons";

interface MaintenanceViewProps {
  title?: string;
  message?: string;
}

export default function MaintenanceView({
  title = "Lavori in Corso",
  message = "Questa sezione è attualmente in stato di manutenzione. Stiamo lavorando per offrirti un'esperienza migliore."
}: MaintenanceViewProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8 flex h-40 w-40 items-center justify-center rounded-full bg-primary/10 shadow-inner"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Settings className="h-32 w-32 text-primary/20" />
        </motion.div>
        
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10"
        >
          <Construction className="h-16 w-16 text-primary" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex items-center justify-center gap-3 mb-4"
      >
        <AlertTriangle className="hidden sm:block h-6 w-6 text-amber-500" />
        <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
          {title}
        </h2>
        <AlertTriangle className="hidden sm:block h-6 w-6 text-amber-500" />
      </motion.div>
      
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="max-w-md text-base leading-relaxed text-muted-foreground"
      >
        {message}
      </motion.p>
    </div>
  );
}
