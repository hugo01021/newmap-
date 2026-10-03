import { motion } from "framer-motion";
import { Tag } from "@/components/ui/Tag";

interface StepHeadingProps {
  tag: string;
  title: React.ReactNode;
  text?: React.ReactNode;
  align?: "left" | "center";
}

export function StepHeading({ tag, title, text, align = "center" }: StepHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}
    >
      <Tag>{tag}</Tag>
      <h1 className="display mt-6 text-4xl text-white sm:text-6xl">{title}</h1>
      {text && <p className={`mt-5 text-base text-muted sm:text-lg ${align === "center" ? "mx-auto" : ""} max-w-xl`}>{text}</p>}
    </motion.div>
  );
}
